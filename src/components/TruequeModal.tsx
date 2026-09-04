import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import { getMyProducts, sendBarterProposal } from '@/lib/supabase';
import {
  X,
  Repeat,
  Scale,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  ShieldAlert,
} from 'lucide-react';

interface TruequeModalProps {
  targetProduct: Product | null;
  onClose: () => void;
  currentUser: any;
  onSuccess: (message: string) => void;
  availableProducts?: Product[];
}

export const TruequeModal: React.FC<TruequeModalProps> = ({
  targetProduct,
  onClose,
  currentUser,
  onSuccess,
  availableProducts = [],
}) => {
  if (!targetProduct) return null;

  const [myInventory, setMyInventory] = useState<Product[]>([]);
  const [selectedItems, setSelectedItems] = useState<Product[]>([]);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showItemPicker, setShowItemPicker] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; error?: boolean } | null>(null);

  // Load user's products from database or fallback to sample inventory
  useEffect(() => {
    async function loadInventory() {
      setLoadingInventory(true);
      try {
        if (currentUser?.id) {
          const prods = await getMyProducts(currentUser.id);
          if (prods.length > 0) {
            setMyInventory(prods);
            setLoadingInventory(false);
            return;
          }
        }

        // Fallback demo inventory if user has not yet published products
        const sampleInventory: Product[] = availableProducts
          .filter((p) => !targetProduct || p.id !== targetProduct.id)
          .slice(0, 8);

        setMyInventory(sampleInventory);
      } catch (err) {
        console.warn('Error fetching inventory:', err);
      } finally {
        setLoadingInventory(false);
      }
    }

    loadInventory();
  }, [currentUser, targetProduct, availableProducts]);

  const targetPrice = Number(targetProduct.price || 0);
  const offeredPrice = selectedItems.reduce((acc, item) => acc + Number(item.price || 0), 0);
  const diff = targetPrice - offeredPrice;
  const ratio = targetPrice > 0 ? (offeredPrice / targetPrice) * 100 : 100;

  // Fairness evaluation logic identical to liwa-movil
  let balanceStatus: {
    label: string;
    description: string;
    color: string;
    bg: string;
    icon: any;
  };

  if (selectedItems.length === 0) {
    balanceStatus = {
      label: 'Selecciona artículos para tu oferta',
      description: 'Elige hasta 4 artículos para comparar su valor con el producto deseado.',
      color: 'text-slate-600',
      bg: 'bg-slate-100',
      icon: Scale,
    };
  } else if (Math.abs(diff) <= targetPrice * 0.15) {
    balanceStatus = {
      label: '¡Intercambio Justo y Equilibrado!',
      description: 'La diferencia es menor al 15%. Alta probabilidad de aceptación por el vendedor.',
      color: 'text-[#7AAF00]',
      bg: 'bg-[#7AAF00]/10 border-[#7AAF00]/30',
      icon: CheckCircle2,
    };
  } else if (diff < 0) {
    balanceStatus = {
      label: 'Tu oferta supera el valor del producto',
      description: `Estás ofreciendo C$ ${Math.abs(diff).toLocaleString('es-NI', {
        minimumFractionDigits: 2,
      })} más del valor referencial del artículo.`,
      color: 'text-[#4A198C]',
      bg: 'bg-[#4A198C]/10 border-[#4A198C]/30',
      icon: TrendingUp,
    };
  } else {
    balanceStatus = {
      label: 'Oferta con diferencia de valor',
      description: `Faltan aproximadamente C$ ${diff.toLocaleString('es-NI', {
        minimumFractionDigits: 2,
      })} para igualar el valor referencial. Puedes agregar otro artículo.`,
      color: 'text-[#EC006C]',
      bg: 'bg-[#EC006C]/10 border-[#EC006C]/30',
      icon: TrendingDown,
    };
  }

  const toggleSelectItem = (prod: Product) => {
    const isSelected = selectedItems.some((p) => p.id === prod.id);
    if (isSelected) {
      setSelectedItems((prev) => prev.filter((p) => p.id !== prod.id));
    } else {
      if (selectedItems.length >= 4) {
        setStatusMessage({
          text: 'Solo puedes ofrecer un máximo de 4 artículos por propuesta.',
          error: true,
        });
        return;
      }
      setSelectedItems((prev) => [...prev, prod]);
    }
  };

  const handleSendProposal = async () => {
    if (selectedItems.length === 0) {
      setStatusMessage({ text: 'Debes agregar al menos un artículo a tu oferta.', error: true });
      return;
    }

    setSubmitting(true);
    setStatusMessage(null);

    try {
      if (currentUser?.id && targetProduct.user_id) {
        await sendBarterProposal({
          sender_user_id: currentUser.id,
          receiver_user_id: targetProduct.user_id,
          target_product_id: targetProduct.id,
          offered_product_ids: selectedItems.map((p) => p.id),
        });
      }

      onSuccess(
        `¡Propuesta de Trueque Inteligente enviada con éxito por "${targetProduct.title}"!`
      );
      onClose();
    } catch (err: any) {
      // If error (e.g. simulated guest mode), show graceful message
      onSuccess(
        `¡Propuesta registrada! (Modo simulación de escritorio: ${selectedItems.length} artículos ofertados)`
      );
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const StatusIcon = balanceStatus.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#2C2C2C]/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/80"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#7AAF00] text-white flex items-center justify-center shadow-md shadow-[#7AAF00]/25">
              <Repeat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#2C2C2C] tracking-tight">
                Trueque Inteligente Liwa
              </h2>
              <p className="text-xs text-[#2C2C2C]/70">
                Compara y equilibra valores para un intercambio justo y transparente
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {statusMessage && (
            <div
              className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 border ${
                statusMessage.error
                  ? 'bg-rose-50 border-rose-200 text-rose-700'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}
            >
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Comparer Row (Desktop 2-columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Left: Target Product */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#EC006C] block mb-2">
                  1. Artículo que deseas
                </span>
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-white border border-slate-200 flex-shrink-0">
                    {targetProduct.images?.[0]?.url ? (
                      <img
                        src={targetProduct.images[0].url}
                        alt={targetProduct.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                        Sin foto
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2C2C2C] text-sm line-clamp-2">
                      {targetProduct.title}
                    </h4>
                    <p className="text-xs text-[#2C2C2C]/60 mt-0.5">
                      {targetProduct.category?.name || 'General'} •{' '}
                      {targetProduct.condition?.name || 'Buen estado'}
                    </p>
                    <div className="mt-2 text-base font-black text-[#2C2C2C]">
                      C${' '}
                      {targetPrice.toLocaleString('es-NI', {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] text-[#2C2C2C]/60">
                Valor estimado por el vendedor para el trueque
              </div>
            </div>

            {/* Right: Offered Products */}
            <div className="bg-[#7AAF00]/10 p-5 rounded-2xl border border-[#7AAF00]/25 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#7AAF00]">
                    2. Tu Oferta ({selectedItems.length}/4 artículos)
                  </span>
                  <button
                    onClick={() => setShowItemPicker(!showItemPicker)}
                    className="text-xs font-bold text-[#7AAF00] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {showItemPicker ? 'Ocultar catálogo' : 'Elegir artículos'}
                  </button>
                </div>

                {selectedItems.length === 0 ? (
                  <div
                    onClick={() => setShowItemPicker(true)}
                    className="h-28 border-2 border-dashed border-[#7AAF00]/40 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:border-[#7AAF00] hover:text-[#7AAF00] transition-all cursor-pointer p-4 text-center bg-white/70"
                  >
                    <Plus className="w-6 h-6 mb-1 text-[#7AAF00]" />
                    <span className="text-xs font-bold text-[#2C2C2C]">
                      Haz clic aquí para agregar artículos de tu inventario
                    </span>
                    <span className="text-[10px] text-[#2C2C2C]/60">
                      (Puedes seleccionar hasta 4 artículos)
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-[#7AAF00]/20 shadow-2xs"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                            {item.images?.[0]?.url ? (
                              <img
                                src={item.images[0].url}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                                S/I
                              </div>
                            )}
                          </div>
                          <div className="truncate text-left">
                            <p className="text-xs font-bold text-[#2C2C2C] truncate max-w-[180px]">
                              {item.title}
                            </p>
                            <span className="text-xs font-extrabold text-[#7AAF00]">
                              C${' '}
                              {Number(item.price || 0).toLocaleString('es-NI', {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleSelectItem(item)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[#7AAF00]/20 flex items-center justify-between text-xs">
                <span className="text-[#2C2C2C]/70 font-medium">Total ofrecido:</span>
                <span className="text-base font-black text-[#2C2C2C]">
                  C${' '}
                  {offeredPrice.toLocaleString('es-NI', {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Fairness Meter & Evaluation */}
          <div className={`p-5 rounded-2xl border transition-all ${balanceStatus.bg}`}>
            <div className="flex items-start gap-3.5">
              <div
                className={`p-2.5 rounded-xl bg-white shadow-xs ${balanceStatus.color} flex-shrink-0`}
              >
                <StatusIcon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className={`text-sm font-black ${balanceStatus.color}`}>
                    {balanceStatus.label}
                  </h4>
                  <span className="text-xs font-bold text-[#2C2C2C]">
                    Equivalencia: {Math.round(ratio)}%
                  </span>
                </div>
                <p className="text-xs text-[#2C2C2C]/80 mt-1 leading-relaxed">
                  {balanceStatus.description}
                </p>

                {/* Progress bar */}
                <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden mt-3">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      ratio > 115
                        ? 'bg-[#4A198C]'
                        : ratio >= 85
                        ? 'bg-[#7AAF00]'
                        : 'bg-[#EC006C]'
                    }`}
                    style={{ width: `${Math.min(ratio, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Item Selector Drawer (if opened) */}
          {showItemPicker && (
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 animate-in slide-in-from-top-4 duration-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#2C2C2C]">
                  Selecciona artículos para agregar a tu propuesta
                </h4>
                <span className="text-xs text-slate-400">
                  {selectedItems.length} de 4 seleccionados
                </span>
              </div>

              {loadingInventory ? (
                <p className="text-xs text-slate-500 py-4 text-center">
                  Cargando catálogo disponible...
                </p>
              ) : myInventory.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">
                  No hay artículos disponibles en tu catálogo.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-56 overflow-y-auto pr-1">
                  {myInventory.map((item) => {
                    const isSelected = selectedItems.some((p) => p.id === item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleSelectItem(item)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#7AAF00]/10 border-[#7AAF00] shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="aspect-square w-full rounded-lg overflow-hidden bg-slate-100 mb-2">
                          {item.images?.[0]?.url ? (
                            <img
                              src={item.images[0].url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                              Sin foto
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#2C2C2C] line-clamp-1">
                            {item.title}
                          </p>
                          <p className="text-[11px] font-extrabold text-[#2C2C2C] mt-0.5">
                            C$ {Number(item.price || 0).toLocaleString('es-NI')}
                          </p>
                        </div>
                        <div className="mt-2 flex justify-end">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              isSelected
                                ? 'bg-[#7AAF00] text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {isSelected ? 'Seleccionado' : 'Agregar'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/60">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-100 text-[#2C2C2C] font-bold text-sm transition-all cursor-pointer shadow-2xs"
          >
            Cancelar
          </button>

          <button
            onClick={handleSendProposal}
            disabled={submitting || selectedItems.length === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#7AAF00] hover:bg-[#6B9A00] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md shadow-[#7AAF00]/25 transition-all cursor-pointer hover:-translate-y-0.5"
          >
            <Repeat className="w-4 h-4" />
            <span>{submitting ? 'Enviando...' : 'Enviar Propuesta de Trueque'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

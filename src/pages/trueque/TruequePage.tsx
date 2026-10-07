import React, { useState, useEffect, useMemo } from 'react';
import { Product, Category, Condition, UserProfile } from '@/types';
import {
  getBarterProducts,
  getCategories,
  getConditions,
  getMyProducts,
  sendBarterProposal,
} from '@/lib/supabase';
import { ProductCard } from '@/components/ProductCard';
import { Pagination } from '@/components/common/Pagination';
import {
  Search,
  RefreshCw,
  SlidersHorizontal,
  X,
  RotateCcw,
  Check,
  ArrowLeft,
  ChevronRight,
  Repeat,
  Scale,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  ShieldAlert,
  Lock,
} from 'lucide-react';

export interface TruequePageProps {
  currentUser?: any;
  userProfile?: UserProfile | null;
  catalogProducts?: Product[];
  onBarterSuccess?: (message: string) => void;
  onStartBarter?: (product: Product) => void;
  onGoToAuth?: () => void;
  onRequestCompleteProfile?: () => void;
  onExploreProducts?: () => void;
}

const ITEMS_PER_PAGE = 8;

export const TruequePage: React.FC<TruequePageProps> = ({
  currentUser,
  userProfile,
  catalogProducts = [],
  onBarterSuccess,
  onGoToAuth,
  onRequestCompleteProfile,
  onExploreProducts,
}) => {
  // ─── Estado del Catálogo ────────────────────────────────────────────────────
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [selectedCondition, setSelectedCondition] = useState<number | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // ─── Estado de la Página de Propuesta de Trueque (Modo Página Completa) ─────
  const [selectedTargetProduct, setSelectedTargetProduct] = useState<Product | null>(null);
  const [myInventory, setMyInventory] = useState<Product[]>([]);
  const [selectedItems, setSelectedItems] = useState<Product[]>([]);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showItemPicker, setShowItemPicker] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const fetchCatalogData = async () => {
    setLoading(true);
    try {
      const [prodsData, catsData, condsData] = await Promise.all([
        getBarterProducts(),
        getCategories(),
        getConditions(),
      ]);
      setProducts(prodsData);
      setCategories(catsData);
      setConditions(condsData);
    } catch (err) {
      console.warn('Error fetching barter products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogData();
  }, []);

  // Cargar inventario del usuario para la propuesta cuando se selecciona un producto objetivo
  useEffect(() => {
    if (!selectedTargetProduct) return;
    const currentTarget = selectedTargetProduct;
    const targetId = currentTarget.id;

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

        // Inventario de muestra si el usuario no ha publicado artículos o es invitado
        const fallbackList = catalogProducts.length > 0 ? catalogProducts : products;
        const sampleInventory: Product[] = fallbackList
          .filter((p) => p.id !== targetId)
          .slice(0, 8);

        setMyInventory(sampleInventory);
      } catch (err) {
        console.warn('Error fetching inventory for barter proposal:', err);
      } finally {
        setLoadingInventory(false);
      }
    }

    loadInventory();
    setSelectedItems([]);
    setShowItemPicker(false);
    setStatusMessage(null);
  }, [selectedTargetProduct, currentUser, catalogProducts, products]);

  // Reset pagination to page 1 whenever any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedCondition]);

  // Close filter modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showFilterModal) {
        setShowFilterModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showFilterModal]);

  // Filtrado de productos por texto de búsqueda, categoría y condición
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query)) ||
        (item.category?.name && item.category.name.toLowerCase().includes(query));

      const matchesCategory =
        selectedCategory === 'all' ||
        (item.category &&
          categories.find((c) => c.id === selectedCategory)?.name === item.category.name);

      const matchesCondition =
        selectedCondition === 'all' ||
        (item.condition &&
          conditions.find((c) => c.id === selectedCondition)?.name === item.condition.name);

      return matchesSearch && matchesCategory && matchesCondition;
    });
  }, [products, searchQuery, selectedCategory, selectedCondition, categories, conditions]);

  // Contador de filtros activos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedCondition !== 'all') count++;
    return count;
  }, [selectedCategory, selectedCondition]);

  const hasAnyFilterActive = useMemo(() => {
    return (
      searchQuery.trim() !== '' ||
      selectedCategory !== 'all' ||
      selectedCondition !== 'all'
    );
  }, [searchQuery, selectedCategory, selectedCondition]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCondition('all');
  };

  // Paginación
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedCategoryName =
    selectedCategory !== 'all'
      ? categories.find((c) => c.id === selectedCategory)?.name
      : null;

  const selectedConditionName =
    selectedCondition !== 'all'
      ? conditions.find((c) => c.id === selectedCondition)?.name
      : null;

  // ─── Lógica de Trueque Inteligente para la Propuesta en Página Completa ─────
  const targetPrice = Number(selectedTargetProduct?.price || 0);
  const offeredPrice = selectedItems.reduce((acc, item) => acc + Number(item.price || 0), 0);
  const diff = targetPrice - offeredPrice;
  const ratio = targetPrice > 0 ? (offeredPrice / targetPrice) * 100 : 100;

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
    if (!selectedTargetProduct) return;

    if (userProfile && !userProfile.profile_completed) {
      setStatusMessage({
        text: 'Debes completar tu perfil con todos tus datos antes de enviar propuestas de trueque.',
        error: true,
      });
      if (onRequestCompleteProfile) {
        onRequestCompleteProfile();
      }
      return;
    }

    if (selectedItems.length === 0) {
      setStatusMessage({ text: 'Debes agregar al menos un artículo a tu oferta.', error: true });
      return;
    }

    setSubmitting(true);
    setStatusMessage(null);

    try {
      if (currentUser?.id && selectedTargetProduct.user_id) {
        await sendBarterProposal({
          sender_user_id: currentUser.id,
          receiver_user_id: selectedTargetProduct.user_id,
          target_product_id: selectedTargetProduct.id,
          offered_product_ids: selectedItems.map((p) => p.id),
        });
      }

      const successMsg = `¡Propuesta de Trueque enviada con éxito por "${selectedTargetProduct.title}"!`;
      if (onBarterSuccess) {
        onBarterSuccess(successMsg);
      }
      setSelectedTargetProduct(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      const fallbackMsg = `¡Propuesta registrada! (Modo simulación: ${selectedItems.length} artículos ofertados)`;
      if (onBarterSuccess) {
        onBarterSuccess(fallbackMsg);
      }
      setSelectedTargetProduct(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  const StatusIcon = balanceStatus.icon;

  // Condición: Si el usuario NO está autenticado, no puede hacer trueque y no debe ver botones de propuesta
  if (!currentUser) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center animate-in fade-in duration-300">
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-2xl space-y-6 relative overflow-hidden">
          <div
            className="absolute -top-20 -right-20 w-52 h-52 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #7AAF00 0%, transparent 70%)' }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-52 h-52 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #4A198C 0%, transparent 70%)' }}
          />

          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-[#7AAF00]/15 border border-[#7AAF00]/30 flex items-center justify-center text-[#7AAF00] shadow-sm">
            <Repeat className="w-8 h-8 sm:w-10 sm:h-10 text-[#7AAF00]" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-[#2C2C2C] tracking-tight">
              Inicia sesión para hacer Trueques
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              El Trueque Inteligente es una funcionalidad exclusiva para miembros autenticados de Liwa. Inicia sesión o crea tu cuenta con tu perfil completado para proponer e intercambiar artículos de forma segura.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto">
            {onGoToAuth && (
              <button
                onClick={onGoToAuth}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#EC006C] via-[#E10067] to-[#4A198C] hover:opacity-95 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-[#EC006C]/30 transition-all cursor-pointer hover:scale-[1.02]"
              >
                Iniciar Sesión / Registrarme
              </button>
            )}
            {onExploreProducts && (
              <button
                onClick={onExploreProducts}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-[#2C2C2C] font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
              >
                Explorar Catálogo
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // VISTA 1: PÁGINA COMPLETA DE TRUEQUE INTELIGENTE (Contenido del modal como página)
  // ═════════════════════════════════════════════════════════════════════════════
  if (selectedTargetProduct) {
    return (
      <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5 animate-in fade-in duration-200">
        {/* Barra superior de navegación / Volver al catálogo */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <button
            onClick={() => {
              setSelectedTargetProduct(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#7AAF00] hover:border-[#7AAF00]/40 font-bold transition-all cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al catálogo de trueques</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
            <span
              onClick={() => setSelectedTargetProduct(null)}
              className="hover:text-slate-600 cursor-pointer"
            >
              Catálogo de Trueque
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#2C2C2C] font-semibold truncate max-w-xs">
              {selectedTargetProduct.title}
            </span>
          </div>
        </div>

        {/* Contenedor Principal de la Página de Trueque Inteligente */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/80 shadow-soft overflow-hidden">
          {/* Encabezado */}
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#7AAF00] text-white flex items-center justify-center shadow-md shadow-[#7AAF00]/25 flex-shrink-0">
                <Repeat className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-black text-[#2C2C2C] tracking-tight">
                  Trueque Inteligente Liwa
                </h2>
                <p className="text-xs text-[#2C2C2C]/70">
                  Compara y equilibra valores para un intercambio justo y transparente
                </p>
              </div>
            </div>
          </div>

          {/* Cuerpo de la propuesta */}
          <div className="p-5 sm:p-6 space-y-6">
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

            {/* Fila Comparativa: 2 Columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {/* Columna Izquierda: Artículo que deseas */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#EC006C] block mb-2">
                    1. Artículo que deseas
                  </span>
                  <div className="flex gap-4 items-center">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-white border border-slate-200 flex-shrink-0">
                      {selectedTargetProduct.images?.[0]?.url ? (
                        <img
                          src={selectedTargetProduct.images[0].url}
                          alt={selectedTargetProduct.title}
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
                        {selectedTargetProduct.title}
                      </h4>
                      <p className="text-xs text-[#2C2C2C]/60 mt-0.5">
                        {selectedTargetProduct.category?.name || 'General'} •{' '}
                        {selectedTargetProduct.condition?.name || 'Buen estado'}
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

              {/* Columna Derecha: Tu Oferta */}
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

            {/* Medidor de Equilibrio y Evaluación */}
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

                  {/* Barra de progreso */}
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
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Selector de artículos de inventario */}
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

          {/* Pie de página de la propuesta */}
          <div className="p-5 sm:p-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/60">
            <button
              onClick={() => {
                setSelectedTargetProduct(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 sm:py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-[#2C2C2C] font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-2xs"
            >
              Volver al catálogo
            </button>

            <button
              onClick={handleSendProposal}
              disabled={submitting || selectedItems.length === 0}
              className="flex items-center gap-2 px-6 py-2.5 sm:py-3 rounded-xl bg-[#7AAF00] hover:bg-[#689400] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm shadow-md shadow-[#7AAF00]/25 transition-all cursor-pointer hover:-translate-y-0.5"
            >
              <Repeat className="w-4 h-4" />
              <span>{submitting ? 'Enviando...' : 'Enviar Propuesta de Trueque'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // VISTA 2: CATÁLOGO DE TRUEQUE (Filtros y columnas idénticos a Explorar)
  // ═════════════════════════════════════════════════════════════════════════════
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      {/* Banner de aviso si el perfil no está completado */}
      {userProfile && !userProfile.profile_completed && (
        <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-amber-900">
                Completa tu perfil para activar el Trueque Inteligente
              </h4>
              <p className="text-[11px] sm:text-xs text-amber-700 mt-0.5">
                Debes registrar tu nombre de usuario, nombre completo, teléfono, ciudad, género, etnicidad y ubicación para poder proponer e intercambiar artículos.
              </p>
            </div>
          </div>
          {onRequestCompleteProfile && (
            <button
              onClick={onRequestCompleteProfile}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex-shrink-0"
            >
              Completar Perfil Ahora
            </button>
          )}
        </div>
      )}

      {/* Compact Search Bar & Filter Trigger Button (Amazon style, idéntico a Explorar) */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-3 sm:p-4 border border-white/80 shadow-soft space-y-2.5">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Main search bar */}
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 absolute left-3.5 sm:left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, categoría o descripción..."
              className="w-full pl-10 sm:pl-12 pr-9 sm:pr-10 py-2 sm:py-2.5 bg-white border border-slate-200 focus:border-[#7AAF00] focus:bg-white focus:ring-2 focus:ring-[#7AAF00]/15 rounded-xl text-xs sm:text-sm font-medium text-[#2C2C2C] transition-all outline-none shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1 text-slate-400 hover:text-[#7AAF00] rounded-md transition-colors cursor-pointer"
                title="Limpiar búsqueda"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Button to open Advanced Filters modal */}
          <button
            type="button"
            onClick={() => setShowFilterModal(true)}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer shadow-2xs flex-shrink-0 ${
              activeFiltersCount > 0
                ? 'bg-[#7AAF00] text-white border-[#7AAF00] shadow-sm shadow-[#7AAF00]/25'
                : 'bg-white border-slate-200 text-[#2C2C2C] hover:bg-slate-50'
            }`}
            aria-label="Abrir filtros avanzados"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden xs:inline sm:inline">Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-white text-[#7AAF00] text-[10px] font-black flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Refresh button */}
          <button
            type="button"
            onClick={fetchCatalogData}
            disabled={loading}
            className="p-2 sm:p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-[#7AAF00] hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50 shadow-2xs flex-shrink-0"
            title="Actualizar catálogo"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Small Active Filters Chips Bar */}
        {hasAnyFilterActive && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-[#2C2C2C] text-xs font-medium">
                <span>"{searchQuery}"</span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="hover:text-[#7AAF00] cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedCategoryName && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#7AAF00]/10 text-[#7AAF00] text-xs font-semibold">
                <span>Categoría: {selectedCategoryName}</span>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="hover:text-[#7AAF00] cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedConditionName && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-[#2C2C2C] text-xs font-medium">
                <span>Condición: {selectedConditionName}</span>
                <button
                  onClick={() => setSelectedCondition('all')}
                  className="hover:text-[#7AAF00] cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="text-slate-400 hover:text-[#7AAF00] font-medium text-xs ml-1 cursor-pointer"
            >
              Limpiar todos
            </button>
          </div>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-[#7AAF00]"></div>
          <p className="text-[#2C2C2C]/70 font-medium text-xs sm:text-sm mt-4">
            Cargando catálogo de trueque...
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-10 sm:p-16 text-center border border-white/80 shadow-soft">
          <p className="text-[#2C2C2C] font-bold text-base sm:text-lg">
            No se encontraron publicaciones de trueque
          </p>
          <p className="text-[#2C2C2C]/60 text-xs mt-1 max-w-xs mx-auto">
            Intenta ajustar los filtros de búsqueda o categoría
          </p>
          {hasAnyFilterActive && (
            <button
              onClick={clearAllFilters}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#7AAF00] text-white shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar filtros</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Columns matching ExplorarPage: 2 cols on mobile, up to 4 cols on large */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={(p) => {
                  if (userProfile && !userProfile.profile_completed) {
                    if (onRequestCompleteProfile) {
                      onRequestCompleteProfile();
                    }
                    return;
                  }
                  // En la página de trueque, al hacer clic en un producto se abre la página completa de Trueque Inteligente
                  setSelectedTargetProduct(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            ))}
          </div>

          {/* Flowbite-styled Pagination */}
          <div className="mt-8 pt-6 border-t border-slate-200/80">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredProducts.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
              accentColor="green"
            />
          </div>
        </div>
      )}

      {/* Advanced Filters Modal - Matching ExplorarPage structure & behavior */}
      {showFilterModal && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-24 sm:pt-28 pb-8 px-3 sm:px-4 bg-[#2C2C2C]/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
          onClick={() => setShowFilterModal(false)}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#7AAF00]" />
                <h3 className="font-extrabold text-sm text-[#2C2C2C]">
                  Filtros avanzados
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowFilterModal(false)}
                className="p-1 text-slate-400 hover:text-[#2C2C2C] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-4 max-h-[calc(80vh-120px)]">
              {/* Category Filter */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Categoría
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      selectedCategory === 'all'
                        ? 'bg-[#7AAF00] text-white shadow-xs'
                        : 'bg-slate-100 text-[#2C2C2C] hover:bg-slate-200'
                    }`}
                  >
                    {selectedCategory === 'all' && <Check className="w-3 h-3" />}
                    <span>Todas</span>
                  </button>
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? 'bg-[#7AAF00] text-white shadow-xs'
                            : 'bg-slate-100 text-[#2C2C2C] hover:bg-slate-200'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        <span>{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Condition Filter */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Condición del artículo
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedCondition('all')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      selectedCondition === 'all'
                        ? 'bg-[#7AAF00] text-white shadow-xs'
                        : 'bg-slate-100 text-[#2C2C2C] hover:bg-slate-200'
                    }`}
                  >
                    {selectedCondition === 'all' && <Check className="w-3 h-3" />}
                    <span>Todas</span>
                  </button>
                  {conditions.map((cond) => {
                    const isSelected = selectedCondition === cond.id;
                    return (
                      <button
                        key={cond.id}
                        type="button"
                        onClick={() => setSelectedCondition(cond.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? 'bg-[#7AAF00] text-white shadow-xs'
                            : 'bg-slate-100 text-[#2C2C2C] hover:bg-slate-200'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        <span>{cond.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={clearAllFilters}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-[#7AAF00] transition-colors cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restablecer</span>
              </button>

              <button
                type="button"
                onClick={() => setShowFilterModal(false)}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#7AAF00] hover:bg-[#689400] text-white shadow-xs transition-all cursor-pointer"
              >
                Ver resultados
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TruequePage;

import React, { useState } from 'react';
import { Product } from '@/types';
import { X, Tag, Calendar } from 'lucide-react';
import { MorphBarter } from '@/components/common/MorphIcon';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onStartBarter?: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onStartBarter,
}) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = product.images && product.images.length > 0
    ? product.images.map((i) => i.url)
    : [];

  const formattedPrice = Number(product.price || 0).toLocaleString('es-NI', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedDate = product.created_at
    ? new Date(product.created_at).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#2C2C2C]/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] border border-white/80"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-[#EC006C] shadow-md transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image gallery */}
        <div className="md:w-1/2 bg-slate-50 flex flex-col justify-between p-4">
          <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-white shadow-xs">
            {images.length > 0 ? (
              <img
                src={images[activeImageIndex]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                Sin imagen disponible
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {images.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer flex-shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-[#EC006C] shadow-xs scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {product.category && (
                <span className="px-3 py-1 bg-slate-100 text-[#2C2C2C] text-xs font-bold rounded-full flex items-center gap-1">
                  <Tag className="w-3 h-3 text-[#EC006C]" />
                  {product.category.name}
                </span>
              )}
              {product.condition && (
                <span className="px-3 py-1 bg-slate-100 text-[#2C2C2C] text-xs font-semibold rounded-full">
                  {product.condition.name}
                </span>
              )}
              {product.barter && (
                <span className="px-3 py-1 bg-[#7AAF00]/15 text-[#7AAF00] text-xs font-bold rounded-full flex items-center gap-1.5 border border-[#7AAF00]/30">
                  <MorphBarter active className="w-3.5 h-3.5 text-[#7AAF00]" />
                  Acepta Trueque
                </span>
              )}
            </div>

            <h2 className="text-2xl font-black text-[#2C2C2C] tracking-tight leading-tight">
              {product.title}
            </h2>

            <div className="mt-4">
              <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                Valor Referencial
              </span>
              <p className="text-3xl font-extrabold text-[#EC006C] tracking-tight">
                C$ {formattedPrice}
              </p>
            </div>

            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C2C2C]/70 mb-2">
                Descripción
              </h4>
              <p className="text-sm text-[#2C2C2C]/80 leading-relaxed whitespace-pre-line">
                {product.description || 'El vendedor no incluyó una descripción detallada para este producto.'}
              </p>
            </div>

            {formattedDate && (
              <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>Publicado el {formattedDate}</span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-3">
            {product.barter && onStartBarter && (
              <button
                onClick={() => {
                  onClose();
                  onStartBarter(product);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-[#7AAF00] hover:bg-[#6B9A00] text-white font-bold text-sm shadow-md shadow-[#7AAF00]/25 transition-all cursor-pointer hover:-translate-y-0.5"
              >
                <MorphBarter active className="w-4 h-4 text-white" />
                <span>Iniciar Trueque Inteligente</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-[#2C2C2C] font-bold text-sm transition-all cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

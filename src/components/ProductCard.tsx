import React from 'react';
import { Product } from '@/types';
import { Repeat, Eye, Tag, Sparkles, Image as ImageIcon } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
  onStartBarter?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onStartBarter,
}) => {
  const firstImage = product.images?.[0]?.url || null;

  const formattedPrice = Number(product.price || 0).toLocaleString('es-NI', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-soft hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
      {/* Image container */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        {firstImage ? (
          <img
            src={firstImage}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
            <ImageIcon className="w-10 h-10 stroke-1 text-slate-300 mb-1" />
            <span className="text-xs font-medium">Sin imagen</span>
          </div>
        )}

        {/* Barter badge */}
        {product.barter && (
          <div className="absolute top-3 left-3 bg-[#72A619] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1.5 backdrop-blur-xs">
            <Repeat className="w-3.5 h-3.5" />
            <span>Trueque</span>
          </div>
        )}

        {/* Condition tag */}
        {product.condition && (
          <div className="absolute top-3 right-3 bg-white/90 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-xs border border-white/50">
            {product.condition.name}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          {product.category && (
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              <Tag className="w-3 h-3" />
              <span>{product.category.name}</span>
            </div>
          )}

          {/* Title */}
          <h3
            className="font-bold text-slate-800 text-base leading-snug line-clamp-2 group-hover:text-[#EC006C] transition-colors cursor-pointer"
            onClick={() => onViewDetails && onViewDetails(product)}
            title={product.title}
          >
            {product.title}
          </h3>

          {product.description && (
            <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">
              Precio Estimado
            </span>
            <span className="text-lg font-black text-slate-900 tracking-tight">
              C$ {formattedPrice}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onViewDetails && (
              <button
                onClick={() => onViewDetails(product)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Ver detalle"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}

            {product.barter && onStartBarter && (
              <button
                onClick={() => onStartBarter(product)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#72A619] hover:bg-[#628f14] text-white shadow-xs shadow-[#72A619]/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>Trueque</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Product } from '@/types';
import { Tag, Image as ImageIcon } from 'lucide-react';
import { MorphBarter } from '@/components/common/MorphIcon';

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
  onStartBarter?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
}) => {
  const firstImage = product.images?.[0]?.url || null;

  const formattedPrice = Number(product.price || 0).toLocaleString('es-NI', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div
      onClick={() => onViewDetails && onViewDetails(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onViewDetails && onViewDetails(product);
        }
      }}
      className="group bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 hover:border-[#EC006C]/40 hover:shadow-md sm:hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden cursor-pointer hover:-translate-y-0.5 select-none"
    >
      {/* Image container: Amazon square style */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden flex items-center justify-center">
        {firstImage ? (
          <img
            src={firstImage}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
            <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 stroke-1 text-slate-300 mb-1" />
            <span className="text-[10px] sm:text-xs font-medium">Sin imagen</span>
          </div>
        )}

        {/* Discreet Trueque badge on image corner */}
        {product.barter && (
          <div className="absolute top-2 left-2 bg-[#7AAF00] text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 backdrop-blur-xs">
            <MorphBarter active className="w-3 h-3 text-white" />
            <span>Trueque</span>
          </div>
        )}

        {/* Condition tag */}
        {product.condition && (
          <div className="absolute top-2 right-2 bg-white/95 text-[#2C2C2C] text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-md shadow-2xs backdrop-blur-md border border-slate-200/60">
            {product.condition.name}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          {product.category && (
            <div className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 truncate">
              <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#EC006C] flex-shrink-0" />
              <span className="truncate">{product.category.name}</span>
            </div>
          )}

          {/* Title - Amazon clean 2 lines */}
          <h3
            className="font-semibold text-xs sm:text-sm text-[#2C2C2C] line-clamp-2 leading-tight sm:leading-snug group-hover:text-[#EC006C] transition-colors"
            title={product.title}
          >
            {product.title}
          </h3>
        </div>

        {/* Price section - Clean "Precio" instead of "Precio Estimado" without buttons */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-baseline justify-between">
          <div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 block uppercase tracking-wide">
              Precio
            </span>
            <span className="text-sm sm:text-base md:text-lg font-black text-[#2C2C2C] tracking-tight">
              C$ {formattedPrice}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

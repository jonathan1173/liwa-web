import React, { useState, useEffect, useMemo } from 'react';
import { Product, Category } from '@/types';
import { getBarterProducts, getCategories } from '@/lib/supabase';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import { Pagination } from '@/components/common/Pagination';
import { MorphBarter } from '@/components/common/MorphIcon';
import {
  Repeat,
  Search,
  RefreshCw,
  Scale,
  ShieldCheck,
  X,
  RotateCcw,
} from 'lucide-react';

interface TruequePageProps {
  onStartBarter: (product: Product) => void;
}

const ITEMS_PER_PAGE = 8;

export const TruequePage: React.FC<TruequePageProps> = ({ onStartBarter }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodsData, catsData] = await Promise.all([
        getBarterProducts(),
        getCategories(),
      ]);
      setProducts(prodsData);
      setCategories(catsData);
    } catch (err) {
      console.warn('Error fetching barter products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Reset pagination to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query));

      const matchesCategory =
        selectedCategory === 'all' ||
        (item.category &&
          categories.find((c) => c.id === selectedCategory)?.name === item.category.name);

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory, categories]);

  const hasAnyFilterActive = useMemo(() => {
    return searchQuery.trim() !== '' || selectedCategory !== 'all';
  }, [searchQuery, selectedCategory]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const selectedCategoryName =
    selectedCategory !== 'all'
      ? categories.find((c) => c.id === selectedCategory)?.name
      : null;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
    

      {/* Filter & Search Bar */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/80 shadow-soft">
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-black text-[#2C2C2C] tracking-tight flex items-center gap-2">
              <MorphBarter active className="w-5 h-5 sm:w-6 sm:h-6 text-[#7AAF00] flex-shrink-0" />
              <span className="truncate">Artículos para Trueque</span>
              <span className="text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#7AAF00]/15 text-[#7AAF00] border border-[#7AAF00]/30 flex-shrink-0">
                {filteredProducts.length}
              </span>
            </h2>
            <p className="text-xs text-[#2C2C2C]/70 mt-1 hidden sm:block">
              Todos los productos listados aceptan propuestas de intercambio
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {hasAnyFilterActive && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-[#7AAF00] hover:bg-[#7AAF00]/10 transition-all cursor-pointer"
                title="Limpiar filtros"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Limpiar</span>
              </button>
            )}

            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-[#2C2C2C] hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer disabled:opacity-50 shadow-2xs"
              title="Actualizar catálogo"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Actualizar</span>
            </button>
          </div>
        </div>

        {/* Search Input with Clear Button */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 absolute left-3.5 sm:left-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar artículos para trueque..."
            className="w-full pl-10 sm:pl-12 pr-9 sm:pr-10 py-2.5 sm:py-3 bg-white/95 border border-slate-200 focus:border-[#7AAF00] focus:bg-white focus:ring-3 focus:ring-[#7AAF00]/20 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium text-[#2C2C2C] transition-all outline-none shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 p-1 text-slate-400 hover:text-[#7AAF00] rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Active Filters Chips Bar */}
        {hasAnyFilterActive && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-semibold text-slate-400 mr-1">Filtros:</span>

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-[#2C2C2C] text-xs font-medium">
                <span>"{searchQuery}"</span>
                <button onClick={() => setSearchQuery('')} className="hover:text-[#7AAF00]">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedCategoryName && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#7AAF00]/15 text-[#7AAF00] text-xs font-semibold">
                <span>Categoría: {selectedCategoryName}</span>
                <button onClick={() => setSelectedCategory('all')} className="hover:text-[#7AAF00]">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Categories Chip Carousel (Horizontal Scroll, touch friendly) */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar -mx-2 px-2 scroll-smooth">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex-shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-[#7AAF00] text-white shadow-md shadow-[#7AAF00]/25'
                  : 'bg-white text-[#2C2C2C] border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Todas las categorías
            </button>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex-shrink-0 ${
                    isSelected
                      ? 'bg-[#7AAF00] text-white shadow-md shadow-[#7AAF00]/25'
                      : 'bg-white text-[#2C2C2C] border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
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
          <Repeat className="w-12 h-12 text-slate-300 mx-auto mb-3 stroke-1" />
          <h3 className="text-base sm:text-lg font-bold text-[#2C2C2C]">
            No se encontraron publicaciones de trueque
          </h3>
          <p className="text-[#2C2C2C]/60 text-xs mt-1 max-w-xs mx-auto">
            Prueba buscando con otro término o seleccionando una categoría diferente.
          </p>
          {hasAnyFilterActive && (
            <button
              onClick={clearAllFilters}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#7AAF00] text-white shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar filtros</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={(p) => setSelectedProduct(p)}
                onStartBarter={onStartBarter}
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

      {/* Details Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onStartBarter={onStartBarter}
      />
    </div>
  );
};

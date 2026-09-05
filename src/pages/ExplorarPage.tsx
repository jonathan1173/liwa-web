import React, { useState, useEffect, useMemo } from 'react';
import { Product, Category, Condition } from '@/types';
import { getProducts, getCategories, getConditions } from '@/lib/supabase';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import { Pagination } from '@/components/common/Pagination';
import { MorphCompass, MorphBarter } from '@/components/common/MorphIcon';
import {
  Search,
  RefreshCw,
  Repeat,
  SlidersHorizontal,
  X,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface ExplorarPageProps {
  onStartBarter: (product: Product) => void;
}

const ITEMS_PER_PAGE = 8;

export const ExplorarPage: React.FC<ExplorarPageProps> = ({ onStartBarter }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [selectedCondition, setSelectedCondition] = useState<number | 'all'>('all');
  const [onlyBarter, setOnlyBarter] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodsData, catsData, condsData] = await Promise.all([
        getProducts(),
        getCategories(),
        getConditions(),
      ]);
      setProducts(prodsData);
      setCategories(catsData);
      setConditions(condsData);
    } catch (err) {
      console.warn('Error loading explorar data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Reset pagination to page 1 whenever any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedCondition, onlyBarter]);

  // Filter products by search text, category, condition, and barter
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

      const matchesBarter = !onlyBarter || item.barter;

      return matchesSearch && matchesCategory && matchesCondition && matchesBarter;
    });
  }, [products, searchQuery, selectedCategory, selectedCondition, onlyBarter, categories, conditions]);

  // Active filter count (excluding category all and empty search)
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCondition !== 'all') count++;
    if (onlyBarter) count++;
    return count;
  }, [selectedCondition, onlyBarter]);

  const hasAnyFilterActive = useMemo(() => {
    return (
      searchQuery.trim() !== '' ||
      selectedCategory !== 'all' ||
      selectedCondition !== 'all' ||
      onlyBarter
    );
  }, [searchQuery, selectedCategory, selectedCondition, onlyBarter]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCondition('all');
    setOnlyBarter(false);
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

  const selectedConditionName =
    selectedCondition !== 'all'
      ? conditions.find((c) => c.id === selectedCondition)?.name
      : null;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header & Search Bar Section */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/80 shadow-soft">
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-3xl font-black text-[#2C2C2C] tracking-tight flex items-center gap-2">
              <MorphCompass active className="w-5 h-5 sm:w-7 sm:h-7 text-[#EC006C] flex-shrink-0" />
              <span className="truncate">Explorar Catálogo</span>
              <span className="text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#EC006C]/10 text-[#EC006C] border border-[#EC006C]/20 flex-shrink-0">
                {filteredProducts.length}
              </span>
            </h1>
            <p className="text-xs text-[#2C2C2C]/70 mt-1 hidden sm:block">
              Descubre productos y servicios de la comunidad local en Liwa
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {hasAnyFilterActive && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-[#EC006C] hover:bg-[#EC006C]/10 transition-all cursor-pointer"
                title="Limpiar todos los filtros"
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

        {/* Search Bar + Controls Container */}
        <div className="space-y-3">
          {/* Main search row with Filter toggle button on mobile */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 flex items-center">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 absolute left-3.5 sm:left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, descripción..."
                className="w-full pl-10 sm:pl-12 pr-9 sm:pr-10 py-2.5 sm:py-3 bg-white/95 border border-slate-200 focus:border-[#EC006C] focus:bg-white focus:ring-3 focus:ring-[#EC006C]/20 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium text-[#2C2C2C] transition-all outline-none shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-1 text-slate-400 hover:text-[#EC006C] rounded-md transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className={`md:hidden flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-2xs ${
                activeFiltersCount > 0 || showMobileFilters
                  ? 'bg-[#EC006C] text-white border-[#EC006C]'
                  : 'bg-white border-slate-200 text-[#2C2C2C] hover:bg-slate-50'
              }`}
              aria-label="Abrir filtros"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filtros</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-[#EC006C] text-[10px] font-black flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Secondary Filters (Always visible on desktop md+, collapsible on mobile) */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-2.5 sm:gap-3 transition-all duration-300 ${
              showMobileFilters ? 'block' : 'hidden md:grid'
            }`}
          >
            {/* Condition Dropdown */}
            <div className="md:col-span-6">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 md:hidden">
                Estado del artículo
              </label>
              <select
                value={selectedCondition}
                onChange={(e) =>
                  setSelectedCondition(e.target.value === 'all' ? 'all' : Number(e.target.value))
                }
                className="w-full py-2.5 sm:py-3 px-3.5 sm:px-4 bg-white/95 border border-slate-200 focus:border-[#EC006C] focus:bg-white rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold text-[#2C2C2C] transition-all outline-none cursor-pointer shadow-2xs"
              >
                <option value="all">Todas las condiciones</option>
                {conditions.map((cond) => (
                  <option key={cond.id} value={cond.id}>
                    {cond.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Only Barter Toggle Button */}
            <div className="md:col-span-6">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 md:hidden">
                Modalidad de intercambio
              </label>
              <button
                onClick={() => setOnlyBarter(!onlyBarter)}
                className={`w-full py-2.5 sm:py-3 px-3.5 sm:px-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer shadow-2xs ${
                  onlyBarter
                    ? 'bg-[#7AAF00] text-white border-[#7AAF00] shadow-md shadow-[#7AAF00]/25'
                    : 'bg-white border-slate-200 text-[#2C2C2C] hover:bg-slate-50'
                }`}
              >
                <MorphBarter active={onlyBarter} className={`w-4 h-4 ${onlyBarter ? 'text-white' : 'text-[#7AAF00]'}`} />
                <span>{onlyBarter ? '✓ Solo Trueque activado' : 'Filtrar solo Trueque'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Chips Bar (When any filter is active) */}
        {hasAnyFilterActive && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-semibold text-slate-400 mr-1">Filtros activos:</span>

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-[#2C2C2C] text-xs font-medium">
                <span>"{searchQuery}"</span>
                <button onClick={() => setSearchQuery('')} className="hover:text-[#EC006C]">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedCategoryName && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EC006C]/10 text-[#EC006C] text-xs font-semibold">
                <span>Categoría: {selectedCategoryName}</span>
                <button onClick={() => setSelectedCategory('all')} className="hover:text-[#EC006C]">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedConditionName && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-[#2C2C2C] text-xs font-medium">
                <span>Condición: {selectedConditionName}</span>
                <button onClick={() => setSelectedCondition('all')} className="hover:text-[#EC006C]">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {onlyBarter && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#7AAF00]/15 text-[#7AAF00] text-xs font-semibold">
                <span>Solo Trueque</span>
                <button onClick={() => setOnlyBarter(false)} className="hover:text-[#7AAF00]">
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
                  ? 'bg-[#EC006C] text-white shadow-md shadow-[#EC006C]/25'
                  : 'bg-white text-[#2C2C2C] border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Todos
            </button>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex-shrink-0 ${
                    isSelected
                      ? 'bg-[#EC006C] text-white shadow-md shadow-[#EC006C]/25'
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

      {/* Product Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-[#EC006C]"></div>
          <p className="text-[#2C2C2C]/70 font-medium text-xs sm:text-sm mt-4">
            Cargando productos desde Liwa...
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-10 sm:p-16 text-center border border-white/80 shadow-soft">
          <p className="text-[#2C2C2C] font-bold text-base sm:text-lg">
            No se encontraron productos coincidentes
          </p>
          <p className="text-[#2C2C2C]/60 text-xs mt-1 max-w-xs mx-auto">
            Intenta ajustar los filtros de búsqueda o categoría
          </p>
          {hasAnyFilterActive && (
            <button
              onClick={clearAllFilters}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#EC006C] text-white shadow-xs"
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
              accentColor="magenta"
            />
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onStartBarter={onStartBarter}
      />
    </div>
  );
};

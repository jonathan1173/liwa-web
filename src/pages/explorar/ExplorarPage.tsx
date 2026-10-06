import React, { useState, useEffect, useMemo } from 'react';
import { Product, Category, Condition } from '@/types';
import { getProducts, getCategories, getConditions } from '@/lib/supabase';
import { ProductCard } from '@/components/ProductCard';
import { Pagination } from '@/components/common/Pagination';
import { MorphBarter } from '@/components/common/MorphIcon';
import {
  Search,
  RefreshCw,
  SlidersHorizontal,
  X,
  RotateCcw,
  Check,
} from 'lucide-react';

export interface ExplorarPageProps {
  onStartBarter?: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
}

const ITEMS_PER_PAGE = 8;

export const ExplorarPage: React.FC<ExplorarPageProps> = ({
  onSelectProduct,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [selectedCondition, setSelectedCondition] = useState<number | 'all'>('all');
  const [onlyBarter, setOnlyBarter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterModal, setShowFilterModal] = useState(false);

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

  // Active filter count (excluding empty search)
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedCondition !== 'all') count++;
    if (onlyBarter) count++;
    return count;
  }, [selectedCategory, selectedCondition, onlyBarter]);

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

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      {/* Compact Search Bar & Filter Trigger Button (Amazon style) */}
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
              className="w-full pl-10 sm:pl-12 pr-9 sm:pr-10 py-2 sm:py-2.5 bg-white border border-slate-200 focus:border-[#EC006C] focus:bg-white focus:ring-2 focus:ring-[#EC006C]/15 rounded-xl text-xs sm:text-sm font-medium text-[#2C2C2C] transition-all outline-none shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1 text-slate-400 hover:text-[#EC006C] rounded-md transition-colors cursor-pointer"
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
                ? 'bg-[#EC006C] text-white border-[#EC006C] shadow-sm shadow-[#EC006C]/25'
                : 'bg-white border-slate-200 text-[#2C2C2C] hover:bg-slate-50'
            }`}
            aria-label="Abrir filtros avanzados"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden xs:inline sm:inline">Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-white text-[#EC006C] text-[10px] font-black flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Refresh button */}
          <button
            type="button"
            onClick={fetchData}
            disabled={loading}
            className="p-2 sm:p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-[#EC006C] hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50 shadow-2xs flex-shrink-0"
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
                  className="hover:text-[#EC006C] cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedCategoryName && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EC006C]/10 text-[#EC006C] text-xs font-semibold">
                <span>Categoría: {selectedCategoryName}</span>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="hover:text-[#EC006C] cursor-pointer"
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
                  className="hover:text-[#EC006C] cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {onlyBarter && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#7AAF00]/15 text-[#7AAF00] text-xs font-semibold">
                <span>Solo Trueque</span>
                <button
                  onClick={() => setOnlyBarter(false)}
                  className="hover:text-[#7AAF00] cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-slate-500 hover:text-[#EC006C] text-xs font-medium hover:bg-slate-100 transition-colors cursor-pointer ml-auto"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpiar filtros</span>
            </button>
          </div>
        )}
      </div>

      {/* Product Grid: 2 columns on mobile, 3-4 columns on desktop */}
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
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#EC006C] text-white shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar filtros</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={(p) => {
                  if (onSelectProduct) {
                    onSelectProduct(p);
                  }
                }}
              />
            ))}
          </div>

          {/* Flowbite-styled Pagination (preserved exactly) */}
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

      {/* Advanced Filters Modal - Compact & Lowered */}
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
                <SlidersHorizontal className="w-4 h-4 text-[#EC006C]" />
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
                        ? 'bg-[#EC006C] text-white shadow-xs'
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
                            ? 'bg-[#EC006C] text-white shadow-xs'
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
                        ? 'bg-[#EC006C] text-white shadow-xs'
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
                            ? 'bg-[#EC006C] text-white shadow-xs'
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

              {/* Barter Option */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Modalidad
                </label>
                <button
                  type="button"
                  onClick={() => setOnlyBarter(!onlyBarter)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    onlyBarter
                      ? 'bg-[#7AAF00] text-white border-[#7AAF00] shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-[#2C2C2C] hover:bg-slate-100'
                  }`}
                >
                  <MorphBarter
                    active={onlyBarter}
                    className={`w-3.5 h-3.5 ${onlyBarter ? 'text-white' : 'text-[#7AAF00]'}`}
                  />
                  <span>{onlyBarter ? '✓ Solo Trueque activado' : 'Filtrar solo artículos con Trueque'}</span>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={clearAllFilters}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-[#EC006C] transition-colors cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restablecer</span>
              </button>

              <button
                type="button"
                onClick={() => setShowFilterModal(false)}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#EC006C] hover:bg-[#c7005b] text-white shadow-xs transition-all cursor-pointer"
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

export default ExplorarPage;

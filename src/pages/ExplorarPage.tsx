import React, { useState, useEffect, useMemo } from 'react';
import { Product, Category, Condition } from '@/types';
import { getProducts, getCategories, getConditions } from '@/lib/supabase';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import {
  Search,
  SlidersHorizontal,
  RefreshCw,
  Repeat,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';

interface ExplorarPageProps {
  onStartBarter: (product: Product) => void;
}

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Search Bar Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Explorar Catálogo</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                {filteredProducts.length} productos
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Descubre productos y servicios ofrecidos por la comunidad local en Liwa
            </p>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>

        {/* Search Bar + Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-6 relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, descripción o categoría..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#EC006C] focus:bg-white focus:ring-2 focus:ring-[#EC006C]/20 rounded-2xl text-sm font-medium text-slate-800 transition-all outline-none"
            />
          </div>

          {/* Condition Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedCondition}
              onChange={(e) =>
                setSelectedCondition(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="w-full py-3 px-4 bg-slate-50 border border-slate-200 focus:border-[#EC006C] focus:bg-white rounded-2xl text-sm font-semibold text-slate-700 transition-all outline-none cursor-pointer"
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
          <div className="md:col-span-3">
            <button
              onClick={() => setOnlyBarter(!onlyBarter)}
              className={`w-full py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                onlyBarter
                  ? 'bg-[#72A619] text-white border-[#72A619] shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Repeat className="w-4 h-4" />
              <span>{onlyBarter ? '✓ Solo Trueque activo' : 'Filtrar solo Trueque'}</span>
            </button>
          </div>
        </div>

        {/* Categories Chip Carousel / Row */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#EC006C] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#EC006C] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-[#EC006C]"></div>
          <p className="text-slate-500 font-medium text-sm mt-4">
            Cargando productos desde Liwa...
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-soft">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4 stroke-1" />
          <h3 className="text-lg font-bold text-slate-800">No se encontraron publicaciones</h3>
          <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
            Prueba ajustando el término de búsqueda o seleccionando otra categoría en los filtros.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedCondition('all');
              setOnlyBarter(false);
            }}
            className="mt-6 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={(p) => setSelectedProduct(p)}
              onStartBarter={onStartBarter}
            />
          ))}
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

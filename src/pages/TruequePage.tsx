import React, { useState, useEffect, useMemo } from 'react';
import { Product, Category } from '@/types';
import { getBarterProducts, getCategories } from '@/lib/supabase';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import {
  Repeat,
  Search,
  RefreshCw,
  Scale,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

interface TruequePageProps {
  onStartBarter: (product: Product) => void;
}

export const TruequePage: React.FC<TruequePageProps> = ({ onStartBarter }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner / Value Proposition Hero for Trueque */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#72A619] via-[#5b8514] to-[#3f5c0e] text-white p-8 sm:p-10 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold uppercase tracking-wider">
            <Repeat className="w-3.5 h-3.5" />
            <span>Comercio Justo y Colaborativo</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Trueque Inteligente: Intercambia lo que tienes por lo que necesitas
          </h1>

          <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-2xl">
            Selecciona cualquier artículo marcado con la etiqueta de trueque. Nuestra herramienta
            calculará y comparará el valor de hasta 4 de tus artículos en tiempo real para asegurar una
            oferta equilibrada y justa para ambas partes.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs font-semibold text-white/80">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-200" />
              <span>Balanceador de valor monetario</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-200" />
              <span>Ofertas seguras con notificación directa</span>
            </div>
          </div>
        </div>

        {/* Decorative Background Element */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Artículos Disponibles para Trueque</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-[#72A619]">
                {filteredProducts.length} disponibles
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Todos los productos listados a continuación aceptan intercambios
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

        {/* Search */}
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar artículos para trueque..."
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-[#72A619] focus:bg-white focus:ring-2 focus:ring-[#72A619]/20 rounded-2xl text-sm font-medium text-slate-800 transition-all outline-none"
          />
        </div>

        {/* Categories */}
        <div className="mt-5 pt-5 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#72A619] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#72A619] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-[#72A619]"></div>
          <p className="text-slate-500 font-medium text-sm mt-4">
            Cargando catálogo de trueque...
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-soft">
          <Repeat className="w-16 h-16 text-slate-300 mx-auto mb-4 stroke-1" />
          <h3 className="text-lg font-bold text-slate-800">
            No se encontraron publicaciones de trueque
          </h3>
          <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
            Prueba buscando con otro término o seleccionando una categoría diferente.
          </p>
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

      {/* Details Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onStartBarter={onStartBarter}
      />
    </div>
  );
};

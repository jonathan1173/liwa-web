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
  ShieldCheck,
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
      {/* Banner / Value Proposition Hero for Trueque con degradado y desenfoque */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#4A198C] via-[#351066] to-[#7AAF00] text-white p-8 sm:p-10 shadow-xl border border-white/10">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-white border border-white/20">
            <Repeat className="w-3.5 h-3.5 text-[#7AAF00]" />
            <span>Comercio Justo y Colaborativo</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Trueque Inteligente: Intercambia lo que tienes por lo que necesitas
          </h1>

          <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-2xl">
            Selecciona cualquier artículo marcado con la insignia verde de trueque. Nuestra herramienta
            calculará y comparará el valor de hasta 4 de tus artículos en tiempo real para asegurar una
            oferta equilibrada y justa para ambas partes.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs font-semibold text-white/90">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#7AAF00]" />
              <span>Balanceador de valor monetario</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#7AAF00]" />
              <span>Ofertas seguras con notificación directa</span>
            </div>
          </div>
        </div>

        {/* Decorative Ambient Orbs */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-[#7AAF00]/25 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-0 right-1/3 w-60 h-60 bg-[#EC006C]/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/80 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-[#2C2C2C] tracking-tight flex items-center gap-2.5">
              <span>Artículos Disponibles para Trueque</span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#7AAF00]/15 text-[#7AAF00] border border-[#7AAF00]/30">
                {filteredProducts.length} disponibles
              </span>
            </h2>
            <p className="text-xs text-[#2C2C2C]/70 mt-1">
              Todos los productos listados a continuación aceptan intercambios
            </p>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-[#2C2C2C] hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer disabled:opacity-50 shadow-2xs"
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
            className="w-full pl-12 pr-4 py-3.5 bg-white/90 border border-slate-200 focus:border-[#7AAF00] focus:bg-white focus:ring-3 focus:ring-[#7AAF00]/20 rounded-2xl text-sm font-medium text-[#2C2C2C] transition-all outline-none shadow-2xs"
          />
        </div>

        {/* Categories */}
        <div className="mt-5 pt-5 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
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
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
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

      {/* Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-[#7AAF00]"></div>
          <p className="text-[#2C2C2C]/70 font-medium text-sm mt-4">
            Cargando catálogo de trueque...
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-16 text-center border border-white/80 shadow-soft">
          <Repeat className="w-16 h-16 text-slate-300 mx-auto mb-4 stroke-1" />
          <h3 className="text-lg font-bold text-[#2C2C2C]">
            No se encontraron publicaciones de trueque
          </h3>
          <p className="text-[#2C2C2C]/60 text-xs mt-1 max-w-sm mx-auto">
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

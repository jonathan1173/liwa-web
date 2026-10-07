import React, { useEffect, useRef, useState, useMemo } from 'react';
import { SellerLocation, Product, Category } from '@/types';
import { getSellerLocationsWithInventory, getMyProducts } from '@/lib/supabase';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import {
  MapPin,
  Phone,
  MessageSquare,
  Package,
  X,
  Info,
  Search,
  Tv,
  Home,
  Shirt,
  UtensilsCrossed,
  Gamepad2,
  Sparkles,
  Layers,
  ChevronRight,
  ExternalLink,
  Store,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import L from 'leaflet';

export interface MapaPageProps {
  onStartBarter: (product: Product) => void;
}

// Category filter configuration with keyword aliases for intelligent matching
interface CategoryFilterConfig {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  dbCategories: string[];
  keywords: string[];
  color: string;
}

const CATEGORY_FILTERS: CategoryFilterConfig[] = [
  {
    id: 'all',
    label: 'Todos los vendedores',
    shortLabel: 'Todos',
    icon: Store,
    dbCategories: [],
    keywords: [],
    color: '#4A198C',
  },
  {
    id: 'electrodomesticos',
    label: 'Electrodomésticos y Electrónica',
    shortLabel: 'Electrodomésticos',
    icon: Tv,
    dbCategories: ['Electronica'],
    keywords: [
      'electrodomestico',
      'electrodoméstico',
      'electrodomesticos',
      'electrodomésticos',
      'electronica',
      'electrónica',
      'aparato',
      'refrigerador',
      'refrigeradora',
      'microondas',
      'licuadora',
      'plancha',
      'estufa',
      'lavadora',
      'ventilador',
      'abanico',
      'laptop',
      'computadora',
      'telefono',
      'teléfono',
      'celular',
      'audifonos',
      'audífonos',
      'consola',
      'televisor',
      'tv',
      'parlante',
    ],
    color: '#EC006C',
  },
  {
    id: 'casa',
    label: 'Cosas de Casa y Hogar',
    shortLabel: 'Cosas de Casa',
    icon: Home,
    dbCategories: ['Casa'],
    keywords: [
      'casa',
      'hogar',
      'mueble',
      'muebles',
      'silla',
      'mesa',
      'cama',
      'colchon',
      'colchón',
      'comedor',
      'sala',
      'cocina',
      'plato',
      'olla',
      'sarten',
      'sartén',
      'utensilio',
      'utensilios',
      'sabana',
      'sábana',
      'almohada',
      'espejo',
      'cortina',
      'lampara',
      'lámpara',
      'decoracion',
      'decoración',
      'vajilla',
    ],
    color: '#4A198C',
  },
  {
    id: 'ropa',
    label: 'Ropa y Accesorios',
    shortLabel: 'Ropa y Accesorios',
    icon: Shirt,
    dbCategories: ['Ropa y Accesorios'],
    keywords: [
      'ropa',
      'accesorio',
      'accesorios',
      'camisa',
      'camiseta',
      'pantalon',
      'pantalón',
      'short',
      'falda',
      'vestido',
      'zapato',
      'zapatos',
      'tenis',
      'sandalias',
      'reloj',
      'joya',
      'cadena',
      'gorra',
      'bolso',
      'cartera',
    ],
    color: '#7AAF00',
  },
  {
    id: 'comida',
    label: 'Comida y Bebidas',
    shortLabel: 'Comida',
    icon: UtensilsCrossed,
    dbCategories: ['Comida', 'Verduras', 'Refrescos'],
    keywords: [
      'comida',
      'alimento',
      'alimentos',
      'verdura',
      'verduras',
      'fruta',
      'frutas',
      'refresco',
      'refrescos',
      'bebida',
      'bebidas',
      'jugo',
      'snack',
      'pan',
      'postre',
      'dulce',
      'queso',
      'grano',
    ],
    color: '#EC006C',
  },
  {
    id: 'entretenimiento',
    label: 'Entretenimiento y Pasatiempos',
    shortLabel: 'Entretenimiento',
    icon: Gamepad2,
    dbCategories: ['Entretenimiento', 'Pasatiempo'],
    keywords: [
      'entretenimiento',
      'pasatiempo',
      'juego',
      'juegos',
      'videojuego',
      'juguete',
      'libro',
      'comic',
      'musica',
      'música',
      'guitarra',
      'instrumento',
      'arte',
      'deporte',
      'bicicleta',
    ],
    color: '#4A198C',
  },
];

export const MapaPage: React.FC<MapaPageProps> = ({ onStartBarter }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  const [sellers, setSellers] = useState<SellerLocation[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'all' | 'sections'>('sections');

  // Selected seller details state
  const [selectedSeller, setSelectedSeller] = useState<SellerLocation | null>(null);
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null);

  // Initial map center (Nicaragua: Masaya / Managua / Granada)
  const defaultLat = 11.9768;
  const defaultLng = -86.0877;

  // Load sellers with inventory & categories directly from Supabase
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const { sellers: sellerList, categories: catList } = await getSellerLocationsWithInventory();
        setSellers(sellerList);
        setCategories(catList);
      } catch (err) {
        console.warn('Error loading seller inventory from Supabase:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Filtered sellers according to active category and search query
  const filteredSellers = useMemo(() => {
    let result = sellers;

    // 1. Filter by Category
    if (selectedCategory !== 'all') {
      const activeFilter = CATEGORY_FILTERS.find((f) => f.id === selectedCategory);
      if (activeFilter) {
        result = result.filter((seller) => {
          // Check if any product category matches
          const hasDbCatMatch = seller.categories?.some((catName) =>
            activeFilter.dbCategories.some(
              (target) => target.toLowerCase() === catName.toLowerCase()
            )
          );
          if (hasDbCatMatch) return true;

          // Check keywords in products
          const hasKeywordMatch = seller.products?.some((prod) => {
            const text = `${prod.title} ${prod.description || ''}`.toLowerCase();
            return activeFilter.keywords.some((kw) => text.includes(kw));
          });

          return Boolean(hasKeywordMatch);
        });
      }
    }

    // 2. Filter by Search Query
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((seller) => {
        // Name, username or city
        if (
          seller.full_name?.toLowerCase().includes(q) ||
          seller.username?.toLowerCase().includes(q) ||
          seller.city?.name?.toLowerCase().includes(q)
        ) {
          return true;
        }

        // Category name
        if (seller.categories?.some((cat) => cat.toLowerCase().includes(q))) {
          return true;
        }

        // Aliases check: electrodomesticos -> electronica
        if (
          q.includes('electro') &&
          seller.categories?.some((c) => c.toLowerCase() === 'electronica')
        ) {
          return true;
        }
        if (
          (q.includes('casa') || q.includes('hogar')) &&
          seller.categories?.some((c) => c.toLowerCase() === 'casa')
        ) {
          return true;
        }

        // Product titles or descriptions
        return seller.products?.some((prod) => {
          const prodText = `${prod.title} ${prod.description || ''}`.toLowerCase();
          return prodText.includes(q);
        });
      });
    }

    return result;
  }, [sellers, selectedCategory, searchQuery]);

  // Count sellers per category for badges
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: sellers.length };

    CATEGORY_FILTERS.forEach((filter) => {
      if (filter.id === 'all') return;
      const count = sellers.filter((seller) => {
        const hasDbCatMatch = seller.categories?.some((catName) =>
          filter.dbCategories.some(
            (target) => target.toLowerCase() === catName.toLowerCase()
          )
        );
        if (hasDbCatMatch) return true;

        const hasKeywordMatch = seller.products?.some((prod) => {
          const text = `${prod.title} ${prod.description || ''}`.toLowerCase();
          return filter.keywords.some((kw) => text.includes(kw));
        });

        return Boolean(hasKeywordMatch);
      }).length;

      counts[filter.id] = count;
    });

    return counts;
  }, [sellers]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [defaultLat, defaultLng],
      zoom: 12,
      zoomControl: false,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update map markers when filtered sellers change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    if (filteredSellers.length === 0) return;

    const bounds: L.LatLngTuple[] = [];

    filteredSellers.forEach((seller) => {
      if (seller.latitude && seller.longitude) {
        bounds.push([seller.latitude, seller.longitude]);

        const usernameTag = seller.username || seller.full_name?.split(' ')[0] || 'vendedor';
        const isSelected = selectedSeller?.id === seller.id;
        const prodCount = seller.products?.length || 0;

        // Custom divIcon matching mobile "@username" pill badge with official colors
        const customIcon = L.divIcon({
          className: 'custom-username-pin',
          html: `<div class="username-box ${isSelected ? 'active-pin' : ''}" style="${
            isSelected ? 'background-color:#EC006C;transform:scale(1.08);box-shadow:0 0 16px rgba(236,0,108,0.5);' : ''
          }">
                  <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#EC006C;margin-right:4px;"></span>
                  @${usernameTag}
                  ${prodCount > 0 ? `<span style="opacity:0.8;font-size:11px;margin-left:3px;font-weight:600;">(${prodCount})</span>` : ''}
                 </div>`,
          iconSize: [120, 34],
          iconAnchor: [60, 17],
        });

        const marker = L.marker([seller.latitude, seller.longitude], {
          icon: customIcon,
        });

        marker.on('click', () => {
          setSelectedSeller(seller);
          map.setView([seller.latitude, seller.longitude], 15, { animate: true });
        });

        markersGroup.addLayer(marker);
      }
    });

    if (bounds.length > 0) {
      map.fitBounds(L.latLngBounds(bounds), { padding: [60, 60], maxZoom: 15 });
    }
  }, [filteredSellers, selectedSeller]);

  // Load products of selected seller
  useEffect(() => {
    if (!selectedSeller) {
      setSellerProducts([]);
      return;
    }

    // Preload from seller object if available
    if (selectedSeller.products && selectedSeller.products.length > 0) {
      setSellerProducts(selectedSeller.products);
    }

    async function loadSellerProducts() {
      setLoadingProducts(true);
      try {
        const prods = await getMyProducts(selectedSeller!.id);
        if (prods && prods.length > 0) {
          setSellerProducts(prods);
        }
      } catch (err) {
        console.warn('Error loading products for seller:', err);
      } finally {
        setLoadingProducts(false);
      }
    }

    loadSellerProducts();
  }, [selectedSeller]);

  const handleWhatsApp = (phone: string | null) => {
    if (!phone) return;
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  const handleFocusSellerOnMap = (seller: SellerLocation) => {
    setSelectedSeller(seller);
    if (mapInstanceRef.current && seller.latitude && seller.longitude) {
      mapInstanceRef.current.setView([seller.latitude, seller.longitude], 15, { animate: true });
      mapContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
  };

  return (
    <div className="w-full min-h-screen bg-[#FAFAFC] pb-16">
      {/* ──────────────────────────────────────────────────────────────────────────
          1. HEADER CON VIDEO DE FONDO (BANNER HERO INSPIRADO EN MAPANICARAGUA)
          ────────────────────────────────────────────────────────────────────────── */}
      <header className="relative w-full overflow-hidden bg-[#2C2C2C] border-b border-slate-200/40 shadow-sm">
        {/* Video Element Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.88] contrast-[1.05]"
        >
          <source
            src="https://www.mapanicaragua.com/wp-content/uploads/2026/04/video-mapa-banner-1.mp4"
            type="video/mp4"
          />
        </video>

        {/* Video Overlay with official Liwa gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2C2C2C]/75 via-[#4A198C]/35 to-[#2C2C2C]/85 pointer-events-none" />

        {/* Top Header Content: Título 'MAPA' */}
        <div className="relative z-10 pt-10 sm:pt-14 pb-14 sm:pb-20 max-w-5xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 shadow-sm animate-in fade-in duration-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EC006C] animate-ping" />
            <MapPin className="w-4 h-4 text-[#EC006C]" />
            <span>Nicaragua • Directorio Comunitario Liwa</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight drop-shadow-lg">
            MAPA
          </h1>

          <p className="mt-3 text-sm sm:text-base text-white/90 font-medium max-w-xl mx-auto drop-shadow-md">
            Localiza vendedores locales en el mapa y filtra por lo que buscas:
            electrodomésticos, cosas de casa, ropa y más.
          </p>
        </div>

        {/* Floating Capsule / Pill Bar (Inspirado en la barra redondeada de las capturas) */}
        <div className="relative z-20 max-w-4xl mx-auto px-4 -mt-8 sm:-mt-10 mb-8">
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl sm:rounded-full border border-white/90 shadow-2xl p-2.5 sm:p-3 transition-all">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              {/* Search Bar Input */}
              <div className="relative flex-1 flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar electrodomésticos, cosas de casa, vendedor..."
                  className="w-full pl-11 pr-10 py-3 rounded-2xl sm:rounded-full bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-xs sm:text-sm font-semibold text-[#2C2C2C] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4A198C] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-[#2C2C2C] hover:bg-slate-200 cursor-pointer"
                    title="Limpiar búsqueda"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Quick View Mode Toggle on Desktop */}
              <div className="flex items-center justify-between sm:justify-start gap-2 px-1">
                <button
                  onClick={() => setViewMode(viewMode === 'sections' ? 'all' : 'sections')}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl sm:rounded-full text-xs font-bold transition-all cursor-pointer border ${
                    viewMode === 'sections'
                      ? 'bg-[#4A198C] text-white border-[#4A198C]'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                  title="Alternar vista seccionada por categoría"
                >
                  <Layers className="w-4 h-4" />
                  <span>{viewMode === 'sections' ? 'Por Categoría' : 'Todos'}</span>
                </button>

                {(selectedCategory !== 'all' || searchQuery) && (
                  <button
                    onClick={handleResetFilters}
                    className="flex items-center gap-1 px-3 py-2.5 rounded-2xl sm:rounded-full text-xs font-bold text-[#EC006C] hover:bg-[#EC006C]/10 transition-colors cursor-pointer"
                    title="Restablecer filtros"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Limpiar</span>
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Pills (Horizontal scrollable chips) */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pt-2 sm:pt-2.5 px-1 pb-1">
              {CATEGORY_FILTERS.map((cat) => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.id;
                const count = categoryCounts[cat.id] ?? 0;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#4A198C] to-[#EC006C] text-white shadow-md shadow-[#4A198C]/20 scale-105'
                        : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200/90 border border-slate-200/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{cat.shortLabel}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* ──────────────────────────────────────────────────────────────────────────
          2. SECCIÓN DEL MAPA INTERACTIVO
          ────────────────────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Banner de estado de filtrado */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#EC006C]" />
            <p className="text-xs sm:text-sm font-bold text-[#2C2C2C]">
              Mostrando{' '}
              <span className="text-[#EC006C] font-black">{filteredSellers.length}</span>{' '}
              {filteredSellers.length === 1 ? 'vendedor en el mapa' : 'vendedores en el mapa'}
              {selectedCategory !== 'all' && (
                <span className="text-slate-500 font-medium">
                  {' '}
                  en{' '}
                  <strong className="text-[#4A198C]">
                    {CATEGORY_FILTERS.find((f) => f.id === selectedCategory)?.shortLabel}
                  </strong>
                </span>
              )}
              {searchQuery && (
                <span className="text-slate-500 font-medium">
                  {' '}
                  para "{searchQuery}"
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {selectedSeller && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#4A198C]/10 text-[#4A198C] flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Vendedor seleccionado: @{selectedSeller.username || 'vendedor'}
              </span>
            )}
            <button
              onClick={() => {
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.setView([defaultLat, defaultLng], 12, { animate: true });
                }
              }}
              className="text-xs font-bold text-slate-600 hover:text-[#4A198C] px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Centrar mapa
            </button>
          </div>
        </div>

        {/* Leaflet Map Frame */}
        <div
          ref={mapContainerRef}
          className="relative w-full h-[380px] sm:h-[480px] lg:h-[540px] rounded-3xl overflow-hidden border border-white/90 shadow-soft bg-white"
        >
          {/* Map canvas */}
          <div className="w-full h-full z-10" />

          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-[#4A198C] mb-3"></div>
              <p className="text-xs font-bold text-[#2C2C2C]">Cargando vendedores y catálogo...</p>
            </div>
          )}

          {/* Empty filtered state */}
          {!loading && filteredSellers.length === 0 && (
            <div className="absolute inset-0 z-20 bg-white/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
                <Store className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-[#2C2C2C]">
                Ningún vendedor coincide con este filtro
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
                No hay vendedores registrados que ofrezcan estos artículos actualmente en esta
                categoría o búsqueda.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-[#4A198C] hover:bg-[#3E1475] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Ver todos los vendedores
              </button>
            </div>
          )}

          {/* Floating Map Helper Badge */}
          <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md py-2.5 px-4 rounded-2xl border border-slate-200/80 shadow-md text-xs font-semibold text-[#2C2C2C] flex items-center gap-2 pointer-events-none max-w-[90%] sm:max-w-md">
            <Info className="w-4 h-4 text-[#4A198C] flex-shrink-0" />
            <span className="truncate sm:whitespace-normal">
              {selectedSeller
                ? `Mostrando detalles de @${selectedSeller.username || 'vendedor'} abajo`
                : 'Toca un distintivo (@usuario) en el mapa para ver sus publicaciones abajo'}
            </span>
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────────────────────────
            3. DETALLES DEL VENDEDOR SELECCIONADO (CUANDO SE HACE CLIC EN EL MAPA)
            ────────────────────────────────────────────────────────────────────────── */}
        {selectedSeller && (
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/90 shadow-soft p-5 sm:p-8 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
            {/* Header: Seller Contact & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                {selectedSeller.photo_url ? (
                  <img
                    src={selectedSeller.photo_url}
                    alt={selectedSeller.full_name || 'Vendedor'}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-[#4A198C] to-[#EC006C] text-white flex items-center justify-center font-black text-lg shadow-md shadow-[#4A198C]/20 flex-shrink-0">
                    {selectedSeller.full_name?.slice(0, 2).toUpperCase() || 'VE'}
                  </div>
                )}
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-[#2C2C2C] tracking-tight">
                    {selectedSeller.full_name || 'Vendedor Liwa'}
                  </h3>
                  <p className="text-sm font-bold text-[#EC006C]">
                    @{selectedSeller.username || 'vendedor'}
                  </p>
                  {selectedSeller.city && (
                    <span className="text-xs text-[#2C2C2C]/70 flex items-center gap-1 mt-0.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#4A198C]" />
                      {selectedSeller.city.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                {selectedSeller.phone && (
                  <>
                    <button
                      onClick={() => handleWhatsApp(selectedSeller.phone)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl sm:rounded-2xl bg-[#7AAF00] hover:bg-[#6B9A00] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#7AAF00]/25 transition-all cursor-pointer hover:scale-105 active:scale-95"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </button>

                    <a
                      href={`tel:${selectedSeller.phone}`}
                      className="p-2.5 rounded-xl sm:rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-[#2C2C2C] shadow-xs transition-all hover:scale-105 active:scale-95"
                      title={`Llamar a ${selectedSeller.phone}`}
                    >
                      <Phone className="w-4 h-4 text-[#4A198C]" />
                    </a>
                  </>
                )}

                <button
                  onClick={() => setSelectedSeller(null)}
                  className="p-2.5 rounded-xl sm:rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-[#2C2C2C] transition-colors cursor-pointer ml-auto sm:ml-0"
                  title="Cerrar detalles del vendedor"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Seller Catalog */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#EC006C]" />
                  <h4 className="text-sm sm:text-base font-black text-[#2C2C2C] uppercase tracking-wider">
                    Publicaciones de @{selectedSeller.username || 'vendedor'}
                  </h4>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-slate-100 rounded-full text-slate-600">
                  {sellerProducts.length} {sellerProducts.length === 1 ? 'producto' : 'productos'}
                </span>
              </div>

              {loadingProducts ? (
                <div className="py-16 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-slate-200 border-t-[#EC006C]"></div>
                  <p className="text-xs font-semibold text-[#2C2C2C]/70 mt-3">
                    Cargando catálogo del vendedor...
                  </p>
                </div>
              ) : sellerProducts.length === 0 ? (
                <div className="py-12 text-center text-slate-400 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
                  <Package className="w-10 h-10 mx-auto stroke-1 text-slate-300 mb-2" />
                  <p className="text-sm font-semibold text-[#2C2C2C]">Sin publicaciones activas</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Este vendedor aún no tiene publicaciones activas en este momento.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {sellerProducts.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onViewDetails={(product) => setSelectedProductModal(product)}
                      onStartBarter={onStartBarter}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ──────────────────────────────────────────────────────────────────────────
            4. SECCIONADO DE VENDEDORES POR TIPO DE COSAS QUE VENDEN
               (CUMPLE: 'poder seccionar a los vendedores por el tipo de cosas que vende')
            ────────────────────────────────────────────────────────────────────────── */}
        <section className="space-y-6 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#2C2C2C] flex items-center gap-2">
                <Store className="w-6 h-6 text-[#4A198C]" />
                <span>Vendedores por Tipo de Producto</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Explora a los vendedores comunitarios seccionados según lo que ofrecen para compra o
                trueque.
              </p>
            </div>

            {/* Selector de modo de vista */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => setViewMode('sections')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'sections'
                    ? 'bg-[#4A198C] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Por Categorías
              </button>
              <button
                onClick={() => setViewMode('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'all'
                    ? 'bg-[#4A198C] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Lista Completa ({filteredSellers.length})
              </button>
            </div>
          </div>

          {/* VISTA 1: AGRUPADA POR CATEGORÍAS (SECCIONES DEDICADAS) */}
          {viewMode === 'sections' && (
            <div className="space-y-8">
              {CATEGORY_FILTERS.filter((f) => f.id !== 'all').map((catFilter) => {
                const Icon = catFilter.icon;

                // Vendedores pertenecientes a esta categoría
                const matchingSellers = sellers.filter((seller) => {
                  const hasDbCat = seller.categories?.some((catName) =>
                    catFilter.dbCategories.some(
                      (target) => target.toLowerCase() === catName.toLowerCase()
                    )
                  );
                  if (hasDbCat) return true;

                  const hasKeyword = seller.products?.some((prod) => {
                    const text = `${prod.title} ${prod.description || ''}`.toLowerCase();
                    return catFilter.keywords.some((kw) => text.includes(kw));
                  });
                  return Boolean(hasKeyword);
                });

                if (matchingSellers.length === 0) return null;

                return (
                  <div
                    key={catFilter.id}
                    className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/90 shadow-soft p-5 sm:p-7 space-y-5"
                  >
                    {/* Header de la Sección */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm"
                          style={{ backgroundColor: catFilter.color }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-black text-[#2C2C2C]">
                            {catFilter.label}
                          </h3>
                          <p className="text-xs text-slate-500">
                            {matchingSellers.length}{' '}
                            {matchingSellers.length === 1
                              ? 'vendedor disponible'
                              : 'vendedores disponibles'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedCategory(catFilter.id);
                          mapContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-xs font-bold text-[#4A198C] hover:text-[#EC006C] flex items-center gap-1 transition-colors cursor-pointer self-start sm:self-auto"
                      >
                        <span>Filtrar mapa por esta categoría</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Tarjetas de vendedores en esta categoría */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {matchingSellers.map((seller) => {
                        const isSelected = selectedSeller?.id === seller.id;
                        const relevantProducts =
                          seller.products?.filter((prod) => {
                            const isDbCat = catFilter.dbCategories.some(
                              (dbCat) =>
                                prod.category?.name?.toLowerCase() === dbCat.toLowerCase()
                            );
                            if (isDbCat) return true;
                            const text = `${prod.title} ${prod.description || ''}`.toLowerCase();
                            return catFilter.keywords.some((kw) => text.includes(kw));
                          }) || [];

                        return (
                          <div
                            key={seller.id}
                            className={`bg-white rounded-2xl border p-4.5 transition-all flex flex-col justify-between ${
                              isSelected
                                ? 'border-[#EC006C] shadow-md ring-2 ring-[#EC006C]/20'
                                : 'border-slate-200/80 hover:border-[#4A198C]/40 hover:shadow-md'
                            }`}
                          >
                            <div>
                              {/* Vendedor info */}
                              <div className="flex items-center gap-3 mb-3">
                                {seller.photo_url ? (
                                  <img
                                    src={seller.photo_url}
                                    alt={seller.full_name || 'Vendedor'}
                                    className="w-11 h-11 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                                  />
                                ) : (
                                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#4A198C] to-[#EC006C] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                                    {seller.full_name?.slice(0, 2).toUpperCase() || 'VE'}
                                  </div>
                                )}
                                <div className="min-w-0 flex-1">
                                  <h4 className="text-sm font-bold text-[#2C2C2C] truncate">
                                    {seller.full_name || 'Vendedor Liwa'}
                                  </h4>
                                  <p className="text-xs font-semibold text-[#EC006C] truncate">
                                    @{seller.username || 'vendedor'}
                                  </p>
                                  {seller.city && (
                                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                      <MapPin className="w-3 h-3 text-[#4A198C]" />
                                      {seller.city.name}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Categorías que maneja este vendedor */}
                              {seller.categories && seller.categories.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {seller.categories.slice(0, 3).map((catName, idx) => (
                                    <span
                                      key={idx}
                                      className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                                    >
                                      {catName}
                                    </span>
                                  ))}
                                  {seller.categories.length > 3 && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">
                                      +{seller.categories.length - 3}
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* Artículos destacados de esta categoría */}
                              {relevantProducts.length > 0 && (
                                <div className="bg-slate-50 rounded-xl p-2.5 mb-3 space-y-1.5">
                                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    Artículos destacados:
                                  </p>
                                  {relevantProducts.slice(0, 2).map((item) => (
                                    <div
                                      key={item.id}
                                      onClick={() => setSelectedProductModal(item)}
                                      className="flex items-center justify-between text-xs font-medium text-[#2C2C2C] hover:text-[#EC006C] cursor-pointer group/item py-0.5"
                                    >
                                      <span className="truncate pr-2 group-hover/item:underline">
                                        • {item.title}
                                      </span>
                                      <span className="font-bold text-[#4A198C] text-[11px] flex-shrink-0">
                                        C$ {item.price}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Botones de acción */}
                            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                              <button
                                onClick={() => handleFocusSellerOnMap(seller)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#4A198C]/10 hover:bg-[#4A198C] text-[#4A198C] hover:text-white text-xs font-bold transition-all cursor-pointer"
                              >
                                <MapPin className="w-3.5 h-3.5" />
                                <span>Ver en mapa</span>
                              </button>

                              {seller.phone && (
                                <button
                                  onClick={() => handleWhatsApp(seller.phone)}
                                  className="p-2 rounded-xl bg-[#7AAF00]/10 hover:bg-[#7AAF00] text-[#7AAF00] hover:text-white transition-all cursor-pointer"
                                  title="WhatsApp"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* VISTA 2: LISTA COMPLETA DE VENDEDORES FILTRADOS */}
          {viewMode === 'all' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSellers.map((seller) => {
                const isSelected = selectedSeller?.id === seller.id;

                return (
                  <div
                    key={seller.id}
                    className={`bg-white rounded-3xl border p-5 transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#EC006C] shadow-lg ring-2 ring-[#EC006C]/25'
                        : 'border-slate-200/80 hover:border-[#4A198C]/40 hover:shadow-card'
                    }`}
                  >
                    <div>
                      {/* Vendedor Info */}
                      <div className="flex items-center gap-3 mb-4">
                        {seller.photo_url ? (
                          <img
                            src={seller.photo_url}
                            alt={seller.full_name || 'Vendedor'}
                            className="w-12 h-12 rounded-2xl object-cover border border-slate-100 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4A198C] to-[#EC006C] text-white flex items-center justify-center font-bold text-base flex-shrink-0">
                            {seller.full_name?.slice(0, 2).toUpperCase() || 'VE'}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h4 className="text-base font-bold text-[#2C2C2C] truncate">
                            {seller.full_name || 'Vendedor Liwa'}
                          </h4>
                          <p className="text-xs font-semibold text-[#EC006C] truncate">
                            @{seller.username || 'vendedor'}
                          </p>
                          {seller.city && (
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-[#4A198C]" />
                              {seller.city.name}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Categorías que maneja */}
                      {seller.categories && seller.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {seller.categories.map((catName, idx) => (
                            <span
                              key={idx}
                              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700"
                            >
                              {catName}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Publicaciones con mini preview */}
                      <div className="mb-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Catálogo ({seller.products?.length || 0} publicaciones)
                        </p>
                        {seller.products && seller.products.length > 0 ? (
                          <div className="grid grid-cols-3 gap-2">
                            {seller.products.slice(0, 3).map((item) => {
                              const thumb = item.images?.[0]?.url;
                              return (
                                <div
                                  key={item.id}
                                  onClick={() => setSelectedProductModal(item)}
                                  className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100 cursor-pointer border border-slate-200/80 hover:border-[#EC006C]"
                                  title={item.title}
                                >
                                  {thumb ? (
                                    <img
                                      src={thumb}
                                      alt={item.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400 p-1 text-center">
                                      Sin foto
                                    </div>
                                  )}
                                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1 text-white text-[9px] font-bold truncate">
                                    C$ {item.price}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic">
                            Sin publicaciones activas registradas.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Acciones del card */}
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => handleFocusSellerOnMap(seller)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#4A198C] hover:bg-[#3E1475] text-white text-xs font-bold transition-all shadow-xs cursor-pointer hover:scale-102"
                      >
                        <MapPin className="w-4 h-4" />
                        <span>Ver en el mapa</span>
                      </button>

                      {seller.phone && (
                        <button
                          onClick={() => handleWhatsApp(seller.phone)}
                          className="p-2.5 rounded-xl bg-[#7AAF00] hover:bg-[#6B9A00] text-white transition-all cursor-pointer shadow-xs"
                          title="WhatsApp"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          5. MODAL DE DETALLES DEL PRODUCTO (TRUEQUE DIRECTO)
          ────────────────────────────────────────────────────────────────────────── */}
      {selectedProductModal && (
        <ProductModal
          product={selectedProductModal}
          onClose={() => setSelectedProductModal(null)}
          onStartBarter={onStartBarter}
        />
      )}
    </div>
  );
};

export default MapaPage;

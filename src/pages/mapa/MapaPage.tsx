import React, { useEffect, useRef, useState, useMemo } from 'react';
import { SellerLocation, Product, Category, UserProfile } from '@/types';
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
  Coffee,
  Carrot,
  Store,
  RotateCcw,
  SlidersHorizontal,
  Check,
  ChevronRight,
  Crosshair,
} from 'lucide-react';
import L from 'leaflet';

export interface MapaPageProps {
  onStartBarter: (product: Product) => void;
  userProfile?: UserProfile | null;
  currentUser?: any;
}

// Helper to assign icons according to official DB category names
function getCategoryIcon(name: string): React.ElementType {
  const n = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (n.includes('electronica')) return Tv;
  if (n.includes('casa')) return Home;
  if (n.includes('entretenimiento')) return Gamepad2;
  if (n.includes('ropa')) return Shirt;
  if (n.includes('pasatiempo')) return Sparkles;
  if (n.includes('refresco') || n.includes('bebida')) return Coffee;
  if (n.includes('verdura') || n.includes('fruta')) return Carrot;
  if (n.includes('comida') || n.includes('alimento')) return UtensilsCrossed;
  return Package;
}

// Helper to assign a brand accent color according to category name
function getCategoryColor(name: string): string {
  const n = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (n.includes('electronica')) return '#EC006C';
  if (n.includes('casa')) return '#4A198C';
  if (n.includes('ropa')) return '#7AAF00';
  if (n.includes('comida') || n.includes('verdura')) return '#EC006C';
  if (n.includes('refresco')) return '#4A198C';
  if (n.includes('entretenimiento')) return '#4A198C';
  if (n.includes('pasatiempo')) return '#7AAF00';
  return '#4A198C';
}

export const MapaPage: React.FC<MapaPageProps> = ({
  onStartBarter,
  userProfile,
  currentUser,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  const [sellers, setSellers] = useState<SellerLocation[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state (selectedCategoryId: null = todas las categorías)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);

  // Selected seller details state
  const [selectedSeller, setSelectedSeller] = useState<SellerLocation | null>(null);
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null);

  // User location detection from userProfile coordinates
  const userLat =
    userProfile?.latitude !== undefined && userProfile?.latitude !== null
      ? Number(userProfile.latitude)
      : null;
  const userLng =
    userProfile?.longitude !== undefined && userProfile?.longitude !== null
      ? Number(userProfile.longitude)
      : null;
  const hasUserCoords =
    userLat !== null && userLng !== null && !isNaN(userLat) && !isNaN(userLng);

  // Default fallback center in Nicaragua (Masaya / Managua)
  const defaultLat = 11.9768;
  const defaultLng = -86.0877;

  // Handle Escape key for Filter Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFilterModalOpen) {
        setIsFilterModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFilterModalOpen]);

  // Lock body scroll when Filter Modal is open
  useEffect(() => {
    if (isFilterModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFilterModalOpen]);

  // Load sellers with inventory & real categories directly from Supabase DB
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const { sellers: sellerList, categories: catList } =
          await getSellerLocationsWithInventory();
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

  // Filtered sellers according to active DB category and search query
  const filteredSellers = useMemo(() => {
    let result = sellers;

    // 1. Filter by exact DB category if selected
    if (selectedCategoryId !== null) {
      const activeCat = categories.find((c) => c.id === selectedCategoryId);
      const activeCatName = activeCat?.name.toLowerCase().trim() || '';

      result = result.filter((seller) => {
        return seller.products?.some((prod) => {
          const prodCatId = (prod as any).category_id;
          const prodCatName = prod.category?.name?.toLowerCase().trim() || '';

          return (
            prodCatId === selectedCategoryId ||
            (activeCatName && prodCatName === activeCatName)
          );
        });
      });
    }

    // 2. Filter by search query if any
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

        // Product title or description
        return seller.products?.some((prod) => {
          const prodText = `${prod.title} ${prod.description || ''}`.toLowerCase();
          return prodText.includes(q);
        });
      });
    }

    return result;
  }, [sellers, selectedCategoryId, categories, searchQuery]);

  // Count sellers per DB category for badges inside the modal
  const categoryCounts = useMemo(() => {
    const counts: Record<number, number> = {};

    categories.forEach((cat) => {
      const catName = cat.name.toLowerCase().trim();
      const count = sellers.filter((seller) =>
        seller.products?.some((prod) => {
          const prodCatId = (prod as any).category_id;
          const prodCatName = prod.category?.name?.toLowerCase().trim() || '';
          return prodCatId === cat.id || prodCatName === catName;
        })
      ).length;

      counts[cat.id] = count;
    });

    return counts;
  }, [sellers, categories]);

  // Initialize Leaflet Map: Centered directly on USER LOCATION with close zoom 15
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const startLat = hasUserCoords ? userLat! : defaultLat;
    const startLng = hasUserCoords ? userLng! : defaultLng;
    const startZoom = hasUserCoords ? 15 : 12;

    const map = L.map(mapContainerRef.current, {
      center: [startLat, startLng],
      zoom: startZoom,
      zoomControl: false,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Group for seller markers
    const markersGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Center on user location when userProfile coordinates load or update
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !hasUserCoords) return;

    map.setView([userLat!, userLng!], 15, { animate: true });
  }, [hasUserCoords, userLat, userLng]);

  // Update map markers when filtered sellers change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    const currentUserId = userProfile?.id || currentUser?.id || null;
    let userRenderedInSellers = false;

    filteredSellers.forEach((seller) => {
      if (seller.latitude && seller.longitude) {
        const isCurrentUser = Boolean(currentUserId && seller.id === currentUserId);
        if (isCurrentUser) {
          userRenderedInSellers = true;
        }

        const usernameTag =
          seller.username || seller.full_name?.split(' ')[0] || 'vendedor';
        const isSelected = selectedSeller?.id === seller.id;

        // Si es el usuario actual, reemplaza el nombre por 'Tu ubicación'
        const labelText = isCurrentUser ? 'Tu ubicación' : `@${usernameTag}`;
        const pinClass = isCurrentUser ? 'user-location-box' : 'username-box';

        const customIcon = L.divIcon({
          className: isCurrentUser ? 'custom-user-pin' : 'custom-username-pin',
          html: `<div class="${pinClass} ${isSelected ? 'active-pin' : ''}">
                  ${labelText}
                 </div>`,
          iconSize: [80, 24],
          iconAnchor: [40, 12],
        });

        const marker = L.marker([seller.latitude, seller.longitude], {
          icon: customIcon,
          zIndexOffset: isCurrentUser ? 500 : isSelected ? 400 : 10,
        });

        marker.on('click', () => {
          setSelectedSeller(seller);
          map.setView([seller.latitude, seller.longitude], 15, { animate: true });
        });

        markersGroup.addLayer(marker);
      }
    });

    // Si el usuario tiene ubicación pero no está entre los vendedores filtrados,
    // se coloca su pin 'Tu ubicación' sin duplicar ningún marcador
    if (hasUserCoords && !userRenderedInSellers) {
      const userIcon = L.divIcon({
        className: 'custom-user-pin',
        html: `<div class="user-location-box">Tu ubicación</div>`,
        iconSize: [80, 24],
        iconAnchor: [40, 12],
      });
      const standaloneUserMarker = L.marker([userLat!, userLng!], {
        icon: userIcon,
        zIndexOffset: 600,
      });
      markersGroup.addLayer(standaloneUserMarker);
    }
  }, [filteredSellers, selectedSeller, hasUserCoords, userLat, userLng, userProfile, currentUser]);

  // Load products of selected seller
  useEffect(() => {
    if (!selectedSeller) {
      setSellerProducts([]);
      return;
    }

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
      mapInstanceRef.current.setView([seller.latitude, seller.longitude], 15, {
        animate: true,
      });
      mapContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleCenterOnUser = () => {
    if (!mapInstanceRef.current) return;
    if (hasUserCoords) {
      mapInstanceRef.current.setView([userLat!, userLng!], 15, { animate: true });
    } else {
      mapInstanceRef.current.setView([defaultLat, defaultLng], 12, { animate: true });
    }
  };

  const handleResetFilters = () => {
    setSelectedCategoryId(null);
    setSearchQuery('');
    handleCenterOnUser();
  };

  const selectedCategoryObj = categories.find((c) => c.id === selectedCategoryId);

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
            Localiza vendedores locales en el mapa y filtra por las categorías de tu interés.
          </p>
        </div>

        {/* ────────────────────────────────────────────────────────────────────────
            BARRA FLOTANTE REDONDEADA CON BUSCADOR Y BOTONES IDÉNTICOS A LA IMAGEN 2:
            [ Filtros ] y [ ↻ ]
            ──────────────────────────────────────────────────────────────────────── */}
        <div className="relative z-20 max-w-4xl mx-auto px-4 -mt-8 sm:-mt-10 mb-8">
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl sm:rounded-full border border-white/90 shadow-2xl p-2.5 sm:p-3 transition-all">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Bar Input */}
              <div className="relative flex-1 flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por artículo, producto o vendedor..."
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

              {/* Botón 1: 'Filtros' (Abre el modal de categorías de la base de datos) */}
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-3 rounded-2xl sm:rounded-full border font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer hover:scale-102 active:scale-98 flex-shrink-0 ${
                  selectedCategoryId !== null
                    ? 'bg-gradient-to-r from-[#4A198C] to-[#EC006C] text-white border-transparent shadow-md shadow-[#4A198C]/20'
                    : 'bg-white hover:bg-slate-50 border-slate-200/90 text-[#2C2C2C]'
                }`}
                title="Abrir modal de filtros por categoría"
              >
                <SlidersHorizontal className="w-4 h-4 flex-shrink-0" />
                <span>
                  {selectedCategoryObj ? selectedCategoryObj.name : 'Filtros'}
                </span>
                {selectedCategoryId !== null && (
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                )}
              </button>

              {/* Botón 2: Reset / Refresh (Restablece y re-centra en la ubicación del usuario) */}
              <button
                onClick={handleResetFilters}
                className="p-3 rounded-2xl sm:rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 text-[#2C2C2C] hover:text-[#4A198C] shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center flex-shrink-0"
                title="Restablecer filtros y centrar mapa en mi ubicación"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ──────────────────────────────────────────────────────────────────────────
          2. MODAL DE FILTROS CON LAS CATEGORÍAS REALES DE LA BASE DE DATOS
          ────────────────────────────────────────────────────────────────────────── */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#2C2C2C]/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-white/90 p-5 sm:p-7 space-y-5 my-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#4A198C]/10 text-[#4A198C] flex items-center justify-center">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#2C2C2C]">
                    Filtrar por Categoría
                  </h3>
                  <p className="text-xs text-slate-500">
                    Selecciona una categoría para ver solo los vendedores con dichos productos
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-[#2C2C2C] transition-colors cursor-pointer"
                title="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Botones generados con las categorías exactas de la tabla 'category' */}
            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {/* Opción 1: Todas las categorías */}
              <button
                type="button"
                onClick={() => setSelectedCategoryId(null)}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
                  selectedCategoryId === null
                    ? 'bg-[#4A198C]/5 border-[#4A198C] shadow-xs ring-2 ring-[#4A198C]/20'
                    : 'bg-white hover:bg-slate-50 border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                      selectedCategoryId === null
                        ? 'bg-[#4A198C] text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h4
                      className={`text-sm font-bold ${
                        selectedCategoryId === null
                          ? 'text-[#4A198C]'
                          : 'text-[#2C2C2C]'
                      }`}
                    >
                      Todas las categorías
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Mostrar todos los vendedores registrados
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-shrink-0 ml-3">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      selectedCategoryId === null
                        ? 'bg-[#4A198C] text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {sellers.length} vendedores
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      selectedCategoryId === null
                        ? 'border-[#4A198C] bg-[#4A198C] text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {selectedCategoryId === null && (
                      <Check className="w-3 h-3 stroke-[3]" />
                    )}
                  </div>
                </div>
              </button>

              {/* Opciones directas de la base de datos (Electronica, Casa, Entretenimiento, etc.) */}
              {categories.map((cat) => {
                const Icon = getCategoryIcon(cat.name);
                const color = getCategoryColor(cat.name);
                const isActive = selectedCategoryId === cat.id;
                const count = categoryCounts[cat.id] ?? 0;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer group ${
                      isActive
                        ? 'bg-[#4A198C]/5 border-[#4A198C] shadow-xs ring-2 ring-[#4A198C]/20'
                        : 'bg-white hover:bg-slate-50 border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                          isActive ? 'text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                        style={{ backgroundColor: isActive ? color : undefined }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4
                          className={`text-sm font-bold truncate ${
                            isActive ? 'text-[#4A198C]' : 'text-[#2C2C2C]'
                          }`}
                        >
                          {cat.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate">
                          Vendedores con productos en {cat.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 flex-shrink-0 ml-3">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          isActive
                            ? 'bg-[#4A198C] text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {count} {count === 1 ? 'vendedor' : 'vendedores'}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                          isActive
                            ? 'border-[#4A198C] bg-[#4A198C] text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isActive && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-3 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
              >
                Restablecer
              </button>
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#4A198C] to-[#EC006C] hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-[#4A198C]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Mostrar {filteredSellers.length} en el mapa</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          3. SECCIÓN DEL MAPA INTERACTIVO
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
              {selectedCategoryObj && (
                <span className="text-slate-500 font-medium">
                  {' '}
                  con artículos en{' '}
                  <strong className="text-[#4A198C]">
                    {selectedCategoryObj.name}
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

          <div className="flex items-center gap-2 flex-wrap">
            {hasUserCoords && (
              <button
                onClick={handleCenterOnUser}
                className="text-xs font-bold text-slate-700 hover:text-[#4A198C] px-3 py-1.5 rounded-xl hover:bg-slate-100 border border-slate-200 bg-white transition-colors cursor-pointer flex items-center gap-1.5"
                title="Centrar en mi ubicación"
              >
                <Crosshair className="w-3.5 h-3.5 text-[#EC006C]" />
                <span>Mi ubicación</span>
              </button>
            )}

            {selectedCategoryId !== null && (
              <button
                onClick={() => setSelectedCategoryId(null)}
                className="text-xs font-bold text-[#EC006C] hover:underline flex items-center gap-1 cursor-pointer mr-2"
              >
                <X className="w-3.5 h-3.5" />
                Quitar categoría
              </button>
            )}

            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="text-xs font-bold text-[#4A198C] hover:text-[#EC006C] px-2.5 py-1 rounded-lg hover:bg-[#4A198C]/5 transition-colors cursor-pointer flex items-center gap-1"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Cambiar filtro
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
              <p className="text-xs font-bold text-[#2C2C2C]">
                Cargando mapa y ubicaciones...
              </p>
            </div>
          )}

          {/* Empty filtered state */}
          {!loading && filteredSellers.length === 0 && (
            <div className="absolute inset-0 z-20 bg-white/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
                <Store className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-[#2C2C2C]">
                Ningún vendedor coincide con esta categoría
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
                No hay vendedores registrados con publicaciones en{' '}
                <strong>{selectedCategoryObj?.name || 'este filtro'}</strong> actualmente.
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
            4. DETALLES DEL VENDEDOR SELECCIONADO (CUANDO SE HACE CLIC EN EL MAPA)
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
            5. LISTA DE VENDEDORES FILTRADOS (SIN SEPARAR EN BLOQUES DE CATEGORÍAS)
            ────────────────────────────────────────────────────────────────────────── */}
        <section className="space-y-6 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#2C2C2C] flex items-center gap-2">
                <Store className="w-6 h-6 text-[#4A198C]" />
                <span>
                  {selectedCategoryObj
                    ? `Vendedores con productos en ${selectedCategoryObj.name}`
                    : 'Vendedores Disponibles'}
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {selectedCategoryObj
                  ? `Mostrando los vendedores que ofrecen productos en la categoría ${selectedCategoryObj.name}.`
                  : 'Explora todos los vendedores comunitarios registrados en la plataforma.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 text-slate-700">
                {filteredSellers.length}{' '}
                {filteredSellers.length === 1 ? 'vendedor' : 'vendedores'}
              </span>
              {selectedCategoryId !== null && (
                <button
                  onClick={() => setSelectedCategoryId(null)}
                  className="text-xs font-bold text-[#EC006C] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  Ver todos
                </button>
              )}
            </div>
          </div>

          {/* Cuadrícula directa de tarjetas de vendedores */}
          {filteredSellers.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8">
              <Store className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <h4 className="text-base font-bold text-[#2C2C2C]">
                No hay vendedores para mostrar
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Ningún vendedor coincide con la categoría o término de búsqueda seleccionado.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-[#4A198C] text-white text-xs font-bold shadow-xs hover:bg-[#3E1475] transition-all cursor-pointer"
              >
                Ver todos los vendedores
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSellers.map((seller) => {
                const isSelected = selectedSeller?.id === seller.id;

                // Products to preview (highlighting products of selected category if any)
                const relevantProducts = selectedCategoryObj
                  ? seller.products?.filter(
                      (p) =>
                        (p as any).category_id === selectedCategoryId ||
                        p.category?.name?.toLowerCase().trim() ===
                          selectedCategoryObj.name.toLowerCase().trim()
                    ) || []
                  : seller.products || [];

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

                      {/* Categorías que maneja este vendedor */}
                      {seller.categories && seller.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {seller.categories.map((catName, idx) => (
                            <span
                              key={idx}
                              className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                                selectedCategoryObj &&
                                catName.toLowerCase().trim() ===
                                  selectedCategoryObj.name.toLowerCase().trim()
                                  ? 'bg-[#4A198C] text-white'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {catName}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Catálogo con miniaturas */}
                      <div className="mb-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Catálogo ({relevantProducts.length}{' '}
                          {relevantProducts.length === 1 ? 'artículo' : 'artículos'})
                        </p>
                        {relevantProducts.length > 0 ? (
                          <div className="grid grid-cols-3 gap-2">
                            {relevantProducts.slice(0, 3).map((item) => {
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
                            Sin publicaciones registradas en esta categoría.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Acciones de la tarjeta */}
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
          6. MODAL DE DETALLES DEL PRODUCTO (TRUEQUE DIRECTO)
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

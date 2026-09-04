import React, { useEffect, useRef, useState } from 'react';
import { SellerLocation, Product } from '@/types';
import { getSellerLocations, getMyProducts } from '@/lib/supabase';
import {
  MapPin,
  Phone,
  MessageSquare,
  Package,
  X,
  Repeat,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
} from 'lucide-react';
import L from 'leaflet';

interface MapaPageProps {
  onStartBarter: (product: Product) => void;
}

export const MapaPage: React.FC<MapaPageProps> = ({ onStartBarter }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  const [sellers, setSellers] = useState<SellerLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeller, setSelectedSeller] = useState<SellerLocation | null>(null);
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Initial map center (Nicaragua: Masaya / Managua / Granada)
  const defaultLat = 11.9768;
  const defaultLng = -86.0877;

  // Load sellers data directly from Supabase
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await getSellerLocations();
        setSellers(data);
      } catch (err) {
        console.warn('Error loading seller locations from Supabase:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [defaultLat, defaultLng],
      zoom: 13,
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

  // Render markers whenever sellers change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    if (sellers.length === 0) return;

    const bounds: L.LatLngTuple[] = [];

    sellers.forEach((seller) => {
      if (seller.latitude && seller.longitude) {
        bounds.push([seller.latitude, seller.longitude]);

        // Custom divIcon matching mobile "@username" pill badge
        const usernameTag = seller.username || seller.full_name?.split(' ')[0] || 'vendedor';
        const customIcon = L.divIcon({
          className: 'custom-username-pin',
          html: `<div class="username-box">
                  <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#EC006C;margin-right:4px;"></span>
                  @${usernameTag}
                 </div>`,
          iconSize: [110, 32],
          iconAnchor: [55, 16],
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
  }, [sellers]);

  // Load products of selected seller
  useEffect(() => {
    if (!selectedSeller) {
      setSellerProducts([]);
      return;
    }

    async function loadSellerProducts() {
      setLoadingProducts(true);
      try {
        const prods = await getMyProducts(selectedSeller!.id);
        setSellerProducts(prods);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Top Bar for Map */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C89211]/15 text-[#C89211] flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Mapa de Vendedores
            </h1>
            <p className="text-xs text-slate-500">
              Explora en el mapa a los emprendedores y miembros de la comunidad Liwa
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 py-2 px-3.5 rounded-xl border border-slate-200">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EC006C] animate-pulse"></span>
          <span>{sellers.length} vendedores geolocalizados</span>
        </div>
      </div>

      {/* Main Map Container with Split Desktop Layout */}
      <div className="relative w-full h-[calc(100vh-250px)] min-h-[500px] rounded-3xl overflow-hidden border border-slate-200 shadow-soft flex">
        {/* Leaflet Map Area */}
        <div
          ref={mapContainerRef}
          className="flex-1 w-full h-full z-10 transition-all duration-300"
        />

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 z-20 bg-white/75 backdrop-blur-xs flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-[#C89211] mb-3"></div>
            <p className="text-xs font-bold text-slate-700">Cargando ubicaciones en el mapa...</p>
          </div>
        )}

        {/* Floating Quick Hint if no seller selected */}
        {!selectedSeller && (
          <div className="absolute bottom-6 left-6 z-20 bg-white/95 backdrop-blur-md py-3 px-4 rounded-2xl border border-slate-200 shadow-lg text-xs font-semibold text-slate-700 flex items-center gap-2 pointer-events-none">
            <Info className="w-4 h-4 text-[#C89211]" />
            <span>Haz clic en el distintivo de un vendedor (@usuario) para ver sus artículos</span>
          </div>
        )}

        {/* Desktop Slide-in Seller Products Sidebar */}
        {selectedSeller && (
          <div className="absolute top-0 right-0 h-full w-full sm:w-[420px] bg-white z-30 shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
            {/* Seller Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#3B1E54] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {selectedSeller.full_name?.slice(0, 2).toUpperCase() || 'VE'}
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 tracking-tight">
                    {selectedSeller.full_name || 'Vendedor Liwa'}
                  </h3>
                  <p className="text-xs font-semibold text-[#EC006C]">
                    @{selectedSeller.username || 'vendedor'}
                  </p>
                  {selectedSeller.city && (
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {selectedSeller.city.name}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedSeller(null)}
                className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contact Actions */}
            {selectedSeller.phone && (
              <div className="px-5 py-3.5 bg-emerald-50/50 border-b border-emerald-100 flex items-center justify-between">
                <div className="text-xs text-slate-600">
                  <span className="font-bold text-slate-800 block">Contacto directo</span>
                  <span>{selectedSeller.phone}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleWhatsApp(selectedSeller.phone)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <a
                    href={`tel:${selectedSeller.phone}`}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Llamar"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* Seller Publications List */}
            <div className="p-5 flex-1 overflow-y-auto space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Publicaciones del vendedor
                </h4>
                <span className="text-xs font-bold text-slate-400">
                  {sellerProducts.length} productos
                </span>
              </div>

              {loadingProducts ? (
                <div className="py-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-slate-200 border-t-[#EC006C]"></div>
                  <p className="text-xs text-slate-500 mt-2">Cargando catálogo...</p>
                </div>
              ) : sellerProducts.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <Package className="w-10 h-10 mx-auto stroke-1 text-slate-300 mb-2" />
                  <p className="text-xs">Este vendedor no tiene publicaciones activas en este momento.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sellerProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-3 hover:border-[#EC006C]/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                          {prod.images?.[0]?.url ? (
                            <img
                              src={prod.images[0].url}
                              alt={prod.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                              S/I
                            </div>
                          )}
                        </div>
                        <div className="truncate">
                          <h5 className="text-xs font-bold text-slate-900 truncate">
                            {prod.title}
                          </h5>
                          <span className="text-xs font-extrabold text-[#EC006C] block mt-0.5">
                            C$ {Number(prod.price || 0).toLocaleString('es-NI', {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>

                      {prod.barter && (
                        <button
                          onClick={() => onStartBarter(prod)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#72A619] hover:bg-[#628f14] text-white text-xs font-bold shadow-xs transition-colors flex-shrink-0 cursor-pointer"
                        >
                          <Repeat className="w-3.5 h-3.5" />
                          <span>Trueque</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

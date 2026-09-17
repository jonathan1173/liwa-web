import React, { useEffect, useRef, useState } from 'react';
import { SellerLocation, Product } from '@/types';
import { getSellerLocations, getMyProducts } from '@/lib/supabase';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import {
  MapPin,
  Phone,
  MessageSquare,
  Package,
  X,
  Info,
} from 'lucide-react';
import L from 'leaflet';

export interface MapaPageProps {
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
  const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null);

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

        // Custom divIcon matching mobile "@username" pill badge with official Morado + Magenta dot
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

  const handleCloseSeller = () => {
    setSelectedSeller(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Main Map Container */}
      <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[520px] rounded-3xl overflow-hidden border border-white/80 shadow-soft bg-white">
        {/* Leaflet Map Area */}
        <div
          ref={mapContainerRef}
          className="w-full h-full z-10"
        />

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-[#4A198C] mb-3"></div>
            <p className="text-xs font-bold text-[#2C2C2C]">Cargando ubicaciones en el mapa...</p>
          </div>
        )}

        {/* Floating Quick Hint */}
        <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-md py-2.5 px-4 rounded-2xl border border-slate-200/80 shadow-md text-xs font-semibold text-[#2C2C2C] flex items-center gap-2 pointer-events-none max-w-[90%] sm:max-w-md">
          <Info className="w-4 h-4 text-[#4A198C] flex-shrink-0" />
          <span className="truncate sm:whitespace-normal">
            {selectedSeller
              ? `Mostrando información de @${selectedSeller.username || selectedSeller.full_name?.split(' ')[0] || 'vendedor'} debajo del mapa`
              : 'Toca un distintivo (@usuario) en el mapa para ver sus detalles y artículos abajo'}
          </span>
        </div>
      </div>

      {/* Seller Details & Products Section BELOW the Map */}
      {!selectedSeller ? (
        <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-white/80 shadow-soft p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#4A198C]/10 to-[#EC006C]/10 text-[#4A198C] flex items-center justify-center shadow-xs">
            <MapPin className="w-7 h-7 text-[#4A198C]" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[#2C2C2C]">
            Explora vendedores en el mapa
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            Haz clic en el distintivo <span className="font-bold text-[#4A198C]">@usuario</span> de cualquier vendedor en el mapa para consultar su información de contacto directo y su catálogo de productos.
          </p>
        </div>
      ) : (
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/80 shadow-soft p-5 sm:p-8 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
          {/* Header with Seller Info, Contact, and Close Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            {/* Seller profile */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-[#4A198C] to-[#EC006C] text-white flex items-center justify-center font-black text-lg shadow-md shadow-[#4A198C]/20 flex-shrink-0">
                {selectedSeller.full_name?.slice(0, 2).toUpperCase() || 'VE'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-black text-[#2C2C2C] tracking-tight">
                    {selectedSeller.full_name || 'Vendedor Liwa'}
                  </h3>
                </div>
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

            {/* Actions: Contact + Close */}
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
                onClick={handleCloseSeller}
                className="p-2.5 rounded-xl sm:rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-[#2C2C2C] transition-colors cursor-pointer ml-auto sm:ml-0"
                title="Cerrar detalles"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Seller Publications / Catalog */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#EC006C]" />
                <h4 className="text-sm sm:text-base font-black text-[#2C2C2C] uppercase tracking-wider">
                  Publicaciones del vendedor
                </h4>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-slate-100 rounded-full text-slate-600">
                {sellerProducts.length} {sellerProducts.length === 1 ? 'producto' : 'productos'}
              </span>
            </div>

            {loadingProducts ? (
              <div className="py-16 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-slate-200 border-t-[#EC006C]"></div>
                <p className="text-xs font-semibold text-[#2C2C2C]/70 mt-3">Cargando catálogo del vendedor...</p>
              </div>
            ) : sellerProducts.length === 0 ? (
              <div className="py-12 text-center text-slate-400 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
                <Package className="w-10 h-10 mx-auto stroke-1 text-slate-300 mb-2" />
                <p className="text-sm font-semibold text-[#2C2C2C]">Sin publicaciones activas</p>
                <p className="text-xs text-slate-500 mt-1">Este vendedor no tiene publicaciones activas en este momento.</p>
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

      {/* Product Modal */}
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

import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import { getProductById, getProducts } from '@/lib/supabase';
import { ProductCard } from '@/components/ProductCard';
import { MorphBarter } from '@/components/common/MorphIcon';
import {
  ArrowLeft,
  Tag,
  Calendar,
  Share2,
  Check,
  ShieldCheck,
  Package,
  Layers,
  ChevronRight,
  Image as ImageIcon,
  AlertCircle,
} from 'lucide-react';

export interface ProductoDetallePageProps {
  product: Product | null;
  productId?: number | string | null;
  onBack: () => void;
  onStartBarter?: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
}

export const ProductoDetallePage: React.FC<ProductoDetallePageProps> = ({
  product: initialProduct,
  productId,
  onBack,
  onStartBarter,
  onSelectProduct,
}) => {
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [loading, setLoading] = useState<boolean>(!initialProduct && !!productId);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [whatsappAlert, setWhatsappAlert] = useState<string | null>(null);

  // Ensure seller info and phone are loaded
  useEffect(() => {
    if (product?.id && (!product.seller || !product.seller.phone)) {
      getProductById(product.id).then((fullData) => {
        if (fullData?.seller) {
          setProduct((prev) => (prev ? { ...prev, seller: fullData.seller } : fullData));
        }
      });
    }
  }, [product?.id]);

  const handleWhatsAppContact = () => {
    const phone = product?.seller?.phone;
    if (!phone || !phone.trim()) {
      setWhatsappAlert('El vendedor aún no ha registrado su número de WhatsApp en su perfil.');
      setTimeout(() => setWhatsappAlert(null), 4000);
      return;
    }

    const cleanDigits = phone.replace(/\D/g, '');
    const phoneWithCode = cleanDigits.length === 8 ? `505${cleanDigits}` : cleanDigits;
    const msg = `¡Hola! Vi tu producto "${product?.title}" en Liwa y me interesa obtener más información.`;
    const whatsappUrl = `https://wa.me/${phoneWithCode}?text=${encodeURIComponent(msg)}`;

    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Update product when initialProduct changes
  useEffect(() => {
    if (initialProduct) {
      setProduct(initialProduct);
      setActiveImageIndex(0);
    }
  }, [initialProduct]);

  // If initialProduct is null but productId exists, fetch from Supabase
  useEffect(() => {
    if (!initialProduct && productId) {
      setLoading(true);
      getProductById(Number(productId))
        .then((data) => {
          setProduct(data);
        })
        .catch((err) => console.warn('Error loading product by id:', err))
        .finally(() => setLoading(false));
    }
  }, [initialProduct, productId]);

  // Load related products
  useEffect(() => {
    if (product) {
      getProducts()
        .then((allProducts) => {
          const others = allProducts.filter((p) => p.id !== product.id);
          // Prioritize same category if available
          const sameCategory = others.filter(
            (p) => p.category?.name && p.category?.name === product.category?.name
          );
          const rest = others.filter(
            (p) => !p.category?.name || p.category?.name !== product.category?.name
          );
          const combined = [...sameCategory, ...rest].slice(0, 4);
          setRelatedProducts(combined);
        })
        .catch((err) => console.warn('Error loading related products:', err));
    }
  }, [product]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      });
    }
  };

  const images =
    product?.images && product.images.length > 0
      ? product.images.map((img) => img.url)
      : [];

  const formattedPrice = Number(product?.price || 0).toLocaleString('es-NI', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedDate = product?.created_at
    ? new Date(product.created_at).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-[#EC006C]"></div>
        <p className="text-slate-500 font-medium text-sm mt-4">
          Cargando detalles del producto...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <Package className="w-16 h-16 mx-auto stroke-1 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-[#2C2C2C]">Producto no encontrado</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
          El artículo que buscas ya no está disponible o el enlace no es válido.
        </p>
        <button
          onClick={onBack}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#EC006C] text-white font-bold text-sm shadow-sm cursor-pointer hover:bg-[#c7005b] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al catálogo</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Bar: Breadcrumbs & Back button */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-white border border-slate-200/90 text-slate-700 hover:text-[#EC006C] hover:border-[#EC006C]/40 hover:bg-slate-50 font-bold transition-all cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al catálogo</span>
        </button>

        {/* Amazon style breadcrumbs */}
        <div className="hidden sm:flex items-center gap-1.5 text-slate-400 font-medium text-xs overflow-hidden">
          <span className="hover:text-slate-600 cursor-pointer" onClick={onBack}>
            Catálogo
          </span>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          {product.category && (
            <>
              <span className="hover:text-slate-600 cursor-pointer">{product.category.name}</span>
              <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            </>
          )}
          <span className="text-[#2C2C2C] font-semibold truncate max-w-xs">{product.title}</span>
        </div>
      </div>

      {/* Main Product Layout - Amazon Style */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-white/80 shadow-soft">
        {/* Left Column: Image Gallery (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Large Image Box */}
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/80 flex items-center justify-center shadow-xs">
            {images.length > 0 ? (
              <img
                src={images[activeImageIndex]}
                alt={product.title}
                className="w-full h-full object-contain p-2 sm:p-4"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                <ImageIcon className="w-12 h-12 stroke-1 text-slate-300 mb-2" />
                <span className="text-xs font-medium">Sin imagen disponible</span>
              </div>
            )}

            {/* Badges on main image */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.barter && (
                <span className="bg-[#7AAF00] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md shadow-[#7AAF00]/25 flex items-center gap-1.5 backdrop-blur-xs">
                  <MorphBarter active className="w-3.5 h-3.5 text-white" />
                  <span>Acepta Trueque</span>
                </span>
              )}
            </div>

            {product.condition && (
              <span className="absolute top-3 right-3 bg-white/95 text-[#2C2C2C] text-xs font-bold px-3 py-1 rounded-full shadow-xs border border-slate-200/80">
                {product.condition.name}
              </span>
            )}
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
              {images.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 bg-slate-50 transition-all cursor-pointer flex-shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-[#EC006C] shadow-sm scale-102 ring-2 ring-[#EC006C]/20'
                      : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300'
                  }`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Info & Action Box (lg:col-span-6) */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category Tag */}
            {product.category && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#EC006C] uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5" />
                <span>{product.category.name}</span>
              </div>
            )}

            {/* Product Title */}
            <h1 className="text-xl sm:text-3xl font-black text-[#2C2C2C] tracking-tight leading-tight">
              {product.title}
            </h1>

            {/* Trust and status pill */}
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Publicación activa en la comunidad Liwa</span>
            </div>

            <div className="border-t border-slate-100 pt-4" />

            {/* Seller Card */}
            <div className="bg-slate-50/80 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#EC006C]/10 text-[#EC006C] font-black flex items-center justify-center text-sm border border-[#EC006C]/20 flex-shrink-0">
                  {(product.seller?.full_name || 'Vendedor Liwa')
                    .split(' ')
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase() || 'L'}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Vendedor
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-[#2C2C2C] truncate">
                    {product.seller?.full_name || 'Vendedor Liwa'}
                  </h4>
                </div>
              </div>
              <div className="flex-shrink-0">
                {product.seller?.phone ? (
                  <span className="text-[10px] sm:text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>WhatsApp disponible</span>
                  </span>
                ) : (
                  <span className="text-[10px] sm:text-xs font-medium text-slate-400">
                    Vendedor Liwa
                  </span>
                )}
              </div>
            </div>

            {/* Price Box - Amazon style */}
            <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-3">
              <div>
                <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Precio
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl sm:text-4xl font-black text-[#2C2C2C] tracking-tight">
                    C$ {formattedPrice}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Disponible para compra directa o negociación</span>
              </div>

              {/* Action Buttons inside Box - Stacked Vertically (Pila) */}
              <div className="pt-2 flex flex-col gap-2.5 w-full">
                {/* WhatsApp contact button */}
                <button
                  onClick={handleWhatsAppContact}
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md shadow-[#25D366]/25 transition-all cursor-pointer hover:scale-[1.01]"
                >
                  <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>Contactar por WhatsApp</span>
                </button>

                {/* Proponer Trueque button */}
                {product.barter && onStartBarter && (
                  <button
                    onClick={() => onStartBarter(product)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#7AAF00] hover:bg-[#6B9A00] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#7AAF00]/25 transition-all cursor-pointer hover:scale-[1.01] active:scale-98"
                  >
                    <MorphBarter active className="w-4 h-4 text-white" />
                    <span>Proponer Trueque</span>
                  </button>
                )}

                {/* Compartir button */}
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-[#2C2C2C] font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-2xs"
                  title="Copiar enlace del producto"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">¡Enlace copiado!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-slate-500" />
                      <span>Compartir</span>
                    </>
                  )}
                </button>
              </div>

              {whatsappAlert && (
                <div className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200/80 rounded-xl p-2.5 flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>{whatsappAlert}</span>
                </div>
              )}
            </div>

            {/* Product Description */}
            <div className="pt-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#2C2C2C] mb-2">
                Acerca de este artículo
              </h3>
              <p className="text-sm text-[#2C2C2C]/85 leading-relaxed whitespace-pre-line bg-white/60 p-4 rounded-xl border border-slate-100">
                {product.description ||
                  'El vendedor no proporcionó una descripción adicional para este artículo.'}
              </p>
            </div>

            {/* Specifications Table */}
            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Detalles del producto
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {product.condition && (
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Condición
                    </span>
                    <span className="font-bold text-[#2C2C2C]">{product.condition.name}</span>
                  </div>
                )}
                {product.category && (
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Categoría
                    </span>
                    <span className="font-bold text-[#2C2C2C]">{product.category.name}</span>
                  </div>
                )}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Modalidad
                  </span>
                  <span className="font-bold text-[#2C2C2C]">
                    {product.barter ? 'Venta y Trueque' : 'Solo Venta'}
                  </span>
                </div>
                {formattedDate && (
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Publicado
                    </span>
                    <span className="font-bold text-[#2C2C2C]">{formattedDate}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-xl font-black text-[#2C2C2C] tracking-tight">
              Otros productos que te podrían interesar
            </h2>
            <button
              onClick={onBack}
              className="text-xs font-bold text-[#EC006C] hover:underline cursor-pointer"
            >
              Ver todo el catálogo →
            </button>
          </div>

          {/* 2-column on mobile, 4-column on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
            {relatedProducts.map((relProduct) => (
              <ProductCard
                key={relProduct.id}
                product={relProduct}
                onViewDetails={(p) => {
                  if (onSelectProduct) {
                    onSelectProduct(p);
                  } else {
                    setProduct(p);
                    setActiveImageIndex(0);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductoDetallePage;

import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  CheckCircle2,
} from 'lucide-react';
import {
  MorphSparkle,
  MorphCompass,
  MorphPin,
  MorphBarter,
} from '@/components/common/MorphIcon';

interface BienvenidoPageProps {
  onExploreAsGuest: () => void;
  onNavigateToTab: (tab: 'explorar' | 'mapa' | 'trueque') => void;
  onGoToAuth: () => void;
  isLoggedIn?: boolean;
}

export const BienvenidoPage: React.FC<BienvenidoPageProps> = ({
  onExploreAsGuest,
  onNavigateToTab,
  onGoToAuth,
  isLoggedIn = false,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-20">
      {/* =========================================================================
          1. HERO SECTION: Aireado, elegante y sin sobre-uso de contenedores
          ========================================================================= */}
      <section className="text-center max-w-4xl mx-auto space-y-8 pt-4 sm:pt-8">
        {/* Badge superior suave con morphicon */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/85 border border-[#EC006C]/20 text-[#2C2C2C] text-xs font-bold tracking-wide shadow-xs backdrop-blur-md">
          <MorphSparkle className="w-4 h-4 text-[#EC006C]" />
          <span className="text-[#EC006C] font-black uppercase tracking-wider">
            Mercado Comunitario
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-600 font-medium">Trueque inteligente y comercio local</span>
        </div>

        {/* Titular Principal de Alto Impacto */}
        <div className="space-y-5">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#2C2C2C] tracking-tight leading-[1.08]">
            Tu mercado de confianza en{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-[#4A198C] via-[#EC006C] to-[#EC006C] bg-clip-text text-transparent">
                Liwa
              </span>
              <span className="absolute -bottom-1.5 left-0 w-full h-3 bg-gradient-to-r from-[#4A198C]/20 via-[#EC006C]/30 to-[#7AAF00]/30 rounded-full blur-[2px] -z-10" />
            </span>
          </h1>

          <p className="text-base sm:text-xl text-[#2C2C2C]/75 max-w-2xl mx-auto font-normal leading-relaxed">
            Descubre productos cerca de ti, ubica comerciantes en el mapa y realiza{' '}
            <span className="text-[#4A198C] font-bold">trueques equitativos</span> valorando
            tus artículos con justicia y balance comunitario.
          </p>
        </div>

        {/* Acciones Principales (CTAs limpios) */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigateToTab('explorar')}
            className="px-7 py-4 rounded-2xl bg-gradient-to-r from-[#EC006C] via-[#E10067] to-[#4A198C] hover:opacity-95 text-white font-extrabold text-sm shadow-xl shadow-[#EC006C]/25 hover:shadow-2xl hover:shadow-[#EC006C]/35 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2.5"
          >
            <MorphCompass active className="w-5 h-5 text-white" />
            <span>Explorar Catálogo</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigateToTab('trueque')}
            className="px-7 py-4 rounded-2xl bg-white hover:bg-slate-50/80 border border-[#7AAF00]/40 text-[#2C2C2C] font-extrabold text-sm shadow-soft hover:shadow-md hover:border-[#7AAF00] transition-all duration-300 cursor-pointer hover:-translate-y-0.5 flex items-center gap-2.5"
          >
            <MorphBarter active className="w-5 h-5 text-[#7AAF00]" />
            <span>Trueque Inteligente</span>
          </button>

          {!isLoggedIn && (
            <button
              onClick={onGoToAuth}
              className="px-5 py-4 rounded-2xl text-xs font-bold text-[#2C2C2C]/80 hover:text-[#EC006C] hover:bg-white/80 transition-all cursor-pointer"
            >
              Iniciar Sesión o Registrarse →
            </button>
          )}
        </div>
      </section>
      
      {/* Banner / Value Proposition Hero for Trueque con degradado y desenfoque */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#4A198C] via-[#351066] to-[#7AAF00] text-white p-5 sm:p-8 lg:p-10 shadow-xl border border-white/10">
        <div className="relative z-10 max-w-3xl space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white border border-white/20">
            <MorphBarter active className="w-3.5 h-3.5 text-[#7AAF00]" />
            <span>Comercio Justo y Colaborativo</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            Trueque Inteligente: Intercambia lo que tienes por lo que necesitas
          </h1>

          <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-2xl">
            Selecciona cualquier artículo con insignia verde. Nuestra herramienta compara el valor de hasta 4
            de tus artículos en tiempo real para asegurar una oferta equilibrada.
          </p>

          <div className="pt-1 flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-semibold text-white/90">
            <div className="flex items-center gap-1.5">
              {/* <Scale className="w-4 h-4 text-[#7AAF00]" /> */}
              <span>Balanceador de valor monetario</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#7AAF00]" />
              <span>Ofertas seguras sin comisiones</span>
            </div>
          </div>
        </div>

        {/* Decorative Ambient Orbs */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-[#7AAF00]/25 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-0 right-1/3 w-60 h-60 bg-[#EC006C]/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* =========================================================================
          2. PILARES OFICIALES LIWA: Estructura limpia y abierta sin cajas sofocantes
          ========================================================================= */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-[#2C2C2C] tracking-tight">
            Todo lo que necesitas en una sola plataforma
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Diseñado con un balance perfecto entre cercanía física, tecnología y sostenibilidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Pilar 1: Explorar Catálogo (Magenta) */}
          <div
            onClick={() => onNavigateToTab('explorar')}
            className="group relative p-8 rounded-3xl bg-white/70 hover:bg-white/95 border border-slate-200/70 hover:border-[#EC006C]/40 shadow-soft hover:shadow-card-hover backdrop-blur-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#EC006C]" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EC006C]/10 text-[#EC006C] flex items-center justify-center mb-6 shadow-2xs group-hover:scale-110 transition-transform">
                <MorphCompass active className="w-6 h-6 text-[#EC006C]" />
              </div>
              <h3 className="text-xl font-bold text-[#2C2C2C] group-hover:text-[#EC006C] transition-colors mb-2">
                Explorar Catálogo
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Descubre cientos de artículos de segunda mano y nuevos publicados por vecinos de tu
                comunidad con precios en córdobas.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#EC006C]">
              <span>Ver productos</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Pilar 2: Mapa de Vendedores (Morado) */}
          <div
            onClick={() => onNavigateToTab('mapa')}
            className="group relative p-8 rounded-3xl bg-white/70 hover:bg-white/95 border border-slate-200/70 hover:border-[#4A198C]/40 shadow-soft hover:shadow-card-hover backdrop-blur-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#4A198C]" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#4A198C]/10 text-[#4A198C] flex items-center justify-center mb-6 shadow-2xs group-hover:scale-110 transition-transform">
                <MorphPin active className="w-6 h-6 text-[#4A198C]" />
              </div>
              <h3 className="text-xl font-bold text-[#2C2C2C] group-hover:text-[#4A198C] transition-colors mb-2">
                Mapa en Tiempo Real
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Ubica geográficamente a comerciantes cercanos, visualiza qué ofrecen y contáctalos
                directamente por WhatsApp sin comisiones intermedias.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#4A198C]">
              <span>Abrir mapa local</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Pilar 3: Trueque Inteligente (Verde) */}
          <div
            onClick={() => onNavigateToTab('trueque')}
            className="group relative p-8 rounded-3xl bg-white/70 hover:bg-white/95 border border-slate-200/70 hover:border-[#7AAF00]/40 shadow-soft hover:shadow-card-hover backdrop-blur-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#7AAF00]" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#7AAF00]/10 text-[#7AAF00] flex items-center justify-center mb-6 shadow-2xs group-hover:scale-110 transition-transform">
                <MorphBarter active className="w-6 h-6 text-[#7AAF00]" />
              </div>
              <h3 className="text-xl font-bold text-[#2C2C2C] group-hover:text-[#7AAF00] transition-colors mb-2">
                Trueque Inteligente
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Intercambia valor por valor. Nuestra calculadora comunitaria equilibra hasta 4 de tus
                artículos para proponer intercambios justos.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#7AAF00]">
              <span>Iniciar un intercambio</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. CÓMO FUNCIONA: 3 Pasos fluidos sin cajas encajonadas
          ========================================================================= */}
      <section className="py-6 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#EC006C]">
            Flujo Simple
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2C2C2C] tracking-tight">
            ¿Cómo comerciar en Liwa?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-white shadow-soft border border-slate-200/80 flex items-center justify-center font-black text-[#EC006C] text-lg">
              1
            </div>
            <h4 className="font-bold text-[#2C2C2C] text-base">Publica o Explora</h4>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Sube fotos de lo que tienes para vender o cambiar, o busca entre las opciones del catálogo.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-white shadow-soft border border-slate-200/80 flex items-center justify-center font-black text-[#4A198C] text-lg">
              2
            </div>
            <h4 className="font-bold text-[#2C2C2C] text-base">Ubica en el Mapa</h4>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Descubre vecinos cerca de tu zona y acuerda entregas sin complicaciones logísticas.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-white shadow-soft border border-slate-200/80 flex items-center justify-center font-black text-[#7AAF00] text-lg">
              3
            </div>
            <h4 className="font-bold text-[#2C2C2C] text-base">Cierra con Trueque o Pago</h4>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Equilibra ofertas de trueque con la calculadora inteligente o acuerda pago en efectivo.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. BANNER DE MÉTRICAS Y CONFIANZA: Vidrio esmerilado suave
          ========================================================================= */}
      <section className="p-8 sm:p-10 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-soft">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-200/70">
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-[#EC006C]">100%</p>
            <p className="text-xs font-bold text-[#2C2C2C]">Comercio Comunitario</p>
            <p className="text-[11px] text-slate-500">Sin intermediarios ni cobros ocultos</p>
          </div>
          <div className="pt-6 sm:pt-0 space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-[#4A198C]">En Vivo</p>
            <p className="text-xs font-bold text-[#2C2C2C]">Ubicación de Comerciantes</p>
            <p className="text-[11px] text-slate-500">Georreferenciación de confianza</p>
          </div>
          <div className="pt-6 sm:pt-0 space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-[#7AAF00]">Equitativo</p>
            <p className="text-xs font-bold text-[#2C2C2C]">Trueque Asistido</p>
            <p className="text-[11px] text-slate-500">Valor referencial justo para ambas partes</p>
          </div>
        </div>
      </section>
    </div>
  );
};

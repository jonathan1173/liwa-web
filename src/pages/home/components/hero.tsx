import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Repeat, MapPin, LogIn, ChevronDown } from 'lucide-react';

export interface HeroProps {
  onExploreAsGuest?: () => void;
  onNavigateToTab?: (tab: any) => void;
  onGoToAuth?: () => void;
  isLoggedIn?: boolean;
}

export function Hero({
  onExploreAsGuest,
  onNavigateToTab,
  onGoToAuth,
  isLoggedIn,
}: HeroProps) {
  const containerRef2 = useRef<HTMLDivElement>(null);
  const containerRef3 = useRef<HTMLDivElement>(null);

  // =========================
  // VARIABLES DE IMÁGENES
  // =========================
  const img1 = '/image/stores/img8.jpeg';
  const img2 = '/image/stores/img1.jpeg';
  const img3 = '/image/stores/img3.jpeg';

  // =========================
  // SECCIÓN 2 (Animación Scroll Fluida con Spring)
  // =========================
  const { scrollYProgress: rawProgress2 } = useScroll({
    target: containerRef2,
    offset: ['start end', 'start start'],
  });

  const progress2 = useSpring(rawProgress2, {
    stiffness: 120,
    damping: 24,
    mass: 0.6,
    restDelta: 0.001,
  });

  const scale2 = useTransform(progress2, [0, 1], [0.82, 1]);
  const opacity2 = useTransform(progress2, [0, 0.4, 1], [0.45, 0.85, 1]);
  const borderRadius2 = useTransform(progress2, [0, 1], ['40px', '0px']);

  // =========================
  // SECCIÓN 3 (Animación Scroll Fluida con Spring)
  // =========================
  const { scrollYProgress: rawProgress3 } = useScroll({
    target: containerRef3,
    offset: ['start end', 'start start'],
  });

  const progress3 = useSpring(rawProgress3, {
    stiffness: 120,
    damping: 24,
    mass: 0.6,
    restDelta: 0.001,
  });

  const scale3 = useTransform(progress3, [0, 1], [0.82, 1]);
  const opacity3 = useTransform(progress3, [0, 0.4, 1], [0.45, 0.85, 1]);
  const borderRadius3 = useTransform(progress3, [0, 1], ['40px', '0px']);

  return (
    <div className="relative w-full bg-[#FAFAFC] text-[#2C2C2C]">
      {/* =========================
          SECCIÓN 1 (Fondo base Hero Principal)
      ========================= */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center z-10 px-6 text-center relative overflow-hidden">
        {/* Fondo con desenfoque exacto de 5px sin ningún velo sobre la pantalla completa */}
        <div
          style={{ backgroundImage: `url(${img1})` }}
          className="absolute inset-0 bg-no-repeat bg-center bg-cover filter blur-[2px] scale-105 pointer-events-none"
        />

        {/* Contenedor flotante tipo tarjeta de cristal esmerilado para legibilidad perfecta */}
        <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto px-6 py-8 sm:px-12 sm:py-10 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-soft">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1] mb-5 text-[#4A198C]">
            Descubre el nuevo{' '}
            <span className="text-[#EC006C]">
              Liwa
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#2C2C2C]/85 max-w-2xl font-normal leading-relaxed mb-8">
            El espacio donde la{' '}
            <span className="text-[#EC006C] font-semibold">confianza</span> y el{' '}
            <span className="text-[#7AAF00] font-semibold">consumo local</span> se
            conectan. Compra, vende y haz trueques con valoración justa, cercanía y total seguridad.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {onExploreAsGuest && (
              <button
                onClick={onExploreAsGuest}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#EC006C] hover:bg-[#D80064] text-white font-bold text-sm sm:text-base shadow-sm hover:shadow transition-all cursor-pointer"
              >
                Explorar Catálogo
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {!isLoggedIn && onGoToAuth && (
              <button
                onClick={onGoToAuth}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-slate-100/90 hover:bg-white border border-slate-200/90 text-[#2C2C2C] font-semibold text-sm sm:text-base backdrop-blur-md transition-all cursor-pointer shadow-sm hover:shadow"
              >
                <LogIn className="w-4 h-4 text-[#EC006C]" />
                Iniciar Sesión
              </button>
            )}
          </div>
        </div>

        {/* Indicador de scroll flotante en tema claro */}
        <div
          onClick={() => {
            containerRef2.current?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="absolute bottom-6 z-20 flex flex-col items-center gap-2 cursor-pointer group select-none"
        >
    
        </div>
      </div>

      {/* =========================
          SECCIÓN 2 (Trueque Inteligente)
      ========================= */}
      <motion.div
        ref={containerRef2}
        style={{
          scale: scale2,
          opacity: opacity2,
          borderRadius: borderRadius2,
        }}
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center origin-center overflow-hidden z-20 px-6 text-center will-change-transform transform-gpu relative border-t border-white/60 shadow-sm"
      >
        {/* Fondo con desenfoque de 5px sin velo global */}
        <div
          style={{ backgroundImage: `url(${img2})` }}
          className="absolute inset-0 bg-no-repeat bg-center bg-cover filter blur-[2px] scale-105 pointer-events-none"
        />

        {/* Contenedor flotante tipo tarjeta de cristal */}
        <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto px-6 py-8 sm:px-12 sm:py-10 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-soft">
          <div className="w-14 h-14 rounded-2xl bg-[#7AAF00]/15 border border-[#7AAF00]/30 text-[#7AAF00] flex items-center justify-center mb-5 shadow-sm backdrop-blur-sm">
            <Repeat className="w-7 h-7" />
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4 text-[#2C2C2C]">
            <span>Trueque </span>
            <span className="text-[#7AAF00]">
              Inteligente
            </span>
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-[#2C2C2C]/85 max-w-xl font-normal leading-relaxed mb-8">
            Intercambia productos de valor equivalente{' '}
            <span className="text-[#7AAF00] font-semibold">sin intermediarios monetarios</span>.
            Nuestra plataforma calcula y sugiere coincidencias ideales para que ambas partes ganen con total transparencia y equidad.
          </p>

          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('trueque')}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#7AAF00] hover:bg-[#6B9A00] text-white font-extrabold text-sm sm:text-base shadow-sm hover:shadow transition-all cursor-pointer"
            >
              Ver Trueques Disponibles
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>

      {/* =========================
          SECCIÓN 3 (Comunidad & Mapa Local)
      ========================= */}
      <motion.div
        ref={containerRef3}
        style={{
          scale: scale3,
          opacity: opacity3,
          borderRadius: borderRadius3,
        }}
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center origin-center overflow-hidden z-30 px-6 text-center will-change-transform transform-gpu relative border-t border-white/60 shadow-sm"
      >
        {/* Fondo con desenfoque de 5px sin velo global */}
        <div
          style={{ backgroundImage: `url(${img3})` }}
          className="absolute inset-0 bg-no-repeat bg-center bg-cover filter blur-[2px] scale-105 pointer-events-none"
        />

        {/* Contenedor flotante tipo tarjeta de cristal */}
        <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto px-6 py-8 sm:px-12 sm:py-10 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-soft">
          <div className="w-14 h-14 rounded-2xl bg-[#4A198C]/10 border border-[#4A198C]/20 text-[#4A198C] flex items-center justify-center mb-5 shadow-sm backdrop-blur-sm">
            <MapPin className="w-7 h-7 text-[#4A198C]" />
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4 text-[#2C2C2C]">
            <span>Comunidad &amp; </span>
            <span className="text-[#4A198C]">
              Mapa Local
            </span>
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-[#2C2C2C]/85 max-w-xl font-normal leading-relaxed mb-8">
            Conéctate con vecinos y vendedores cerca de ti en tiempo real. Explora{' '}
            <span className="text-[#4A198C] font-semibold">ubicaciones seguras de entrega</span>,
            descubre oportunidades a la vuelta de la esquina y fortalece la economía de tu barrio.
          </p>

          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('mapa')}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#4A198C] hover:bg-[#3E1475] text-white font-extrabold text-sm sm:text-base shadow-sm hover:shadow transition-all cursor-pointer"
            >
              Explorar Mapa Local
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Hero;
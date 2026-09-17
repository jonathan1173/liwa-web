import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Repeat, MapPin, Sparkles, LogIn } from 'lucide-react';

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
  const img1 = '/image/stores/img1.jpeg';
  const img2 = '/image/stores/img2.jpeg';
  const img3 = '/image/stores/img3.jpeg';

  // =========================
  // SECCIÓN 2 (Animación Scroll)
  // =========================
  const { scrollYProgress: progress2 } = useScroll({
    target: containerRef2,
    offset: ['start end', 'start start'],
  });

  const scale2 = useTransform(progress2, [0, 1], [0.001, 1]);
  const borderRadius2 = useTransform(progress2, [0, 1], ['100px', '0px']);

  // =========================
  // SECCIÓN 3 (Animación Scroll)
  // =========================
  const { scrollYProgress: progress3 } = useScroll({
    target: containerRef3,
    offset: ['start end', 'start start'],
  });

  const scale3 = useTransform(progress3, [0, 1], [0.001, 1]);
  const borderRadius3 = useTransform(progress3, [0, 1], ['100px', '0px']);

  return (
    <div className="relative w-full bg-black">
      {/* =========================
          SECCIÓN 1 (Fondo base Hero)
      ========================= */}
      <div
        style={{ backgroundImage: `url(${img1})` }}
        className="sticky top-0 h-screen w-full bg-no-repeat bg-center bg-cover text-white flex flex-col items-center justify-center z-10 px-6 text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>El nuevo mercado colaborativo</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight mb-6">
          Descubre el nuevo <span className="underline decoration-white/40">Liwa</span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl font-medium mb-10">
          Tu mercado de confianza para comprar, vender y hacer trueques con seguridad,
          cercanía y valoración justa de tus artículos.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {onExploreAsGuest && (
            <button
              onClick={onExploreAsGuest}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#EC006C] font-bold text-sm sm:text-base shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Explorar Catálogo
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {!isLoggedIn && onGoToAuth && (
            <button
              onClick={onGoToAuth}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold text-sm sm:text-base backdrop-blur-sm transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              Iniciar Sesión
            </button>
          )}
        </div>

        <div className="absolute bottom-8 text-white/60 text-xs flex items-center gap-1.5 animate-bounce">
          <span>Desliza para descubrir más</span>
          ↓
        </div>
      </div>

      {/* =========================
          SECCIÓN 2 (Trueque Inteligente)
      ========================= */}
      <motion.div
        ref={containerRef2}
        style={{
          scale: scale2,
          borderRadius: borderRadius2,
          backgroundImage: `url(${img2})`,
        }}
        className="sticky top-0 h-screen w-full bg-no-repeat bg-center bg-cover text-white flex flex-col items-center justify-center shadow-[0_-20px_50px_rgba(0,0,0,0.7)] origin-center overflow-hidden z-20 px-6 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-[#7AAF00]/20 border border-[#7AAF00]/30 text-[#7AAF00] flex items-center justify-center mb-6">
          <Repeat className="w-8 h-8" />
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-4">
          Trueque Inteligente
        </h2>

        <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-xl font-normal mb-8">
          Intercambia productos de valor equivalente sin dinero de por medio. Nuestra plataforma calcula y sugiere coincidencias ideales para que ambas partes ganen.
        </p>

        {onNavigateToTab && (
          <button
            onClick={() => onNavigateToTab('trueque')}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#7AAF00] text-[#2C2C2C] font-bold text-sm sm:text-base shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            Ver Trueques Disponibles
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </motion.div>

      {/* =========================
          SECCIÓN 3 (Comunidad & Mapa Local)
      ========================= */}
      <motion.div
        ref={containerRef3}
        style={{
          scale: scale3,
          borderRadius: borderRadius3,
          backgroundImage: `url(${img3})`,
        }}
        className="sticky top-0 h-screen w-full bg-no-repeat bg-center bg-cover text-white flex flex-col items-center justify-center shadow-[0_-20px_50px_rgba(0,0,0,0.7)] origin-center overflow-hidden z-30 px-6 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center mb-6">
          <MapPin className="w-8 h-8 text-[#EC006C]" />
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-4">
          Comunidad & Mapa Local
        </h2>

        <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-xl font-normal mb-8">
          Conéctate con vecinos y vendedores cerca de ti. Explora ubicaciones seguras de entrega y fortalece la economía local.
        </p>

        {onNavigateToTab && (
          <button
            onClick={() => onNavigateToTab('mapa')}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#4A198C] font-bold text-sm sm:text-base shadow-lg hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
          >
            Explorar Mapa
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </motion.div>
    </div>
  );
}

export default Hero;
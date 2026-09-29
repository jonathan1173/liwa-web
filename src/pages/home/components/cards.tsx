import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Layers } from 'lucide-react';
import { HeroProps } from './hero';

export interface CardsProps extends HeroProps {}

interface CardData {
  id: number;
  category: string;
  titlePrefix: string;
  titleHighlight: string;
  titleHighlightColor: string;
  description: string;
  primaryButtonText: string;
  primaryAction: 'explore' | 'trueque' | 'mapa' | 'auth';
  secondaryButtonText: string;
  secondaryAction: 'auth' | 'explore' | 'trueque' | 'mapa';
  overlayColors: {
    blob1From: string;
    blob1To: string;
    blob2From: string;
    blob2To: string;
    glow: string;
    borderAccent: string;
  };
}

const CARDS_CONTENT: CardData[] = [
  {
    id: 1,
    category: 'Comunidad & Confianza',
    titlePrefix: 'Descubre el',
    titleHighlight: 'nuevo Liwa',
    titleHighlightColor: '#EC006C',
    description:
      'El espacio donde la confianza y el consumo local se conectan. Compra, vende y haz trueques con valoración justa, cercanía y total seguridad.',
    primaryButtonText: 'Explorar Catálogo →',
    primaryAction: 'explore',
    secondaryButtonText: '→ Iniciar Sesión',
    secondaryAction: 'auth',
    overlayColors: {
      blob1From: 'rgba(236, 0, 108, 0.45)',
      blob1To: 'rgba(122, 175, 0, 0.1)',
      blob2From: 'rgba(74, 25, 140, 0.5)',
      blob2To: 'rgba(236, 0, 108, 0.35)',
      glow: '#EC006C',
      borderAccent: 'rgba(236, 0, 108, 0.35)',
    },
  },
  {
    id: 2,
    category: 'Trueque Inteligente',
    titlePrefix: 'Intercambio justo',
    titleHighlight: 'sin dinero',
    titleHighlightColor: '#7AAF00',
    description:
      'Cambia productos de valor equivalente directamente con vecinos de tu zona. Algoritmos justos para que ambas partes ganen con total transparencia y equidad.',
    primaryButtonText: 'Ver Trueques →',
    primaryAction: 'trueque',
    secondaryButtonText: '→ Explorar Catálogo',
    secondaryAction: 'explore',
    overlayColors: {
      blob1From: 'rgba(122, 175, 0, 0.45)',
      blob1To: 'rgba(74, 25, 140, 0.2)',
      blob2From: 'rgba(236, 0, 108, 0.35)',
      blob2To: 'rgba(122, 175, 0, 0.25)',
      glow: '#7AAF00',
      borderAccent: 'rgba(122, 175, 0, 0.35)',
    },
  },
  {
    id: 3,
    category: 'Comercio Local',
    titlePrefix: 'Tu barrio a la',
    titleHighlight: 'vuelta de la esquina',
    titleHighlightColor: '#A855F7',
    description:
      'Ubica productores, emprendedores y artesanos en tiempo real. Explora mapas con puntos seguros de entrega y fortalece la economía de tu comunidad.',
    primaryButtonText: 'Ver Mapa Local →',
    primaryAction: 'mapa',
    secondaryButtonText: '→ Iniciar Sesión',
    secondaryAction: 'auth',
    overlayColors: {
      blob1From: 'rgba(168, 85, 247, 0.45)',
      blob1To: 'rgba(236, 0, 108, 0.2)',
      blob2From: 'rgba(74, 25, 140, 0.55)',
      blob2To: 'rgba(168, 85, 247, 0.3)',
      glow: '#A855F7',
      borderAccent: 'rgba(168, 85, 247, 0.35)',
    },
  },
  {
    id: 4,
    category: 'Seguridad & Reputación',
    titlePrefix: 'Comunidad con',
    titleHighlight: 'perfiles verificados',
    titleHighlightColor: '#EC006C',
    description:
      'Construye tu reputación con valoraciones auténticas de cada compra o trueque. Negocia con tranquilidad respaldado por una red local confiable.',
    primaryButtonText: 'Crear Cuenta Gratis →',
    primaryAction: 'auth',
    secondaryButtonText: '→ Explorar Catálogo',
    secondaryAction: 'explore',
    overlayColors: {
      blob1From: 'rgba(236, 0, 108, 0.5)',
      blob1To: 'rgba(168, 85, 247, 0.2)',
      blob2From: 'rgba(244, 63, 94, 0.4)',
      blob2To: 'rgba(74, 25, 140, 0.35)',
      glow: '#EC006C',
      borderAccent: 'rgba(236, 0, 108, 0.4)',
    },
  },
  {
    id: 5,
    category: 'Economía Circular',
    titlePrefix: 'Consumo consciente',
    titleHighlight: 'y sostenible',
    titleHighlightColor: '#7AAF00',
    description:
      'Dale una segunda vida a lo que ya no usas y encuentra tesoros cercanos a precios justos. Cero comisiones ocultas y máxima colaboración comunitaria.',
    primaryButtonText: 'Publicar Producto →',
    primaryAction: 'trueque',
    secondaryButtonText: '→ Explorar Mapa',
    secondaryAction: 'mapa',
    overlayColors: {
      blob1From: 'rgba(122, 175, 0, 0.4)',
      blob1To: 'rgba(16, 185, 129, 0.2)',
      blob2From: 'rgba(74, 25, 140, 0.45)',
      blob2To: 'rgba(122, 175, 0, 0.3)',
      glow: '#7AAF00',
      borderAccent: 'rgba(122, 175, 0, 0.4)',
    },
  },
];

export default function Cards({
  onExploreAsGuest,
  onNavigateToTab,
  onGoToAuth,
  isLoggedIn,
}: CardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);

  const handleNext = () => {
    setExitDirection('left');
    setCurrentIndex((prev) => (prev + 1) % CARDS_CONTENT.length);
  };

  const handlePrev = () => {
    setExitDirection('right');
    setCurrentIndex((prev) => (prev - 1 + CARDS_CONTENT.length) % CARDS_CONTENT.length);
  };

  const handleAction = (action: string) => {
    if (action === 'explore') {
      onExploreAsGuest?.();
    } else if (action === 'trueque') {
      onNavigateToTab?.('trueque');
    } else if (action === 'mapa') {
      onNavigateToTab?.('mapa');
    } else if (action === 'auth') {
      onGoToAuth?.();
    }
  };

  const activeCard = CARDS_CONTENT[currentIndex];
  const nextCard = CARDS_CONTENT[(currentIndex + 1) % CARDS_CONTENT.length];

  const cardVariants = {
    initial: { scale: 0.93, y: 12, opacity: 0 },
    animate: { scale: 1, y: 0, opacity: 1 },
    exit: (dir: 'left' | 'right' | null) => ({
      scale: 0.9,
      y: -18,
      opacity: 0,
      rotate: dir === 'right' ? 8 : -8,
      transition: { duration: 0.24, ease: 'easeInOut' as const },
    }),
  };

  return (
    <section className="relative w-full py-10 sm:py-13 px-4 sm:px-6 flex flex-col items-center justify-center overflow-hidden  text-white">
      {/* Luces de ambiente sutiles en el fondo (sin imagen) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] opacity-20 transition-all duration-700"
          style={{ background: activeCard.overlayColors.glow }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Área del contenedor de tarjetas apiladas */}
      <div className="relative z-10 w-full max-w-[420px] sm:max-w-[460px] h-[480px] sm:h-[500px] flex items-center justify-center">
        {/* =========================================================
            Tarjeta de Fondo 3 (Profundidad base)
            ========================================================= */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-500"
          style={{
            transform: 'scale(0.86) translateY(28px)',
            opacity: 0.35,
          }}
        >
          <div className="w-full h-full rounded-[40px] sm:rounded-[48px] bg-[#12131A]/60 border border-white/10 backdrop-blur-md" />
        </div>

        {/* =========================================================
            Tarjeta de Fondo 2 (Siguiente en la pila)
            ========================================================= */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-500"
          style={{
            transform: 'scale(0.93) translateY(14px)',
            opacity: 0.65,
          }}
        >
          <div className="relative w-full h-full rounded-[40px] sm:rounded-[48px] bg-[#14161F]/80 border border-white/15 backdrop-blur-xl shadow-xl flex flex-col items-center justify-center p-8 text-center">
            {/* Formas modernas decorativas de la tarjeta siguiente */}
            <div
              className="absolute -top-4 -right-4 w-44 h-44 rounded-[42px] rotate-12 blur-[1px] opacity-40 pointer-events-none"
              style={{
                background: `linear-gradient(135deg, ${nextCard.overlayColors.blob1From}, transparent)`,
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            />
            <div
              className="absolute -bottom-4 -left-4 w-40 h-40 rounded-[38px] -rotate-12 blur-[1px] opacity-40 pointer-events-none"
              style={{
                background: `linear-gradient(135deg, ${nextCard.overlayColors.blob2From}, transparent)`,
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            />

            <span className="text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
              {nextCard.category}
            </span>
            <h4 className="text-xl sm:text-2xl font-bold text-white/90">
              {nextCard.titlePrefix}{' '}
              <span style={{ color: nextCard.titleHighlightColor }}>
                {nextCard.titleHighlight}
              </span>
            </h4>
          </div>
        </div>

        {/* =========================================================
            Tarjeta Activa Frontal (Cambia al tocar / clic)
            ========================================================= */}
        <AnimatePresence mode="popLayout" custom={exitDirection}>
          <motion.div
            key={activeCard.id}
            custom={exitDirection}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={handleNext}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            transition={{
              type: 'spring',
              stiffness: 280,
              damping: 24,
            }}
            className="absolute inset-0 flex items-center justify-center cursor-pointer select-none z-20 group"
          >
            {/* SUPERPOSICIÓN DE FORMAS MODERNAS (MODERN SHAPE OVERLAY) */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Capa 1: Forma moderna orgánica superior derecha */}
              <div
                className="absolute -top-5 -right-5 w-52 h-52 sm:w-60 sm:h-60 rounded-[44px] sm:rounded-[52px] rotate-[14deg] backdrop-blur-xl border pointer-events-none transition-all duration-500 shadow-lg group-hover:rotate-[16deg]"
                style={{
                  background: `linear-gradient(135deg, ${activeCard.overlayColors.blob1From} 0%, ${activeCard.overlayColors.blob1To} 100%)`,
                  borderColor: 'rgba(255, 255, 255, 0.22)',
                  boxShadow: `0 12px 36px ${activeCard.overlayColors.blob1From}`,
                }}
              />

              {/* Capa 2: Forma moderna orgánica inferior izquierda */}
              <div
                className="absolute -bottom-6 -left-6 w-48 h-48 sm:w-56 sm:h-56 rounded-[40px] sm:rounded-[48px] -rotate-[12deg] backdrop-blur-xl border pointer-events-none transition-all duration-500 shadow-lg group-hover:-rotate-[14deg]"
                style={{
                  background: `linear-gradient(135deg, ${activeCard.overlayColors.blob2From} 0%, ${activeCard.overlayColors.blob2To} 100%)`,
                  borderColor: 'rgba(255, 255, 255, 0.18)',
                  boxShadow: `0 10px 32px ${activeCard.overlayColors.blob2From}`,
                }}
              />

              {/* Capa 3: Borde de cristal suave superior izquierdo */}
              <div
                className="absolute -top-3 -left-3 w-40 h-40 sm:w-48 sm:h-48 rounded-[38px] sm:rounded-[44px] -rotate-[6deg] backdrop-blur-md border border-white/25 pointer-events-none bg-white/[0.04]"
              />

              {/* Tarjeta Central de Cristal Oscuro */}
              <div
                className="relative z-10 w-full h-full rounded-[38px] sm:rounded-[44px] bg-white/92 backdrop-blur-2xl border border-white/20 shadow-[0_24px_50px_rgba(0,0,0,0.6)] flex flex-col items-center justify-between p-7 sm:p-9 text-center overflow-hidden transition-all duration-300 group-hover:border-white/35"
                style={{
                  boxShadow: `0 20px 50px rgba(0,0,0,0.65), inset 0 1px 1px rgba(255,255,255,0.2), 0 0 40px ${activeCard.overlayColors.borderAccent}`,
                }}
              >
                {/* Resplandor interno sutil */}
                <div
                  className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-[60px] opacity-40 pointer-events-none"
                  style={{ background: activeCard.overlayColors.glow }}
                />

                {/* Encabezado de la tarjeta con indicación táctil */}
                <div className="w-full flex items-center justify-between pt-1">
                  <span className="text-[10px] text-black sm:text-xs font-semibold px-3 py-1 rounded-full bg-white/10 border border-black/15  uppercase tracking-widest backdrop-blur-sm">
                    {activeCard.category}
                  </span>
                  <span className="text-[11px] font-medium text-zinc-600 group-hover:text-black transition-colors flex items-center gap-1">
                    <span>Toca para cambiar</span>
                    <span className="text-xs">→</span>
                  </span>
                </div>

                {/* Contenido principal: Título y descripción */}
                <div className="my-auto py-2">
                  <h3 className="text-2xl sm:text-3xl md:text-[2.1rem] font-extrabold text-black tracking-tight leading-[1.15] mb-3 sm:mb-4 select-none">
                    <span>{activeCard.titlePrefix} </span>
                    <span
                      style={{ color: activeCard.titleHighlightColor }}
                      className="drop-shadow-sm"
                    >
                      {activeCard.titleHighlight}
                    </span>
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-[340px] sm:max-w-[370px] mx-auto select-none">
                    {activeCard.description}
                  </p>
                </div>

                {/* Botones de acción (con stopPropagation para no cambiar la tarjeta al hacer clic en ellos) */}
                <div className="w-full flex flex-col items-center gap-2.5 sm:gap-3 pb-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction(activeCard.primaryAction);
                    }}
                    className="w-full max-w-[270px] inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 rounded-full text-white font-semibold text-xs sm:text-sm shadow-lg hover:shadow-xl hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 cursor-pointer select-none"
                    style={{
                      background:
                        'linear-gradient(90deg, #6B1D52 0%, #8C245E 50%, #B02A6F 100%)',
                      boxShadow: '0 4px 18px rgba(140, 36, 94, 0.4)',
                    }}
                  >
                    <span>{activeCard.primaryButtonText}</span>
                  </button>

                  {(!isLoggedIn || activeCard.secondaryAction !== 'auth') && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(activeCard.secondaryAction);
                      }}
                      className="w-full max-w-[270px] inline-flex items-center justify-center gap-2 px-6 py-2 sm:py-2.5 rounded-full bg-black/35 hover:bg-white/10 border border-white/40 hover:border-white/70 text-white font-medium text-xs sm:text-sm backdrop-blur-md hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 cursor-pointer shadow-md select-none"
                    >
                      <span>{activeCard.secondaryButtonText}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controles de navegación y paginación */}
      <div className="relative z-10 flex flex-col items-center gap-4 mt-8 sm:mt-10">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrev}
            aria-label="Tarjeta anterior"
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Indicadores de puntos / estado de la tarjeta */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            {CARDS_CONTENT.map((card, idx) => (
              <button
                key={card.id}
                onClick={() => {
                  setExitDirection(idx > currentIndex ? 'left' : 'right');
                  setCurrentIndex(idx);
                }}
                aria-label={`Ir a tarjeta ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentIndex
                    ? 'w-6 h-2 bg-[#EC006C]'
                    : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            aria-label="Tarjeta siguiente"
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Guía de interacción */}
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 select-none">
          <Sparkles className="w-3.5 h-3.5 text-[#EC006C]" />
          <span>Toca la tarjeta para cambiar ({currentIndex + 1} de {CARDS_CONTENT.length})</span>
        </div>
      </div>
    </section>
  );
}
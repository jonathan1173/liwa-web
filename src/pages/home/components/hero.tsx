import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Repeat, MapPin } from 'lucide-react';

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
          SECCIÓN 1 (Fondo base Hero Principal - Reconstruido)
      ========================= */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center z-10 relative overflow-hidden bg-[#0a0a0c]">
        {/* Tarjeta principal del Hero con bordes redondeados y borde sutil */}
        <div className="relative w-full h-full  overflow-hidden border border-white/20 shadow-2xl flex flex-col items-center justify-center text-center">
          {/* Fondo con imagen de vegetales original (img8.jpeg) con desenfoque suave */}
          <div
            style={{ backgroundImage: `url(${img1})` }}
            className="absolute inset-0 bg-no-repeat bg-center bg-cover filter blur-[2.5px] scale-105 pointer-events-none"
          />

          {/* Sombra oscura localizada ÚNICAMENTE donde aparece el texto (los vegetales superiores quedan iluminados y visibles) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 22%, rgba(10,10,14,0.52) 36%, rgba(10,10,14,0.8) 52%, rgba(10,10,14,0.86) 75%, rgba(10,10,14,0.9) 100%)',
            }}
          />
          {/* Viñeta radial suave para mayor contraste detrás de las letras */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 90% 65% at 50% 55%, rgba(10,10,14,0.7) 0%, rgba(10,10,14,0.25) 50%, transparent 80%)',
            }}
          />

          {/* Contenedor del contenido: Tipografía con máscara y degradado, párrafo y botones */}
          <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto">
            {/* Título en dos líneas con efecto de máscara y degradado */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] xl:text-[5.8rem] font-black tracking-tight leading-[0.96] text-center select-none">
              <span
                className="block bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    'linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 45%, #E2E8F0 65%, #DDD6FE 90%, #E9D5FF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.5))',
                }}
              >
                Conectamos raíces
              </span>
              <span className="block mt-1 sm:mt-2">
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      'linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 50%, #C4B5FD 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.5))',
                  }}
                >
                  {' '}
                </span>
                <span
                  className="bg-clip-text text-transparent font-black"
                  style={{
                    backgroundImage:
                      'linear-gradient(135deg, #9333EA 0%, #A855F7 25%, #C026D3 55%, #D946EF 80%, #EC4899 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter:
                      'drop-shadow(0 2px 14px rgba(168, 85, 247, 0.4)) drop-shadow(0 2px 10px rgba(0,0,0,0.5))',
                  }}
                >
                Impulsamos futuro
                </span>
              </span>
            </h1>

            {/* Subtítulo limpio y legible */}
            <p className="mt-5 sm:mt-6 text-sm sm:text-base md:text-lg text-zinc-200/90 max-w-2xl font-normal leading-relaxed drop-shadow-sm px-2">
              El espacio donde la confianza y el consumo local se conectan. Compra, vende y haz trueques con valoración justa, cercanía y total seguridad.
            </p>

            {/* Botones de acción fielmente recreados */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
              <button
                onClick={onExploreAsGuest}
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-white font-medium text-xs sm:text-sm shadow-lg hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer select-none"
                style={{
                  background:
                    'linear-gradient(90deg, #6B1D52 0%, #8C245E 50%, #B02A6F 100%)',
                  boxShadow: '0 4px 20px rgba(140, 36, 94, 0.4)',
                }}
              >
                <span>Explorar Catálogo</span>
                <span className="text-base leading-none">→</span>
              </button>

              {(!isLoggedIn || !onGoToAuth) && (
                <button
                  onClick={onGoToAuth}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-black/30 hover:bg-white/10 border border-white/40 hover:border-white/70 text-white font-medium text-xs sm:text-sm backdrop-blur-md hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-md select-none"
                >
                  <span className="text-base leading-none">→</span>
                  <span>Iniciar Sesión</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Indicador de scroll */}
        <div
          onClick={() => {
            containerRef2.current?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="absolute bottom-6 z-20 flex flex-col items-center gap-2 cursor-pointer group select-none"
        />
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
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center origin-center overflow-hidden z-20 px-4 sm:px-6 text-center will-change-transform transform-gpu relative bg-[#0a0a0c] border border-white/20 shadow-2xl"
      >
        {/* Fondo con imagen de productos (img2) con desenfoque suave */}
        <div
          style={{ backgroundImage: `url(${img2})` }}
          className="absolute inset-0 bg-no-repeat bg-center bg-cover filter blur-[2.5px] scale-105 pointer-events-none"
        />

        {/* Sombra oscura localizada en el centro detrás del texto (el doble de amplia, sin franja horizontal) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse min(52rem, 82vw) min(36rem, 76vh) at 50% 50%, rgba(10,10,14,0.96) 0%, rgba(10,10,14,0.9) 45%, rgba(10,10,14,0.55) 75%, transparent 100%)',
          }}
        />

        {/* Contenedor del contenido (sin forma de tarjeta blanca flotante) */}
        <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto px-4">
          {/* Badge de icono brillante */}
          <div className="w-14 h-14 rounded-2xl bg-[#7AAF00]/20 border border-[#7AAF00]/40 text-[#A3E635] flex items-center justify-center mb-5 shadow-lg shadow-[#7AAF00]/10 backdrop-blur-md">
            <Repeat className="w-7 h-7 text-[#A3E635]" />
          </div>

          {/* Título en dos líneas con degradado y sombra de profundidad */}
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-black tracking-tight leading-[0.96] text-center select-none">
            <span
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 45%, #E2E8F0 65%, #DCFCE7 90%, #F0FDF4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.5))',
              }}
            >
              TRUEQUE
            </span>
            <span
              className="block mt-1 sm:mt-2 bg-clip-text text-transparent font-black"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, #A3E635 0%, #84CC16 25%, #7AAF00 55%, #659900 80%, #4D7300 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter:
                  'drop-shadow(0 2px 14px rgba(122, 175, 0, 0.45)) drop-shadow(0 2px 10px rgba(0,0,0,0.5))',
              }}
            >
              INTELIGENTE
            </span>
          </h2>

          {/* Subtítulo legible y limpio con sombra de texto */}
          <p
            className="mt-5 sm:mt-6 text-sm sm:text-base md:text-lg text-zinc-200/90 max-w-2xl font-normal leading-relaxed drop-shadow-sm px-2"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.85)' }}
          >
            Intercambia productos de valor equivalente{' '}
            <span className="text-[#A3E635] font-semibold">sin intermediarios monetarios</span>.
            Nuestra plataforma calcula y sugiere coincidencias ideales para que ambas partes ganen con total transparencia y equidad.
          </p>

          {/* Botón de acción */}
          {onNavigateToTab && (
            <div className="flex items-center justify-center mt-6 sm:mt-8">
              <button
                onClick={() => onNavigateToTab('trueque')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-white font-medium text-xs sm:text-sm shadow-lg hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer select-none"
                style={{
                  background:
                    'linear-gradient(90deg, #557E00 0%, #7AAF00 50%, #8CC600 100%)',
                  boxShadow: '0 4px 20px rgba(122, 175, 0, 0.4)',
                }}
              >
                <span>Ver Trueques Disponibles</span>
                <span className="text-base leading-none">→</span>
              </button>
            </div>
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
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center origin-center overflow-hidden z-30 px-4 sm:px-6 text-center will-change-transform transform-gpu relative bg-[#0a0a0c] border border-white/20 shadow-2xl"
      >
        {/* Fondo con imagen de mapa / comercio (img3) con desenfoque suave */}
        <div
          style={{ backgroundImage: `url(${img3})` }}
          className="absolute inset-0 bg-no-repeat bg-center bg-cover filter blur-[2.5px] scale-105 pointer-events-none"
        />

        {/* Sombra oscura localizada en el centro detrás del texto (el doble de amplia, sin franja horizontal) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse min(52rem, 82vw) min(36rem, 76vh) at 50% 50%, rgba(10,10,14,0.96) 0%, rgba(10,10,14,0.9) 45%, rgba(10,10,14,0.55) 75%, transparent 100%)',
          }}
        />

        {/* Contenedor del contenido (sin forma de tarjeta blanca flotante) */}
        <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto px-4">
          {/* Badge de icono brillante */}
          <div className="w-14 h-14 rounded-2xl bg-[#4A198C]/25 border border-[#A855F7]/40 text-[#C084FC] flex items-center justify-center mb-5 shadow-lg shadow-[#4A198C]/20 backdrop-blur-md">
            <MapPin className="w-7 h-7 text-[#C084FC]" />
          </div>

          {/* Título en dos líneas con degradado y sombra de profundidad */}
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-black tracking-tight leading-[0.96] text-center select-none">
            <span
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 45%, #E2E8F0 65%, #F3E8FF 90%, #FAF5FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.5))',
              }}
            >
              COMUNIDAD &amp;
            </span>
            <span
              className="block mt-1 sm:mt-2 bg-clip-text text-transparent font-black"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, #C084FC 0%, #A855F7 25%, #8B5CF6 55%, #6D28D9 80%, #4A198C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter:
                  'drop-shadow(0 2px 14px rgba(168, 85, 247, 0.45)) drop-shadow(0 2px 10px rgba(0,0,0,0.5))',
              }}
            >
              MAPA LOCAL
            </span>
          </h2>

          {/* Subtítulo legible y limpio con sombra de texto */}
          <p
            className="mt-5 sm:mt-6 text-sm sm:text-base md:text-lg text-zinc-200/90 max-w-2xl font-normal leading-relaxed drop-shadow-sm px-2"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.85)' }}
          >
            Conéctate con vecinos y vendedores cerca de ti en tiempo real. Explora{' '}
            <span className="text-[#C084FC] font-semibold">ubicaciones seguras de entrega</span>,
            descubre oportunidades a la vuelta de la esquina y fortalece la economía de tu barrio.
          </p>

          {/* Botón de acción */}
          {onNavigateToTab && (
            <div className="flex items-center justify-center mt-6 sm:mt-8">
              <button
                onClick={() => onNavigateToTab('mapa')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-white font-medium text-xs sm:text-sm shadow-lg hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer select-none"
                style={{
                  background:
                    'linear-gradient(90deg, #38126B 0%, #4A198C 50%, #6D28D9 100%)',
                  boxShadow: '0 4px 20px rgba(74, 25, 140, 0.45)',
                }}
              >
                <span>Explorar Mapa Local</span>
                <span className="text-base leading-none">→</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Hero;
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Recycle, ShieldCheck, MapPin, CheckCircle2, Users, ArrowRight } from "lucide-react";

export default function FeaturesSection() {
  const section2TrackRef = useRef<HTMLDivElement>(null);

  const img1 = '/image/stores/img4.jpeg';
  const img2 = '/image/stores/img5.jpeg';
  const img3 = '/image/stores/img6.jpeg';

  // Mide el scroll a lo largo de toda la pista con física suave useSpring
  const { scrollYProgress: rawScrollProgress } = useScroll({
    target: section2TrackRef,
    offset: ["start start", "end end"],
  });

  const scrollYProgress = useSpring(rawScrollProgress, {
    stiffness: 110,
    damping: 24,
    restDelta: 0.001,
  });

  // La imagen se abre de banner (25% visible) al 100% y se queda fija el resto del scroll
  const clipPathImage = useTransform(
    scrollYProgress,
    [0, 0.7, 1],
    [
      "inset(0% 0% 99% 0% round 16px)",
      "inset(0% 0% 0% 0% round 16px)",
      "inset(0% 0% 0% 0% round 16px)",
    ]
  );

  return (
    <section className="relative w-full bg-[#FAFAFC] text-[#2C2C2C]">
      {/* =========================================================================
          SECCIÓN 1: Economía Circular y Comercio Consciente
          ========================================================================= */}
      <div className="sticky top-0 flex h-screen w-full items-center justify-center px-6 relative overflow-hidden border-t border-white/60 shadow-sm">
        {/* Fondo con desenfoque de 5px sin velo global */}
        <div
          style={{ backgroundImage: `url(${img1})` }}
          className="absolute inset-0 bg-no-repeat bg-center bg-cover filter blur-[2px] scale-105 pointer-events-none"
        />


      </div>

      {/* =========================================================================
          SECCIÓN 2: Puntos de Encuentro y Entregas Seguras
          ========================================================================= */}
      <div
        ref={section2TrackRef}
        className="relative h-[180vh] w-full bg-[#EC006C] text-white"
      >
        {/* Contenedor fijo a la pantalla centrado verticalmente con Flexbox */}
        <div className="sticky top-0 flex h-screen w-full items-center justify-center px-8 lg:px-16 overflow-hidden">
          {/* Destellos sutiles para profundidad limpia */}
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#4A198C]/30 blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#D80064] blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex w-full max-w-7xl flex-col items-center justify-between gap-10 lg:flex-row lg:gap-16">

            {/* LADO IZQUIERDO: Imagen animada con medidas y clipPath fluido */}
            <div className="order-2 lg:order-1 flex w-full items-center justify-center lg:w-1/2">
              <motion.div
                style={{ clipPath: clipPathImage }}
                className="relative w-full max-w-[480px] lg:max-w-[540px] aspect-[4/3] overflow-hidden rounded-2xl bg-black/15 shadow-md border border-white/30 will-change-transform transform-gpu"
              >
                <img
                  src={`${img2}`}
                  alt="Puntos de Encuentro Seguros Liwa"
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[#2C2C2C] text-xs font-semibold px-3 py-2 rounded-xl bg-white/90 backdrop-blur-md border border-white/80 shadow-sm">
                  <span className="flex items-center gap-1.5 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-[#EC006C]" />
                    Punto de Entrega Verificado
                  </span>
                  {/* <span className="text-[#EC006C] font-extrabold">Zona Segura</span> */}
                </div>
              </motion.div>
            </div>

            {/* LADO DERECHO: Título y descripción con diseño elegante */}
            <div className="order-1 lg:order-2 flex w-full flex-col items-center lg:items-start text-center lg:text-left lg:w-1/2">


              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] mb-5">
                Rapido &amp;{' '}
                <span className="text-[#FFE082]">
                  Seguro
                </span>
              </h2>

              <p className="max-w-lg text-base sm:text-lg text-white/95 leading-relaxed font-normal mb-8">
                Coordina tus intercambios con total tranquilidad. Liwa te sugiere puntos concurridos,
                cafeterías, plazas y comercios aliados en tu colonia para realizar entregas en mano con certeza, comodidad y confianza mutua.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 border border-white/25 text-xs sm:text-sm font-semibold text-white shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#FFE082]" />
                  <span>Lugares públicos y concurridos</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 border border-white/25 text-xs sm:text-sm font-semibold text-white shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#FFE082]" />
                  <span>Confirmación presencial</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* =========================================================================
          SECCIÓN 3: Reputación y Red Comunitaria Confiable
          ========================================================================= */}
      <div className="sticky top-0 flex h-screen w-full items-center justify-center px-6 relative overflow-hidden border-t border-white/60 shadow-sm">
        {/* Fondo con desenfoque de 5px sin velo global */}
        <div
          style={{ backgroundImage: `url(${img3})` }}
          className="absolute inset-0 bg-no-repeat bg-center bg-cover filter blur-[2px] scale-105 pointer-events-none"
        />

      </div>
    </section>
  );
}
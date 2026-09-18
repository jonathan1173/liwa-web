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

        {/* Tarjeta flotante de cristal esmerilado para legibilidad impecable */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto px-6 py-8 sm:px-12 sm:py-10 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-soft">
          <div className="w-14 h-14 rounded-2xl bg-[#7AAF00]/15 border border-[#7AAF00]/30 text-[#7AAF00] flex items-center justify-center mb-5 shadow-sm backdrop-blur-sm">
            <Recycle className="w-7 h-7" />
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight mb-5 text-[#2C2C2C]">
            <span>Economía Circular &amp; </span>
            <span className="text-[#7AAF00]">
              Comercio Consciente
            </span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-[#2C2C2C]/85 max-w-2xl font-normal leading-relaxed mb-8">
            Dale una segunda vida a los artículos que ya no usas. Al reusar, comprar de segunda mano
            y realizar trueques directos, reduces residuos en tu ciudad, apoyas a tus vecinos y ahorras de manera inteligente.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 text-xs sm:text-sm font-semibold text-[#2C2C2C] shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-[#7AAF00]" />
              <span>100% Sostenible</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 text-xs sm:text-sm font-semibold text-[#2C2C2C] shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-[#7AAF00]" />
              <span>Sin comisiones abusivas</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 text-xs sm:text-sm font-semibold text-[#2C2C2C] shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-[#7AAF00]" />
              <span>Valoración honesta</span>
            </div>
          </div>
        </div>
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

        {/* Tarjeta flotante de cristal esmerilado para legibilidad impecable */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto px-6 py-8 sm:px-12 sm:py-10 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-soft">
          <div className="w-14 h-14 rounded-2xl bg-[#EC006C]/15 border border-[#EC006C]/30 text-[#EC006C] flex items-center justify-center mb-5 shadow-sm backdrop-blur-sm">
            <Users className="w-7 h-7 text-[#EC006C]" />
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight mb-5 text-[#2C2C2C]">
            <span>Una Red Vecinal Basada en la </span>
            <span className="text-[#EC006C]">
              Confianza Mutua
            </span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-[#2C2C2C]/85 max-w-2xl font-normal leading-relaxed mb-8">
            Cada persona en Liwa cuenta con un perfil transparente, historial comunitario y calificaciones de otros usuarios.
            Construye una reputación sólida en tu vecindario y sé parte de un comercio donde la palabra y la honestidad son lo primero.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 text-xs sm:text-sm font-semibold text-[#2C2C2C] shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-[#EC006C]" />
              <span>Calificaciones auténticas</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 text-xs sm:text-sm font-semibold text-[#2C2C2C] shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-[#EC006C]" />
              <span>Perfiles verificados</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 text-xs sm:text-sm font-semibold text-[#2C2C2C] shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-[#7AAF00]" />
              <span>Comunidad activa</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
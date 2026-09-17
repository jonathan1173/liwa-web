import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function FeaturesSection() {
  const section2TrackRef = useRef<HTMLDivElement>(null);

  const img1 = '/image/stores/img4.jpeg';
  const img2 = '/image/stores/img5.jpeg';
  const img3 = '/image/stores/img6.jpeg';

  // Mide el scroll a lo largo de toda la pista
  const { scrollYProgress } = useScroll({
    target: section2TrackRef,
    offset: ["start start", "end end"],
  });

  // La imagen se abre de banner (25% visible) al 100% y se queda fija el resto del scroll
  const clipPathImage = useTransform(
    scrollYProgress,
    [0, 0.7, 1],
    [
      "inset(0% 0% 99% 0% round 12px )",
      "inset(0% 0% 0% 0% round 12px )",
      "inset(0% 0% 0% 0% round 12px )", // Permanece fija al 100%
    ]
  );

  return (
    <section className="relative w-full">
      {/* Sección 1 */}
      <div
        style={{ backgroundImage: `url(${img1})` }}
        className="sticky bg-no-repeat bg-center bg-cover top-0 flex h-screen w-full items-center justify-center text-white shadow-[0_-20px_40px_rgba(0,0,0,0.6)]">
        <h2 className="text-4xl font-bold tracking-tight md:text-6xl">
          Sección 1
        </h2>
      </div>

      {/* Sección 2: Pista de scroll */}
      <div
        ref={section2TrackRef}
        className="relative h-[170vh] w-full bg-[#EC006C] text-white "
      >
        {/* Contenedor fijo a la pantalla centrado verticalmente con Flexbox */}
        <div className="sticky top-0 flex h-screen w-full items-center justify-center px-8 lg:px-16">

          <div className="flex w-full max-w-7xl flex-col items-center justify-between gap-10 lg:flex-row lg:gap-16">

            {/* LADO IZQUIERDO: Imagen animada con tus medidas intactas */}
            <div className="order-2 lg:order-1 flex w-full items-center justify-center lg:w-1/2">
              <motion.div
                style={{ clipPath: clipPathImage }}
                className="relative w-full max-w-[480px] lg:max-w-[540px] aspect-[4/3] overflow-hidden rounded-xl bg-black/20 "
              >
                <img
                  src={`${img2}`}
                  alt="Ilustración Principal"
                  className="h-full w-full object-cover object-center bg-blue-500"
                />
              </motion.div>
            </div>

            {/* LADO DERECHO: Texto alineado verticalmente con la imagen */}
            <div className="order-1 lg:order-2 flex w-full flex-col items-center lg:items-start text-center lg:text-left lg:w-1/2">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Sección 2
              </h2>
              <p className="mt-4 max-w-lg text-base text-white/90 sm:text-lg">
                Descripción del feature de la sección 2. A medida que scrolleas,
                la imagen se desenvuelve de arriba hacia abajo hasta mostrarse completa.
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* Sección 3 */}
      <div
        style={{ backgroundImage: `url(${img3})` }}
        className="sticky top-0 flex h-screen w-full items-center justify-center bg-[#7AAF00] bg-cover bg-center bg-no-repeat  text-white ">
        <h2 className="text-4xl font-bold tracking-tight md:text-6xl">
          Sección 3
        </h2>
      </div>
    </section>
  );
}
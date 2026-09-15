import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function BienvenidoPage() {
  const containerRef2 = useRef<HTMLDivElement>(null);
  const containerRef3 = useRef<HTMLDivElement>(null);

  // =========================
  // SECCIÓN 2
  // =========================
  const { scrollYProgress: progress2 } = useScroll({
    target: containerRef2,
    offset: ["start end", "start start"],
  });

  const scale2 = useTransform(progress2, [0, 1], [0.001, 1]);
  const borderRadius2 = useTransform(progress2, [0, 1], ["100px", "0px"]);

  // =========================
  // SECCIÓN 3
  // =========================
  const { scrollYProgress: progress3 } = useScroll({
    target: containerRef3,
    offset: ["start end", "start start"],
  });

  const scale3 = useTransform(progress3, [0, 1], [0.001, 1]);
  const borderRadius3 = useTransform(progress3, [0, 1], ["100px", "0px"]);

  return (
    <div className="relative w-full bg-black">
      {/* =========================
          SECCIÓN 1 (Fondo base)
      ========================= */}
      <div className="sticky top-0 h-screen w-full bg-[#EC006C] text-white flex items-center justify-center z-10">
        <h2 className="text-4xl font-bold">Sección 1</h2>
      </div>

      {/* =========================
          SECCIÓN 2 (Escala sobre Sec. 1)
      ========================= */}
      <motion.div
        ref={containerRef2}
        style={{
          scale: scale2,
          borderRadius: borderRadius2,
        }}
        className="
          sticky
          top-0
          h-screen
          w-full
          bg-[#2C2C2C]
          text-white
          flex
          items-center
          justify-center
          shadow-[0_-20px_40px_rgba(0,0,0,0.6)]
          origin-center
          overflow-hidden
          z-20
        "
      >
        <h2 className="text-4xl font-bold">Sección 2</h2>
      </motion.div>

      {/* =========================
          SECCIÓN 3 (Escala sobre Sec. 2)
      ========================= */}
      <motion.div
        ref={containerRef3}
        style={{
          scale: scale3,
          borderRadius: borderRadius3,
        }}
        className="
          sticky
          top-0
          h-screen
          w-full
          bg-[#4A198C]
          text-white
          flex
          items-center
          justify-center
          shadow-[0_-20px_40px_rgba(0,0,0,0.6)]
          origin-center
          overflow-hidden
          z-30
        "
      >
        <h2 className="text-4xl font-bold">Sección 3</h2>
      </motion.div>
    </div>
  );
}

export default BienvenidoPage;
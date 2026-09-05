import React, { useState } from 'react';
import { Sparkles, Compass, Repeat, MapPin, Eye, EyeOff } from 'lucide-react';

/**
 * HamburgerMorphIcon:
 * 3 barras SVG que se transforman mediante morphing geométrico a una 'X'
 * con una animación ultra-suave.
 */
interface HamburgerMorphIconProps {
  isOpen: boolean;
  className?: string;
  color?: string;
}

export const HamburgerMorphIcon: React.FC<HamburgerMorphIconProps> = ({
  isOpen,
  className = 'w-6 h-6',
  color = '#2C2C2C',
}) => {
  return (
    <div className={`relative flex flex-col justify-center items-center ${className}`}>
      <span
        style={{ backgroundColor: color }}
        className={`hamburger-line block h-0.5 w-5 rounded-full ${
          isOpen ? 'hamburger-line-top-active bg-[#EC006C]' : '-translate-y-1.5'
        }`}
      />
      <span
        style={{ backgroundColor: color }}
        className={`hamburger-line block h-0.5 w-5 rounded-full ${
          isOpen ? 'hamburger-line-middle-active' : ''
        }`}
      />
      <span
        style={{ backgroundColor: color }}
        className={`hamburger-line block h-0.5 w-5 rounded-full ${
          isOpen ? 'hamburger-line-bottom-active bg-[#EC006C]' : 'translate-y-1.5'
        }`}
      />
    </div>
  );
};

/**
 * MorphSparkle:
 * Icono de destello que rota y pulsa sutilmente al pasar el ratón.
 */
export const MorphSparkle: React.FC<{
  className?: string;
  active?: boolean;
}> = ({ className = 'w-4 h-4 text-[#EC006C]', active = false }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="inline-flex items-center justify-center cursor-pointer"
    >
      <Sparkles
        className={`${className} transition-all duration-300 ${
          hovered || active
            ? 'scale-125 rotate-12 text-[#EC006C] drop-shadow-[0_0_8px_rgba(236,0,108,0.4)]'
            : 'animate-morph-spin-subtle'
        }`}
      />
    </div>
  );
};

/**
 * MorphCompass:
 * Icono de brújula con balanceo orgánico reactivo.
 */
export const MorphCompass: React.FC<{
  className?: string;
  active?: boolean;
}> = ({ className = 'w-5 h-5 text-[#EC006C]', active = false }) => {
  const [wobbling, setWobbling] = useState(false);

  return (
    <div
      onMouseEnter={() => {
        setWobbling(true);
        setTimeout(() => setWobbling(false), 1200);
      }}
      className="inline-flex items-center justify-center cursor-pointer"
    >
      <Compass
        className={`${className} transition-all duration-300 ${
          wobbling ? 'animate-morph-wobble scale-110' : active ? 'scale-110' : ''
        }`}
      />
    </div>
  );
};

/**
 * MorphBarter:
 * Icono de trueque que rota 180 grados de forma fluida simulando el intercambio.
 */
export const MorphBarter: React.FC<{
  className?: string;
  active?: boolean;
}> = ({ className = 'w-5 h-5 text-[#7AAF00]', active = false }) => {
  const [rotated, setRotated] = useState(false);

  return (
    <div
      onMouseEnter={() => setRotated(true)}
      onMouseLeave={() => setRotated(false)}
      className="inline-flex items-center justify-center cursor-pointer"
    >
      <Repeat
        className={`${className} transition-transform duration-500 ease-out ${
          rotated ? 'rotate-180 scale-115 text-[#7AAF00]' : active ? 'scale-110' : ''
        }`}
      />
    </div>
  );
};

/**
 * MorphPin:
 * Icono de ubicación en el mapa que da un salto sutil y resalta al hover.
 */
export const MorphPin: React.FC<{
  className?: string;
  active?: boolean;
}> = ({ className = 'w-5 h-5 text-[#4A198C]', active = false }) => {
  const [jumping, setJumping] = useState(false);

  return (
    <div
      onMouseEnter={() => setJumping(true)}
      onMouseLeave={() => setJumping(false)}
      className="inline-flex items-center justify-center cursor-pointer"
    >
      <MapPin
        className={`${className} transition-all duration-300 ${
          jumping
            ? '-translate-y-1.5 scale-120 drop-shadow-[0_4px_8px_rgba(74,25,140,0.3)]'
            : active
            ? 'scale-110'
            : ''
        }`}
      />
    </div>
  );
};

/**
 * MorphEye:
 * Icono de alternancia de contraseña que cambia entre ojo abierto y cerrado con fade/scale.
 */
export const MorphEye: React.FC<{
  visible: boolean;
  onToggle: () => void;
  className?: string;
}> = ({ visible, onToggle, className = 'w-4 h-4 text-slate-400' }) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="p-1 rounded-lg hover:bg-slate-100 transition-transform active:scale-90 text-slate-400 hover:text-[#EC006C] cursor-pointer"
      title={visible ? 'Ocultar contraseña' : 'Ver contraseña'}
    >
      <div className="transition-all duration-200">
        {visible ? (
          <EyeOff className={`${className} transition-transform scale-100`} />
        ) : (
          <Eye className={`${className} transition-transform scale-100`} />
        )}
      </div>
    </button>
  );
};

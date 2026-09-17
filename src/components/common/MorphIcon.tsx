import React, { useState } from 'react';
import { Sparkles, Eye, EyeOff } from 'lucide-react';
import {
  HouseIcon,
  CompassIcon,
  MapPinIcon,
  RepeatIcon,
  LogInIcon,
  LogOutIcon,
} from '@animateicons/react/lucide';

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
 * MorphHome (Lucide Animate House):
 * Icono de Casa animado mediante @animateicons/react con micro-animaciones al hover y activo.
 */
export const MorphHome: React.FC<{
  className?: string;
  active?: boolean;
  color?: string;
  size?: number;
}> = ({ className = '', active = false, color = '#EC006C', size = 20 }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`inline-flex items-center justify-center transition-transform duration-300 ${
        hovered || active ? 'scale-110 drop-shadow-[0_0_8px_rgba(236,0,108,0.35)]' : ''
      } ${className}`}
    >
      <HouseIcon
        size={size}
        color={color}
        isAnimated={hovered || active}
        className="transition-colors duration-200"
      />
    </div>
  );
};

/**
 * MorphCompass (Lucide Animate Compass):
 * Icono de Brújula animada reactiva con giro orgánico al hover o activo.
 */
export const MorphCompass: React.FC<{
  className?: string;
  active?: boolean;
  color?: string;
  size?: number;
}> = ({ className = '', active = false, color = '#EC006C', size = 20 }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`inline-flex items-center justify-center transition-transform duration-300 ${
        hovered || active ? 'scale-110 drop-shadow-[0_0_8px_rgba(236,0,108,0.35)]' : ''
      } ${className}`}
    >
      <CompassIcon
        size={size}
        color={color}
        isAnimated={hovered || active}
        className="transition-colors duration-200"
      />
    </div>
  );
};

/**
 * MorphPin (Lucide Animate MapPin):
 * Icono de Pin de Ubicación con micro-salto reactivo al hover y activo.
 */
export const MorphPin: React.FC<{
  className?: string;
  active?: boolean;
  color?: string;
  size?: number;
}> = ({ className = '', active = false, color = '#4A198C', size = 20 }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`inline-flex items-center justify-center transition-transform duration-300 ${
        hovered || active ? '-translate-y-0.5 scale-110 drop-shadow-[0_4px_8px_rgba(74,25,140,0.3)]' : ''
      } ${className}`}
    >
      <MapPinIcon
        size={size}
        color={color}
        isAnimated={hovered || active}
        className="transition-colors duration-200"
      />
    </div>
  );
};

/**
 * MorphBarter (Lucide Animate Repeat/Trueque):
 * Icono de Trueque con animación de ciclo fluido al hover y activo.
 */
export const MorphBarter: React.FC<{
  className?: string;
  active?: boolean;
  color?: string;
  size?: number;
}> = ({ className = '', active = false, color = '#7AAF00', size = 20 }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`inline-flex items-center justify-center transition-transform duration-300 ${
        hovered || active ? 'scale-110 drop-shadow-[0_0_8px_rgba(122,175,0,0.35)]' : ''
      } ${className}`}
    >
      <RepeatIcon
        size={size}
        color={color}
        isAnimated={hovered || active}
        className="transition-colors duration-200"
      />
    </div>
  );
};

/**
 * MorphSparkle (Preservado para secciones decorativas como Hero/Features):
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
 * AnimatedLogIn:
 * Botón de acceso / login con icono animado interactivo.
 */
export const AnimatedLogIn: React.FC<{
  size?: number;
  color?: string;
  className?: string;
  isAnimated?: boolean;
}> = ({ size = 18, color = '#ffffff', className = '', isAnimated = false }) => {
  return <LogInIcon size={size} color={color} className={className} isAnimated={isAnimated} />;
};

/**
 * AnimatedLogOut:
 * Botón de salida con icono animado interactivo.
 */
export const AnimatedLogOut: React.FC<{
  size?: number;
  color?: string;
  className?: string;
  isAnimated?: boolean;
}> = ({ size = 18, color = '#e11d48', className = '', isAnimated = false }) => {
  return <LogOutIcon size={size} color={color} className={className} isAnimated={isAnimated} />;
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

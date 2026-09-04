/**
 * PALETA DE COLORES OFICIAL DE LIWA
 * =================================
 * Este archivo centraliza la paleta corporativa y de interfaz de Liwa.
 * Basado estrictamente en los 4 colores oficiales del sistema:
 * 
 * 1. Magenta:     #EC006C | RGB(236, 0, 108)
 * 2. Gris Oscuro:  #2C2C2C | RGB(44, 44, 44)
 * 3. Morado:       #4A198C | RGB(74, 25, 140)
 * 4. Verde:        #7AAF00 | RGB(122, 175, 0)
 */

export const LIWA_COLORS = {
  // 1. Magenta - Color insignia, acciones principales y llamadas a la acción
  magenta: {
    hex: '#EC006C',
    rgb: '236, 0, 108',
    rgbValues: [236, 0, 108] as const,
    name: 'Magenta',
    description: 'Color principal de marca, acentos vivos y llamadas a la acción (CTA)',
  },

  // 2. Gris Oscuro - Tipografía principal, alto contraste y superficies sólidas
  grisOscuro: {
    hex: '#2C2C2C',
    rgb: '44, 44, 44',
    rgbValues: [44, 44, 44] as const,
    name: 'Gris Oscuro',
    description: 'Texto principal, títulos de alto contraste y estructura neutra oscura',
  },

  // 3. Morado - Profundidad visual, sección de Mapa y gradientes contrastantes
  morado: {
    hex: '#4A198C',
    rgb: '74, 25, 140',
    rgbValues: [74, 25, 140] as const,
    name: 'Morado',
    description: 'Identidad, sección de mapa y base para degradados ricos',
  },

  // 4. Verde - Trueque, sostenibilidad, éxito y elementos ecológicos
  verde: {
    hex: '#7AAF00',
    rgb: '122, 175, 0',
    rgbValues: [122, 175, 0] as const,
    name: 'Verde',
    description: 'Trueque inteligente, sostenibilidad, badges ECO y balance justo',
  },
} as const;

/**
 * Función helper para generar colores RGBA a partir de los 4 colores oficiales.
 */
export function getLiwaRgba(color: keyof typeof LIWA_COLORS, alpha: number): string {
  const { rgb } = LIWA_COLORS[color];
  return `rgba(${rgb}, ${alpha})`;
}

/**
 * Presets de degradados (desvanecientes) oficiales que combinan exclusivamente
 * los 4 colores de la paleta.
 */
export const LIWA_GRADIENTS = {
  // Degradado insignia: Morado intenso a Magenta vibrante
  hero: 'linear-gradient(135deg, #4A198C 0%, #EC006C 100%)',
  
  // Botones y tarjetas con alto impacto
  buttonPrimary: 'linear-gradient(135deg, #EC006C 0%, #D80064 50%, #4A198C 100%)',
  
  // Sostenibilidad y Trueque: Verde con toque de profundidad
  trueque: 'linear-gradient(135deg, #7AAF00 0%, #5E8700 100%)',
  
  // Fondo ambiental suave (desvaneciente para orbes con blur)
  ambientPurpleMagenta: 'radial-gradient(circle, rgba(236, 0, 108, 0.25) 0%, rgba(74, 25, 140, 0.18) 50%, transparent 70%)',
  ambientGreen: 'radial-gradient(circle, rgba(122, 175, 0, 0.22) 0%, transparent 70%)',
  ambientPurple: 'radial-gradient(circle, rgba(74, 25, 140, 0.25) 0%, transparent 70%)',
  
  // Borde resplandeciente
  borderGradient: 'linear-gradient(135deg, rgba(236, 0, 108, 0.4), rgba(74, 25, 140, 0.4), rgba(122, 175, 0, 0.3))',
} as const;

/**
 * Clases de Tailwind CSS predefinidas para aplicar los 4 colores fácilmente.
 */
export const LIWA_CLASSES = {
  text: {
    magenta: 'text-[#EC006C]',
    grisOscuro: 'text-[#2C2C2C]',
    morado: 'text-[#4A198C]',
    verde: 'text-[#7AAF00]',
  },
  bg: {
    magenta: 'bg-[#EC006C]',
    grisOscuro: 'bg-[#2C2C2C]',
    morado: 'bg-[#4A198C]',
    verde: 'bg-[#7AAF00]',
  },
  border: {
    magenta: 'border-[#EC006C]',
    grisOscuro: 'border-[#2C2C2C]',
    morado: 'border-[#4A198C]',
    verde: 'border-[#7AAF00]',
  },
  glow: {
    magenta: 'shadow-[0_0_25px_rgba(236,0,108,0.35)]',
    morado: 'shadow-[0_0_25px_rgba(74,25,140,0.35)]',
    verde: 'shadow-[0_0_25px_rgba(122,175,0,0.35)]',
  },
} as const;

export default LIWA_COLORS;

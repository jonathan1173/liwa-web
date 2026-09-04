# 🎨 Paleta de Colores Oficial de Liwa

Documento de referencia rápida para el diseño e interfaz de **Liwa**. Esta paleta está compuesta estrictamente por los **4 colores corporativos oficiales**, sus degradados complementarios y efectos de desenfoque (*blur*).

---

## 1. Tabla de Colores Oficiales

| Color | HEX | RGB | Uso Principal | Clases Tailwind sugeridas |
| :--- | :--- | :--- | :--- | :--- |
| **Magenta** | `#EC006C` | `rgb(236, 0, 108)` | Marca principal, llamadas a la acción (CTA), botones activos, precios destacados | `bg-[#EC006C]`, `text-[#EC006C]`, `border-[#EC006C]` |
| **Gris Oscuro** | `#2C2C2C` | `rgb(44, 44, 44)` | Títulos de alto contraste, texto corporal legible, botones oscuros elegantes | `bg-[#2C2C2C]`, `text-[#2C2C2C]`, `border-[#2C2C2C]` |
| **Morado** | `#4A198C` | `rgb(74, 25, 140)` | Sección de Mapa, fondos de profundidad, degradados con magenta | `bg-[#4A198C]`, `text-[#4A198C]`, `border-[#4A198C]` |
| **Verde** | `#7AAF00` | `rgb(122, 175, 0)` | Trueque Inteligente, sostenibilidad, badges ecológicos y confirmaciones | `bg-[#7AAF00]`, `text-[#7AAF00]`, `border-[#7AAF00]` |

---

## 2. Desvanecientes (Degradados Oficiales)

Utiliza estos degradados para dar dinamismo y vitalidad a la interfaz:

- **Hero Gradient (Morado a Magenta)**:
  `bg-gradient-to-r from-[#4A198C] via-[#EC006C] to-[#EC006C]`
- **Botón Primario Resplandeciente**:
  `bg-gradient-to-r from-[#EC006C] to-[#4A198C] hover:opacity-95`
- **Degradado Trueque (Verde Sostenible)**:
  `bg-gradient-to-r from-[#7AAF00] to-[#5E8700]`

---

## 3. Efectos de Desenfoque (*Blur*) y Cristal (*Glassmorphism*)

Para evitar que la página se vea plana o pálida:

1. **Orbes de fondo con Blur ambiental**:
   ```html
   <!-- Orbe Morado -->
   <div className="absolute top-10 left-10 w-96 h-96 bg-[#4A198C]/20 rounded-full blur-3xl pointer-events-none"></div>
   <!-- Orbe Magenta -->
   <div className="absolute top-40 right-20 w-96 h-96 bg-[#EC006C]/20 rounded-full blur-3xl pointer-events-none"></div>
   <!-- Orbe Verde -->
   <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-[#7AAF00]/15 rounded-full blur-3xl pointer-events-none"></div>
   ```

2. **Tarjetas de Vidrio Esmerilado (Frosted Glass)**:
   ```html
   <div className="backdrop-blur-xl bg-white/85 border border-white/70 shadow-2xl rounded-3xl p-8">
     <!-- Contenido nítido sobre fondo translúcido -->
   </div>
   ```

3. **Sombras de Brillo (*Glow*)**:
   - Magenta Glow: `shadow-lg shadow-[#EC006C]/30`
   - Morado Glow: `shadow-lg shadow-[#4A198C]/30`
   - Verde Glow: `shadow-lg shadow-[#7AAF00]/30`

---

## 4. Archivo de Constantes en Código

Todas las constantes TypeScript están disponibles para importar en:
```typescript
import { LIWA_COLORS, LIWA_GRADIENTS, getLiwaRgba } from '@/theme/colors';
```

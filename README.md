# 🌿 Liwa Web — Tu Mercado de Confianza

<div align="center">

![Liwa Banner](https://ximkltsvydnzvudfojay.supabase.co/storage/v1/object/public/app/MUJER-FULL-COLOR.png)

**Plataforma web comunitaria para la comercialización local y el Trueque Inteligente en Nicaragua.**

[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0.9-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-13.3.0-FF0055?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

[Explorar Web](#-características-principales) • [Instalación](#-guía-de-instalación-y-puesta-en-marcha) • [Tecnologías](#-stack-tecnológico) • [Estructura](#-estructura-del-proyecto) • [Paleta de Colores](#-sistema-de-diseño-y-paleta-de-colores)

</div>

---

## 📖 Acerca de Liwa Web

**Liwa** es una plataforma web progresiva diseñada para reactivar y fortalecer la economía comunitaria local y el comercio justo en Nicaragua. Su propósito fundamental es conectar directamente a productores locales, artesanos y familias consumidoras sin intermediarios especulativos, permitiendo no solo la compra/venta tradicional en córdobas, sino reactivando de forma moderna el **Trueque Inteligente**, la geolocalización de vendedores en mapa interactivo y la difusión del conocimiento a través de una biblioteca abierta.

---

## 📑 Tabla de Contenidos

1. [Características Principales](#-características-principales)
2. [Stack Tecnológico](#-stack-tecnológico)
3. [Sistema de Diseño y Paleta de Colores](#-sistema-de-diseño-y-paleta-de-colores)
4. [Estructura del Proyecto](#-estructura-del-proyecto)
5. [Guía de Instalación y Puesta en Marcha](#-guía-de-instalación-y-puesta-en-marcha)
6. [Scripts Disponibles](#-scripts-disponibles)
7. [Base de Datos y Arquitectura de Supabase](#-base-de-datos-y-arquitectura-de-supabase)
8. [Despliegue](#-despliegue)
9. [Créditos](#-créditos)

---

## ✨ Características Principales

### 1. 🏠 Página de Inicio Interactiva (Home)
- **Hero cinemático con física Spring**: Integración de animaciones avanzadas mediante Framer Motion y scroll dinámico con interpolaciones fluidas.
- **Narrativa visual comunitaria**: Presentación clara de los pilares del proyecto (sostenibilidad, comercio justo, intercambio local).
- **Acceso rápido**: Enlaces directos para explorar el catálogo como invitado, registrarse o descargar la aplicación móvil.

### 2. 🛍️ Catálogo y Exploración de Productos (`/explorar`)
- **Búsqueda reactiva**: Filtrado instantáneo por texto en títulos y descripciones.
- **Filtros avanzados**:
  - Filtrado por categorías oficiales (Alimentos, Ropa, Electrónica, Pasatiempos, etc.).
  - Filtrado por estado de condición física (Nuevo, Como nuevo, Usado, etc.).
  - Interruptor exclusivo para productos disponibles para **Trueque**.
- **Paginación inteligente**: Navegación ágil optimizada para catálogos extensos.
- **Tarjetas interactivas**: Visualización de precios, fotografías optimizadas, distintivos de trueque y modal rápido.

### 3. 🗺️ Mapa Interactivo de Vendedores (`/mapa`)
- **Visualización geoespacial con Leaflet**: Representación de los vendedores y productores locales distribuidos en los departamentos de Nicaragua.
- **Marcadores personalizados (Pines)**: Identificación visual con avatares o nombres de usuario.
- **Filtro dinámico de categorías sobre el mapa**: Permite a los compradores ver qué vendedores ofrecen artículos de su interés específico.
- **Panel lateral de inventario**: Al seleccionar un marcador en el mapa, se despliega el perfil del vendedor con sus datos de contacto y catálogo disponible en esa locación.

### 4. 🔄 Módulo de Trueque Inteligente (`/trueque`)
- **Negociación justa sin dinero obligatorio**: Interfaz orientada exclusivamente a los productos marcados como aptos para intercambio.
- **Flujo de propuesta guiada**:
  - Selección del artículo deseado del vendedor receptor.
  - Selección de uno o varios artículos propios para ofrecer en intercambio.
  - Confirmación y guardado seguro de la propuesta en la base de datos (`barter_proposal` y `barter_proposal_item`).
- **Control de seguridad**: Validación previa de sesión activa y perfil de usuario completado.

### 5. 🔍 Ficha Detallada de Producto (`/producto/:id`)
- **Galería fotográfica interactiva**: Navegación entre las imágenes del producto con miniaturas.
- **Información del vendedor**: Datos del oferente, departamento o municipio y reputación.
- **Integración directa con WhatsApp**: Botón de contacto directo con mensaje preformateado para acordar entrega o resolver dudas al instante.
- **Recomendación de artículos relacionados**: Productos similares de la misma categoría.

### 6. 📚 Biblioteca Comunitaria (`/biblioteca`)
- **Repositorio cultural y educativo**: Catálogo de libros, guías agroecológicas y documentos en formato digital.
- **Visualización y descarga**: Enlaces directos para descarga gratuita de materiales educativos y botón para compartir enlaces en el portapapeles.

### 7. 📲 Centro de Descarga de APK Android (`/descarga/apk`)
- **Guía de instalación paso a paso en 4 fases**:
  1. Descarga del archivo APK desde el navegador.
  2. Confirmación de instalación en Android.
  3. Gestión preventiva de la alerta de Google Play Protect (*Desplegar más detalles*).
  4. Finalización y ejecución de la app móvil (*Instalar sin analizar*).
- **Integración con GitHub Releases**: Consulta automática de la última versión publicada de la app móvil `liwa-movil`.

### 8. 👤 Identidad, Autenticación y Perfil Multicultural (`/auth`)
- **Autenticación con Supabase Auth**: Registro e inicio de sesión seguros mediante correo y contraseña.
- **Sesión de invitado transparente**: Permite navegar, consultar catálogos y explorar el mapa sin fricciones previas de registro, respetando las políticas de Row Level Security (RLS).
- **Inclusión y diversidad cultural**:
  - Departamentos y municipios de Nicaragua (Managua, León, Granada, Masaya, Matagalpa, Bilwi, Bluefields, etc.).
  - Reconocimiento de identidades étnicas y pueblos originarios (Mestizo, Miskito, Mayangna, Creol, Rama, Ulwa, Garífuna, Xiu-Sutiaba, Chorotega).
  - Georreferenciación con coordenadas automáticas por municipio o manuales vía GPS.

---

## 🛠️ Stack Tecnológico

| Área | Tecnología | Versión | Propósito |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | **React** | `19.0.0` | Arquitectura de componentes e interfaz reactiva de última generación |
| **Lenguaje** | **TypeScript** | `5.7.3` | Tipado estricto, robustez y autodocumentación de interfaces |
| **Herramienta de Construcción** | **Vite** | `6.2.0` | Servidor de desarrollo ultrarrápido y empaquetador de producción |
| **Framework CSS** | **Tailwind CSS** | `4.0.9` | Utilidades de estilos atómicos con la nueva versión Tailwind v4 |
| **Componentes UI** | **Flowbite / Flowbite React** | `^4.0.2` | Componentes accesibles complementarios |
| **Motor de Animaciones** | **Framer Motion** | `13.3.0` | Animaciones de scroll, transiciones de vista y física de resortes |
| **Animación Avanzada** | **GSAP** | `3.15.0` | Control de secuencias y transformaciones complejas |
| **Iconografía** | **Lucide React** & **Animate Icons** | `^0.475.0` | Iconos vectoriales limpios y morphing icons animados |
| **Cartografía y Mapas** | **Leaflet** | `1.9.4` | Renderizado de mapas interactivos y marcadores geolocalizados |
| **Backend as a Service** | **Supabase JS Client** | `2.49.1` | Autenticación, PostgreSQL, Storage y RLS |
| **Telemetría y Métricas** | **Vercel Analytics** | `2.0.1` | Medición de rendimiento y tráfico web en producción |

---

## 🎨 Sistema de Diseño y Paleta de Colores

La identidad visual de Liwa está regida por **4 colores corporativos oficiales**, acompañados de estética moderna basada en *Glassmorphism* (cristal esmerilado) y orbes con desenfoque ambiental (*blur*):

| Color | Código HEX | Valor RGB | Significado y Aplicación en la Interfaz |
| :--- | :--- | :--- | :--- |
| **Magenta** | `#EC006C` | `rgb(236, 0, 108)` | **Marca insignia**: Llamadas a la acción principales (CTA), botones activos, precios y acentos de energía. |
| **Gris Oscuro** | `#2C2C2C` | `rgb(44, 44, 44)` | **Estructura y lectura**: Títulos principales, textos corporales de alto contraste y botones secundarios elegantes. |
| **Morado** | `#4A198C` | `rgb(74, 25, 140)` | **Identidad y Mapa**: Elementos de geolocalización, fondos de profundidad visual y degradados cinemáticos. |
| **Verde** | `#7AAF00` | `rgb(122, 175, 0)` | **Trueque y Sostenibilidad**: Distintivos de intercambio, confirmaciones de éxito y sellos ecológicos. |

### Degradados Corporativos
- **Hero Gradient**: `linear-gradient(135deg, #4A198C 0%, #EC006C 100%)`
- **Botón Primario**: `linear-gradient(135deg, #EC006C 0%, #D80064 50%, #4A198C 100%)`
- **Trueque Ecológico**: `linear-gradient(135deg, #7AAF00 0%, #5E8700 100%)`

> **Nota:** La configuración completa de tokens CSS se encuentra en [`src/theme/colors.ts`](src/theme/colors.ts) y en [`src/index.css`](src/index.css).

---

## 📁 Estructura del Proyecto

```text
liwa-web/
├── public/                     # Archivos públicos estáticos
│   ├── assets/                 # Favicons y logotipos de Liwa
│   └── image/                  # Imágenes locales de tiendas y capturas de descarga
├── src/
│   ├── components/             # Componentes modulares y reutilizables
│   │   ├── common/             # Micro-componentes (MorphIcon, Pagination, etc.)
│   │   ├── CompleteProfileModal.tsx # Modal para completar o actualizar perfil
│   │   ├── Navbar.tsx          # Barra de navegación adaptable (Desktop & Mobile)
│   │   ├── ProductCard.tsx     # Tarjeta estándar de exhibición de producto
│   │   ├── ProductModal.tsx    # Modal de previsualización rápida
│   │   └── TruequeModal.tsx    # Modal para conformar propuesta de intercambio
│   ├── lib/
│   │   └── supabase.ts         # Cliente Supabase, queries a BD, auth y RLS session fallback
│   ├── pages/                  # Vistas principales de la plataforma
│   │   ├── auth/               # Inicio de sesión, registro y perfil
│   │   ├── biblioteca/         # Catálogo de recursos educativos y libros digitales
│   │   ├── descarga/           # Guía visual y descarga de la app Android (APK)
│   │   ├── explorar/           # Catálogo con filtros y búsqueda reactiva
│   │   ├── home/               # Landing page con Hero y animaciones scroll
│   │   ├── mapa/               # Mapa interactivo Leaflet de productores locales
│   │   ├── producto/           # Detalle exhaustivo de producto y contacto
│   │   ├── trueque/            # Catálogo de trueque y creador de propuestas
│   │   └── index.ts            # Exportaciones unificadas de páginas
│   ├── theme/
│   │   └── colors.ts           # Definición oficial de paleta de colores y degradados
│   ├── types/
│   │   └── index.ts            # Interfaces TypeScript (Product, UserProfile, etc.)
│   ├── App.tsx                 # Enrutador principal, layouts y orbes ambientales
│   ├── index.css               # Importación de Tailwind v4 y clases personalizadas
│   ├── main.tsx                # Punto de montaje de React en el DOM
│   └── vite-env.d.ts           # Definiciones de tipos para el entorno Vite
├── .env.example                # Plantilla de variables de entorno requeridas
├── index.html                  # Plantilla HTML5 con metadatos OpenGraph y fuentes
├── package.json                # Dependencias, scripts y metadatos del proyecto
├── PALETA_COLORES.md           # Guía complementaria de diseño gráfico
├── tsconfig.json               # Configuración del compilador de TypeScript
├── vercel.json                 # Reglas de reescritura para Single Page Application (SPA)
└── vite.config.ts              # Configuración de Vite, plugins y alias (@)
```

---

## 🚀 Guía de Instalación y Puesta en Marcha

Sigue estos pasos para ejecutar **Liwa Web** localmente en tu entorno de desarrollo.

### 1. Prerrequisitos
Asegúrate de contar con las siguientes herramientas instaladas en tu sistema:
- **Node.js**: Versión `18.18.0` o superior (se sugiere **Node.js 20 LTS**).
- **npm** (versión 9 o superior), **pnpm** o **yarn**.
- **Git** para clonar el repositorio.

Verifica tu versión de Node.js con:
```bash
node -v
```

### 2. Clonar el Repositorio
```bash
git clone https://github.com/jonathan1173/liwa-web.git
cd liwa-web
```

### 3. Instalar Dependencias
Instala los paquetes del proyecto definidos en `package.json`:
```bash
npm install
```

### 4. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto tomando como referencia el archivo `.env.example`:

En sistemas Unix/macOS:
```bash
cp .env.example .env
```

En Windows (PowerShell):
```powershell
Copy-Item .env.example .env
```

Edita el archivo `.env` con las credenciales de tu proyecto Supabase:
```env
# URL de tu instancia de Supabase
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co

# Clave pública anónima de Supabase (Anon Key)
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

> **Nota:** La aplicación cuenta con fallbacks integrados en [`src/lib/supabase.ts`](src/lib/supabase.ts) para facilitar pruebas rápidas en caso de no definir variables explícitas.

### 5. Iniciar el Servidor de Desarrollo
Ejecuta el servidor local con recarga rápida (HMR):
```bash
npm run dev
```

El servidor iniciará generalmente en:
```text
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```
Abre tu navegador en `http://localhost:5173` para interactuar con la aplicación.

### 6. Compilar para Producción
Para generar los artefactos optimizados y minificados de producción:
```bash
npm run build
```
Este comando verificará los tipos de TypeScript con `tsc` y empaquetará el proyecto con Vite en el directorio `dist/`.

Para previsualizar localmente el build de producción:
```bash
npm run preview
```

---

## 📜 Scripts Disponibles

En el archivo `package.json` encontrarás los siguientes comandos:

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el entorno local de desarrollo con Vite. |
| `npm run build` | Compila TypeScript (`tsc`) y genera la versión optimizada en la carpeta `dist`. |
| `npm run preview` | Levanta un servidor local para verificar el resultado del build de producción. |

---

## 🗄️ Base de Datos y Arquitectura de Supabase

Liwa Web se conecta a una base de datos relacional PostgreSQL administrada mediante Supabase. Las tablas principales del modelo son:

- **`product`**: Catálogo de productos disponibles con título, descripción, precio en córdobas, indicador booleano de `barter` (trueque), llaves foráneas a categoría y condición, y estado (`state_id`).
- **`product_image`**: URLs de imágenes asociadas a cada producto.
- **`category`**: Taxonomía comercial (Electrónica, Ropa, Hogar, Alimentos, Pasatiempos, etc.).
- **`product_condition`**: Grado de uso del artículo (Nuevo, Como nuevo, Buen estado, etc.).
- **`profile`**: Perfiles de usuarios con nombre completo, teléfono para WhatsApp, biografía, avatar, departamento (`city_id`), identidad de género (`gender_id`), etnia (`ethnicity_id`) y coordenadas (`latitude`, `longitude`).
- **`barter_proposal`**: Cabecera de propuesta de trueque emitida por un comprador hacia el vendedor receptor con estado de la negociación (`barter_state`).
- **`barter_proposal_item`**: Detalle con los productos ofrecidos a cambio por el remitente.
- **`library`**: Libros y materiales digitales descargables con título, portada y URL de descarga.

---

## 🌐 Despliegue

La aplicación está lista para desplegarse en plataformas como **Vercel**, **Netlify** o cualquier servidor web estático.

El proyecto incluye el archivo [`vercel.json`](vercel.json) configurado para manejar correctamente las rutas SPA (Single Page Application):

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

Al desplegar en Vercel:
1. Conecta el repositorio de GitHub.
2. Configura las variables de entorno `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
3. Vercel detectará automáticamente la configuración de Vite y ejecutará `npm run build`.

---

## 🤝 Créditos

Desarrollado con dedicación para impulsar la soberanía económica, el intercambio justo y la comunidad productiva de Nicaragua.

- **Diseño & Desarrollo**: Equipo Liwa
- **Iconografía**: [Lucide Icons](https://lucide.dev/)
- **Cartografía**: [OpenStreetMap](https://www.openstreetmap.org/) & [Leaflet](https://leafletjs.com/)
- **Infraestructura Backend**: [Supabase](https://supabase.com/)

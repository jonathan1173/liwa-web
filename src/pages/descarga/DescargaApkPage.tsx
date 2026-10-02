import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Settings,
  PackageCheck,
  ArrowDown,
  Info,
  Sparkles,
  ArrowLeft,
  FileBox,
  Image as ImageIcon,
  Check,
  RefreshCw,
} from 'lucide-react';

/**
 * =========================================================================
 * 📸 VARIABLES DE IMÁGENES PARA CADA PASO DE INSTALACIÓN
 * =========================================================================
 * Inserta directamente aquí las URLs de tus capturas de pantalla.
 * Cada contenedor aplicará la imagen como fondo (bg-image) con ajuste cover y centrado.
 * Mientras dejes la cadena vacía (""), se mostrará una elegante maqueta (mockup) con
 * el indicador visual del paso correspondiente.
 */
export const STEP_IMAGES = {
  // Paso 1: Alerta en el navegador (ej: "Este archivo puede ser dañino -> Descargar de todos modos")
  step1: '',

  // Paso 2: Permisos de orígenes desconocidos (ej: Ajustes -> Confiar en esta fuente / Chrome)
  step2: '',

  // Paso 3: Instalador de Android (ej: "¿Deseas instalar esta app? -> Instalar")
  step3: '',

  // Paso 4: App instalada (ej: "Se instaló la app -> Abrir" y bienvenida a Liwa)
  step4: '',
};

interface ReleaseInfo {
  version: string;
  apkUrl: string;
  sizeMB: string;
  releasePageUrl: string;
  publishedAt: string;
  isLoading: boolean;
}

// Fallback por defecto si no hay conexión a la API de GitHub
const DEFAULT_FALLBACK_RELEASE = {
  version: 'v9.0.1',
  apkUrl: 'https://github.com/jonathan1173/liwa-movil/releases/download/v9.0.1/liwa-v9.0.1.apk',
  sizeMB: '82.2 MB',
  releasePageUrl: 'https://github.com/jonathan1173/liwa-movil/releases/tag/v9.0.0',
};

interface DescargaApkPageProps {
  onBackToHome?: () => void;
}

export const DescargaApkPage: React.FC<DescargaApkPageProps> = ({ onBackToHome }) => {
  const [releaseInfo, setReleaseInfo] = useState<ReleaseInfo>({
    version: DEFAULT_FALLBACK_RELEASE.version,
    apkUrl: DEFAULT_FALLBACK_RELEASE.apkUrl,
    sizeMB: DEFAULT_FALLBACK_RELEASE.sizeMB,
    releasePageUrl: DEFAULT_FALLBACK_RELEASE.releasePageUrl,
    publishedAt: '',
    isLoading: true,
  });

  const [downloadStarted, setDownloadStarted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Consulta la API de GitHub para obtener siempre el último release y su APK
  useEffect(() => {
    let isMounted = true;

    async function fetchLatestRelease() {
      try {
        const response = await fetch(
          'https://api.github.com/repos/jonathan1173/liwa-movil/releases/latest',
          {
            headers: {
              Accept: 'application/vnd.github.v3+json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`GitHub API returned status ${response.status}`);
        }

        const data = await response.json();
        // Buscar el activo con extensión .apk
        const apkAsset = data.assets?.find(
          (asset: any) => asset.name && asset.name.toLowerCase().endsWith('.apk')
        );

        if (apkAsset && isMounted) {
          const sizeInMB = apkAsset.size
            ? (apkAsset.size / (1024 * 1024)).toFixed(1) + ' MB'
            : DEFAULT_FALLBACK_RELEASE.sizeMB;

          setReleaseInfo({
            version: data.tag_name || data.name || DEFAULT_FALLBACK_RELEASE.version,
            apkUrl: apkAsset.browser_download_url,
            sizeMB: sizeInMB,
            releasePageUrl: data.html_url || DEFAULT_FALLBACK_RELEASE.releasePageUrl,
            publishedAt: data.published_at
              ? new Date(data.published_at).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : '',
            isLoading: false,
          });
        } else if (isMounted) {
          setReleaseInfo((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (err) {
        console.warn('Usando release por defecto debido a error al consultar GitHub:', err);
        if (isMounted) {
          setReleaseInfo((prev) => ({ ...prev, isLoading: false }));
        }
      }
    }

    fetchLatestRelease();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDownload = () => {
    setDownloadStarted(true);
    // Disparar la descarga del archivo APK
    const link = document.createElement('a');
    link.href = releaseInfo.apkUrl;
    link.setAttribute('download', `liwa-${releaseInfo.version}.apk`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Ocultar mensaje tras 8 segundos
    setTimeout(() => {
      setDownloadStarted(false);
    }, 8000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(releaseInfo.apkUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Definición de los pasos pedagógicos ordenados
  const steps = [
    {
      id: 1,
      badge: 'Paso 01',
      title: 'Descarga el archivo APK en tu celular',
      subtitle: 'Acepta la advertencia preventiva del navegador',
      description:
        'Al pulsar el botón de descarga situado al final de esta guía, tu navegador Android (Google Chrome, Samsung Internet, etc.) te advertirá que los archivos APK pueden ser perjudiciales. Esto es una medida de seguridad genérica para cualquier app no descargada directamente desde la Play Store.',
      tip: 'Haz clic en "Descargar de todos modos" o "Aceptar" para continuar con la descarga del instalador oficial.',
      imageVariable: 'STEP_IMAGES.step1',
      imageUrl: STEP_IMAGES.step1,
      highlightColor: '#EC006C',
      icon: Download,
    },
    {
      id: 2,
      badge: 'Paso 02',
      title: 'Permite la instalación de fuentes desconocidas',
      subtitle: 'Habilita los permisos de seguridad de Android',
      description:
        'Si es la primera vez que instalas un archivo descargado desde tu navegador o explorador de archivos, el sistema te solicitará autorización: "Para tu seguridad, el teléfono no tiene permitido instalar apps desconocidas de esta fuente".',
      tip: 'Presiona "Configuración" en la ventana emergente y activa el interruptor "Permitir desde esta fuente" o "Confiar en esta app".',
      imageVariable: 'STEP_IMAGES.step2',
      imageUrl: STEP_IMAGES.step2,
      highlightColor: '#4A198C',
      icon: Settings,
    },
    {
      id: 3,
      badge: 'Paso 03',
      title: 'Confirma la instalación de Liwa',
      subtitle: 'Inicia el paquete del instalador',
      description:
        'Una vez terminada la descarga, pulsa sobre la notificación de "Descarga finalizada" o busca el archivo APK descargado en tu carpeta de "Descargas" (Archivos/Files de tu celular).',
      tip: 'El instalador te preguntará "¿Deseas instalar esta aplicación?". Simplemente pulsa el botón "Instalar" y aguarda unos segundos.',
      imageVariable: 'STEP_IMAGES.step3',
      imageUrl: STEP_IMAGES.step3,
      highlightColor: '#7AAF00',
      icon: PackageCheck,
    },
    {
      id: 4,
      badge: 'Paso 04',
      title: 'Abre Liwa y configura tus permisos',
      subtitle: '¡Todo listo para comerciar y hacer trueques!',
      description:
        'Cuando la pantalla muestre "Se instaló la app", pulsa en "Abrir". La aplicación Liwa iniciará inmediatamente en tu dispositivo Android.',
      tip: 'Concede los permisos solicitados (como ubicación para visualizar productos cercanos en el mapa y cámara para publicar artículos) para disfrutar la experiencia completa.',
      imageVariable: 'STEP_IMAGES.step4',
      imageUrl: STEP_IMAGES.step4,
      highlightColor: '#EC006C',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="relative w-full pb-24 text-[#2C2C2C]">
      {/* Botón superior sutil para regresar al portal */}
      {onBackToHome && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-[#EC006C] bg-white/80 hover:bg-white border border-slate-200 shadow-2xs backdrop-blur-md transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Volver al sitio principal de Liwa</span>
          </button>
        </div>
      )}

      {/* Hero / Encabezado de la Guía */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-12 text-center">
        {/* Badge superior */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EC006C]/10 border border-[#EC006C]/25 text-[#EC006C] text-xs font-bold uppercase tracking-wider mb-6 shadow-2xs">
          <Smartphone className="w-4 h-4" />
          <span>Liwa Móvil para Android</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#EC006C]" />
          <span>{releaseInfo.version}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#2C2C2C] tracking-tight leading-[1.15]">
          Cómo descargar e instalar el{' '}
          <span className="bg-gradient-to-r from-[#4A198C] via-[#EC006C] to-[#EC006C] bg-clip-text text-transparent">
            APK de Liwa
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Sigue esta sencilla guía visual paso a paso para instalar la aplicación oficial de
          Liwa en tu teléfono Android. Al finalizar el tutorial encontrarás el botón de{' '}
          <strong className="text-[#EC006C] font-semibold">descarga directa</strong> del APK.
        </p>

        {/* Resumen rápido de requisitos */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-600">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 border border-slate-200/90 shadow-2xs backdrop-blur-xs">
            <ShieldCheck className="w-4 h-4 text-[#7AAF00]" />
            100% Seguro y Oficial
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 border border-slate-200/90 shadow-2xs backdrop-blur-xs">
            <Smartphone className="w-4 h-4 text-[#4A198C]" />
            Compatible con Android 8.0 o superior
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 border border-slate-200/90 shadow-2xs backdrop-blur-xs">
            <FileBox className="w-4 h-4 text-[#EC006C]" />
            Tamaño: {releaseInfo.sizeMB}
          </span>
        </div>

        {/* Indicador de scroll hacia los pasos */}
        <div className="mt-10 flex flex-col items-center justify-center gap-2 text-slate-400">
          <span className="text-[11px] font-semibold tracking-wider uppercase">
            Instrucciones en orden
          </span>
          <ArrowDown className="w-5 h-5 text-[#EC006C] animate-bounce" />
        </div>
      </section>

      {/* Lista Secuencial de Pasos con Contenedores de Imágenes */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-16">
        {steps.map((step, index) => {
          const IconComponent = step.icon;
          const isEven = index % 2 === 1;

          return (
            <div
              key={step.id}
              className="relative p-6 sm:p-10 rounded-3xl bg-white/85 border border-white/70 shadow-xl shadow-slate-900/5 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:border-slate-200"
            >
              <div
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                  isEven ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Columna de Texto y Explicación */}
                <div
                  className={`space-y-5 ${
                    isEven ? 'lg:col-span-6 lg:order-2' : 'lg:col-span-6 lg:order-1'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="px-3.5 py-1.5 rounded-xl text-xs font-black tracking-wider text-white shadow-sm"
                      style={{ backgroundColor: step.highlightColor }}
                    >
                      {step.badge}
                    </span>
                    <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">
                      Paso obligatorio {step.id} de {steps.length}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C2C2C] leading-snug">
                      {step.title}
                    </h2>
                    <p className="text-sm font-semibold text-slate-500 mt-1">
                      {step.subtitle}
                    </p>
                  </div>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Caja de Consejo / Acción recomendada */}
                  <div
                    className="p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 bg-slate-50/80"
                    style={{ borderColor: `${step.highlightColor}33` }}
                  >
                    <div
                      className="p-2 rounded-xl text-white flex-shrink-0"
                      style={{ backgroundColor: step.highlightColor }}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block font-bold text-[#2C2C2C] mb-1">
                        ¿Qué debes hacer en la pantalla?
                      </strong>
                      <span className="text-slate-600 leading-normal">{step.tip}</span>
                    </div>
                  </div>
                </div>

                {/* Columna del Contenedor de Imagen (Mockup móvil con soporte bg-image) */}
                <div
                  className={`flex justify-center ${
                    isEven ? 'lg:col-span-6 lg:order-1' : 'lg:col-span-6 lg:order-2'
                  }`}
                >
                  <div className="relative w-full max-w-[320px] sm:max-w-[340px] aspect-[9/16] rounded-[2.5rem] p-3 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 shadow-2xl border-4 border-slate-700/60 ring-1 ring-white/20 overflow-hidden flex flex-col">
                    {/* Bocina / Altavoz superior del celular */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-3 bg-black/80 rounded-full z-20 flex items-center justify-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-slate-800 border border-slate-700" />
                      <div className="w-6 h-1 rounded-full bg-slate-800" />
                    </div>

                    {/* Área de Pantalla: Aplica la imagen mediante bg-image */}
                    <div
                      className="relative w-full h-full rounded-[2rem] overflow-hidden bg-slate-900 flex flex-col items-center justify-center text-center p-6 border border-slate-800/80"
                      style={{
                        backgroundImage: step.imageUrl ? `url("${step.imageUrl}")` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                      }}
                    >
                      {/* Si NO hay URL asignada en la variable, mostramos el contenedor mockup vacío informativo */}
                      {!step.imageUrl && (
                        <div className="relative z-10 flex flex-col items-center justify-center p-4 bg-slate-950/70 border border-white/10 rounded-2xl backdrop-blur-md max-w-[240px] shadow-lg">
                          <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-md"
                            style={{ backgroundColor: `${step.highlightColor}25` }}
                          >
                            <ImageIcon
                              className="w-6 h-6"
                              style={{ color: step.highlightColor }}
                            />
                          </div>

                          <h3 className="text-xs font-bold text-white mb-1">
                            Captura de Pantalla
                          </h3>

                          <p className="text-[11px] text-slate-300 leading-tight mb-3">
                            Espacio preparado para la imagen del {step.badge.toLowerCase()}
                          </p>

                          <div className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/10 text-[10px] font-mono text-slate-400 text-left truncate">
                            <span className="text-[#EC006C]">var:</span> {step.imageVariable}
                          </div>
                        </div>
                      )}

                      {/* Marca de agua decorativa sutil en el fondo si está vacío */}
                      {!step.imageUrl && (
                        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
                          <Smartphone className="w-48 h-48 text-white stroke-[1]" />
                        </div>
                      )}

                      {/* Brillo de pantalla */}
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent" />
                    </div>

                    {/* Barra de inicio inferior de navegación */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/40 rounded-full z-20" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* SECCIÓN FINAL: Botón Principal de Descarga de la APK */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mt-20">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#2C2C2C] via-[#241b35] to-[#171221] p-8 sm:p-14 text-white shadow-2xl border border-white/10">
          {/* Orbes de resplandor decorativos internos */}
          <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-[90px] opacity-40 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #EC006C 0%, transparent 70%)' }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-[90px] opacity-35 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #4A198C 0%, transparent 70%)' }}
          />

          <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#EC006C] text-xs font-bold backdrop-blur-md shadow-inner">
              <Sparkles className="w-4 h-4 text-[#EC006C]" />
              <span className="text-white">Última versión disponible en GitHub</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              ¿Listo para instalar? <br />
              <span className="bg-gradient-to-r from-[#EC006C] via-[#ff4b98] to-[#7AAF00] bg-clip-text text-transparent">
                Descarga el APK Oficial
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Presiona el botón a continuación para iniciar la descarga directa en tu celular.
              Recuerda seguir los 4 pasos explicados arriba una vez completada la descarga.
            </p>

            {/* BOTÓN PRINCIPAL DE DESCARGA */}
            <div className="w-full pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleDownload}
                className="w-full sm:w-auto min-w-[280px] flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-extrabold text-white bg-gradient-to-r from-[#EC006C] via-[#E10067] to-[#4A198C] hover:opacity-95 shadow-xl shadow-[#EC006C]/35 hover:shadow-2xl hover:shadow-[#EC006C]/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer group"
              >
                <Download className="w-6 h-6 transition-transform group-hover:translate-y-0.5" />
                <span>Descargar APK ({releaseInfo.version})</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-4 rounded-2xl text-xs font-bold text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-all cursor-pointer"
                title="Copiar enlace de descarga directa"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-[#7AAF00]" />
                    <span>¡Enlace copiado!</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    <span>Copiar link</span>
                  </>
                )}
              </button>
            </div>

            {/* Mensaje flotante de retroalimentación al presionar descargar */}
            {downloadStarted && (
              <div className="w-full p-4 rounded-2xl bg-[#7AAF00]/20 border border-[#7AAF00]/50 text-[#7AAF00] text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in duration-300">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>
                  ¡Descarga iniciada! Revisa las notificaciones de tu teléfono y sigue el Paso 2
                  y 3 para instalar.
                </span>
              </div>
            )}

            {/* Metadatos y enlaces de seguridad */}
            <div className="pt-6 border-t border-white/10 w-full flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#7AAF00] animate-pulse" />
                <span>Compilación verificada: {releaseInfo.version}</span>
                {releaseInfo.sizeMB && <span>• {releaseInfo.sizeMB}</span>}
              </div>

              <a
                href={releaseInfo.releasePageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-300 hover:text-[#EC006C] transition-colors underline underline-offset-4"
              >
                <span>Ver notas de la versión en GitHub Releases</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Preguntas Frecuentes / Resolución de problemas comunes */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mt-16">
        <h3 className="text-xl font-bold text-[#2C2C2C] mb-6 flex items-center gap-2">
          <Info className="w-5 h-5 text-[#4A198C]" />
          <span>Preguntas Frecuentes sobre la instalación</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-2xs backdrop-blur-xs">
            <h4 className="text-sm font-bold text-[#2C2C2C] mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              ¿Por qué Android dice que el archivo puede ser dañino?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Google muestra este aviso en todos los archivos APK descargados fuera de Google Play
              Store para prevenir instalaciones accidentales. El APK de Liwa está compilado
              directamente desde nuestro código fuente seguro de GitHub.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-2xs backdrop-blur-xs">
            <h4 className="text-sm font-bold text-[#2C2C2C] mb-2 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#7AAF00]" />
              ¿Cómo actualizo la aplicación en el futuro?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cuando publiquemos una nueva versión, simplemente vuelve a esta misma página y
              descarga el APK actualizado. Al instalarlo sobre la versión anterior, conservará tu
              sesión y configuración intactas.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DescargaApkPage;

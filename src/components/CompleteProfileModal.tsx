import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  MapPin,
  Compass,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  X,
  Navigation,
  Globe,
  Users,
} from 'lucide-react';
import {
  getCities,
  getGenders,
  getEthnicities,
  updateUserProfile,
  getUserProfile,
} from '@/lib/supabase';
import { City, Gender, Ethnicity, UserProfile } from '@/types';

// Coordenadas de referencia aproximadas para departamentos de Nicaragua
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  managua: { lat: 12.1364, lng: -86.2514 },
  león: { lat: 12.4379, lng: -86.878 },
  leon: { lat: 12.4379, lng: -86.878 },
  granada: { lat: 11.9299, lng: -85.956 },
  masaya: { lat: 11.9744, lng: -86.0942 },
  matagalpa: { lat: 12.9256, lng: -85.9175 },
  estelí: { lat: 13.0919, lng: -86.3538 },
  esteli: { lat: 13.0919, lng: -86.3538 },
  chinandega: { lat: 12.6294, lng: -87.1311 },
  jinotega: { lat: 13.0921, lng: -86.0028 },
  rivas: { lat: 11.4372, lng: -85.8263 },
  carazo: { lat: 11.8541, lng: -86.2081 },
  'nueva segovia': { lat: 13.6276, lng: -86.4754 },
  madriz: { lat: 13.4614, lng: -86.5828 },
  boaco: { lat: 12.4722, lng: -85.6586 },
  chontales: { lat: 12.0624, lng: -85.3678 },
  'río san juan': { lat: 11.2064, lng: -84.6989 },
  'rio san juan': { lat: 11.2064, lng: -84.6989 },
  bilwi: { lat: 14.0351, lng: -83.3888 },
  'puerto cabezas': { lat: 14.0351, lng: -83.3888 },
  bluefields: { lat: 12.0137, lng: -83.7635 },
};

export interface CompleteProfileModalProps {
  isOpen: boolean;
  onClose?: () => void;
  user: any;
  initialProfile?: UserProfile | null;
  onProfileCompleted: (profile: UserProfile) => void;
  isMandatory?: boolean;
}

export const CompleteProfileModal: React.FC<CompleteProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  initialProfile,
  onProfileCompleted,
  isMandatory = false,
}) => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [cityId, setCityId] = useState<number | ''>('');
  const [genderId, setGenderId] = useState<number | ''>('');
  const [ethnicityId, setEthnicityId] = useState<number | ''>('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [cities, setCities] = useState<City[]>([]);
  const [genders, setGenders] = useState<Gender[]>([]);
  const [ethnicities, setEthnicities] = useState<Ethnicity[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingTaxonomies, setLoadingTaxonomies] = useState(true);
  const [detectingGps, setDetectingGps] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);

  // Cargar catálogos de ciudad, género y etnicidad
  useEffect(() => {
    let isMounted = true;
    async function loadTaxonomies() {
      setLoadingTaxonomies(true);
      try {
        const [cList, gList, eList] = await Promise.all([
          getCities(),
          getGenders(),
          getEthnicities(),
        ]);
        if (isMounted) {
          setCities(cList);
          setGenders(gList);
          setEthnicities(eList);
        }
      } catch (err) {
        console.warn('Error loading taxonomies:', err);
      } finally {
        if (isMounted) setLoadingTaxonomies(false);
      }
    }

    if (isOpen) {
      loadTaxonomies();
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Rellenar datos existentes si los hay
  useEffect(() => {
    if (initialProfile) {
      setUsername(initialProfile.username || '');
      setFullName(initialProfile.full_name || '');
      setPhone(initialProfile.phone || '');
      setCityId(initialProfile.city_id || '');
      setGenderId(initialProfile.gender_id || '');
      setEthnicityId(initialProfile.ethnicity_id || '');
      setLatitude(initialProfile.latitude ?? null);
      setLongitude(initialProfile.longitude ?? null);
    } else if (user?.id) {
      getUserProfile(user.id).then((prof) => {
        if (prof) {
          setUsername(prof.username || '');
          setFullName(prof.full_name || '');
          setPhone(prof.phone || '');
          setCityId(prof.city_id || '');
          setGenderId(prof.gender_id || '');
          setEthnicityId(prof.ethnicity_id || '');
          setLatitude(prof.latitude ?? null);
          setLongitude(prof.longitude ?? null);
        } else if (user.email) {
          // Prefill username sugerido a partir del email
          const suggestedUser = user.email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_');
          setUsername(suggestedUser);
        }
      });
    }
  }, [initialProfile, user, isOpen]);

  // Actualizar coordenadas estimadas cuando cambia la ciudad (si no se ha detectado GPS)
  const handleCityChange = (newCityId: number) => {
    setCityId(newCityId);
    if (latitude === null || longitude === null) {
      const selected = cities.find((c) => c.id === newCityId);
      if (selected) {
        const key = selected.name.toLowerCase().trim();
        for (const [cityName, coords] of Object.entries(CITY_COORDINATES)) {
          if (key.includes(cityName)) {
            setLatitude(coords.lat);
            setLongitude(coords.lng);
            setGpsMessage(`Ubicación aproximada establecida para ${selected.name}`);
            break;
          }
        }
      }
    }
  };

  // Detección de GPS por navegador
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      setErrorMessage('La geolocalización no es compatible con tu navegador actual.');
      return;
    }

    setDetectingGps(true);
    setErrorMessage('');
    setGpsMessage(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));
        setLatitude(lat);
        setLongitude(lng);
        setDetectingGps(false);
        setGpsMessage(`✓ Ubicación GPS detectada con éxito (${lat}, ${lng})`);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setDetectingGps(false);
        // Usar fallback de Managua si falla
        if (latitude === null || longitude === null) {
          setLatitude(12.1364);
          setLongitude(-86.2514);
          setGpsMessage('No pudimos acceder a tu GPS. Se asignaron coordenadas de referencia (Managua).');
        } else {
          setGpsMessage('No se pudo acceder al GPS. Manteniendo coordenadas previas.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const validateForm = () => {
    setErrorMessage('');
    const cleanUser = username.trim().toLowerCase();
    const cleanName = fullName.trim();
    const cleanPhone = phone.trim();

    if (!cleanUser) {
      setErrorMessage('Ingresa un nombre de usuario.');
      return false;
    }
    if (cleanUser.length < 3) {
      setErrorMessage('El nombre de usuario debe contener al menos 3 caracteres.');
      return false;
    }
    if (!/^[a-zA-Z0-9_.-]+$/.test(cleanUser)) {
      setErrorMessage('El nombre de usuario solo puede contener letras, números, puntos y guiones bajos.');
      return false;
    }
    if (!cleanName) {
      setErrorMessage('Ingresa tu nombre completo.');
      return false;
    }
    if (cleanName.length < 3) {
      setErrorMessage('El nombre completo debe contener al menos 3 caracteres.');
      return false;
    }
    if (!cleanPhone) {
      setErrorMessage('Ingresa un número de teléfono o WhatsApp para contactar trueques.');
      return false;
    }
    if (cleanPhone.replace(/\D/g, '').length < 8) {
      setErrorMessage('El número de teléfono debe tener al menos 8 dígitos.');
      return false;
    }
    if (!cityId) {
      setErrorMessage('Selecciona tu ciudad.');
      return false;
    }
    if (!genderId) {
      setErrorMessage('Selecciona tu género.');
      return false;
    }
    if (!ethnicityId) {
      setErrorMessage('Selecciona tu etnicidad.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!user?.id) {
      setErrorMessage('No se encontró una sesión activa de usuario.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    // Asegurar coordenadas por defecto de la ciudad si el usuario no tiene GPS
    let finalLat = latitude;
    let finalLng = longitude;
    if (finalLat === null || finalLng === null) {
      const selected = cities.find((c) => c.id === cityId);
      const key = selected?.name.toLowerCase().trim() || 'managua';
      const fallback = CITY_COORDINATES[key] || { lat: 12.1364, lng: -86.2514 };
      finalLat = fallback.lat;
      finalLng = fallback.lng;
    }

    try {
      const updated = await updateUserProfile(user.id, {
        username: username.trim().toLowerCase(),
        full_name: fullName.trim(),
        phone: phone.trim(),
        city_id: Number(cityId),
        gender_id: Number(genderId),
        ethnicity_id: Number(ethnicityId),
        latitude: finalLat,
        longitude: finalLng,
        email: user.email,
      });

      onProfileCompleted(updated);
      if (onClose) onClose();
    } catch (err: any) {
      console.error('Error saving profile:', err);
      if (err.message && (err.message.includes('unique') || err.message.includes('duplicate'))) {
        setErrorMessage('Este nombre de usuario ya está en uso. Por favor elige otro.');
      } else {
        setErrorMessage(err.message || 'Ocurrió un error al guardar tu perfil. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-[#2C2C2C]/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={() => {
        if (!isMandatory && onClose) onClose();
      }}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-white/90 overflow-hidden my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Orbes decorativos superiores */}
        <div
          className="absolute -top-16 -right-16 w-44 h-44 rounded-full blur-2xl opacity-25 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #EC006C 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-44 h-44 rounded-full blur-2xl opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #4A198C 0%, transparent 70%)' }}
        />

        {/* Encabezado del Modal */}
        <div className="relative z-10 px-6 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#EC006C] via-[#E10067] to-[#4A198C] text-white flex items-center justify-center shadow-md shadow-[#EC006C]/25 flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#2C2C2C] tracking-tight">
                Completar Perfil en Liwa
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                Datos necesarios para habilitar propuestas de trueque y compras
              </p>
            </div>
          </div>

          {!isMandatory && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-[#2C2C2C] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Alerta de error si existe */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="relative z-10 p-6 space-y-4 max-h-[calc(86vh-120px)] overflow-y-auto">
          {/* Nombre de usuario y Nombre completo en 2 columnas en pantallas medianas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Nombre de usuario */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2C2C2C]/80 mb-1">
                Nombre de Usuario *
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400 text-xs font-bold select-none">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, '_'))}
                  placeholder="juan_perez"
                  className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#EC006C] focus:bg-white focus:ring-2 focus:ring-[#EC006C]/15 rounded-xl text-xs sm:text-sm font-semibold text-[#2C2C2C] outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Nombre Completo */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2C2C2C]/80 mb-1">
                Nombre Completo *
              </label>
              <div className="relative flex items-center">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Juan Pérez Martínez"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#EC006C] focus:bg-white focus:ring-2 focus:ring-[#EC006C]/15 rounded-xl text-xs sm:text-sm font-medium text-[#2C2C2C] outline-none transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Teléfono / WhatsApp y Ciudad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Teléfono */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2C2C2C]/80 mb-1">
                Teléfono / WhatsApp *
              </label>
              <div className="relative flex items-center">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="8888-8888"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#EC006C] focus:bg-white focus:ring-2 focus:ring-[#EC006C]/15 rounded-xl text-xs sm:text-sm font-medium text-[#2C2C2C] outline-none transition-all"
                  required
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Para coordinar trueques</p>
            </div>

            {/* Ciudad */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2C2C2C]/80 mb-1">
                Ciudad *
              </label>
              <div className="relative flex items-center">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                <select
                  value={cityId}
                  onChange={(e) => handleCityChange(Number(e.target.value))}
                  disabled={loadingTaxonomies}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#EC006C] focus:bg-white focus:ring-2 focus:ring-[#EC006C]/15 rounded-xl text-xs sm:text-sm font-medium text-[#2C2C2C] outline-none transition-all cursor-pointer"
                  required
                >
                  <option value="">Selecciona tu ciudad...</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Género y Etnicidad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Género */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2C2C2C]/80 mb-1">
                Género *
              </label>
              <div className="relative flex items-center">
                <Users className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                <select
                  value={genderId}
                  onChange={(e) => setGenderId(Number(e.target.value))}
                  disabled={loadingTaxonomies}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#EC006C] focus:bg-white focus:ring-2 focus:ring-[#EC006C]/15 rounded-xl text-xs sm:text-sm font-medium text-[#2C2C2C] outline-none transition-all cursor-pointer"
                  required
                >
                  <option value="">Selecciona género...</option>
                  {genders.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Etnicidad */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2C2C2C]/80 mb-1">
                Etnicidad *
              </label>
              <div className="relative flex items-center">
                <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                <select
                  value={ethnicityId}
                  onChange={(e) => setEthnicityId(Number(e.target.value))}
                  disabled={loadingTaxonomies}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#EC006C] focus:bg-white focus:ring-2 focus:ring-[#EC006C]/15 rounded-xl text-xs sm:text-sm font-medium text-[#2C2C2C] outline-none transition-all cursor-pointer"
                  required
                >
                  <option value="">Selecciona etnicidad...</option>
                  {ethnicities.map((eth) => (
                    <option key={eth.id} value={eth.id}>
                      {eth.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Sección de Ubicación Geográfica (GPS / Mapa) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2C2C2C]/80">
                  Ubicación Geográfica *
                </label>
                <p className="text-[10px] text-slate-400">
                  Permite ubicar tus trueques en el mapa comunitario local
                </p>
              </div>

              <button
                type="button"
                onClick={handleDetectGps}
                disabled={detectingGps}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-[#4A198C] font-bold text-xs shadow-2xs hover:border-[#4A198C]/40 transition-all cursor-pointer disabled:opacity-50"
              >
                <Navigation className={`w-3.5 h-3.5 ${detectingGps ? 'animate-spin' : ''}`} />
                <span>{detectingGps ? 'Detectando...' : 'Detectar GPS'}</span>
              </button>
            </div>

            {/* Visualización de Coordenadas */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Latitud</span>
                <span className="font-bold text-[#2C2C2C]">
                  {latitude !== null ? latitude : 'Pendiente'}
                </span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Longitud</span>
                <span className="font-bold text-[#2C2C2C]">
                  {longitude !== null ? longitude : 'Pendiente'}
                </span>
              </div>
            </div>

            {gpsMessage && (
              <p className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                <span>{gpsMessage}</span>
              </p>
            )}
          </div>

          {/* Botón de Enviar */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#EC006C] via-[#E10067] to-[#4A198C] hover:opacity-95 text-white font-extrabold text-sm shadow-xl shadow-[#EC006C]/30 hover:shadow-[#EC006C]/40 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Guardar y Activar Funciones de Trueque</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfileModal;

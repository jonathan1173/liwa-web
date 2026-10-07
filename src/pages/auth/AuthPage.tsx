import React, { useState, useEffect } from 'react';
import { signIn, signUp, getCities, getGenders, getEthnicities, updateUserProfile, getUserProfile } from '@/lib/supabase';
import { City, Gender, Ethnicity, UserProfile } from '@/types';
import {
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  UserPlus,
  LogIn,
  ShieldCheck,
  User,
  Phone,
  MapPin,
  Users,
  Globe,
  Navigation,
  Sparkles,
} from 'lucide-react';
import { MorphEye, MorphSparkle } from '@/components/common/MorphIcon';

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

export interface AuthPageProps {
  onLoginSuccess: (user: any, profile?: UserProfile) => void;
  onBackToHome: () => void;
  onExploreAsGuest: () => void;
  initialMode?: 'login' | 'register' | 'complete-profile';
  pendingUser?: any;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onLoginSuccess,
  onBackToHome,
  onExploreAsGuest,
  initialMode = 'login',
  pendingUser = null,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'complete-profile'>(initialMode);
  const [authUser, setAuthUser] = useState<any>(pendingUser);

  // Campos de Credenciales
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Campos de Completación de Perfil
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [cityId, setCityId] = useState<number | ''>('');
  const [genderId, setGenderId] = useState<number | ''>('');
  const [ethnicityId, setEthnicityId] = useState<number | ''>('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // Listas de catálogo
  const [cities, setCities] = useState<City[]>([]);
  const [genders, setGenders] = useState<Gender[]>([]);
  const [ethnicities, setEthnicities] = useState<Ethnicity[]>([]);
  const [loadingTaxonomies, setLoadingTaxonomies] = useState(false);

  const [loading, setLoading] = useState(false);
  const [detectingGps, setDetectingGps] = useState(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Cargar catálogos cuando entra al modo de completar perfil
  useEffect(() => {
    if (authMode === 'complete-profile') {
      setLoadingTaxonomies(true);
      Promise.all([getCities(), getGenders(), getEthnicities()])
        .then(([cList, gList, eList]) => {
          setCities(cList);
          setGenders(gList);
          setEthnicities(eList);
        })
        .catch((err) => console.warn('Error loading taxonomies:', err))
        .finally(() => setLoadingTaxonomies(false));
    }
  }, [authMode]);

  // Si se cambia de ciudad y no hay GPS, colocar coordenadas de ciudad
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
            setGpsMessage(`Ubicación de referencia asignada para ${selected.name}`);
            break;
          }
        }
      }
    }
  };

  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      setErrorMessage('La geolocalización no está soportada por tu navegador.');
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
        setGpsMessage(`✓ Ubicación GPS detectada (${lat}, ${lng})`);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setDetectingGps(false);
        if (latitude === null || longitude === null) {
          setLatitude(12.1364);
          setLongitude(-86.2514);
          setGpsMessage('No se pudo leer el GPS. Se fijaron coordenadas referenciales de Managua.');
        } else {
          setGpsMessage('No se pudo acceder al GPS. Manteniendo ubicación previa.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const validateAuth = () => {
    setErrorMessage('');
    if (!email.trim()) {
      setErrorMessage('El correo electrónico es requerido.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Ingresa un formato de correo electrónico válido.');
      return false;
    }
    if (!password || password.length < 6) {
      setErrorMessage('La contraseña debe contener al menos 6 caracteres.');
      return false;
    }
    if (authMode === 'register' && password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return false;
    }
    return true;
  };

  const validateProfile = () => {
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
      setErrorMessage('El nombre completo debe tener al menos 3 caracteres.');
      return false;
    }
    if (!cleanPhone) {
      setErrorMessage('Ingresa un teléfono o WhatsApp de contacto.');
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

  const handleSubmitAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAuth()) return;

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (authMode === 'register') {
        const signUpRes = await signUp(email.trim().toLowerCase(), password);
        let userToUse = signUpRes?.user;

        // Intentar iniciar sesión de inmediato para tener el token y sesión activa
        if (!userToUse || !signUpRes?.session) {
          try {
            const loginRes = await signIn(email.trim().toLowerCase(), password);
            if (loginRes?.user) {
              userToUse = loginRes.user;
            }
          } catch {
            // Ignorar si aún requiere confirmación por email
          }
        }

        if (userToUse) {
          setAuthUser(userToUse);
          const suggestedUser = userToUse.email
            ? userToUse.email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_')
            : '';
          setUsername(suggestedUser);
          setSuccessMessage('¡Cuenta creada con éxito! Ahora completa tu perfil para activar el Trueque.');
          setAuthMode('complete-profile');
        } else {
          setSuccessMessage('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
          setAuthMode('login');
          setPassword('');
          setConfirmPassword('');
        }
      } else {
        const data = await signIn(email.trim().toLowerCase(), password);
        if (data?.user) {
          const profile = await getUserProfile(data.user.id);
          // Si el perfil no está completado, redirigir a completarlo
          if (!profile || !profile.profile_completed) {
            setAuthUser(data.user);
            if (profile) {
              setUsername(profile.username || '');
              setFullName(profile.full_name || '');
              setPhone(profile.phone || '');
              setCityId(profile.city_id || '');
              setGenderId(profile.gender_id || '');
              setEthnicityId(profile.ethnicity_id || '');
              setLatitude(profile.latitude ?? null);
              setLongitude(profile.longitude ?? null);
            } else {
              const suggested = data.user.email
                ? data.user.email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_')
                : '';
              setUsername(suggested);
            }
            setAuthMode('complete-profile');
            setSuccessMessage('Por favor completa los datos de tu perfil para continuar.');
            return;
          }

          onLoginSuccess(data.user, profile);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Ocurrió un error al procesar tu solicitud.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProfile()) return;

    if (!authUser?.id) {
      setErrorMessage('No hay una sesión activa de usuario. Por favor inicia sesión nuevamente.');
      setAuthMode('login');
      return;
    }

    setLoading(true);
    setErrorMessage('');

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
      const updatedProfile = await updateUserProfile(authUser.id, {
        username: username.trim().toLowerCase(),
        full_name: fullName.trim(),
        phone: phone.trim(),
        city_id: Number(cityId),
        gender_id: Number(genderId),
        ethnicity_id: Number(ethnicityId),
        latitude: finalLat,
        longitude: finalLng,
        email: authUser.email,
      });

      onLoginSuccess(authUser, updatedProfile);
    } catch (err: any) {
      console.error('Error saving profile in AuthPage:', err);
      if (err.message && (err.message.includes('unique') || err.message.includes('duplicate'))) {
        setErrorMessage('El nombre de usuario elegido ya está ocupado. Por favor ingresa otro.');
      } else {
        setErrorMessage(err.message || 'No se pudo guardar el perfil. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 relative">
      {/* Botón Volver a Inicio */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/80 hover:bg-white border border-slate-200/80 text-xs font-bold text-[#2C2C2C] shadow-xs backdrop-blur-md hover:border-[#EC006C]/40 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Inicio</span>
        </button>
      </div>

      <div className={`w-full ${authMode === 'complete-profile' ? 'max-w-lg' : 'max-w-md'} relative z-10 transition-all duration-300`}>
        {/* Tarjeta principal */}
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-9 shadow-2xl border border-white/90 relative overflow-hidden">
          {/* Orbes internos decorativos suaves */}
          <div
            className="absolute -right-16 -top-16 w-48 h-48 rounded-full blur-2xl opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #EC006C 0%, transparent 70%)' }}
          />
          <div
            className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full blur-2xl opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #4A198C 0%, transparent 70%)' }}
          />

          {/* Encabezado */}
          <div className="text-center mb-6 relative z-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white border border-slate-200/80 shadow-xs mb-3">
              <img
                src="/assets/liwa_color.png"
                alt="Liwa"
                className="w-10 h-10 object-contain"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#2C2C2C] tracking-tight">
              {authMode === 'complete-profile'
                ? 'Completa tu Perfil en Liwa'
                : authMode === 'register'
                ? 'Crear Cuenta en Liwa'
                : 'Bienvenido a Liwa'}
            </h1>
            <p className="text-xs text-[#2C2C2C]/70 mt-1.5 max-w-sm mx-auto leading-relaxed">
              {authMode === 'complete-profile'
                ? 'Para poder participar en trueques y comercio local, completa tu información'
                : authMode === 'register'
                ? 'Únete a la comunidad de comercio local y trueque inteligente'
                : 'Accede a tus publicaciones, mensajes y propuestas de trueque'}
            </p>
          </div>

          {/* Selector de Pestaña Unificada (Solo si no está en modo completar perfil) */}
          {authMode !== 'complete-profile' && (
            <div className="relative z-10 p-1 bg-slate-100/90 rounded-2xl flex items-center mb-6">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-white text-[#EC006C] shadow-sm font-black'
                    : 'text-[#2C2C2C]/70 hover:text-[#2C2C2C]'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Iniciar Sesión</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-white text-[#EC006C] shadow-sm font-black'
                    : 'text-[#2C2C2C]/70 hover:text-[#2C2C2C]'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Crear Cuenta</span>
              </button>
            </div>
          )}

          {/* Alertas */}
          {errorMessage && (
            <div className="relative z-10 mb-4 p-3.5 rounded-2xl bg-rose-50/90 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="relative z-10 mb-4 p-3.5 rounded-2xl bg-emerald-50/90 border border-[#7AAF00]/40 text-[#7AAF00] text-xs flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* FORMULARIO 1: LOGIN / REGISTRO */}
          {authMode !== 'complete-profile' && (
            <form onSubmit={handleSubmitAuth} className="relative z-10 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2C2C2C]/80 mb-1.5">
                  Correo Electrónico
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="w-full pl-11 pr-4 py-3 bg-white/95 border border-slate-200 focus:border-[#EC006C] focus:ring-3 focus:ring-[#EC006C]/20 rounded-2xl text-sm font-medium text-[#2C2C2C] transition-all outline-none"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2C2C2C]/80 mb-1.5">
                  Contraseña
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full pl-11 pr-11 py-3 bg-white/95 border border-slate-200 focus:border-[#EC006C] focus:ring-3 focus:ring-[#EC006C]/20 rounded-2xl text-sm font-medium text-[#2C2C2C] transition-all outline-none"
                    autoComplete={authMode === 'register' ? 'new-password' : 'current-password'}
                    required
                  />
                  <div className="absolute right-3">
                    <MorphEye
                      visible={showPassword}
                      onToggle={() => setShowPassword(!showPassword)}
                    />
                  </div>
                </div>
              </div>

              {authMode === 'register' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2C2C2C]/80 mb-1.5">
                    Confirmar Contraseña
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repite tu contraseña"
                      className="w-full pl-11 pr-11 py-3 bg-white/95 border border-slate-200 focus:border-[#EC006C] focus:ring-3 focus:ring-[#EC006C]/20 rounded-2xl text-sm font-medium text-[#2C2C2C] transition-all outline-none"
                      autoComplete="new-password"
                      required
                    />
                    <div className="absolute right-3">
                      <MorphEye
                        visible={showConfirmPassword}
                        onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#EC006C] via-[#E10067] to-[#4A198C] hover:opacity-95 text-white font-extrabold text-sm shadow-xl shadow-[#EC006C]/30 hover:shadow-[#EC006C]/40 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{authMode === 'register' ? 'Continuar y Completar Perfil' : 'Iniciar Sesión'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* FORMULARIO 2: COMPLETACIÓN DE PERFIL */}
          {authMode === 'complete-profile' && (
            <form onSubmit={handleSubmitProfile} className="relative z-10 space-y-4 animate-in fade-in duration-300">
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

              {/* Geolocalización / GPS */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2C2C2C]/80">
                      Ubicación para Trueques *
                    </label>
                    <p className="text-[10px] text-slate-400">
                      Ubicación para calcular cercanía comunitaria
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

              {/* Botón Guardar Perfil */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#EC006C] via-[#E10067] to-[#4A198C] hover:opacity-95 text-white font-extrabold text-sm shadow-xl shadow-[#EC006C]/30 hover:shadow-[#EC006C]/40 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Guardar y Entrar a Liwa</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Opciones Secundarias e Invitado */}
          {authMode !== 'complete-profile' && (
            <div className="relative z-10 mt-6 pt-5 border-t border-slate-200/80 flex flex-col gap-3">
              <button
                type="button"
                onClick={onExploreAsGuest}
                className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-[#2C2C2C] font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs hover:border-[#4A198C]/40"
              >
                <ShieldCheck className="w-4 h-4 text-[#4A198C]" />
                <span>Continuar explorando como invitado</span>
              </button>
            </div>
          )}
        </div>

        {/* Badge inferior de confianza */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-medium">
            <MorphSparkle className="w-3.5 h-3.5 text-[#7AAF00]" />
            <span>Tus datos están protegidos con encriptación comunitaria segura</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

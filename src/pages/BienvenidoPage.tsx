import React, { useState } from 'react';
import { signIn, signUp } from '@/lib/supabase';
import {
  Mail,
  Lock,
  ArrowRight,
  Compass,
  Repeat,
  MapPin,
  Sparkles,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface BienvenidoPageProps {
  onLoginSuccess: (user: any) => void;
  onExploreAsGuest: () => void;
  onNavigateToTab: (tab: 'explorar' | 'mapa' | 'trueque') => void;
}

export const BienvenidoPage: React.FC<BienvenidoPageProps> = ({
  onLoginSuccess,
  onExploreAsGuest,
  onNavigateToTab,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validate = () => {
    setErrorMessage('');
    if (!email.trim()) {
      setErrorMessage('El correo electrónico es requerido.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Ingresa un formato de correo válido.');
      return false;
    }
    if (!password || password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (isRegister) {
        await signUp(email.trim().toLowerCase(), password);
        setSuccessMessage('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
        setIsRegister(false);
      } else {
        const data = await signIn(email.trim().toLowerCase(), password);
        if (data?.user) {
          onLoginSuccess(data.user);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Ocurrió un error al procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Brand Hero & Value Proposition */}
        <div className="lg:col-span-7 space-y-8">
          {/* Badge superior con desenfoque e insignia Magenta */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/80 border border-[#EC006C]/30 text-[#EC006C] text-xs font-bold uppercase tracking-wider shadow-xs backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#EC006C] animate-pulse"></span>
            <Sparkles className="w-3.5 h-3.5" />
            <span>La nueva forma de intercambiar y comerciar</span>
          </div>

          {/* Gran titular con degradado desvaneciente Morado -> Magenta */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#2C2C2C] tracking-tight leading-[1.12]">
              Tu mercado local de confianza en{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[#4A198C] via-[#EC006C] to-[#EC006C] bg-clip-text text-transparent">
                  Liwa
                </span>
                <span className="absolute -bottom-1 left-0 w-full h-2.5 bg-gradient-to-r from-[#4A198C]/30 via-[#EC006C]/40 to-[#7AAF00]/40 rounded-full blur-[2px] -z-10"></span>
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-[#2C2C2C]/80 max-w-2xl leading-relaxed">
              Explora productos cercanos, ubica vendedores en el mapa en tiempo real y realiza{' '}
              <strong className="text-[#4A198C] font-extrabold underline decoration-[#7AAF00] decoration-2 underline-offset-4">
                trueques inteligentes
              </strong>{' '}
              valorando tus artículos con absoluta justicia y equidad comunitaria.
            </p>
          </div>

          {/* Tarjetas de Acceso Rápido (3 colores de la paleta oficial) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* 1. Explorar -> Color: Magenta (#EC006C) */}
            <div
              onClick={() => onNavigateToTab('explorar')}
              className="group relative p-5 rounded-3xl bg-white/80 hover:bg-white border border-white/80 hover:border-[#EC006C]/40 shadow-soft hover:shadow-card-hover backdrop-blur-xl transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#EC006C]"></div>
              <div className="w-11 h-11 rounded-2xl bg-[#EC006C] text-white flex items-center justify-center mb-3 shadow-md shadow-[#EC006C]/25 group-hover:scale-110 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#2C2C2C] group-hover:text-[#EC006C] text-sm flex items-center justify-between transition-colors">
                <span>Explorar</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#EC006C]" />
              </h3>
              <p className="text-xs text-[#2C2C2C]/65 mt-1.5 leading-normal">
                Catálogo de productos, filtros y ofertas en córdobas.
              </p>
            </div>

            {/* 2. Explorar Mapa -> Color: Morado (#4A198C) */}
            <div
              onClick={() => onNavigateToTab('mapa')}
              className="group relative p-5 rounded-3xl bg-white/80 hover:bg-white border border-white/80 hover:border-[#4A198C]/40 shadow-soft hover:shadow-card-hover backdrop-blur-xl transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#4A198C]"></div>
              <div className="w-11 h-11 rounded-2xl bg-[#4A198C] text-white flex items-center justify-center mb-3 shadow-md shadow-[#4A198C]/25 group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#2C2C2C] group-hover:text-[#4A198C] text-sm flex items-center justify-between transition-colors">
                <span>Mapa Vendedores</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#4A198C]" />
              </h3>
              <p className="text-xs text-[#2C2C2C]/65 mt-1.5 leading-normal">
                Ubica negocios locales y contacta por WhatsApp.
              </p>
            </div>

            {/* 3. Trueque ECO -> Color: Verde (#7AAF00) */}
            <div
              onClick={() => onNavigateToTab('trueque')}
              className="group relative p-5 rounded-3xl bg-white/80 hover:bg-white border border-white/80 hover:border-[#7AAF00]/40 shadow-soft hover:shadow-card-hover backdrop-blur-xl transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#7AAF00]"></div>
              <div className="w-11 h-11 rounded-2xl bg-[#7AAF00] text-white flex items-center justify-center mb-3 shadow-md shadow-[#7AAF00]/25 group-hover:scale-110 transition-transform">
                <Repeat className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#2C2C2C] group-hover:text-[#7AAF00] text-sm flex items-center justify-between transition-colors">
                <span>Trueque Inteligente</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#7AAF00]" />
              </h3>
              <p className="text-xs text-[#2C2C2C]/65 mt-1.5 leading-normal">
                Intercambia valor por valor con comparador en tiempo real.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Tarjeta Glassmorphic con desenfoque (Blur) y degradados */}
        <div className="lg:col-span-5">
          <div className="relative bg-white/85 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/90 overflow-hidden">
            {/* Orbes internos de desenfoque decorativo con la paleta oficial */}
            <div
              className="absolute -right-12 -top-12 w-48 h-48 rounded-full blur-2xl opacity-20 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #EC006C 0%, transparent 70%)' }}
            />
            <div
              className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full blur-2xl opacity-20 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #4A198C 0%, transparent 70%)' }}
            />

            <div className="relative z-10 flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-[#2C2C2C] tracking-tight">
                  {isRegister ? 'Crear Cuenta' : 'Bienvenido'}
                </h2>
                <p className="text-xs text-[#2C2C2C]/70 mt-1">
                  {isRegister
                    ? 'Regístrate para publicar y proponer trueques'
                    : 'Inicia sesión para continuar en Liwa'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center p-2 shadow-xs">
                <img
                  src="/assets/liwa_color.png"
                  alt="Liwa"
                  className="w-full h-full object-contain"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </div>
            </div>

            {errorMessage && (
              <div className="relative z-10 mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="relative z-10 mb-4 p-3.5 rounded-xl bg-emerald-50 border border-[#7AAF00]/40 text-[#7AAF00] text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
              {/* Email */}
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
                    placeholder="correo@ejemplo.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-white/90 border border-slate-200/90 focus:border-[#EC006C] focus:bg-white focus:ring-3 focus:ring-[#EC006C]/20 rounded-2xl text-sm font-medium text-[#2C2C2C] transition-all outline-none"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
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
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3.5 bg-white/90 border border-slate-200/90 focus:border-[#EC006C] focus:bg-white focus:ring-3 focus:ring-[#EC006C]/20 rounded-2xl text-sm font-medium text-[#2C2C2C] transition-all outline-none"
                    autoComplete={isRegister ? 'new-password' : 'current-password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-slate-400 hover:text-[#EC006C] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Botón Principal: Sólido + Desvaneciente (Gris/Morado/Magenta) */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#EC006C] via-[#E10067] to-[#4A198C] hover:opacity-95 text-white font-extrabold text-sm shadow-xl shadow-[#EC006C]/30 hover:shadow-[#EC006C]/45 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                <span>
                  {loading
                    ? 'Procesando...'
                    : isRegister
                    ? 'Crear Cuenta'
                    : 'Iniciar Sesión'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Acceso como invitado */}
            <div className="relative z-10 mt-6 pt-6 border-t border-slate-200/70 flex flex-col gap-3">
              <button
                type="button"
                onClick={onExploreAsGuest}
                className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-[#2C2C2C] font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs hover:border-[#4A198C]/40"
              >
                <Compass className="w-4 h-4 text-[#4A198C]" />
                <span>Explorar la plataforma como invitado</span>
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="text-xs text-slate-500 hover:text-[#EC006C] font-semibold transition-colors cursor-pointer"
                >
                  {isRegister
                    ? '¿Ya tienes una cuenta? Inicia sesión aquí'
                    : '¿No tienes una cuenta aún? Regístrate gratis'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

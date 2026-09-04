import React, { useState } from 'react';
import { signIn, signUp } from '@/lib/supabase';
import {
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
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
        const data = await signUp(email.trim().toLowerCase(), password);
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
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Brand Hero & Value Proposition */}
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EC006C]/10 text-[#EC006C] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>La nueva forma de intercambiar y comerciar</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Tu mercado local de confianza en{' '}
              <span className="text-[#EC006C] relative inline-block">
                Liwa
                <span className="absolute bottom-1.5 left-0 w-full h-3 bg-[#EC006C]/15 -z-10 rounded-sm"></span>
              </span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
              Explora productos cercanos, ubica vendedores en el mapa en tiempo real y realiza
              <strong> trueques inteligentes</strong> valorando tus artículos con justicia y equidad.
            </p>
          </div>

          {/* Quick Access Feature Cards (Aligned with Navigation Order) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* 1. Explorar */}
            <div
              onClick={() => onNavigateToTab('explorar')}
              className="p-4 rounded-2xl bg-white border border-slate-100 shadow-soft hover:shadow-card-hover hover:border-[#EC006C]/30 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EC006C]/10 text-[#EC006C] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm flex items-center justify-between">
                <span>Explorar</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#EC006C]" />
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Catálogo de productos, filtros y ofertas en córdobas.
              </p>
            </div>

            {/* 2. Explorar Mapa */}
            <div
              onClick={() => onNavigateToTab('mapa')}
              className="p-4 rounded-2xl bg-white border border-slate-100 shadow-soft hover:shadow-card-hover hover:border-[#C89211]/30 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#C89211]/15 text-[#C89211] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm flex items-center justify-between">
                <span>Mapa Vendedores</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#C89211]" />
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Ubica negocios locales y contacta por WhatsApp.
              </p>
            </div>

            {/* 3. Trueque */}
            <div
              onClick={() => onNavigateToTab('trueque')}
              className="p-4 rounded-2xl bg-white border border-slate-100 shadow-soft hover:shadow-card-hover hover:border-[#72A619]/30 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#72A619]/15 text-[#72A619] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Repeat className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm flex items-center justify-between">
                <span>Trueque Inteligente</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#72A619]" />
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Intercambia valor por valor con comparador en tiempo real.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Neumorphic / Soft Raised Auth Card */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-100/80 backdrop-blur-md relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#EC006C]/5 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {isRegister ? 'Crear Cuenta' : 'Bienvenido'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {isRegister
                    ? 'Regístrate para publicar y proponer trueques'
                    : 'Inicia sesión para continuar en Liwa'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 shadow-xs">
                <img
                  src="/assets/liwa_color.png"
                  alt="Liwa"
                  className="w-full h-full object-contain"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Correo Electrónico
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-[#EC006C] focus:bg-white focus:ring-2 focus:ring-[#EC006C]/20 rounded-2xl text-sm font-medium text-slate-800 transition-all outline-none"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Contraseña
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3.5 bg-slate-50 border border-slate-200 focus:border-[#EC006C] focus:bg-white focus:ring-2 focus:ring-[#EC006C]/20 rounded-2xl text-sm font-medium text-slate-800 transition-all outline-none"
                    autoComplete={isRegister ? 'new-password' : 'current-password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-[#EC006C] hover:bg-[#D80064] text-white font-bold text-sm shadow-lg shadow-[#EC006C]/25 transition-all cursor-pointer hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-2"
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

            {/* Quick Guest exploration shortcut */}
            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-3">
              <button
                type="button"
                onClick={onExploreAsGuest}
                className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 text-slate-500" />
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

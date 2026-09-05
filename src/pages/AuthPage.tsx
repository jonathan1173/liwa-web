import React, { useState } from 'react';
import { signIn, signUp } from '@/lib/supabase';
import { Mail, Lock, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2, Sparkles, UserPlus, LogIn, ShieldCheck } from 'lucide-react';
import { MorphEye, MorphSparkle } from '@/components/common/MorphIcon';

interface AuthPageProps {
  onLoginSuccess: (user: any) => void;
  onBackToHome: () => void;
  onExploreAsGuest: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onLoginSuccess,
  onBackToHome,
  onExploreAsGuest,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const isRegister = authMode === 'register';

  const validate = () => {
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
    if (isRegister && password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
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
        setSuccessMessage('¡Cuenta creada con éxito! Ahora puedes iniciar sesión con tus credenciales.');
        setAuthMode('login');
        setPassword('');
        setConfirmPassword('');
      } else {
        const data = await signIn(email.trim().toLowerCase(), password);
        if (data?.user) {
          onLoginSuccess(data.user);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Ocurrió un error al procesar tu solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
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

      <div className="w-full max-w-md relative z-10">
        {/* Tarjeta principal con eufemismo suave y bordes orgánicos */}
        <div className="bg-white/85 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/90 relative overflow-hidden">
          {/* Orbes internos decorativos suaves */}
          <div
            className="absolute -right-16 -top-16 w-48 h-48 rounded-full blur-2xl opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #EC006C 0%, transparent 70%)' }}
          />
          <div
            className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full blur-2xl opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #4A198C 0%, transparent 70%)' }}
          />

          {/* Encabezado de Marca */}
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
              {isRegister ? 'Crear Cuenta en Liwa' : 'Bienvenido a Liwa'}
            </h1>
            <p className="text-xs text-[#2C2C2C]/70 mt-1.5 max-w-xs mx-auto leading-relaxed">
              {isRegister
                ? 'Únete a la comunidad de comercio local y trueque inteligente'
                : 'Accede a tus publicaciones, mensajes y propuestas de trueque'}
            </p>
          </div>

          {/* Selector de Pestaña Unificada (Flowbite Tabs Style) */}
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

          {/* Alertas de Notificación suaves */}
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

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
            {/* Campo: Correo */}
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

            {/* Campo: Contraseña */}
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
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
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

            {/* Campo adicional: Confirmar Contraseña para registro */}
            {isRegister && (
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

            {/* Botón de Envío con degradado suave oficial */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#EC006C] via-[#E10067] to-[#4A198C] hover:opacity-95 text-white font-extrabold text-sm shadow-xl shadow-[#EC006C]/30 hover:shadow-[#EC006C]/40 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isRegister ? 'Registrarme en Liwa' : 'Iniciar Sesión'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Opciones Secundarias e Invitado */}
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

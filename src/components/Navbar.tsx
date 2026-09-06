import React, { useState } from 'react';
import { LogIn, LogOut, Sparkles } from 'lucide-react';
import {
  HamburgerMorphIcon,
  MorphSparkle,
  MorphCompass,
  MorphPin,
  MorphBarter,
} from '@/components/common/MorphIcon';

export type NavTab = 'bienvenido' | 'explorar' | 'mapa' | 'trueque' | 'auth';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  user: any;
  onOpenLoginModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  user,
  onOpenLoginModal,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getInitials = (userObj: any) => {
    if (!userObj) return 'JD';
    const email = userObj.email || '';
    return email.slice(0, 2).toUpperCase() || 'JD';
  };

  const navItems = [
    {
      id: 'bienvenido' as NavTab,
      label: 'Bienvenido',
      renderIcon: (active: boolean) => <MorphSparkle active={active} className="w-4 h-4 text-[#EC006C]" />,
      activeClass: 'text-[#EC006C] border-[#EC006C] bg-[#EC006C]/10 shadow-xs shadow-[#EC006C]/10',
    },
    {
      id: 'explorar' as NavTab,
      label: 'Explorar',
      renderIcon: (active: boolean) => <MorphCompass active={active} className="w-4 h-4 text-[#EC006C]" />,
      activeClass: 'text-[#EC006C] border-[#EC006C] bg-[#EC006C]/10 shadow-xs shadow-[#EC006C]/10',
    },
    {
      id: 'mapa' as NavTab,
      label: 'Mapa',
      renderIcon: (active: boolean) => <MorphPin active={active} className="w-4 h-4 text-[#4A198C]" />,
      activeClass: 'text-[#4A198C] border-[#4A198C] bg-[#4A198C]/10 shadow-xs shadow-[#4A198C]/10',
    },
    {
      id: 'trueque' as NavTab,
      label: 'Trueque',
      renderIcon: (active: boolean) => <MorphBarter active={active} className="w-4 h-4 text-[#7AAF00]" />,
      activeClass: 'text-[#7AAF00] border-[#7AAF00] bg-[#7AAF00]/10 shadow-xs shadow-[#7AAF00]/10',
    },
  ];

  const handleTabClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-slate-200/70 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleTabClick('bienvenido')}
          >
            <img
              src="/assets/liwa_color.png"
              alt="Liwa"
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-[#2C2C2C] flex items-center gap-1">
                Liwa
              </span>
              <span className="text-xs text-slate-400 font-medium -mt-1 hidden sm:block">
                Tu mercado de confianza
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border cursor-pointer ${
                    isActive
                      ? `${item.activeClass} font-bold`
                      : 'text-[#2C2C2C]/70 border-transparent hover:bg-slate-100/80 hover:text-[#2C2C2C]'
                  }`}
                >
                  {item.renderIcon(isActive)}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Desktop Right Side: User State or Login CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <div className="flex items-center gap-2.5 bg-white/90 py-1.5 px-3.5 rounded-full border border-slate-200/90 shadow-2xs">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#EC006C] to-[#4A198C] text-white flex items-center justify-center font-black text-xs shadow-xs">
                    {getInitials(user)}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-[#2C2C2C] truncate max-w-[120px]">
                      {user.email?.split('@')[0]}
                    </p>
                    <p className="text-[10px] text-[#7AAF00] font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7AAF00] animate-pulse"></span>
                      En línea
                    </p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="text-xs font-semibold text-slate-500 hover:text-[#EC006C] transition-colors px-3 py-2 hover:bg-[#EC006C]/10 rounded-xl cursor-pointer"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleTabClick('auth')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#EC006C] via-[#E10067] to-[#4A198C] hover:opacity-95 text-white shadow-md shadow-[#EC006C]/25 hover:shadow-lg hover:shadow-[#EC006C]/35 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Ingresar</span>
              </button>
            )}
          </div>

          {/* Mobile/Tablet Hamburger Morph Button (active at 768px and below) */}
          <div className="flex items-center gap-2 lg:hidden">
            {!user && (
              <button
                onClick={() => handleTabClick('auth')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#EC006C] text-white shadow-xs cursor-pointer"
              >
                Ingresar
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-2xl bg-white/90 border border-slate-200/90 text-[#2C2C2C] hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
              aria-label="Abrir menú de navegación"
              aria-expanded={mobileMenuOpen}
            >
              <HamburgerMorphIcon isOpen={mobileMenuOpen} className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Drawer / Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer border ${
                    isActive
                      ? `${item.activeClass} font-bold`
                      : 'text-[#2C2C2C] border-transparent hover:bg-slate-100/70'
                  }`}
                >
                  {item.renderIcon(isActive)}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile User Profile Section */}
          <div className="pt-4 mt-3 border-t border-slate-200/80">
            {user ? (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#EC006C] to-[#4A198C] text-white flex items-center justify-center font-black text-xs shadow-xs">
                    {getInitials(user)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#2C2C2C]">{user.email}</p>
                    <p className="text-[10px] text-[#7AAF00] font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7AAF00]"></span>
                      Conectado
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                >
                  Salir
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleTabClick('auth')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-bold bg-gradient-to-r from-[#EC006C] via-[#E10067] to-[#4A198C] text-white shadow-md shadow-[#EC006C]/25 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Iniciar Sesión / Registrarse</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

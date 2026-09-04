import React from 'react';
import { Compass, MapPin, Repeat, LogIn, Sparkles } from 'lucide-react';

export type NavTab = 'bienvenido' | 'explorar' | 'mapa' | 'trueque';

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
  const getInitials = (userObj: any) => {
    if (!userObj) return 'JD';
    const email = userObj.email || '';
    return email.slice(0, 2).toUpperCase() || 'JD';
  };

  const navItems = [
    {
      id: 'bienvenido' as NavTab,
      label: 'Bienvenido',
      icon: Sparkles,
      color: 'hover:text-[#EC006C]',
      activeClass: 'text-[#EC006C] border-[#EC006C] bg-[#EC006C]/10 shadow-xs shadow-[#EC006C]/10',
    },
    {
      id: 'explorar' as NavTab,
      label: 'Explorar',
      icon: Compass,
      color: 'hover:text-[#EC006C]',
      activeClass: 'text-[#EC006C] border-[#EC006C] bg-[#EC006C]/10 shadow-xs shadow-[#EC006C]/10',
    },
    {
      id: 'mapa' as NavTab,
      label: 'Explorar Mapa',
      icon: MapPin,
      color: 'hover:text-[#4A198C]',
      activeClass: 'text-[#4A198C] border-[#4A198C] bg-[#4A198C]/10 shadow-xs shadow-[#4A198C]/10',
    },
    {
      id: 'trueque' as NavTab,
      label: 'Trueque ECO',
      icon: Repeat,
      color: 'hover:text-[#7AAF00]',
      activeClass: 'text-[#7AAF00] border-[#7AAF00] bg-[#7AAF00]/10 shadow-xs shadow-[#7AAF00]/10',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-slate-200/70 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onSelectTab('bienvenido')}
          >
            <img
              src="/assets/liwa_color.png"
              alt="Liwa"
              className="h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-[#2C2C2C] flex items-center gap-1">
                Liwa
                <span className="inline-block w-2 h-2 rounded-full bg-[#EC006C]"></span>
              </span>
              <span className="text-xs text-slate-400 font-medium -mt-1 hidden sm:block">
                Tu mercado de confianza
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                    isActive
                      ? `${item.activeClass} font-bold`
                      : 'text-[#2C2C2C]/70 border-transparent hover:bg-slate-100/80 hover:text-[#2C2C2C]'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110' : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Account / Login State */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <div className="flex items-center gap-2.5 bg-white/80 py-1.5 px-3 rounded-full border border-slate-200 shadow-xs">
                  <div className="w-8 h-8 rounded-full bg-linear-to-r from-[#EC006C] to-[#4A198C] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {getInitials(user)}
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-xs font-bold text-[#2C2C2C] truncate max-w-[120px]">
                      {user.email?.split('@')[0]}
                    </p>
                    <p className="text-[10px] text-[#7AAF00] font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7AAF00]"></span>
                      En línea
                    </p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="text-xs font-medium text-slate-500 hover:text-[#EC006C] transition-colors px-2 py-1 hover:bg-[#EC006C]/10 rounded-lg"
                >
                  Salir
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-linear-to-r from-[#EC006C] to-[#D80064] hover:to-[#4A198C] text-white shadow-md shadow-[#EC006C]/25 hover:shadow-lg hover:shadow-[#EC006C]/35 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Ingresar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

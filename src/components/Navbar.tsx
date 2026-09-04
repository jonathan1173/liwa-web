import React from 'react';
import { Compass, MapPin, Repeat, LogIn, User, Sparkles } from 'lucide-react';

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
      activeClass: 'text-[#EC006C] border-[#EC006C] bg-[#EC006C]/5',
    },
    {
      id: 'explorar' as NavTab,
      label: 'Explorar',
      icon: Compass,
      color: 'hover:text-[#EC006C]',
      activeClass: 'text-[#EC006C] border-[#EC006C] bg-[#EC006C]/5',
    },
    {
      id: 'mapa' as NavTab,
      label: 'Explorar Mapa',
      icon: MapPin,
      color: 'hover:text-[#C89211]',
      activeClass: 'text-[#C89211] border-[#C89211] bg-[#C89211]/10',
    },
    {
      id: 'trueque' as NavTab,
      label: 'Trueque',
      icon: Repeat,
      color: 'hover:text-[#72A619]',
      activeClass: 'text-[#72A619] border-[#72A619] bg-[#72A619]/10',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
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
                // Fallback to text if image not found
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-slate-800 flex items-center gap-1">
                Liwa
                <span className="h-2 w-2 rounded-full bg-[#EC006C]"></span>
              </span>
              <span className="text-xs text-slate-400 font-medium -mt-1 hidden sm:block">
                Tu mercado de confianza
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links (Following requested navigation order) */}
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
                      ? `${item.activeClass} shadow-xs font-bold`
                      : 'text-slate-600 border-transparent hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'scale-110' : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Account / Login State */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <div className="flex items-center gap-2.5 bg-slate-50 py-1.5 px-3 rounded-full border border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-[#EC006C] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {getInitials(user)}
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-xs font-bold text-slate-800 truncate max-w-[120px]">
                      {user.email?.split('@')[0]}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      En línea
                    </p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors px-2 py-1 hover:bg-rose-50 rounded-lg"
                >
                  Salir
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-[#EC006C] text-white hover:bg-[#D80064] shadow-md shadow-[#EC006C]/20 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
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

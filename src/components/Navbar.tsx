import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  HamburgerMorphIcon,
  MorphHome,
  MorphCompass,
  MorphPin,
  MorphBarter,
  AnimatedLogIn,
  AnimatedLogOut,
} from '@/components/common/MorphIcon';

export type NavTab = 'home' | 'explorar' | 'mapa' | 'trueque' | 'auth';

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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );

  // Monitor desktop vs mobile viewport breakpoint
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && drawerOpen) {
        setDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const getInitials = (userObj: any) => {
    if (!userObj) return 'JD';
    const email = userObj.email || '';
    return email.slice(0, 2).toUpperCase() || 'JD';
  };

  const navItems = [
    {
      id: 'home' as NavTab,
      label: 'Inicio',
      renderIcon: (active: boolean) => (
        <MorphHome active={active} size={20} color={active ? '#EC006C' : '#2C2C2C'} />
      ),
      activeClass: 'text-[#EC006C] border-[#EC006C]/30 bg-[#EC006C]/10 shadow-xs shadow-[#EC006C]/10',
    },
    {
      id: 'explorar' as NavTab,
      label: 'Explorar',
      renderIcon: (active: boolean) => (
        <MorphCompass active={active} size={20} color={active ? '#EC006C' : '#2C2C2C'} />
      ),
      activeClass: 'text-[#EC006C] border-[#EC006C]/30 bg-[#EC006C]/10 shadow-xs shadow-[#EC006C]/10',
    },
    {
      id: 'mapa' as NavTab,
      label: 'Mapa',
      renderIcon: (active: boolean) => (
        <MorphPin active={active} size={20} color={active ? '#4A198C' : '#2C2C2C'} />
      ),
      activeClass: 'text-[#4A198C] border-[#4A198C]/30 bg-[#4A198C]/10 shadow-xs shadow-[#4A198C]/10',
    },
    {
      id: 'trueque' as NavTab,
      label: 'Trueque',
      renderIcon: (active: boolean) => (
        <MorphBarter active={active} size={20} color={active ? '#7AAF00' : '#2C2C2C'} />
      ),
      activeClass: 'text-[#7AAF00] border-[#7AAF00]/30 bg-[#7AAF00]/10 shadow-xs shadow-[#7AAF00]/10',
    },
  ];

  const handleTabClick = (tab: NavTab) => {
    onSelectTab(tab);
    setDrawerOpen(false);
  };

  return (
    <>
      <header className=" top-0 z-40 w-full bg-white/85 backdrop-blur-xl border-b border-slate-200/70 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left Section:
                - On Desktop: Hamburger button to open left panel + Liwa Brand Logo
                - On Mobile: Liwa Brand Logo
            */}
            <div className="flex items-center gap-3">
              {/* Desktop Menu Trigger (opens left panel) */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="hidden lg:flex p-2.5 rounded-2xl bg-white/90 border border-slate-200/90 text-[#2C2C2C] hover:bg-slate-100/80 transition-all shadow-2xs hover:scale-105 cursor-pointer items-center justify-center group"
                aria-label="Abrir panel lateral de navegación"
                title="Abrir menú"
              >
                <HamburgerMorphIcon isOpen={drawerOpen} className="w-5 h-5" />
              </button>

              {/* Brand Logo */}
              <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => handleTabClick('home')}
              >
                <img
                  src="/assets/liwa_nombre.png"
                  alt="Liwa"
                  className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
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
                    </div>
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-2 text-slate-500 hover:text-[#EC006C] hover:bg-[#EC006C]/10 rounded-xl transition-colors cursor-pointer"
                    title="Cerrar sesión"
                  >
                    <AnimatedLogOut size={18} color="#e11d48" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleTabClick('auth')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#EC006C] via-[#E10067] to-[#4A198C] hover:opacity-95 text-white shadow-md shadow-[#EC006C]/25 hover:shadow-lg hover:shadow-[#EC006C]/35 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                >
                  <AnimatedLogIn size={18} color="#ffffff" />
                  <span>Ingresar</span>
                </button>
              )}
            </div>

            {/* Mobile Right Side: Hamburger Button (active at < lg) */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setDrawerOpen(true)}
                className="p-2.5 rounded-2xl bg-white/90 border border-slate-200/90 text-[#2C2C2C] hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                aria-label="Abrir menú de navegación"
                aria-expanded={drawerOpen}
              >
                <HamburgerMorphIcon isOpen={drawerOpen} className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Off-Canvas Navigation Drawer (Never displaces page content) */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop Overlay with blur */}
            <motion.div
              key="nav-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs cursor-pointer"
              aria-hidden="true"
            />

            {/* Drawer Panel:
                - On Desktop: slides out from LEFT
                - On Mobile: slides out from RIGHT
            */}
            <motion.aside
              key="nav-drawer-panel"
              initial={{ x: isDesktop ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isDesktop ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              className={`fixed top-0 bottom-0 z-50 w-[84vw] max-w-80 sm:w-80 bg-white/95 backdrop-blur-2xl shadow-2xl flex flex-col justify-between p-5 sm:p-6 select-none ${
                isDesktop
                  ? 'left-0 border-r border-slate-200/90'
                  : 'right-0 border-l border-slate-200/90'
              }`}
              role="dialog"
              aria-modal="true"
              aria-label="Panel de navegación Liwa"
            >
              {/* Drawer Top Header */}
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div
                    className="flex items-center gap-2.5 cursor-pointer group"
                    onClick={() => handleTabClick('home')}
                  >
                    <img
                      src="/assets/liwa_nombre.png"
                      alt="Liwa"
                      className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-[#2C2C2C] hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Cerrar menú"
                    aria-label="Cerrar menú"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation Items (Instagram-style vertical stack) */}
                <nav className="mt-6 space-y-1.5">
                  {navItems.map((item) => {
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTabClick(item.id)}
                        className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-base font-semibold transition-all duration-200 cursor-pointer text-left border ${
                          isActive
                            ? 'bg-[#EC006C]/10 text-[#EC006C] border-[#EC006C]/25 font-bold shadow-xs shadow-[#EC006C]/10'
                            : 'text-[#2C2C2C]/80 border-transparent hover:bg-slate-100/80 hover:text-[#2C2C2C]'
                        }`}
                      >
                        <span className="flex-shrink-0">{item.renderIcon(isActive)}</span>
                        <span className="truncate">{item.label}</span>
                        {isActive && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#EC006C]" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer Bottom Section: User Profile or Login CTA */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                {user ? (
                  <div className="p-3 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#EC006C] to-[#4A198C] text-white flex items-center justify-center font-black text-xs shadow-xs flex-shrink-0">
                        {getInitials(user)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#2C2C2C] truncate">
                          {user.email?.split('@')[0]}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onLogout();
                        setDrawerOpen(false);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer flex-shrink-0"
                      title="Cerrar sesión"
                    >
                      <AnimatedLogOut size={16} color="#e11d48" isAnimated />
                      <span>Salir</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleTabClick('auth')}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl text-sm font-bold bg-gradient-to-r from-[#EC006C] via-[#E10067] to-[#4A198C] hover:opacity-95 text-white shadow-md shadow-[#EC006C]/25 hover:shadow-lg hover:shadow-[#EC006C]/35 transition-all cursor-pointer"
                  >
                    <AnimatedLogIn size={18} color="#ffffff" isAnimated />
                    <span>Iniciar Sesión / Registrarse</span>
                  </button>
                )}

                <div className="text-center pt-1">
                  <p className="text-[11px] text-slate-400 font-medium">
                    Liwa • Tu mercado de confianza
                  </p>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

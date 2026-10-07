import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  HamburgerMorphIcon,
  MorphHome,
  MorphCompass,
  MorphPin,
  MorphBarter,
  MorphBook,
  AnimatedLogIn,
  AnimatedLogOut,
} from '@/components/common/MorphIcon';

export type NavTab = 'home' | 'explorar' | 'mapa' | 'trueque' | 'biblioteca' | 'auth';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  user: any;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  onGoToApk?: () => void;
  isApkActive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  user,
  onLogout,
  onGoToApk,
  isApkActive,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

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
      description: 'Página principal y destacados',
      renderIcon: (active: boolean) => (
        <MorphHome active={active} size={20} color={active ? '#EC006C' : '#2C2C2C'} />
      ),
      activeClass: 'text-[#EC006C] border-[#EC006C]/30 bg-[#EC006C]/10 shadow-xs shadow-[#EC006C]/10',
      dotColor: '#EC006C',
    },
    {
      id: 'explorar' as NavTab,
      label: 'Explorar',
      description: 'Catálogo de productos comunitarios',
      renderIcon: (active: boolean) => (
        <MorphCompass active={active} size={20} color={active ? '#EC006C' : '#2C2C2C'} />
      ),
      activeClass: 'text-[#EC006C] border-[#EC006C]/30 bg-[#EC006C]/10 shadow-xs shadow-[#EC006C]/10',
      dotColor: '#EC006C',
    },
    {
      id: 'mapa' as NavTab,
      label: 'Mapa',
      description: 'Ubicaciones de vendedores locales',
      renderIcon: (active: boolean) => (
        <MorphPin active={active} size={20} color={active ? '#4A198C' : '#2C2C2C'} />
      ),
      activeClass: 'text-[#4A198C] border-[#4A198C]/30 bg-[#4A198C]/10 shadow-xs shadow-[#4A198C]/10',
      dotColor: '#4A198C',
    },
    {
      id: 'trueque' as NavTab,
      label: 'Trueque',
      description: 'Intercambio directo y sostenible',
      renderIcon: (active: boolean) => (
        <MorphBarter active={active} size={20} color={active ? '#7AAF00' : '#2C2C2C'} />
      ),
      activeClass: 'text-[#7AAF00] border-[#7AAF00]/30 bg-[#7AAF00]/10 shadow-xs shadow-[#7AAF00]/10',
      dotColor: '#7AAF00',
    },
    {
      id: 'biblioteca' as NavTab,
      label: 'Biblioteca',
      description: 'Libros y lecturas digitales comunitarias',
      badge: '',
      renderIcon: (active: boolean) => (
        <MorphBook active={active} size={20} color={active ? '#4A198C' : '#2C2C2C'} />
      ),
      activeClass: 'text-[#4A198C] border-[#4A198C]/30 bg-[#4A198C]/10 shadow-xs shadow-[#4A198C]/10',
      dotColor: '#4A198C',
    },
  ];

  const handleTabClick = (tab: NavTab) => {
    onSelectTab(tab);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* Top Navbar Header: Clean and unified for desktop and mobile */}
      <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-xl border-b border-slate-200/70 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left Section: Unified Hamburger button + Liwa Brand Logo */}
            <div className="flex items-center gap-3">
              {/* Universal Hamburger button for ALL screens */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="flex items-center gap-2 p-2.5 sm:px-3.5 sm:py-2.5 rounded-2xl bg-white/95 border border-slate-200/90 text-[#2C2C2C] hover:bg-slate-100/90 transition-all shadow-2xs hover:scale-105 cursor-pointer group"
                aria-label="Abrir menú de navegación"
                title="Menú de navegación"
              >
                <HamburgerMorphIcon isOpen={drawerOpen} className="w-5 h-5" />
               
              </button>

              {/* Brand Logo */}
              <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => handleTabClick('home')}
                title="Ir a Inicio"
              >
                <img
                  src="/assets/liwa_nombre.png"
                  alt="Liwa"
                  className="h-6 sm:h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>

            {/* Right Section: Descargar APK + User / Login */}
            <div className="flex items-center gap-2 sm:gap-3">
           

              {user ? (
                <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-slate-200">
                  <div className="flex items-center gap-2 bg-white/90 py-1 sm:py-1.5 px-2.5 sm:px-3.5 rounded-full border border-slate-200/90 shadow-2xs">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-[#EC006C] to-[#4A198C] text-white flex items-center justify-center font-black text-xs shadow-xs">
                      {getInitials(user)}
                    </div>
                    <div className="text-left hidden sm:block">
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
                  className="flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-[#EC006C] via-[#E10067] to-[#4A198C] hover:opacity-95 text-white shadow-md shadow-[#EC006C]/25 hover:shadow-lg hover:shadow-[#EC006C]/35 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                >
                  <AnimatedLogIn size={16} color="#ffffff" />
                  <span>Ingresar</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Off-Canvas Navigation Drawer (General para Desktop y Móvil) */}
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

            {/* Drawer Panel: Slides in from the LEFT on both desktop and mobile */}
            <motion.aside
              key="nav-drawer-panel"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed top-0 bottom-0 left-0 z-50 w-[86vw] max-w-84 sm:w-84 bg-white/98 backdrop-blur-2xl shadow-2xl flex flex-col justify-between p-5 sm:p-6 select-none border-r border-slate-200/90 overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-label="Panel de navegación Liwa"
            >
              {/* Drawer Top Content */}
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

                {/* Section Header */}
                <div className="mt-5 px-1 mb-2">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    Navegación Principal
                  </p>
                </div>

                {/* Navigation Items (Vertical stack con iconos animados e información) */}
                <nav className="space-y-1.5">
                  {navItems.map((item) => {
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTabClick(item.id)}
                        className={`w-full flex items-center justify-between p-3 sm:p-3.5 rounded-2xl text-left border transition-all duration-200 cursor-pointer ${
                          isActive
                            ? `${item.activeClass} font-bold`
                            : 'bg-transparent text-[#2C2C2C]/80 border-transparent hover:bg-slate-100/80 hover:text-[#2C2C2C]'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="flex-shrink-0">
                            {item.renderIcon(isActive)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm sm:text-base font-bold truncate">
                                {item.label}
                              </span>
                              {item.badge && (
                                <span className="px-1.5 py-0.5 text-[9px] font-black rounded-md bg-[#4A198C] text-white">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 truncate">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        {isActive && (
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0 ml-2"
                            style={{ backgroundColor: item.dotColor }}
                          />
                        )}
                      </button>
                    );
                  })}

                  {/* Acceso a Descargar APK en Drawer */}
                  {onGoToApk && (
                    <div className="pt-3">
                      <button
                        onClick={() => {
                          onGoToApk();
                          setDrawerOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left border transition-all duration-200 cursor-pointer ${
                          isApkActive
                            ? 'bg-[#EC006C]/10 border-[#EC006C]/30 text-[#EC006C] shadow-xs'
                            : 'bg-slate-50/90 hover:bg-slate-100/80 border-slate-200/80 text-[#2C2C2C]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-2xs ${
                              isApkActive ? 'bg-[#EC006C] text-white' : 'bg-[#EC006C]/10 text-[#EC006C]'
                            }`}
                          >
                            <Download className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate">Descargar APK</p>
                            <p className="text-[10px] text-slate-500 truncate">Instalador oficial Android</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-[#7AAF00] text-white flex-shrink-0">
                          Android
                        </span>
                      </button>
                    </div>
                  )}
                </nav>
              </div>

              {/* Drawer Bottom Section: User Profile or Login CTA */}
              <div className="pt-4 border-t border-slate-100 space-y-3 mt-6">
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

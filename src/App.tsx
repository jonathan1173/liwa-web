import React, { useState, useEffect } from 'react';
import { supabase, signOut, getProducts, ensureSession } from '@/lib/supabase';
import { Product } from '@/types';
import { Navbar, NavTab } from '@/components/Navbar';
import { BienvenidoPage } from '@/pages/BienvenidoPage';
import { ExplorarPage } from '@/pages/ExplorarPage';
import { MapaPage } from '@/pages/MapaPage';
import { TruequePage } from '@/pages/TruequePage';
import { AuthPage } from '@/pages/AuthPage';
import { TruequeModal } from '@/components/TruequeModal';
import { CheckCircle2, X } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('bienvenido');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [barterTargetProduct, setBarterTargetProduct] = useState<Product | null>(null);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize session for database access & subscribe to auth changes
  useEffect(() => {
    ensureSession().then(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        // Only set currentUser if it's not the anonymous guest account
        if (session?.user && session.user.email !== 'invitado@liwa.app') {
          setCurrentUser(session.user);
        } else {
          setCurrentUser(null);
        }
      });

      // Preload real products from database for Trueque picker
      getProducts()
        .then((prods) => setCatalogProducts(prods))
        .catch((err) => console.warn('Error loading products:', err));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user && session.user.email !== 'invitado@liwa.app') {
        setCurrentUser(session.user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      setCurrentUser(null);
      setToastMessage('Has cerrado sesión correctamente.');
    } catch (err: any) {
      console.warn('Error during logout:', err);
    }
  };

  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    setToastMessage('¡Bienvenido de vuelta a Liwa!');
    setCurrentTab('explorar');
  };

  const handleStartBarter = (product: Product) => {
    setBarterTargetProduct(product);
  };

  const handleBarterSuccess = (msg: string) => {
    setToastMessage(msg);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] relative flex flex-col selection:bg-[#EC006C] selection:text-white text-[#2C2C2C] overflow-x-hidden">
      <Analytics />
      {/* 
        =======================================================================
        AMBIENT BLUR BACKGROUND ORBS (Efecto de desenfoque ambiental con 4 colores)
        Rompe la palidez y proporciona máxima vistosidad y profundidad moderna.
        =======================================================================
      */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* Orbe 1: Morado (#4A198C) en esquina superior izquierda */}
        <div
          className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full blur-[110px] opacity-25"
          style={{ background: 'radial-gradient(circle, #4A198C 0%, rgba(74,25,140,0.15) 70%, transparent 100%)' }}
        />

        {/* Orbe 2: Magenta (#EC006C) en cuadrante superior derecho */}
        <div
          className="absolute top-10 right-[-100px] w-[580px] h-[580px] rounded-full blur-[120px] opacity-25"
          style={{ background: 'radial-gradient(circle, #EC006C 0%, rgba(236,0,108,0.2) 70%, transparent 100%)' }}
        />

        {/* Orbe 3: Verde (#7AAF00) en el centro-izquierdo para balance fresco */}
        <div
          className="absolute top-[45%] -left-20 w-[480px] h-[480px] rounded-full blur-[110px] opacity-20"
          style={{ background: 'radial-gradient(circle, #7AAF00 0%, rgba(122,175,0,0.15) 70%, transparent 100%)' }}
        />

        {/* Orbe 4: Desvaneciente combinado Morado + Magenta en la zona inferior */}
        <div
          className="absolute bottom-[-100px] right-[10%] w-[620px] h-[620px] rounded-full blur-[130px] opacity-20"
          style={{ background: 'radial-gradient(circle, #4A198C 0%, #EC006C 50%, transparent 80%)' }}
        />

        {/* Malla sutil de textura suave */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'radial-gradient(#2C2C2C 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      {/* Top Desktop Navigation */}
      <div className="relative z-40">
        <Navbar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          user={currentUser}
          onOpenLoginModal={() => setCurrentTab('auth')}
          onLogout={handleLogout}
        />
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-3 bg-[#2C2C2C] text-white px-5 py-3.5 rounded-2xl shadow-xl border border-white/10 backdrop-blur-md">
            <CheckCircle2 className="w-5 h-5 text-[#7AAF00] flex-shrink-0" />
            <span className="text-xs font-semibold">{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="ml-2 p-1 text-slate-400 hover:text-white rounded-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Rendered by Tab */}
      <main className="flex-1 relative z-10">
        {currentTab === 'bienvenido' && (
          <BienvenidoPage
            onExploreAsGuest={() => setCurrentTab('explorar')}
            onNavigateToTab={(tab) => setCurrentTab(tab)}
            onGoToAuth={() => setCurrentTab('auth')}
            isLoggedIn={!!currentUser}
          />
        )}

        {currentTab === 'auth' && (
          <AuthPage
            onLoginSuccess={handleLoginSuccess}
            onBackToHome={() => setCurrentTab('bienvenido')}
            onExploreAsGuest={() => setCurrentTab('explorar')}
          />
        )}

        {currentTab === 'explorar' && (
          <ExplorarPage onStartBarter={handleStartBarter} />
        )}

        {currentTab === 'mapa' && (
          <MapaPage onStartBarter={handleStartBarter} />
        )}

        {currentTab === 'trueque' && (
          <TruequePage onStartBarter={handleStartBarter} />
        )}
      </main>

      {/* Global Trueque Inteligente Modal */}
      <TruequeModal
        targetProduct={barterTargetProduct}
        onClose={() => setBarterTargetProduct(null)}
        currentUser={currentUser}
        onSuccess={handleBarterSuccess}
        availableProducts={catalogProducts}
      />

      {/* Footer for Desktop */}
      <footer className="relative z-10 border-t border-slate-200/80 bg-white/80 backdrop-blur-md py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#2C2C2C]">Liwa</span>
            <span>— Tu mercado de confianza</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#EC006C]"></span>
          </div>
          <div className="flex items-center gap-2">
            <span>Diseñado con la paleta oficial Liwa</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EC006C]" title="Magenta #EC006C"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#2C2C2C]" title="Gris Oscuro #2C2C2C"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#4A198C]" title="Morado #4A198C"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#7AAF00]" title="Verde #7AAF00"></span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

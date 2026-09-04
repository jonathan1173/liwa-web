import React, { useState, useEffect } from 'react';
import { supabase, signOut, getProducts, ensureSession } from '@/lib/supabase';
import { Product } from '@/types';
import { Navbar, NavTab } from '@/components/Navbar';
import { BienvenidoPage } from '@/pages/BienvenidoPage';
import { ExplorarPage } from '@/pages/ExplorarPage';
import { MapaPage } from '@/pages/MapaPage';
import { TruequePage } from '@/pages/TruequePage';
import { TruequeModal } from '@/components/TruequeModal';
import { CheckCircle2, X } from 'lucide-react';

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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col selection:bg-[#EC006C]/20 selection:text-[#EC006C]">
      {/* Top Desktop Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        user={currentUser}
        onOpenLoginModal={() => setCurrentTab('bienvenido')}
        onLogout={handleLogout}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl border border-slate-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
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
      <main className="flex-1">
        {currentTab === 'bienvenido' && (
          <BienvenidoPage
            onLoginSuccess={handleLoginSuccess}
            onExploreAsGuest={() => setCurrentTab('explorar')}
            onNavigateToTab={(tab) => setCurrentTab(tab)}
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
      <footer className="border-t border-slate-200/60 bg-white py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-700">Liwa</span>
            <span>— Tu mercado de confianza</span>
          </div>
          <div>
            <span>Adaptado para escritorio • Vite + React + TypeScript + Tailwind CSS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

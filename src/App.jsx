import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import HeroSlider from './components/HeroSlider';
import Collectionproducts from './components/Collectionproducts';
import ProductDetailsPage from './components/ProductDetailsPage';
import Checkout from './components/Checkout';
import Navbar from './components/Navbar';
import About from './components/About';
import Contact from './components/Contact';
import AccountModal from './components/AccountModal';
import CartDrawer from './components/CartDrawer';
import AdminLayout from './Admin/AdminLayout';
import DiscountOfferModal from './components/DiscountOfferModal';
import ComingSoon from './components/ComingSoon';
import { ConfirmProvider } from './components/ConfirmModal';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import './App.css';

// Automatically scroll instantly to top of page on route changes
function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, search]);
  return null;
}

// Security Route Guard: Restricts /admin routes strictly to verified admin accounts
function ProtectedAdminRoute({ children }) {
  const { isLoggedIn, user, isAdmin, promptLoginRequired } = useAuth();

  useEffect(() => {
    if (isLoggedIn && !isAdmin) {
      promptLoginRequired('Access denied: Admin privileges required.');
    }
  }, [isLoggedIn, isAdmin, promptLoginRequired]);

  if (!isLoggedIn || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function MainApp() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isDedicatedComingSoonRoute = location.pathname === '/coming-soon';

  // Method 1: Coming Soon Toggle via Environment Variable
  const isComingSoonMode = import.meta.env.VITE_COMING_SOON === 'true';

  // Preview Unlock state (persisted per session, triggered by code or ?preview=)
  const [isPreviewUnlocked, setIsPreviewUnlocked] = useState(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const previewParam = searchParams.get('preview');
      const expectedCode = (import.meta.env.VITE_PREVIEW_PASSCODE || 'lune2026').toLowerCase();
      if (
        previewParam &&
        (previewParam.toLowerCase() === expectedCode ||
          previewParam === 'true' ||
          previewParam.toLowerCase() === 'lune' ||
          previewParam.toLowerCase() === 'preview')
      ) {
        sessionStorage.setItem('lune_preview_unlocked', 'true');
        return true;
      }
      return sessionStorage.getItem('lune_preview_unlocked') === 'true';
    } catch (e) {
      return false;
    }
  });

  const handleExitPreview = () => {
    try {
      sessionStorage.removeItem('lune_preview_unlocked');
    } catch (e) {}
    setIsPreviewUnlocked(false);
  };

  const { cartItems, setCartItems, totalCartCount, isCartOpen, setIsCartOpen, updateQuantity, removeItem } = useCart();

  const [loaderKey, setLoaderKey] = useState(0);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [loaderState, setLoaderState] = useState('loading');

  useEffect(() => {
    if (location.pathname !== '/') {
      setLoaderState('completed');
    }
  }, [location.pathname]);

  // Global E-commerce Account & Admin State
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const handleModelLoaded = useCallback(() => {
    setIsModelLoaded(true);
  }, []);

  const handleReplayLoader = useCallback(() => {
    setIsModelLoaded(false);
    setLoaderState('loading');
    setLoaderKey((prev) => prev + 1);
  }, []);

  const handleLoaderStartExit = useCallback(() => {
    try {
      sessionStorage.setItem('perfume_has_visited', 'true');
    } catch {
      // ignore storage errors
    }
    setLoaderState('exiting');
  }, []);

  const handleLoaderComplete = useCallback(() => {
    try {
      sessionStorage.setItem('perfume_has_visited', 'true');
    } catch {
      // ignore storage errors
    }
    requestAnimationFrame(() => {
      setLoaderState('completed');
    });
  }, []);

  const [accountTab, setAccountTab] = useState('orders');

  const handleOpenAccount = (tab = 'orders') => {
    if (typeof tab === 'string') {
      setAccountTab(tab);
    }
    setIsAccountOpen(true);
  };

  // If in Coming Soon mode (or direct /coming-soon route), render Coming Soon
  if (isDedicatedComingSoonRoute || (isComingSoonMode && !isAdminRoute && !isPreviewUnlocked)) {
    return <ComingSoon onUnlockPreview={() => setIsPreviewUnlocked(true)} />;
  }

  return (
    <main className="relative min-h-screen w-full bg-white flex flex-col justify-between overflow-x-clip">
      {/* Global Floating Luxury Navbar - Hidden on Admin routes */}
      {!isAdminRoute && (
        <Navbar
          loaderState={loaderState}
          cartCount={totalCartCount}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenAccount={handleOpenAccount}
        />
      )}

      {/* Global Shopping Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => setIsCartOpen(false)}
      />


      {/* Global Account Drawer Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        initialTab={accountTab}
        onClose={() => setIsAccountOpen(false)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />


      <div className="w-full min-h-screen z-10">
        <Routes>
          <Route
            path="/"
            element={
              <HeroSlider
                loaderKey={loaderKey}
                loaderState={loaderState}
                isModelLoaded={isModelLoaded}
                onModelLoaded={handleModelLoaded}
                onLoaderStartExit={handleLoaderStartExit}
                onLoaderComplete={handleLoaderComplete}
                onReplayLoader={handleReplayLoader}
                cartItems={cartItems}
                setCartItems={setCartItems}
                isCartOpen={isCartOpen}
                setIsCartOpen={setIsCartOpen}
              />
            }
          />
          <Route
            path="/collection"
            element={
              <Collectionproducts
                cartItems={cartItems}
                setCartItems={setCartItems}
                isCartOpen={isCartOpen}
                setIsCartOpen={setIsCartOpen}
                onOpenAccount={handleOpenAccount}
              />
            }
          />
          <Route
            path="/about"
            element={
              <About
                cartItems={cartItems}
                setCartItems={setCartItems}
                isCartOpen={isCartOpen}
                setIsCartOpen={setIsCartOpen}
                onOpenAccount={handleOpenAccount}
              />
            }
          />
          <Route
            path="/contact"
            element={
              <Contact
                cartItems={cartItems}
                setCartItems={setCartItems}
                isCartOpen={isCartOpen}
                setIsCartOpen={setIsCartOpen}
                onOpenAccount={handleOpenAccount}
              />
            }
          />
          <Route
            path="/product"
            element={
              <ProductDetailsPage
                cartItems={cartItems}
                setCartItems={setCartItems}
                isCartOpen={isCartOpen}
                setIsCartOpen={setIsCartOpen}
                onOpenAccount={handleOpenAccount}
              />
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProductDetailsPage
                cartItems={cartItems}
                setCartItems={setCartItems}
                isCartOpen={isCartOpen}
                setIsCartOpen={setIsCartOpen}
                onOpenAccount={handleOpenAccount}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <Checkout
                cartItems={cartItems}
                setCartItems={setCartItems}
                onOpenAccount={handleOpenAccount}
              />
            }
          />
          <Route
            path="/coming-soon"
            element={<ComingSoon onUnlockPreview={() => setIsPreviewUnlocked(true)} />}
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          />

        </Routes>
        {!isAdminRoute && <DiscountOfferModal />}

        {/* Client & Team Live Preview Floating Indicator */}
        {isComingSoonMode && isPreviewUnlocked && !isAdminRoute && (
          <aside
            aria-label="Preview Mode Notice"
            className="fixed bottom-5 left-5 z-50 flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#111111]/95 text-white border border-[#C5A880]/40 backdrop-blur-xl shadow-2xl text-[11px]"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A880] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C5A880]" />
            </span>
            <span className="font-mono text-white/90 tracking-wide">
              Preview Mode Active
            </span>
            <button
              onClick={handleExitPreview}
              className="ml-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-[#C5A880] hover:text-black text-white font-medium text-[10px] uppercase tracking-wider transition-all cursor-pointer"
            >
              Lock Site
            </button>
          </aside>
        )}
      </div>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ConfirmProvider>
        <ScrollToTop />
        <MainApp />
      </ConfirmProvider>
    </BrowserRouter>
  );
}

export default App;

import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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
import { ConfirmProvider } from './components/ConfirmModal';
import { useCart } from './context/CartContext';
import './App.css';

// Automatically scroll to top of page on route changes
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function MainApp() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const { cartItems, setCartItems, totalCartCount, isCartOpen, setIsCartOpen, updateQuantity, removeItem } = useCart();


  const [loaderKey, setLoaderKey] = useState(0);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [loaderState, setLoaderState] = useState(() => {
    try {
      return sessionStorage.getItem('perfume_has_visited') ? 'completed' : 'loading';
    } catch {
      return 'loading';
    }
  });

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
    } catch (e) {
      // ignore storage errors
    }
    setLoaderState('exiting');
  }, []);

  const handleLoaderComplete = useCallback(() => {
    try {
      sessionStorage.setItem('perfume_has_visited', 'true');
    } catch (e) {
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

  return (
    <main className="relative min-h-screen w-full bg-white flex flex-col justify-between overflow-x-hidden">
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
          <Route path="/admin/*" element={<AdminLayout />} />

        </Routes>
        {!isAdminRoute && <DiscountOfferModal />}
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

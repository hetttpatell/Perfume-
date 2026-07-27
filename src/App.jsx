import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import HeroSlider from './components/HeroSlider';
import Collectionproducts from './components/Collectionproducts';
import ProductDetailsPage from './components/ProductDetailsPage';
import Navbar from './components/Navbar';
import About from './components/About';
import Contact from './components/Contact';
import AccountModal from './components/AccountModal';
import DiscountOfferModal from './components/DiscountOfferModal';
import './App.css';

// Automatically scroll to top of page on route changes
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const [loaderKey, setLoaderKey] = useState(0);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [loaderState, setLoaderState] = useState(() => {
    // Only play smooth loader on initial website visit, skip on page refresh
    try {
      return sessionStorage.getItem('perfume_has_visited') ? 'completed' : 'loading';
    } catch {
      return 'loading';
    }
  });

  // Global E-commerce Cart & Account State
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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

  return (
    <BrowserRouter>
      <ScrollToTop />
      <main className="relative min-h-screen w-full bg-white flex flex-col justify-between overflow-x-hidden">
        {/* Global Floating Luxury Navbar */}
        <Navbar
          loaderState={loaderState}
          cartCount={totalCartCount}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenAccount={() => setIsAccountOpen(true)}
        />

        {/* Global Account Drawer Modal */}
        <AccountModal
          isOpen={isAccountOpen}
          onClose={() => setIsAccountOpen(false)}
          onOpenCart={() => setIsCartOpen(true)}
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
                  onOpenAccount={() => setIsAccountOpen(true)}
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
                  onOpenAccount={() => setIsAccountOpen(true)}
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
                  onOpenAccount={() => setIsAccountOpen(true)}
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
                />
              }
            />
          </Routes>
          <DiscountOfferModal />
        </div>
      </main>
    </BrowserRouter>
  );
}

export default App;

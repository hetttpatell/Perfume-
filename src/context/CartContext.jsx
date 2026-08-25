import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { fetchUserCart, addToUserCart, updateUserCartQuantity, removeFromUserCart, clearUserCart } from '../services/api';

const CartContext = createContext();

// Load guest cart from localStorage
const loadGuestCart = () => {
  try {
    const stored = localStorage.getItem('lune_guest_cart');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save guest cart to localStorage
const saveGuestCart = (items) => {
  try {
    localStorage.setItem('lune_guest_cart', JSON.stringify(items));
  } catch {
    // ignore storage errors
  }
};

export function CartProvider({ children }) {
  const { isLoggedIn, token } = useAuth();

  const [cartItems, setCartItems] = useState(() => loadGuestCart());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loadingCart, setLoadingCart] = useState(true);
  const prevLoggedIn = useRef(isLoggedIn);

  // Sync / Load live cart data from database (authenticated users only)
  const refreshCartFromDb = useCallback(async () => {
    if (!isLoggedIn) {
      setLoadingCart(false);
      return;
    }
    setLoadingCart(true);
    try {
      const dbItems = await fetchUserCart();
      if (Array.isArray(dbItems)) {
        setCartItems(dbItems);
      }
    } catch (err) {
      console.error('Failed to sync live cart:', err);
    } finally {
      setLoadingCart(false);
    }
  }, [isLoggedIn]);

  // Sync live cart from database on mount or auth state changes
  useEffect(() => {
    let isMounted = true;

    async function initCart() {
      if (!isLoggedIn) {
        // Guest: use local cart from localStorage
        if (isMounted) {
          setCartItems(loadGuestCart());
          setLoadingCart(false);
        }
        return;
      }

      // User just logged in — sync any guest cart items to DB then load DB cart
      if (!prevLoggedIn.current && isLoggedIn) {
        const guestCart = loadGuestCart();
        if (guestCart.length > 0) {
          try {
            for (const item of guestCart) {
              await addToUserCart({
                productId: item.product?.id,
                selectedSize: item.size?.size || 'Full Size Flacon',
                quantity: item.quantity,
                engravingText: item.engraving || null
              });
            }
            // Clear guest cart after syncing
            localStorage.removeItem('lune_guest_cart');
          } catch (err) {
            console.error('Error syncing guest cart to DB:', err);
          }
        }
      }

      try {
        const liveDbCart = await fetchUserCart();
        if (isMounted && Array.isArray(liveDbCart)) {
          setCartItems(liveDbCart);
        }
      } catch (e) {
        console.error('Error fetching initial live cart:', e);
      } finally {
        if (isMounted) setLoadingCart(false);
      }
    }

    initCart();
    prevLoggedIn.current = isLoggedIn;
    return () => { isMounted = false; };
  }, [isLoggedIn, token]);

  // Save cart state to localStorage for guests
  useEffect(() => {
    if (!isLoggedIn) {
      saveGuestCart(cartItems);
    }
  }, [cartItems, isLoggedIn]);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Add Item to Cart (works for both guest and authenticated)
  const addItemToCart = async (product, sizeObj, quantity = 1, engraving = '') => {
    const targetSize = sizeObj || (product.sizes && product.sizes[0]) || { size: '50 ml', price: product.price };
    const price = targetSize.price || product.price;

    const newItem = {
      product,
      size: targetSize,
      price,
      quantity,
      engraving
    };

    // Immediate state update
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.product?.id === product?.id && i.size?.size === targetSize.size && (i.engraving || '') === (engraving || '')
      );
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx] = {
          ...copy[existingIdx],
          quantity: copy[existingIdx].quantity + quantity
        };
        return copy;
      }
      return [...prev, newItem];
    });

    // Sync to Supabase Database (authenticated users only)
    if (isLoggedIn) {
      try {
        await addToUserCart({
          productId: product.id,
          selectedSize: targetSize.size,
          quantity,
          engravingText: engraving || null
        });
        // Refresh to get exact DB primary keys
        const freshDbCart = await fetchUserCart();
        if (Array.isArray(freshDbCart)) {
          setCartItems(freshDbCart);
        }
      } catch (err) {
        console.error('Error syncing to database cart:', err);
      }
    }
  };

  // Update Item Quantity in Cart
  const updateQuantity = async (indexOrDbId, newQuantity) => {
    let targetItem = null;

    if (typeof indexOrDbId === 'string') {
      targetItem = cartItems.find((i) => i.dbId === indexOrDbId || i.id === indexOrDbId);
    } else if (typeof indexOrDbId === 'number') {
      targetItem = cartItems[indexOrDbId];
    }

    if (newQuantity <= 0) {
      return removeItem(indexOrDbId);
    }

    // Local UI update
    setCartItems((prev) =>
      prev.map((item, idx) => {
        const matches = (item.dbId && item.dbId === indexOrDbId) || item.id === indexOrDbId || idx === indexOrDbId;
        return matches ? { ...item, quantity: newQuantity } : item;
      })
    );

    // Sync to database (authenticated only)
    if (isLoggedIn && targetItem?.dbId) {
      await updateUserCartQuantity(targetItem.dbId, newQuantity);
    }
  };

  // Remove Item from Cart
  const removeItem = async (indexOrDbId) => {
    let targetItem = null;

    if (typeof indexOrDbId === 'string') {
      targetItem = cartItems.find((i) => i.dbId === indexOrDbId || i.id === indexOrDbId);
    } else if (typeof indexOrDbId === 'number') {
      targetItem = cartItems[indexOrDbId];
    }

    setCartItems((prev) =>
      prev.filter((item, idx) => {
        const matches = (item.dbId && item.dbId === indexOrDbId) || item.id === indexOrDbId || idx === indexOrDbId;
        return !matches;
      })
    );

    if (isLoggedIn && targetItem?.dbId) {
      await removeFromUserCart(targetItem.dbId);
    }
  };

  // Clear Entire Cart
  const clearCart = async () => {
    setCartItems([]);
    localStorage.removeItem('lune_guest_cart');
    if (isLoggedIn) {
      await clearUserCart();
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        totalCartCount,
        isCartOpen,
        setIsCartOpen,
        loadingCart,
        addItemToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCartFromDb
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}


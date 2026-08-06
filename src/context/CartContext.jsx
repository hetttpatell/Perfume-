import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { fetchUserCart, addToUserCart, updateUserCartQuantity, removeFromUserCart, clearUserCart } from '../services/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { isLoggedIn, token } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loadingCart, setLoadingCart] = useState(true);

  // Sync / Load live cart data from database
  const refreshCartFromDb = useCallback(async () => {
    if (!isLoggedIn) {
      setCartItems([]);
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
        if (isMounted) {
          setCartItems([]);
          setLoadingCart(false);
        }
        return;
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
    return () => { isMounted = false; };
  }, [isLoggedIn, token]);

  // Save cart state to localStorage as a backup for instant display
  useEffect(() => {
    try {
      localStorage.setItem('lune_guest_cart', JSON.stringify(cartItems));
    } catch (e) {
      // ignore storage errors
    }
  }, [cartItems]);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Add Item to Live Cart
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

    // Sync to Supabase Database
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
  };

  // Update Item Quantity in Live Cart
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

    // Sync to database
    if (targetItem?.dbId) {
      await updateUserCartQuantity(targetItem.dbId, newQuantity);
    }
  };

  // Remove Item from Live Cart
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

    if (targetItem?.dbId) {
      await removeFromUserCart(targetItem.dbId);
    }
  };

  // Clear Entire Cart
  const clearCart = async () => {
    setCartItems([]);
    localStorage.removeItem('lune_guest_cart');
    await clearUserCart();
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

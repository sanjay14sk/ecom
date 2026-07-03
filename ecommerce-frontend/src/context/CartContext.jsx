import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token, user } = useContext(AuthContext);
  const [cart, setCart] = useState({ items: [] });
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (token && user) {
      loadCart();
      loadWishlist();
    } else {
      setCart({ items: [] });
      setWishlist([]);
    }
  }, [token, user]);

  const loadCart = async () => {
    try {
      const res = await API.get('/cart');
      setCart(res.data);
    } catch (err) {
      console.error('Failed to load cart', err);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await API.post(`/cart/add?productId=${productId}&quantity=${quantity}`);
      setCart(res.data);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to add item to cart',
      };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await API.put(`/cart/update?productId=${productId}&quantity=${quantity}`);
      setCart(res.data);
    } catch (err) {
      console.error('Failed to update quantity', err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await API.delete(`/cart/remove?productId=${productId}`);
      setCart(res.data);
    } catch (err) {
      console.error('Failed to remove item', err);
    }
  };

  const clearCart = async () => {
    try {
      await API.delete('/cart/clear');
      setCart({ items: [] });
    } catch (err) {
      console.error('Failed to clear cart', err);
    }
  };

  const loadWishlist = async () => {
    try {
      const res = await API.get('/wishlist');
      setWishlist(res.data);
    } catch (err) {
      console.error('Failed to load wishlist', err);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      const res = await API.post(`/wishlist/add?productId=${productId}`);
      setWishlist(res.data);
    } catch (err) {
      console.error('Failed to add to wishlist', err);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const res = await API.delete(`/wishlist/remove?productId=${productId}`);
      setWishlist(res.data);
    } catch (err) {
      console.error('Failed to remove from wishlist', err);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const getCartCount = () => {
    return cart.items ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        loadCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        loadWishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

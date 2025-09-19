import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('cartItems');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity ,store_id: product.store?.id || product.store_id}];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  
  const clearCart = () => {
    setCartItems([]);
  };

  // ============== YAHAN BADLAV KIYA GAYA HAI ==============
  const totalAmount = cartItems.reduce((total, item) => {
    // Sunishchit karein ki price aur quantity valid numbers hain
    const price = parseFloat(item.selling_price || item.price || 0);
    const quantity = parseInt(item.quantity || 1, 10);
    return total + (price * quantity);
  }, 0);
  // ==========================================================

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalAmount,
    itemCount: cartItems.length,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
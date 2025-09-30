import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { apiService } from '../components/layout/apiService';
import { endpoints } from '../api/endpoints';
import { toast } from 'react-hot-toast';
import { transformProductData } from '../utils/transformProductData';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await apiService(endpoints.getCart);

      // **THE FIX**: This logic robustly finds the array of items from the API
      // response and then transforms it.
      const rawCartItems = response.data || response.cartItems || [];

      if (Array.isArray(rawCartItems)) {
        const transformedCartItems = rawCartItems
          .map(item => ({
            ...item,
            product: item.product ? transformProductData(item.product) : null
          }))
          .filter(item => item.product); // Ensure no items with null products are in the cart

        setCartItems(transformedCartItems);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Failed to fetch cart items", error);
      if (!error.message.includes("404")) {
         toast.error(`Could not load cart: ${error.message}`);
      }
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // --- No changes needed for the functions below ---

  const addToCart = async (product, quantity = 1) => {
    try {
      const response = await apiService(endpoints.addToCart, {
        method: 'POST',
        body: {
          product_id: product.id,
          store_id: product.store?.id || product.store_id,
          quantity: String(quantity),
        },
      });

      if (response.success || response.message === "Item added to cart") {
        await fetchCart();
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to add item to cart.');
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const response = await apiService(endpoints.removeFromCart(cartItemId), {
        method: 'DELETE',
      });
      if (response.success || (response.message && !response.error)) {
        await fetchCart();
        toast.success(response.message || "Item removed from cart.");
      } else {
        throw new Error(response.message || 'Failed to remove item.');
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error(error.message || "Could not remove item from cart.");
      throw error;
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    const itemInCart = cartItems.find(item => item.product.id === productId);
    if (!itemInCart) return;

    if (newQuantity < 1) {
      return await removeFromCart(itemInCart.id);
    }

    try {
      const response = await apiService(endpoints.updateCartItem(itemInCart.id), {
        method: 'PUT',
        body: { quantity: String(newQuantity) },
      });
      if (response.success || (response.message && !response.error)) {
        await fetchCart();
      } else {
        throw new Error(response.message || 'Failed to update quantity.');
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error(error.message || "Could not update item quantity.");
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const response = await apiService(endpoints.clearCart, {
        method: 'DELETE',
      });
      if (response.success || response.message === "Cart cleared") {
        setCartItems([]);
        toast.success("Cart cleared!");
      } else {
        throw new Error(response.message || 'Failed to clear cart.');
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error(error.message || "Could not clear cart.");
      throw error;
    }
  };

  const removeItems = async (productIdsToRemove) => {
     const cartItemIds = cartItems
        .filter(item => productIdsToRemove.includes(item.product.id))
        .map(item => item.id);
    await Promise.all(cartItemIds.map(id => removeFromCart(id)));
  };

  const prepareForCheckout = (selectedItems) => {
    setCheckoutItems(selectedItems);
  };

  const totalAmount = cartItems.reduce((total, item) => {
    const price = parseFloat(item.product?.selling_price || item.product?.price || 0);
    const quantity = parseInt(item.quantity || 1, 10);
    return total + (price * quantity);
  }, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalAmount,
    itemCount: cartItems.reduce((count, item) => count + (parseInt(item.quantity, 10) || 0), 0),
    removeItems,
    checkoutItems,
    prepareForCheckout,
    loading
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};


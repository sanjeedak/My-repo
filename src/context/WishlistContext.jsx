import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from './AuthContext';
import { apiService } from '../components/layout/apiService';
import { endpoints } from '../api/endpoints';
import { toast } from 'react-hot-toast';
import { transformProductData } from '../utils/transformProductData'; // 1. Import the transformer

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { isAuthenticated } = useAuth();

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      return;
    }
    try {
      const response = await apiService(endpoints.getWishlist);
      
      if (response && Array.isArray(response.items)) {
        // 2. Transform the product data within each wishlist item
        const transformedItems = response.items.map(item => ({
          ...item,
          product: transformProductData(item.product)
        }));
        setWishlistItems(transformedItems);
      } else {
        setWishlistItems([]);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist items", error);
      setWishlistItems([]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (product) => {
    try {
      const response = await apiService(endpoints.addToWishlist, {
        method: 'POST',
        body: {
          product_id: product.id,
          store_id: product.store?.id || product.store_id,
        },
      });

      if (response && response.item) {
        await fetchWishlist();
        toast.success(response.message || `${product.name} added to wishlist!`);
      } else {
        throw new Error(response.message || 'Failed to add item to wishlist.');
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error(error.message || "Could not add to wishlist.");
    }
  };

  const removeFromWishlist = async (wishlistItemId) => {
    try {
        const response = await apiService(endpoints.removeFromWishlist(wishlistItemId), {
            method: 'DELETE',
        });

        // 3. Make the success check more flexible
        if (response.success || response.message) {
            await fetchWishlist();
            toast.success(response.message || "Item removed from wishlist.");
        } else {
            throw new Error(response.message || 'Failed to remove item from wishlist.');
        }
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        toast.error(error.message || "Could not remove from wishlist.");
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.productId === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
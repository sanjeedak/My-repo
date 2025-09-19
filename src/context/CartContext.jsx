import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const localData = localStorage.getItem('cartItems');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Failed to parse cart items from localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                // If item exists, just increment its quantity
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + (product.quantity || 1) } : item
                );
            }
            // Otherwise, add the new product to the cart
            return [...prevItems, { ...product, quantity: product.quantity || 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        setCartItems(prevItems => {
            // If the new quantity is 0 or less, remove the item from the cart
            if (newQuantity < 1) {
                return prevItems.filter(item => item.id !== productId);
            }
            // Otherwise, update the quantity of the matching item
            return prevItems.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            );
        });
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        itemCount,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
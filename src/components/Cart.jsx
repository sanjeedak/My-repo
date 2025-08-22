// components/Cart.jsx
import React from 'react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">Cart</h2>
      {cartItems.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-2">
              <div>
                <h4>{item.title}</h4>
                <p>${item.price} x {item.quantity}</p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="flex justify-between mt-4">
            <span className="font-bold">Total: ${total.toFixed(2)}</span>
            <button onClick={clearCart} className="bg-gray-200 px-3 py-1 rounded">Clear</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;

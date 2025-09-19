import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cartItems, clearCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h2 className="text-2xl font-bold mb-4">{t('cart_empty')}</h2>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {t('continue_shopping')}
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:underline"
      >
        ← {t('back')}
      </button>

      <h2 className="text-3xl font-bold mb-6">{t('your_cart')}</h2>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row justify-between items-center border-b pb-4 gap-4"
          >
            {/* Left: Image + Name */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-contain rounded border"
              />
              <div className="flex-grow">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">₹{item.price}</p>
              </div>
            </div>

            <div className="flex items-center justify-between w-full sm:w-auto gap-4">
              {/* Middle: Quantity Controls */}
              <div className="flex items-center gap-2">
                <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                    −
                </button>
                <span className="px-3 py-1 border rounded">{item.quantity}</span>
                <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                    +
                </button>
              </div>

              {/* Right: Subtotal */}
              <p className="font-semibold text-gray-800 w-24 text-right">
                ₹{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Total & Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="text-xl font-bold">{t('total')} ₹{total.toFixed(2)}</h3>
        <div className="flex gap-4">
          <button
            onClick={clearCart}
            className="bg-gray-200 px-6 py-2 rounded hover:bg-gray-300"
          >
            {t('clear_cart')}
          </button>
          <button
            onClick={() => navigate('/checkout')}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            {t('proceed_to_checkout')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
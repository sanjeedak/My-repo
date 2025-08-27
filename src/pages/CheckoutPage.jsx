import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.city || !form.pincode) {
      alert('Please fill all required fields!');
      return;
    }
    // ✅ Normally API call goes here
    clearCart();
    navigate('/order-success'); // ✅ redirect to success page
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button
          onClick={() => navigate('/products')}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Cart Summary */}
      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between items-center border-b py-3">
            <div className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-contain rounded border"
              />
              <div>
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-gray-600">₹{item.price} × {item.quantity}</p>
              </div>
            </div>
            <p className="font-semibold text-gray-800">
              ₹{(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
        <div className="flex justify-between items-center mt-6">
          <span className="text-xl font-bold">Total</span>
          <span className="text-xl font-bold text-blue-600">₹{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Right: Checkout Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Delivery Details</h2>
        <form onSubmit={handlePlaceOrder} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <textarea
            name="address"
            placeholder="Full Address"
            value={form.address}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={form.pincode}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;

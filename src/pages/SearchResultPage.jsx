import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Signin from '../pages/SignIn';
import Signup from '../pages/SignUp';
import { useCart } from '../context/CartContext';

// Icons
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4zm0 10c3.3 0 6 2.7 6 6v2H6v-2c0-3.3 2.7-6 6-6z" />
  </svg>
);

const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zM7 6h15l-1.5 9H8L7 6zM4 6H2v2h2l3.6 7.59-1.35 2.44C5.89 19.37 6.42 20 7 20h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L7.1 17h12.45c.75 0 1.41-.41 1.75-1.03L23 6H6.21L5.27 4H1v2h3z" />
  </svg>
);

// Cart Modal
const CartModal = ({ onClose }) => {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout'); // Navigate to checkout page
    onClose(); // Close the modal after navigation
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-xl font-semibold mb-4">My Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between mb-2">
                <span>{item.title} (x{item.quantity})</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <p className="mt-4 font-bold">
              Total: ${cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
            </p>
            <button
              onClick={handleCheckout}
              className="mt-4 w-full bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-teal-600 transition duration-300"
            >
              Checkout
            </button>
          </div>
        )}
        <button
          className="mt-2 w-full bg-blue-600 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Header Component
const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const { cartItems } = useCart();

  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  return (
    <>
      <header className="border-b shadow-sm">
        <div className="bg-gray-100 text-sm px-4 py-1 flex justify-between items-center">
          <div className="text-blue-900 font-medium">📞 +00-123456789</div>
          <div>USD | EN</div>
        </div>

        <div className="flex items-center justify-between px-4 py-4 bg-white">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src="/img/logo_shopzeo.png" alt="Shopzeo Logo" className="h-10 w-auto" />
            <span className="text-2xl font-bold text-blue-800">Shopzeo</span>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 mx-6 flex border border-blue-700 rounded overflow-hidden"
          >
            <input
              type="text"
              placeholder="Search for items..."
              className="flex-grow px-4 py-2 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="bg-blue-700 px-4 text-white">
              <SearchIcon />
            </button>
          </form>

          {/* Right Icons */}
          <div className="flex items-center space-x-6">
            {/* User Icon with Dropdown */}
            <div className="relative">
              <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                <UserIcon />
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md z-50">
                  <div
                    onClick={() => {
                      navigate('/signin');
                      setIsUserMenuOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Sign In
                  </div>
                  <div
                    onClick={() => {
                      navigate('/signup');
                      setIsUserMenuOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Sign Up
                  </div>
                </div>
              )}
            </div>

            {/* Cart Icon */}
            <div className="relative cursor-pointer" onClick={() => setShowCart(true)}>
              <CartIcon />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                {cartItems.length}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Modal */}
      {showCart && <CartModal onClose={() => setShowCart(false)} />}
    </>
  );
};

export default Header;
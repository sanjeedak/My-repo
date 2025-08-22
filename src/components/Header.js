import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { SearchIcon, UserIcon, CartIcon } from '../assets/icons';

// Cart Modal
const CartModal = ({ onClose }) => {
  const { cartItems } = useCart(); // Access cart items within the modal
  const [language] = useState('en'); // Sync with Header language state

  const translations = {
    en: {
      cartTitle: 'My Cart',
      emptyCart: 'Your cart is empty.',
      total: 'Total',
      close: 'Close',
    },
    hi: {
      cartTitle: 'मेरा कार्ट',
      emptyCart: 'आपका कार्ट खाली है।',
      total: 'कुल',
      close: 'बंद करें',
    },
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-xl font-semibold mb-4">{translations[language].cartTitle}</h2>
        {cartItems.length === 0 ? (
          <p>{translations[language].emptyCart}</p>
        ) : (
          <div>
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between mb-2">
                <span>{item.title} (x{item.quantity})</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <p className="mt-4 font-bold">
              {translations[language].total}: ₹{cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
            </p>
          </div>
        )}
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded" onClick={onClose}>
          {translations[language].close}
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
  const [language, setLanguage] = useState('en'); // Default to English

  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  const translations = {
    en: {
      searchPlaceholder: 'Search for items...',
      signIn: 'Sign In',
      signUp: 'Sign Up',
    },
    hi: {
      searchPlaceholder: 'वस्तुओं के लिए खोजें...',
      signIn: 'साइन इन करें',
      signUp: 'साइन अप करें',
    },
  };

  return (
    <>
      <header className="border-b shadow-sm">
        <div className="bg-gray-100 text-sm px-4 py-1 flex justify-between items-center">
          <div className="text-blue-900 font-medium">📞 +00-123456789</div>
          <div className="flex items-center">
            <span className="mr-2">₹</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border-none bg-transparent focus:outline-none"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>
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
              placeholder={translations[language].searchPlaceholder}
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
                    {translations[language].signIn}
                  </div>
                  <div
                    onClick={() => {
                      navigate('/signup');
                      setIsUserMenuOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {translations[language].signUp}
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
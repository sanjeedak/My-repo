import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// --- SVG Icon Components ---
const PhoneIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg> );
const SearchIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg> );
const WishlistIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 20.25l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg> );
const UserIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> );
const CartIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg> );
const ChevronDownIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg> );
const IndiaFlagIcon = () => ( <svg className="w-5 h-5 rounded-sm" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="900" height="600" fill="#f93"/><rect width="900" height="400" fill="#fff"/><rect width="900" height="200" fill="#128807"/><g transform="translate(450 300)"><circle r="90" fill="#fff"/><circle r="70" fill="#000080"/><circle r="70" fill="none" stroke="#fff" strokeWidth="20"/></g></svg> );

// --- Main Header Component ---
const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const languages = [
    // MODIFIED: English now uses the Indian flag
    { code: 'en', name: 'English', flag: <IndiaFlagIcon /> },
    { code: 'hi', name: 'Hindi', flag: <IndiaFlagIcon /> }
  ];
  const [selectedLang, setSelectedLang] = useState(languages[0]);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const wishlistCount = 1; // Placeholder

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  const IconBadge = ({ count }) => (
    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
      {count}
    </span>
  );
  
  const handleLangSelect = (lang) => {
    setSelectedLang(lang);
    setIsLangMenuOpen(false);
  };

  return (
    <header className="bg-white sticky top-0 z-40 shadow-sm">
      <div className="border-b text-sm text-slate-600">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <PhoneIcon />
            <span>+91 73488 32668</span>
          </div>
          <div className="flex items-center gap-4">
            {/* MODIFIED: Currency changed to INR */}
            <span>₹ INR</span>
            <div className="relative">
                <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="flex items-center gap-2">
                    {selectedLang.flag}
                    <span>{selectedLang.name}</span>
                    <ChevronDownIcon/>
                </button>
                {isLangMenuOpen && (
                    <div className="absolute right-0 mt-2 w-36 bg-white shadow-lg rounded-md z-50 py-1 border">
                        {languages.map(lang => (
                            <button 
                                key={lang.code} 
                                onClick={() => handleLangSelect(lang)} 
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                            >
                                {lang.flag}
                                <span>{lang.name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/img/logo_shopzeo.png" alt="Shopzeo Logo" className="h-10 w-auto" />
        </Link>
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-2xl mx-8 border border-slate-200 rounded-lg overflow-hidden focus-within:border-blue-700 transition-colors">
          <input
            type="text"
            placeholder="Search for items..."
            className="flex-grow px-4 py-2 outline-none text-sm text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="bg-blue-700 px-5 text-white hover:bg-blue-800 transition-colors">
            <SearchIcon />
          </button>
        </form>
        <div className="flex items-center space-x-4">
          <Link to="/wishlist" className="relative p-3 rounded-full hover:bg-slate-100 transition-colors">
            <WishlistIcon />
            {wishlistCount > 0 && <IconBadge count={wishlistCount} />}
          </Link>
          <div className="relative">
            <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="p-3 rounded-full hover:bg-slate-100 transition-colors">
              <UserIcon />
            </button>
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50 py-1 border">
                <Link to="/signin" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Sign In</Link>
                <Link to="/signup" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Sign Up</Link>
              </div>
            )}
          </div>
          <Link to="/cart" className="flex items-center space-x-2 p-3 rounded-full hover:bg-slate-100 transition-colors">
            <div className="relative">
              <CartIcon />
              {cartItems.length > 0 && <IconBadge count={cartItems.length} />}
            </div>
            <div className="hidden lg:block text-sm text-slate-600">
              <p>My cart</p>
              {/* MODIFIED: Currency symbol changed to ₹ */}
              <p className="font-semibold text-slate-800">₹{cartTotal.toFixed(2)}</p>
            </div>
            <ChevronDownIcon />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next'; // <-- Import useTranslation
import {
  SearchIcon,
  WishlistIcon,
  UserIcon,
  CartIcon,
  ChevronDownIcon,
  IndiaFlagIcon,
  UKFlagIcon,
} from "../../assets/icons";
import { LogIn, LogOut, UserPlus, Search as SearchIconMobile } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { t, i18n } = useTranslation(); // <-- Initialize translation hook
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const navigate = useNavigate();

  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, logout } = useAuth();
  
  const languages = [
    { code: 'en', name: t('english'), Icon: UKFlagIcon },
    { code: 'hi', name: t('hindi'), Icon: IndiaFlagIcon },
  ];
  
  const [selectedLang, setSelectedLang] = useState(languages.find(l => l.code === i18n.language) || languages[0]);


  const handleLogout = () => {
    logout();
    navigate('/');
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setIsMobileSearchOpen(false);
    }
  }
  
  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang.code); // <-- Change the language
    setSelectedLang(lang);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target)
      ) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-white"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        <Link to="/" className="flex items-center">
          <img
            src="/img/logo_shopzeo.png"
            alt="Shopzeo Logo"
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </Link>
        <div className="hidden md:flex flex-1 mx-8 max-w-xl">
          <form className="w-full flex" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder={t('search_placeholder')} // <-- Use translated text
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border border-gray-300 px-4 py-2 rounded-l-md focus:outline-none"
            />
            <button
              type="submit"
              className="bg-teal-500 px-6 text-white hover:bg-teal-600 rounded-r-md"
              aria-label="Search"
            >
              <SearchIcon className="h-6 w-6" />
            </button>
          </form>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)} className="md:hidden p-2 rounded-full hover:bg-gray-100 transition">
             <SearchIconMobile className="h-6 w-6 text-gray-700" />
          </button>
          <Link
            to="/wishlist"
            className="relative p-2 rounded-full hover:bg-gray-100 transition"
          >
            <WishlistIcon className="h-6 w-6" />
            {wishlistItems && wishlistItems.length > 0 && (
              <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                {wishlistItems.length}
              </span>
            )}
          </Link>
          <div className="relative" ref={userDropdownRef}>
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <UserIcon className="h-6 w-6" />
            </button>
            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-semibold truncate">{`${user.first_name} ${user.last_name}`}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <UserIcon className="h-4 w-4 text-gray-600" /> My Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 text-gray-600" /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/signin"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <LogIn className="h-4 w-4 text-gray-600" /> Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <UserPlus className="h-4 w-4 text-gray-600" /> Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          <Link
            to="/cart"
            className="relative p-2 rounded-full hover:bg-gray-100 transition"
          >
            <CartIcon className="h-6 w-6" />
            {cartItems && cartItems.length > 0 && (
              <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>
          <div className="relative hidden md:block" ref={dropdownRef}>
            <button
              className="flex items-center gap-1 px-3 py-2 border rounded-md hover:bg-gray-50"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <selectedLang.Icon className="w-5 h-5 rounded-sm" />
              <span className="text-sm">{selectedLang.code.toUpperCase()}</span>
              <ChevronDownIcon className="h-4 w-4" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang)}
                    className="flex items-center w-full px-3 py-2 hover:bg-gray-100 text-sm"
                  >
                    <lang.Icon className="w-5 h-5 mr-2 rounded-sm" />
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {isMobileSearchOpen && (
          <div className="md:hidden px-4 pb-3">
               <form className="w-full flex" onSubmit={handleSearch}>
                    <input
                      type="text"
                      placeholder={t('search_placeholder')} // <-- Use translated text
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 border border-gray-300 px-4 py-2 rounded-l-md focus:outline-none"
                    />
                    <button
                      type="submit"
                      aria-label="Search"
                      className="bg-teal-500 px-4 text-white hover:bg-teal-600 rounded-r-md"
                    >
                      <SearchIcon className="h-6 w-6" />
                    </button>
                </form>
          </div>
      )}
    </header>
  );
};

export default Header;
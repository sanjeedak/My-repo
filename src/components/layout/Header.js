import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  SearchIcon,
  WishlistIcon,
  UserIcon,
  CartIcon,
  ChevronDownIcon,
  PhoneIcon,
  IndiaFlagIcon,
} from "../../assets/icons";
import { LogIn, UserPlus } from "lucide-react";
import { useCart } from "../../context/CartContext";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  const { cartItems } = useCart();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle dropdown click outside
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
      <div className="flex items-center justify-between px-6 py-3">
        {/* --- Left: Logo --- */}
        <Link to="/" className="flex items-center">
          <img
            src="/img/logo_shopzeo.png"
            alt="Shopzeo Logo"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* --- Middle: Search Bar --- */}
        <div className="hidden md:flex flex-1 mx-8">
          <form className="w-full flex">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 border border-gray-300 px-4 py-2 rounded-l-md focus:outline-none"
            />
            <button
              type="submit"
              className="bg-teal-500 px-6 text-white hover:bg-teal-600 rounded-r-md"
            >
              <SearchIcon className="h-6 w-6" />
            </button>
          </form>
        </div>

        {/* --- Right: Icons --- */}
        <div className="flex items-center gap-4">
          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <WishlistIcon className="h-6 w-6" />
          </Link>

          {/* User Dropdown (Sign In / Sign Up) */}
          <div className="relative" ref={userDropdownRef}>
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <UserIcon className="h-6 w-6" />
            </button>

            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg z-50">
                <Link
                  to="/signin"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                >
                  <LogIn className="h-4 w-4 text-gray-600" /> Sign In
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                >
                  <UserPlus className="h-4 w-4 text-gray-600" /> Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Cart */}
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

          {/* --- Language & Contact Dropdown --- */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-1 px-3 py-2 border rounded-md hover:bg-gray-50"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <IndiaFlagIcon className="w-5 h-5 rounded-sm" />
              <span className="text-sm">EN</span>
              <ChevronDownIcon className="h-4 w-4" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50">
                <button className="flex items-center w-full px-3 py-2 hover:bg-gray-100 text-sm">
                  <IndiaFlagIcon className="w-5 h-5 mr-2 rounded-sm" />
                  English
                </button>
                <button className="flex items-center w-full px-3 py-2 hover:bg-gray-100 text-sm">
                  <PhoneIcon className="w-5 h-5 mr-2" />
                  Contact Us
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
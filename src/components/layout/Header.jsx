import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import {
  SearchIcon,
  WishlistIcon,
  UserIcon,
  CartIcon,
  ChevronDownIcon,
  IndiaFlagIcon,
  UKFlagIcon,
} from "../../assets/icons";
import { LogIn, LogOut, UserPlus, Search as SearchIconMobile, Menu, X, Globe } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { apiService } from "./apiService";
import { endpoints } from "../../api/endpoints";

const Header = () => {
  const { t, i18n } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isMobileLangOpen, setIsMobileLangOpen] = useState(false);
  
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const navigate = useNavigate();

  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, logout } = useAuth();
  
  const languages = useMemo(() => [
    { code: 'en', name: t('english'), Icon: UKFlagIcon },
    { code: 'hi', name: t('hindi'), Icon: IndiaFlagIcon },
  ], [t]);
  
  const [selectedLang, setSelectedLang] = useState(languages.find(l => l.code === i18n.language) || languages[0]);
  
  useEffect(() => {
    apiService(`${endpoints.categories}?parent_id=null`)
      .then(res => {
        if (res?.success && Array.isArray(res?.data?.categories)) {
          setCategories(res.data.categories);
        }
      })
      .catch(err => console.error("Failed to fetch navbar data:", err))
      .finally(() => setLoadingCategories(false));
  }, []);

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
    i18n.changeLanguage(lang.code);
    setSelectedLang(lang);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
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
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsDropdownOpen(false);
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) setIsUserDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setSelectedLang(languages.find(l => l.code === i18n.language) || languages[0]);
  }, [i18n.language, languages]);
  
  const mainNavLinks = [{ to: '/', text: t('home') }];
  const vendorZoneLinks = [
    { to: '/vendor/signup', text: t('become_a_vendor') },
    { to: '/vendor/signin', text: t('vendor_login') },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-white"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        <div className="flex items-center gap-2">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-gray-600 focus:outline-none p-2" aria-label="Open menu">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link to="/" className="flex items-center">
              <img
                src="/img/logo_shopzeo.png"
                alt="Shopzeo Logo"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </Link>
        </div>

        <div className="hidden md:flex flex-1 mx-8 max-w-xl">
          <form className="w-full flex" onSubmit={handleSearch}><input type="text" placeholder={t('search_placeholder')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 border border-gray-300 px-4 py-2 rounded-l-md focus:outline-none" /><button type="submit" className="bg-teal-500 px-6 text-white hover:bg-teal-600 rounded-r-md" aria-label="Search"><SearchIcon className="h-6 w-6" /></button></form>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)} className="md:hidden p-2 rounded-full hover:bg-gray-100 transition"><SearchIconMobile className="h-6 w-6 text-gray-700" /></button>
          <Link to="/wishlist" className="relative p-2 rounded-full hover:bg-gray-100 transition"><WishlistIcon className="h-6 w-6" />{wishlistItems?.length > 0 && <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">{wishlistItems.length}</span>}</Link>
          <div className="relative" ref={userDropdownRef}>
            <button onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)} className="p-2 rounded-full hover:bg-gray-100 transition"><UserIcon className="h-6 w-6" /></button>
            {isUserDropdownOpen && (<div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">{user ? (<>
                <div className="px-4 py-2 border-b"><p className="text-sm font-semibold truncate">{`${user.first_name} ${user.last_name}`}</p><p className="text-xs text-gray-500 truncate">{user.email}</p></div>
                <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100" onClick={() => setIsUserDropdownOpen(false)}><UserIcon className="h-4 w-4 text-gray-600" /> My Profile</Link>
                <button onClick={() => { handleLogout(); setIsUserDropdownOpen(false); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"><LogOut className="h-4 w-4 text-gray-600" /> Logout</button></>) : (<>
                <Link to="/signin" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"><LogIn className="h-4 w-4 text-gray-600" /> Sign In</Link>
                <Link to="/signup" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"><UserPlus className="h-4 w-4 text-gray-600" /> Sign Up</Link></>)}</div>)}
          </div>
          <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-100 transition"><CartIcon className="h-6 w-6" />{cartItems?.length > 0 && <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">{cartItems.length}</span>}</Link>
          <div className="relative hidden md:block" ref={dropdownRef}>
            <button className="flex items-center gap-1 px-3 py-2 border rounded-md hover:bg-gray-50" onClick={() => setIsDropdownOpen(!isDropdownOpen)}><selectedLang.Icon className="w-5 h-5 rounded-sm" /><span className="text-sm">{selectedLang.code.toUpperCase()}</span><ChevronDownIcon className="h-4 w-4" /></button>
            {isDropdownOpen && (<div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">{languages.map((lang) => (<button key={lang.code} onClick={() => handleLanguageChange(lang)} className="flex items-center w-full px-3 py-2 hover:bg-gray-100 text-sm"><lang.Icon className="w-5 h-5 mr-2 rounded-sm" />{lang.name}</button>))}</div>)}
          </div>
        </div>
      </div>

      {isMobileSearchOpen && (<div className="md:hidden px-4 pb-3"><form className="w-full flex" onSubmit={handleSearch}><input type="text" placeholder={t('search_placeholder')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 border border-gray-300 px-4 py-2 rounded-l-md focus:outline-none" /><button type="submit" aria-label="Search" className="bg-teal-500 px-4 text-white hover:bg-teal-600 rounded-r-md"><SearchIcon className="h-6 w-6" /></button></form></div>)}
      
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-blue-800 text-white shadow-lg pb-4">
          <nav className="flex flex-col space-y-1 container mx-auto px-4">
            {mainNavLinks.map(link => <Link key={link.text} to={link.to} onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 rounded-md text-blue-100 hover:bg-blue-700">{link.text}</Link>)}
            <div className="border-t border-b border-blue-700 my-2">
              <button onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)} className="w-full flex justify-between items-center px-3 py-2 text-blue-100 font-semibold">{t('categories')}<ChevronDownIcon className={`h-5 w-5 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} /></button>
              {isCategoryDropdownOpen && (<div className="pl-6 border-l-2 border-blue-600 pb-2">{loadingCategories ? <div className="p-2 text-blue-200">Loading...</div> : categories.map(cat => (<Link key={cat.id} to={`/category/${cat.slug}`} onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm text-blue-200 hover:text-white">{cat.name}</Link>))}</div>)}
            </div>
            <Link to="/brands" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 rounded-md text-blue-100 hover:bg-blue-700">{t('brands')}</Link>
            <Link to="/deals" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 rounded-md text-blue-100 hover:bg-blue-700">{t('offers')}</Link>
            <div className="border-t border-blue-700 mt-2 pt-2">
              <h4 className="px-3 text-sm font-semibold text-gray-400 uppercase">Vendor</h4>
              {vendorZoneLinks.map(link => (<Link key={link.text} to={link.to} onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-blue-100 hover:bg-blue-700">{link.text}</Link>))}
            </div>
            <div className="border-t border-blue-700 mt-2 pt-2">
              <button onClick={() => setIsMobileLangOpen(!isMobileLangOpen)} className="w-full flex justify-between items-center px-3 py-2 text-blue-100 font-semibold"><span className="flex items-center gap-2"><Globe className="h-5 w-5" /> Language</span><ChevronDownIcon className={`h-5 w-5 transition-transform ${isMobileLangOpen ? 'rotate-180' : ''}`} /></button>
              {isMobileLangOpen && (<div className="pl-6 border-l-2 border-blue-600 pb-2">{languages.map((lang) => (<button key={lang.code} onClick={() => handleLanguageChange(lang)} className="w-full text-left flex items-center gap-2 py-2 text-sm text-blue-200 hover:text-white"><lang.Icon className="w-5 h-5 rounded-sm" />{lang.name}</button>))}</div>)}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
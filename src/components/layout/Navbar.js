import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { apiService } from './apiService';
import { endpoints } from '../../api/endpoints'; // Import endpoints
import { GridIcon, ChevronDownIcon } from '../../assets/icons';
import { Menu, X } from 'lucide-react';

// --- Reusable DropdownMenu ---
const DropdownMenu = ({
  buttonContent,
  links,
  dropdownWidth = "w-64",
  buttonClassName,
  isScrollable = false,
  isLoading = false,
}) => {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 200);
  };

  const linkClass = "block px-5 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-md text-sm";
  const scrollableClass = isScrollable ? "max-h-[70vh] overflow-y-auto" : "";

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className={buttonClassName} aria-expanded={open}>
        {buttonContent}
      </div>
      {open && (
        <div className={`absolute left-0 bg-white shadow-lg rounded-md mt-2 ${dropdownWidth} py-2 z-50 border border-gray-100 ${scrollableClass} transition-all duration-200`}>
          {isLoading ? <div className="p-4 text-center text-gray-500">Loading...</div> : links.map((link, index) => (
            <Link key={index} to={link.to} className={`${linkClass} ${link.isBold ? "font-bold border-t mt-2 pt-3" : ""}`}>
              {link.text}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};


// --- Main Navbar ---
const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // UPDATED: Use endpoints object for API calls
        const [catResponse, brandResponse] = await Promise.all([
          apiService(`${endpoints.categories}?parent_id=null`),
          apiService(`${endpoints.brands}?limit=8`) 
        ]);

        if (catResponse?.success && Array.isArray(catResponse?.data?.categories)) {
          setCategories(catResponse.data.categories);
        }
        if (brandResponse?.success && Array.isArray(brandResponse?.data?.brands)) {
          setBrands(brandResponse.data.brands);
        }
      } catch (err) {
        console.error("Failed to fetch navbar data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const mainNavLinks = [{ to: '/', text: 'Home' }];

  const offerLinks = [
      { to: "/deals?type=flash", text: "Flash Deals" },
      { to: "/products?featured=true", text: "Featured Products" },
      { to: "/products?top_rated=true", text: "Top Rated" },
  ];

  const brandLinks = [
    ...brands.map(brand => ({ to: `/products?brand=${brand.slug}`, text: brand.name })),
    { to: "/brands", text: "View All Brands", isBold: true }
  ];

  const vendorZoneLinks = [
    { to: '/vendor/signup', text: 'Become a Vendor' },
    { to: '/vendor/signin', text: 'Vendor Login' },
  ];

  const categoryLinks = loading
    ? []
    : categories
        .map((cat) => ({ to: `/category/${cat.slug}`, text: cat.name }))
        .concat([{ to: "/categories", text: "View All", isBold: true }]);

  const categoriesButtonClass = "flex items-center bg-white text-blue-800 font-semibold py-2.5 px-4 rounded-md border-2 border-transparent hover:bg-gray-100 transition-colors shadow-sm text-base justify-between";
  const defaultButtonClass = "flex items-center font-medium text-blue-100 hover:text-white transition-colors text-base px-3 py-2 cursor-pointer";

  return (
    <nav className="bg-blue-800 text-white shadow-md font-poppins sticky top-[64px] md:top-auto z-30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-x-1 w-full">
            <DropdownMenu
              buttonClassName={categoriesButtonClass}
              buttonContent={<><GridIcon className="h-5 w-5 mr-2" /><span>Categories</span><ChevronDownIcon className="h-5 w-5 ml-2 text-gray-400" /></>}
              links={categoryLinks}
              dropdownWidth="w-72"
              isScrollable
              isLoading={loading}
            />
            {mainNavLinks.map(link => (
              <NavLink key={link.text} to={link.to} className={({ isActive }) => `px-4 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-blue-900 text-white' : 'text-blue-100 hover:bg-blue-700'}`}>{link.text}</NavLink>
            ))}
            <DropdownMenu
              buttonContent={<><span>Brands</span><ChevronDownIcon className="h-5 w-5 ml-1 text-blue-200" /></>}
              buttonClassName={defaultButtonClass}
              links={brandLinks}
              isLoading={loading}
            />
            <DropdownMenu
              buttonContent={<><span>Offers</span><ChevronDownIcon className="h-5 w-5 ml-1 text-blue-200" /></>}
              buttonClassName={defaultButtonClass}
              links={offerLinks}
            />
            <DropdownMenu
              buttonContent={<><span>Vendor Zone</span><ChevronDownIcon className="h-5 w-5 ml-1 text-blue-200" /></>}
              buttonClassName={defaultButtonClass}
              links={vendorZoneLinks}
              dropdownWidth="w-56"
            />
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white focus:outline-none p-2" aria-label="Open menu">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-1">
              {mainNavLinks.map(link => <Link key={link.text} to={link.to} onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 rounded-md text-blue-100 hover:bg-blue-700">{link.text}</Link>)}
              
              {/* Mobile Categories Dropdown */}
              <div className="border-t border-b border-blue-700 my-2">
                <button
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className="w-full flex justify-between items-center px-3 py-2 text-blue-100 font-semibold"
                >
                  Categories
                  <ChevronDownIcon className={`h-5 w-5 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isCategoryDropdownOpen && (
                  <div className="pl-6 border-l-2 border-blue-600 pb-2">
                    {loading ? <div className="p-2 text-blue-200">Loading...</div> : categories.map(cat => (
                      <Link key={cat.id} to={`/category/${cat.slug}`} onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm text-blue-200 hover:text-white">
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/brands" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 rounded-md text-blue-100 hover:bg-blue-700">Brands</Link>
              <Link to="/deals" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 rounded-md text-blue-100 hover:bg-blue-700">Offers</Link>
              
              <div className="border-t border-blue-700 mt-2 pt-2">
                <h4 className="px-3 text-sm font-semibold text-gray-400 uppercase">Vendor</h4>
                {vendorZoneLinks.map(link => (
                    <Link key={link.text} to={link.to} onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-blue-100 hover:bg-blue-700">{link.text}</Link>
                ))}
              </div>
            </nav>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

// src/components/layout/Navbar.js
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { apiService } from "./apiService"; // adjust path if yours differs
import { GridIcon, ChevronDownIcon } from "../../assets/icons"; // ✅ icons from assets

// --- Reusable DropdownMenu ---
const DropdownMenu = ({
  buttonContent,
  links,
  dropdownWidth = "w-64",
  buttonClassName,
  isScrollable = false,
}) => {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 200); // gentle close delay
  };

  const linkClass =
    "block px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-[#1455ac] transition-colors rounded-md text-base";
  const scrollableClass = isScrollable
    ? "max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
    : "";

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Button */}
      <button type="button" className={buttonClassName} aria-expanded={open}>
        {buttonContent}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={`absolute left-0 bg-white shadow-lg rounded-md mt-2 ${dropdownWidth} py-3 z-50 border border-gray-100 ${scrollableClass} transition-all duration-200`}
        >
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.to}
              className={`${linkClass} ${link.isBold ? "font-bold border-t mt-2 pt-3" : ""}`}
            >
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await apiService("/categories?parent_id=null");
        if (mounted && response?.success && Array.isArray(response?.data?.categories)) {
          setCategories(response.data.categories);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const mainNavLinks = [
    { to: "/", text: "Home" },
    { to: "/brands", text: "Brands" },
    { to: "/deals", text: "Offers" },
  ];

  const vendorZoneLinks = [
    { to: "/vendor/signup", text: "Become a Vendor" },
    { to: "/vendor/signin", text: "Vendor Login" },
  ];

  const categoryLinks = loading
    ? [{ to: "#", text: "Loading..." }]
    : categories
        .map((cat) => ({ to: `/category/${cat.slug}`, text: cat.name }))
        .concat([{ to: "/categories", text: "View All", isBold: true }]);

  const categoriesButtonClass =
    "flex items-center bg-white text-[#1455ac] font-semibold py-3 px-6 rounded-lg border-2 border-transparent hover:bg-blue-50 transition-colors shadow-sm text-base w-56 justify-between";
  const defaultButtonClass =
    "flex items-center font-medium text-blue-100 hover:text-white transition-colors text-base px-3 py-2";

  return (
    <nav className="bg-blue-800 text-white shadow-md font-poppins">
      <div className="container mx-auto px-6">
        <div className="flex items-center flex-wrap gap-y-2 py-3">
          <div className="flex items-center flex-wrap gap-x-6 gap-y-2 md:gap-x-7">
            {/* Categories Dropdown */}
            <div className="flex-shrink-0">
              <DropdownMenu
                buttonClassName={categoriesButtonClass}
                buttonContent={
                  <>
                    <div className="flex items-center gap-2">
                      <GridIcon className="h-6 w-6 text-[#1455ac]" />
                      <span>Categories</span>
                    </div>
                    <ChevronDownIcon className="h-5 w-5 text-gray-200" />
                  </>
                }
                links={categoryLinks}
                dropdownWidth="w-72"
                isScrollable
              />
            </div>

            {/* Main Navigation Links */}
            {mainNavLinks.map((link) => (
              <Link
                key={link.text}
                to={link.to}
                className="font-medium text-blue-100 hover:text-white transition-colors whitespace-nowrap text-base px-3 py-2"
              >
                {link.text}
              </Link>
            ))}

            {/* Vendor Zone Dropdown */}
            <DropdownMenu
              buttonClassName={defaultButtonClass}
              buttonContent={
                <>
                  <div className="flex items-center gap-2">
                    <GridIcon className="h-6 w-6 text-blue-100" />
                    <span>Vendor Zone</span>
                  </div>
                  <ChevronDownIcon className="h-5 w-5 ml-1 text-blue-100" />
                </>
              }
              links={vendorZoneLinks}
              dropdownWidth="w-56"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

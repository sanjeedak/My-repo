import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiService } from './apiService';
import { endpoints } from '../../api/endpoints';
import { GridIcon, ChevronDownIcon } from '../../assets/icons';

// --- Reusable DropdownMenu ---
const DropdownMenu = ({
  buttonContent,
  links,
  dropdownWidth = "w-64",
  buttonClassName,
  isScrollable = false,
  isLoading = false,
  showImages = false,
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

  const linkClass =
    "flex items-center gap-2 px-5 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-md text-sm";
  const scrollableClass = isScrollable ? "max-h-[70vh] overflow-y-auto" : "";

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={buttonClassName} aria-expanded={open}>
        {buttonContent}
      </div>
      {open && (
        <div
          className={`absolute left-0 bg-white shadow-lg rounded-md mt-2 ${dropdownWidth} py-2 z-50 border border-gray-100 ${scrollableClass} transition-all duration-200`}
        >
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : (
            links.map((link, index) => (
              <Link
                key={index}
                to={link.to}
                className={`${linkClass} ${
                  link.isBold ? "font-bold border-t mt-2 pt-3" : ""
                }`}
              >
                {showImages && (
                  link.image ? (
                    <img
                      src={link.image}
                      alt={link.text}
                      className="h-7 w-7 object-cover rounded-full"
                    />
                  ) : (
                    <div className="h-7 w-7 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                      {link.text?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                  )
                )}
                {link.text}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// --- Main Navbar (Desktop Only) ---
const Navbar = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catResponse, brandResponse] = await Promise.all([
          apiService(endpoints.categories),
          apiService(`${endpoints.brands}?limit=8`),
        ]);

        if (
          catResponse?.success &&
          Array.isArray(catResponse?.data?.categories)
        ) {
          setCategories(catResponse.data.categories);
        }
        if (
          brandResponse?.success &&
          Array.isArray(brandResponse?.data?.brands)
        ) {
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

  const mainNavLinks = [{ to: '/', text: t('home') }];

  const offerLinks = [
    { to: "/products?section=flash_deal", text: t('flash_deals') },
    { to: "/products?section=featured", text: t('featured_products') },
    { to: "/products?section=top_rated", text: t('top_rated') },
  ];

  const brandLinks = [
    ...brands.map((brand) => ({
      to: `/products?brand=${brand.slug}`,
      text: brand.name,
    })),
    { to: "/brands", text: t('view_all_brands'), isBold: true },
  ];

  const vendorZoneLinks = [
    { to: '/vendor/signup', text: t('become_a_vendor') },
    { to: '/vendor/signin', text: t('vendor_login') },
  ];

  const categoryLinks = loading
    ? []
    : categories
        .map((cat) => ({
          to: `/category/${cat.slug}`,
          text: cat.name,
          image: cat.image,
        }))
        .concat([{ to: "/categories", text: "View All", isBold: true }]);

  const categoriesButtonClass =
    "flex items-center bg-white text-blue-800 font-semibold py-2.5 px-4 rounded-md border-2 border-transparent hover:bg-gray-100 transition-colors shadow-sm text-base justify-between";
  const defaultButtonClass =
    "flex items-center font-medium text-blue-100 hover:text-white transition-colors text-base px-3 py-2 cursor-pointer";

  return (
    <nav className="hidden md:block bg-blue-800 text-white shadow-md font-poppins z-30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-x-1 w-full">
            <DropdownMenu
              buttonClassName={categoriesButtonClass}
              buttonContent={
                <>
                  <GridIcon className="h-5 w-5 mr-2" />
                  <span>{t('categories')}</span>
                  <ChevronDownIcon className="h-5 w-5 ml-2 text-gray-400" />
                </>
              }
              links={categoryLinks}
              dropdownWidth="w-72"
              isScrollable
              isLoading={loading}
              showImages
            />
            {mainNavLinks.map((link) => (
              <NavLink
                key={link.text}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? 'bg-blue-900 text-white'
                      : 'text-blue-100 hover:bg-blue-700'
                  }`
                }
              >
                {link.text}
              </NavLink>
            ))}
            <DropdownMenu
              buttonContent={
                <>
                  <span>{t('brands')}</span>
                  <ChevronDownIcon className="h-5 w-5 ml-1 text-blue-200" />
                </>
              }
              buttonClassName={defaultButtonClass}
              links={brandLinks}
              isLoading={loading}
            />
            <DropdownMenu
              buttonContent={
                <>
                  <span>{t('offers')}</span>
                  <ChevronDownIcon className="h-5 w-5 ml-1 text-blue-200" />
                </>
              }
              buttonClassName={defaultButtonClass}
              links={offerLinks}
            />
            <DropdownMenu
              buttonContent={
                <>
                  <span>{t('vendor_zone')}</span>
                  <ChevronDownIcon className="h-5 w-5 ml-1 text-blue-200" />
                </>
              }
              buttonClassName={defaultButtonClass}
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
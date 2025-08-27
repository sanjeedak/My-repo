import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from './apiService'; // Make sure this path is correct

// --- SVG Icon Components ---
const GridIcon = ({ className = "h-5 w-5 mr-2" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);

const ChevronDownIcon = ({ className = "h-4 w-4 ml-auto" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

// --- Reusable DropdownMenu Component ---
const DropdownMenu = ({ buttonContent, links, dropdownWidth = 'w-60', buttonClassName, isScrollable = false }) => {
    const linkClass = "block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#1455ac] transition-colors rounded-md text-sm";
    const scrollableClass = isScrollable ? 'max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100' : '';

    return (
        <div className="group relative">
            <button className={buttonClassName}>
                {buttonContent}
            </button>
            <div className={`absolute hidden group-hover:block bg-white shadow-lg rounded-md mt-2 ${dropdownWidth} py-2 z-50 border border-gray-100 ${scrollableClass}`}>
                {links.map((link, index) => (
                    <Link key={index} to={link.to} className={`${linkClass} ${link.isBold ? 'font-bold border-t mt-1 pt-2' : ''}`}>
                        {link.text}
                    </Link>
                ))}
            </div>
        </div>
    );
};

// --- Main Navbar Component ---
const Navbar = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiService('/categories?parent_id=null');
                if (response.success && Array.isArray(response.data.categories)) {
                    setCategories(response.data.categories);
                }
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const mainNavLinks = [
        { to: '/', text: 'Home' },
        { to: '/brands', text: 'Brands' },
        { to: '/deals', text: 'Offers' }
    ];

    const vendorZoneLinks = [
        { to: '/vendor/signup', text: 'Become a Vendor' },
        { to: '/vendor/signin', text: 'Vendor Login' }
    ];

    const categoryLinks = loading
        ? [{ to: '#', text: 'Loading...' }]
        : categories.map(cat => ({ to: `/category/${cat.slug}`, text: cat.name }))
            .concat([{ to: '/categories', text: 'View All', isBold: true }]);

    const categoriesButtonClass = "flex items-center bg-white text-[#1455ac] font-semibold py-2 px-4 rounded-lg border-2 border-transparent hover:bg-blue-50 transition-colors shadow-sm text-sm w-48 justify-between";
    const defaultButtonClass = "flex items-center font-medium text-blue-100 hover:text-white transition-colors text-sm";

    return (
        <nav className="bg-blue-800 text-white shadow-md font-poppins">
            <div className="container mx-auto px-4">
                <div className="flex items-center flex-wrap gap-y-2 py-1">
                    {/* All links are now in a single container */}
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-2 md:gap-x-5">
                        {/* Categories Dropdown */}
                        <div className="flex-shrink-0">
                            <DropdownMenu
                                buttonClassName={categoriesButtonClass}
                                buttonContent={<>
                                    <div className="flex items-center">
                                        <GridIcon />
                                        <span>Categories</span>
                                    </div>
                                    <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                                </>}
                                links={categoryLinks}
                                dropdownWidth="w-64"
                                isScrollable={true}
                            />
                        </div>
                        {/* Main Navigation Links */}
                        {mainNavLinks.map(link => (
                            <Link key={link.text} to={link.to} className="font-medium text-blue-100 hover:text-white transition-colors whitespace-nowrap text-sm px-2">
                                {link.text}
                            </Link>
                        ))}
                        {/* Vendor Zone Links */}
                        <DropdownMenu
                            buttonClassName={defaultButtonClass}
                            buttonContent={<><span>Vendor Zone</span><ChevronDownIcon className="h-4 w-4 ml-1 text-blue-100" /></>}
                            links={vendorZoneLinks}
                            dropdownWidth="w-48"
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import { apiService } from './apiService';

// --- SVG Icon Components ---
const GridIcon = ({ className = "h-5 w-5 mr-2" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

// --- Reusable DropdownMenu Component ---
const DropdownMenu = ({ buttonContent, links, dropdownWidth = 'w-60', buttonClassName }) => {
    // Using a blue theme for hover effects
    const linkClass = "block px-4 py-2 text-blue-700 hover:bg-blue-50 hover:text-[#1455ac] transition-colors rounded-md";

    return (
        <div className="group relative">
            <button className={buttonClassName}>
                {buttonContent}
            </button>
            <div className={`absolute hidden group-hover:block bg-white shadow-lg rounded-md mt-2 ${dropdownWidth} py-2 z-50 border border-blue-100`}>
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
                const data = await new Promise(resolve => setTimeout(() => resolve({
                     success: true,
                     data: {
                         categories: [
                             { parent_id: null, slug: 'electronics', name: 'Electronics' },
                             { parent_id: null, slug: 'fashion', name: 'Fashion' },
                             { parent_id: null, slug: 'home-garden', name: 'Home & Garden' },
                             { parent_id: null, slug: 'books', name: 'Books' },
                             { parent_id: null, slug: 'sports', name: 'Sports & Outdoors' },
                         ],
                     },
                }), 1000));

                if (data.success) {
                    const topLevel = data.data.categories.filter(cat => cat.parent_id === null);
                    setCategories(topLevel.slice(0, 8));
                }
            } catch (err)
 {
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
        { to: '/deals', 'text': 'Offers' }
    ];

    const categoryLinks = loading
        ? [{ to: '#', text: 'Loading...' }]
        : categories.map(cat => ({ to: `/categories/${cat.slug}`, text: cat.name }))
            .concat([{ to: '/categories', text: 'View All', isBold: true }]);

    const vendorZoneLinks = [
        { to: '/vendor/signup', text: 'Become a Vendor' },
        { to: '/vendor/signin', text: 'Vendor Login' }
    ];

    // --- Styling to match the provided image ---
    const categoriesButtonClass = "flex items-center bg-white text-[#1455ac] font-semibold py-2 px-3 rounded-lg border-2 border-[#1455ac] hover:bg-blue-50 transition-colors shadow-sm text-sm w-48 justify-between";
    const defaultButtonClass = "flex items-center font-medium text-gray-800 hover:text-[#1455ac] transition-colors text-sm";

    return (
        // Using a light background and "Open Sans" font family
        <nav className="bg-blue-600 text-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-3 items-center py-2">
                    {/* Left & Center Links */}
                    <div className="flex items-center flex-wrap gap-x-3 gap-y-2 md:gap-x-3">
                        {/* Categories Dropdown */}
                        <div className="flex-shrink-0">
                            <DropdownMenu
                                buttonClassName={categoriesButtonClass}
                                buttonContent={<>
                                    <div className="flex items-center">
                                        <GridIcon />
                                        <span>Categories</span>
                                    </div>
                                    <ChevronDownIcon />
                                </>}
                                links={categoryLinks}
                                dropdownWidth="w-48"
                            />
                        </div>
                        {/* Main Navigation Links */}
                        {mainNavLinks.map(link => (
                            <Link key={link.text} to={link.to} className="font-medium text-gray-800 hover:text-[#1455ac] transition-colors whitespace-nowrap text-sm">
                                {link.text}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Links */}
                    <div className="flex items-center">
                        <DropdownMenu
                            buttonClassName={defaultButtonClass}
                            buttonContent={<><span>Vendor Zone</span><ChevronDownIcon /></>}
                            links={vendorZoneLinks}
                            dropdownWidth="w-48"
                        />
                    </div>
                     <div className="justify-self-end"></div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

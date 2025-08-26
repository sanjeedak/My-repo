import React, { useState, useEffect } from 'react';
// The Link component from react-router-dom requires a parent <Router> component.
// To make this component self-contained and runnable, we'll use a simple anchor tag.
const Link = ({ to, children, className }) => <a href={to} className={className}>{children}</a>;

// import { apiService } from './apiService'; // Assuming you have an API service utility

// --- SVG Icon Components ---
const MenuIcon = ({ className = "h-5 w-5 mr-2" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

// --- Reusable DropdownMenu Component ---
const DropdownMenu = ({ buttonContent, links, dropdownWidth = 'w-60', buttonClassName }) => {
    const linkClass = "block px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-md";

    return (
        <div className="group relative">
            <button className={buttonClassName}>
                {buttonContent}
            </button>
            <div className={`absolute hidden group-hover:block bg-white shadow-lg rounded-md mt-1 ${dropdownWidth} py-2 z-50`}>
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
                // Example of how you might call your actual apiService
                // const data = await apiService('/categories');
                // For demonstration, using a mock promise
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

    const categoryLinks = loading
        ? [{ to: '#', text: 'Loading...' }]
        : categories.map(cat => ({ to: `/categories/${cat.slug}`, text: cat.name }))
            .concat([{ to: '/categories', text: 'View All', isBold: true }]);

    const vendorZoneLinks = [
        { to: '/vendor/signup', text: 'Become a Vendor' },
        { to: '/vendor/signin', text: 'Vendor Login' }
    ];

    const categoriesButtonClass = "flex items-center bg-blue-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-800 transition-colors";
    const defaultButtonClass = "flex items-center font-medium hover:opacity-80 transition-opacity";

    return (
        <nav className="bg-blue-600 text-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex items-center flex-wrap gap-y-3 py-3">

                    {/* Left Side: Categories Dropdown */}
                    <div className="flex-shrink-0 mr-4 md:mr-6">
                        <DropdownMenu
                            buttonClassName={categoriesButtonClass}
                            buttonContent={<><MenuIcon /><span>Categories</span><ChevronDownIcon /></>}
                            links={categoryLinks}
                        />
                    </div>

                    {/* Center: Navigation Links (always visible) */}
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-2 md:gap-x-6">
                        {mainNavLinks.map(link => (
                            <Link key={link.text} to={link.to} className="font-medium hover:opacity-80 transition-opacity whitespace-nowrap">
                                {link.text}
                            </Link>
                        ))}
                        <DropdownMenu
                            buttonClassName={defaultButtonClass}
                            buttonContent={<><span>Vendor Zone</span><ChevronDownIcon /></>}
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

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../api/apiService';

// --- SVG Icon Components ---
const MenuIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg> );
const ChevronDownIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg> );

// --- Reusable DropdownMenu Component ---
const DropdownMenu = ({ buttonContent, links, dropdownWidth = 'w-60', buttonClassName }) => {
    const linkClass = "block px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors";
    
    return (
        <div className="group relative">
            <button className={buttonClassName}>
                {buttonContent}
            </button>
            <div className={`absolute hidden group-hover:block bg-white shadow-lg rounded-md mt-1 ${dropdownWidth} py-2 z-50`}>
                {links.map((link, index) => (
                    <Link key={index} to={link.to} className={`${linkClass} ${link.isBold ? 'font-bold border-t mt-1' : ''}`}>
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
                const data = await apiService('/api/categories');
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
        { to: '/brands', text: 'Brand' },
        { to: '/deals', text: 'Offers' }
    ];

    const categoryLinks = loading
        ? [{ to: '#', text: 'Loading...' }]
        : categories.map(cat => ({ to: `/category/${cat.slug}`, text: cat.name }))
            .concat([{ to: '/categories', text: 'View All', isBold: true }]);

    const vendorZoneLinks = [
        { to: '/vendor/signup', text: 'Become a Vendor' },
        { to: '/vendor/login', text: 'Vendor Login' }
    ];
    
    const categoriesButtonClass = "flex items-center bg-blue-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-800 transition-colors";
    const defaultButtonClass = "flex items-center font-medium hover:opacity-80 transition-opacity";
    
    return (
        <nav className="bg-blue-600 text-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-3 items-center py-2">
                    
                    <div className="justify-self-start">
                        <DropdownMenu
                            buttonClassName={categoriesButtonClass}
                            buttonContent={<><MenuIcon /><span>Categories</span><ChevronDownIcon /></>}
                            links={categoryLinks}
                        />
                    </div>

                    <div className="hidden md:flex items-center justify-center space-x-6">
                        {mainNavLinks.map(link => (
                            <Link key={link.text} to={link.to} className="font-medium hover:opacity-80 transition-opacity">
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

                    <div className="justify-self-end"></div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;
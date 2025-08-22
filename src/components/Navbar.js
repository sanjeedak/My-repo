import React from 'react';
import { Link } from 'react-router-dom';
import { MenuIcon,ChevronDownIcon  } from '../assets/icons';

/**
 * Navbar Component
 * A beautified secondary navigation bar with categories and all vendors dropdown.
 */
const Navbar = () => {
    return (
        <nav className="bg-blue-700 px-4 text-white">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-3">
                    {/* Categories Dropdown */}
                    <div className="group relative">
                        <button className="flex items-center border-2 border-indigo-800 text-indigo-800 font-bold py-2 px-4 rounded-md bg-white hover:opacity-90 transition-opacity">
                            <MenuIcon />
                            <span>Categories</span>
                            <ChevronDownIcon />
                        </button>

                        {/* Categories Dropdown Menu (hidden by default) */}
                        <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md mt-0 w-60 py-2 z-50">
                            <a href="/products/Men's%20Fashion" className="block px-4 py-2 text-slate-700 hover:bg-amber-100 hover:text-amber-800">Men's Fashion</a>
                            <a href="/products/Women's%20Fashion" className="block px-4 py-2 text-slate-700 hover:bg-amber-100 hover:text-amber-800">Women's Fashion</a>
                            <a href="/products/Kid's%20Fashion" className="block px-4 py-2 text-slate-700 hover:bg-amber-100 hover:text-amber-800">Kid's Fashion</a>
                            <a href="/products/Home%20%26%20Kitchen" className="block px-4 py-2 text-slate-700 hover:bg-amber-100 hover:text-amber-800">Home & Kitchen</a>
                        </div>
                    </div>

                    {/* Main Navigation Links Dropdown */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-white font-medium hover:text-amber-600 transition-colors">Home</Link>
                        <Link to="/brand" className="text-white font-medium hover:text-amber-600 transition-colors">Brand</Link>
                        <Link to="/offers" className="text-white font-medium hover:text-amber-600 transition-colors">Offers</Link>

                        <div className="group relative">
                            <button className="flex items-center text-white font-medium hover:text-amber-600 transition-colors">
                                All Vendors
                                <ChevronDownIcon />
                            </button>
                            <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md mt-0 w-60 py-2 z-50">
                                <Link to="/signup" className="block px-4 py-2 text-slate-700 hover:bg-amber-100 hover:text-amber-800">Become a Vendor</Link>
                                <Link to="/signin" className="block px-4 py-2 text-slate-700 hover:bg-amber-100 hover:text-amber-800">Vendor Login</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
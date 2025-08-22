import React from 'react';

/**
 * Footer Component
 * Renders the footer for the website, which includes important links,
 * contact information, and the copyright notice.
 */
const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white pt-12 mt-8">
            <div className="container mx-auto px-4">
                {/* Top section of the footer with links and info */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    
                    {/* About Section */}
                    <div className="space-y-4">
                        <img 
                          src="https://6valley.6amtech.com/storage/app/public/company/2023-06-07-64803e22393c1.png" 
                          alt="Shopzeo White Logo" 
                          className="h-10" 
                        />
                        <p className="text-sm text-gray-400">
                            The ultimate multivendor eCommerce solution for your business. 
                            Build your online store and grow your brand with us.
                        </p>
                    </div>

                    {/* Special Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Special</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Flash Deal</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Featured Products</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Latest Products</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Best Selling Products</a></li>
                        </ul>
                    </div>

                    {/* Account Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Account & Shipping Info</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Profile Info</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Wish List</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Track Order</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Refund Policy</a></li>
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                           <li>Email: support@shopzeo.in</li>
                           <li>Phone: +123 456 7890</li>
                           <li>Address: 123 Tech Street, Silicon Valley, CA</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom section of the footer with copyright */}
                <div className="mt-8 py-4 border-t border-gray-700 text-center text-sm text-gray-500">
                    <p>Copyright © 2024 Shopzeo. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

import React from 'react';
import { FaLinkedin, FaInstagram, FaPinterest, FaTwitter, FaFacebook } from "react-icons/fa";
import { Link } from 'react-router-dom';

// --- SVG Icon Components ---
const PhoneIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>);
const MailIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>);
const SupportIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>);
const LocationIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
const ChevronUpIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>);

const Footer = () => {
    const linkHoverClass = "hover:text-white transition-colors";

    return (
        <footer className="mt-6 text-slate-300">
            {/* Main Footer Section */}
            <div className="bg-[#203956] pt-6 px-2">
                <div className="px-20 mx-auto">
                    {/* Top Links Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">
                        {/* Brand & Downloads */}
                        <div className="space-y-4">
                            <img src="/img/logo_shopzeo.png" alt="Shopzeo Logo" className="h-8" />
                            <h3 className="text-white uppercase text-sm font-semibold tracking-wider pt-4">Download Our App</h3>
                            <div className="flex gap-2">
                                <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
                                    <img src="/img/appstore.jpeg" alt="App Store" className="h-10 object-contain" />
                                </a>
                                <a href="https://play.google.com/store/apps" target="_blank" rel="noopener noreferrer">
                                    <img src="/img/googleplay.jpeg" alt="Google Play" className="h-10 object-contain" />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-white uppercase text-sm font-semibold tracking-wider mb-4">Quick Links</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/profile" className={linkHoverClass}>Profile Info</Link></li>
                                <li><Link to="/deals" className={linkHoverClass}>Flash Deal</Link></li>
                                <li><Link to="/products" className={linkHoverClass}>Featured Products</Link></li>
                                <li><Link to="/best-selling" className={linkHoverClass}>Best Selling Product</Link></li>
                                <li><Link to="/latest" className={linkHoverClass}>Latest Products</Link></li>
                                <li><Link to="/top-rated" className={linkHoverClass}>Top Rated Product</Link></li>
                                <li><Link to="/track-order" className={linkHoverClass}>Track Order</Link></li>
                            </ul>
                        </div>

                        {/* Other Links */}
                        <div>
                            <h3 className="text-white uppercase text-sm font-semibold tracking-wider mb-4">Other</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/about" className={linkHoverClass}>About Us</Link></li>
                                <li><Link to="/terms" className={linkHoverClass}>Terms And Conditions</Link></li>
                                <li><Link to="/privacy" className={linkHoverClass}>Privacy Policy</Link></li>
                                <li><Link to="/refund" className={linkHoverClass}>Refund Policy</Link></li>
                                <li><Link to="/return" className={linkHoverClass}>Return Policy</Link></li>
                                <li><Link to="/cancellation" className={linkHoverClass}>Cancellation Policy</Link></li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h3 className="text-white uppercase text-sm font-semibold tracking-wider mb-4">Newsletter</h3>
                            <p className="text-sm mb-4">Subscribe to our new channel to get latest updates</p>
                            <form onSubmit={(e) => e.preventDefault()} className="flex items-center">
                                <input type="email" placeholder="Your Email Address" className="w-full bg-[#19314D] text-white px-4 py-2.5 border border-slate-600 rounded-l-md focus:outline-none placeholder:text-slate-400" />
                                <button type="submit" className="bg-white text-[#203956] font-semibold px-4 py-2.5 rounded-r-md hover:bg-slate-200 transition-colors">
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Contact Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-5 text-sm">
                        {/* Start A Conversation */}
                        <div>
                            <h3 className="text-white font-semibold mb-2">Start A Conversation</h3>
                            <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-x-4 gap-y-2">
                                <a href="tel:+917348832668" className="flex items-center gap-2 text-md"><PhoneIcon /> <span>+91 73488 32668</span></a>
                                <a href="mailto:shopzeo@shopzeo.in" className="flex items-center gap-2 text-md"><MailIcon /> <span>shopzeo@shopzeo.in</span></a>
                                <Link to="/support" className="flex items-center gap-2 text-md"><SupportIcon /> <span>Support ticket</span></Link>
                            </div>
                        </div>
                        {/* Address */}
                        <div>
                            <h3 className="text-white font-semibold mb-2">Address</h3>
                            <div className="flex items-start gap-2">
                                <LocationIcon className="mt-1 flex-shrink-0" />
                                <span>2447,16th B Main, Kodihalli,HAL 2nd Stage,Bangalore-560008</span>
                            </div>
                        </div>
                        {/* Social */}
                        <div>
                            <h3 className="text-white font-semibold mb-2">Social</h3>
                            <div className="flex items-center gap-5">
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin className="w-6 h-6 text-white" /></a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram className="w-6 h-6 text-white" /></a>
                                <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest"><FaPinterest className="w-6 h-6 text-white" /></a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter className="w-6 h-6 text-white" /></a>
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook className="w-6 h-6 text-white" /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright Bar */}
            <div className="bg-[#162E48] relative">
                <div className="container mx-auto px-6 py-4 text-center text-sm">
                    Copyright©Shopzeo
                </div>
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="absolute right-4 -top-4 w-10 h-10 flex items-center justify-center rounded-full bg-[#3B76DD] text-white hover:bg-[#2563eb] transition-colors"
                >
                    <ChevronUpIcon />
                </button>
            </div>
        </footer>
    );
}

export default Footer;
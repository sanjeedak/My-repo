import React from 'react';
import { Link } from 'react-router-dom';

const AuthFormLayout = ({ title, children, footerLink, footerText, footerActionText }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center p-4" style={{ backgroundImage: "url('/img/vendor-auth-bg.jpg')" }}>
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <Link to="/">
                        <img src="/img/logo_shopzeo.png" alt="Shopzeo Logo" className="h-12 mx-auto" />
                    </Link>
                </div>
                <div className="bg-white rounded-xl shadow-2xl p-8 md:p-12">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">{title}</h2>
                    {children}
                </div>
                <div className="text-center mt-6">
                    <p className="text-sm text-white">
                        {footerText}{' '}
                        <Link to={footerLink} className="font-semibold text-white hover:underline">
                            {footerActionText}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthFormLayout;
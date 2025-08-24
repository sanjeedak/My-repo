import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthFormLayout from '../components/layout/AuthFormLayout';

// A styled input field with a label.
const InputField = ({ id, label, type, value, onChange, error, autoComplete }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
        <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            autoComplete={autoComplete}
            className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow sm:text-sm`}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

// --- Main Vendor Sign-In Page Component ---

const VendorSignInPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        if (errors[e.target.id]) {
            setErrors({ ...errors, [e.target.id]: null });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // --- Your API call for vendor sign-in would go here ---
        console.log('Vendor sign-in attempt:', formData);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            navigate('/vendor/dashboard'); // Redirect on successful login
        }, 1500);
    };

    return (
        <AuthFormLayout>
            <div className="text-center mb-6">
                <h2 className="text-3xl font-extrabold text-gray-900">
                    Vendor Login
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Welcome back! Please sign in to your dashboard.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <InputField
                    id="email"
                    label="Your Email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                />
                <InputField
                    id="password"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                />
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
                    </div>
                    <div className="text-sm">
                        <Link to="/vendor/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                            Forgot password?
                        </Link>
                    </div>
                </div>
                <div>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 transition-colors"
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </div>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Don't have a vendor account?{' '}
                    <Link to="/vendor/signin" className="font-semibold text-blue-600 hover:underline">
                        Sign Up Now
                    </Link>
                </p>
            </div>
        </AuthFormLayout>
    );
};

export default VendorSignInPage;
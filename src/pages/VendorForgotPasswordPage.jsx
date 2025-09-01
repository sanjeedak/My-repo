import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthFormLayout from '../components/layout/AuthFormLayout';
import { apiService } from '../components/layout/apiService';
import { sanitizeInput, validateEmailPhone } from '../utils/sanatize';
import InfoCards from '../components/layout/InfoCards';
import { endpoints } from '../api/endpoints'; // Import endpoints

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

const VendorForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setEmail(sanitizeInput(e.target.value));
        setError('');
        setMessage('');
    };

    const handleClose = () => {
        if (email) {
            if (!window.confirm('Are you sure you want to close? Unsaved changes will be lost.')) return;
        }
        navigate(-1);
    };

    const validateForm = () => {
        const emailError = validateEmailPhone(email, true);
        if (emailError) {
            setError(emailError);
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setIsLoading(true);
        try {
            // API call to send password reset link for vendors
            await apiService(endpoints.vendorForgotPassword, { // CORRECTED
                method: 'POST',
                body: { email },
            });
            setMessage('A password reset link has been sent to your email.');
        } catch (error) {
            setError(error.message || 'Failed to send reset link. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-50">
            <AuthFormLayout>
                 <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition-colors"
                    aria-label="Close form"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Vendor Forgot Password
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter your email to receive a reset link.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <InputField
                        id="email"
                        label="Your Email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={handleChange}
                        error={error}
                    />
                    {message && <p className="text-green-600 text-xs text-center">{message}</p>}
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 transition-colors"
                        >
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Remember your password?{' '}
                        <Link to="/vendor/signin" className="font-semibold text-blue-600 hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </AuthFormLayout>
            <InfoCards />
        </div>
    );
};

export default VendorForgotPasswordPage;

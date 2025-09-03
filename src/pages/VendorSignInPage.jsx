import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthFormLayout from '../components/layout/AuthFormLayout';
import InfoCards from '../components/layout/InfoCards';
import { apiService } from '../components/layout/apiService';
import { endpoints } from '../api/endpoints';
import { useAuth } from '../context/AuthContext'; 

const InputField = ({ id, label, type, value, onChange, error, autoComplete }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
        <input
            id={id}
            type={type}
            name={id}
            value={value}
            onChange={onChange}
            autoComplete={autoComplete}
            className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow sm:text-sm`}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

const VendorSignInPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth(); 
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name] || errors.submit) {
            setErrors({ ...errors, [e.target.name]: null, submit: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        try {
            const response = await apiService(endpoints.vendorLogin, {
                method: 'POST',
                body: formData,
            });

            if (response.success && response.data.token) {
                login(response.data.vendor, response.data.token);
                navigate('/vendor/dashboard'); 
            } else {
                throw new Error(response.message || 'Login failed.');
            }
        } catch (error) {
            setErrors({ submit: error.message || 'Invalid credentials. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <AuthFormLayout>
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        {t('vendor_login')}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {t('vendor_signin_welcome')}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <InputField
                        id="email"
                        label={t('your_email')}
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                    />
                    <InputField
                        id="password"
                        label={t('password')}
                        type="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                    />
                    {errors.submit && <p className="text-xs text-red-600 text-center">{errors.submit}</p>}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">{t('remember_me')}</label>
                        </div>
                        <div className="text-sm">
                            <Link to="/vendor/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                                {t('forgot_password')}?
                            </Link>
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 transition-colors"
                        >
                            {isLoading ? t('sending') : t('sign_in')}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        {t('dont_have_vendor_account')}{' '}
                        <Link to="/vendor/signup" className="font-semibold text-blue-600 hover:underline">
                            {t('signup_now')}
                        </Link>
                    </p>
                </div>
            </AuthFormLayout>
            <InfoCards />
        </>
    );
};

export default VendorSignInPage;
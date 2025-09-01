import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import InputField from '../components/forms/InputField';
import { apiService } from '../components/layout/apiService';
import { endpoints } from '../api/endpoints';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiMessage, setApiMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Current password is required.';
        }
        if (!formData.newPassword) {
            newErrors.newPassword = 'New password is required.';
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters.';
        }
        if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);
        setApiMessage('');
        try {
            const payload = {
                old_password: formData.currentPassword,
                new_password: formData.newPassword
            };

            const response = await apiService(endpoints.userChangePassword, {
                method: 'POST',
                body: payload,
            });

            if (response.success) {
                setApiMessage('Password has been reset successfully!');
                setTimeout(() => {
                    navigate('/signin');
                }, 2000);
            } else {
                throw new Error(response.message || 'Password reset failed.');
            }
        } catch (error) {
            // Check for the specific verification error message
            if (error.message.includes('not verified')) {
                setErrors({ submit: 'Account not verified. Please complete verification before changing your password.' });
            } else {
                setErrors({ submit: error.message || 'An error occurred during password reset.' });
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 font-sans">
            <div className="w-full max-w-md">
                <div className="text-center mb-6">
                    <Link to="/">
                        <img src="/img/logo_shopzeo.png" alt="Shopzeo Logo" className="h-10 mx-auto" />
                    </Link>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                            Reset Password
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                           Enter a new password for your account.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <InputField 
                            id="currentPassword" 
                            name="currentPassword"
                            label="Current Password" 
                            type="password" 
                            value={formData.currentPassword} 
                            onChange={handleChange} 
                            error={errors.currentPassword} 
                        />
                        <InputField 
                            id="newPassword" 
                            name="newPassword"
                            label="New Password" 
                            type="password" 
                            value={formData.newPassword} 
                            onChange={handleChange} 
                            error={errors.newPassword} 
                        />
                        <InputField 
                            id="confirmPassword" 
                            name="confirmPassword"
                            label="Confirm New Password" 
                            type="password" 
                            value={formData.confirmPassword} 
                            onChange={handleChange} 
                            error={errors.confirmPassword} 
                        />
                        {apiMessage && <p className="text-green-600 text-sm text-center font-medium">{apiMessage}</p>}
                        {errors.submit && <p className="text-red-500 text-xs text-center">{errors.submit}</p>}
                        <div className="pt-2">
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-colors"
                            >
                                {isLoading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
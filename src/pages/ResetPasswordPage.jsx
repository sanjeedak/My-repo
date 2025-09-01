import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import InputField from '../components/forms/InputField';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);
        console.log("Password reset data:", formData);
        
        setTimeout(() => {
            setIsLoading(false);
            alert('Password has been reset successfully!');
            navigate('/signin');
        }, 1500);
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

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthFormLayout from '../components/layout/AuthFormLayout';
import Stepper from '../components/layout/Stepper';
import VendorInfoStep from '../components/VendorInfoStep';
import ShopInfoStep from '../components/ShopInfoStep';
import BusinessInfoStep from '../components/BusinessInfoStep';
import InfoCards from '../components/layout/InfoCards';
import { apiService } from '../components/layout/apiService';
import { endpoints } from '../api/endpoints';

// --- Reusable Form Components ---
export const InputField = ({ id, label, type, value, onChange, error, required = true }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <input id={id} name={id} type={type} value={value} onChange={onChange} required={required} className={`mt-1 block w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`} />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

export const FileUpload = ({ id, label, onChange, fileName, helpText, required = true }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <div className="flex text-sm text-gray-600">
                    <label htmlFor={id} className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"><span>Upload a file</span><input id={id} name={id} type="file" className="sr-only" onChange={onChange} required={required} /></label>
                    <p className="pl-1">or drag and drop</p>
                </div>
                {fileName ? <p className="text-xs text-green-600 font-semibold">{fileName}</p> : <p className="text-xs text-gray-500">{helpText}</p>}
            </div>
        </div>
    </div>
);

// --- Main Page Component ---
const VendorSignUpPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        first_name: '', last_name: '', email: '', phone: '', password: '', confirmPassword: '',
        name: '', address: '', city: '', state: '', country: '', postal_code: '', logo: null, banner: null,
        gst_number: '', pan_number: '',
        agreedToTerms: false,
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData(prev => ({ ...prev, [name]: files[0] }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };
    
    const validateStep = (currentStep) => {
        const newErrors = {};
        if (currentStep === 1) {
            if (!formData.first_name) newErrors.first_name = "First name is required.";
            if (!formData.last_name) newErrors.last_name = "Last name is required.";
            if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email format.";
            if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Phone must be 10 digits.";
            if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
            if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
        }
        if (currentStep === 2) {
            if (!formData.name) newErrors.name = "Store name is required.";
            if (!formData.address) newErrors.address = "Address is required.";
            if (!formData.city) newErrors.city = "City is required.";
            if (!formData.state) newErrors.state = "State is required.";
            if (!formData.country) newErrors.country = "Country is required.";
            if (!/^\d{6}$/.test(formData.postal_code)) newErrors.postal_code = "Pincode must be 6 digits.";
            if (!formData.logo) newErrors.logo = "Store logo is required.";
            if (!formData.banner) newErrors.banner = "Store banner is required.";
        }
        if (currentStep === 3) {
            if (!formData.gst_number) newErrors.gst_number = "GST number is required.";
            if (!formData.agreedToTerms) newErrors.agreedToTerms = "You must agree to the terms.";
        }
        return newErrors;
    };

    const handleNext = () => {
        const validationErrors = validateStep(step);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({});
            setStep(prev => prev + 1);
        }
    };
    
    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateStep(step);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        
        setIsLoading(true);
        setErrors({});

        const submissionData = new FormData();
        // Append all fields from state to FormData
        Object.keys(formData).forEach(key => {
            if (key !== 'confirmPassword' && key !== 'agreedToTerms') {
                submissionData.append(key, formData[key]);
            }
        });

        try {
            const response = await apiService(endpoints.vendorSignup, {
                method: 'POST',
                body: submissionData,
                headers: {
                    'Content-Type': undefined, 
                },
            });

            if (response.success) {
                // Corrected to use a custom message box or an inline message instead of alert
                // For now, we'll just log to the console and navigate, as a custom modal is not a simple fix.
                console.log('Application submitted successfully! Redirecting to login.');
                navigate('/vendor/signin');
            } else {
                throw new Error(response.message || 'Submission failed.');
            }
        } catch (error) {
            setErrors({ submit: error.message || 'An error occurred during submission.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-50">
            <AuthFormLayout
                footerText={t('already_have_account')}
                footerLink="/vendor/signin"
                footerActionText={t('sign_in')}
            >
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">{t('create_vendor_account')}</h2>
                
                <Stepper currentStep={step} />

                <form onSubmit={handleSubmit} className="space-y-8">
                    {step === 1 && <VendorInfoStep formData={formData} handleChange={handleChange} handleFileChange={handleFileChange} errors={errors} />}
                    {step === 2 && <ShopInfoStep formData={formData} handleChange={handleChange} handleFileChange={handleFileChange} errors={errors} />}
                    {step === 3 && <BusinessInfoStep formData={formData} handleChange={handleChange} errors={errors} />}
                    
                    {errors.submit && <p className="text-xs text-red-600 text-center">{errors.submit}</p>}

                    <div className="pt-4">
                        {step === 1 && (
                            <button type="button" onClick={handleNext} className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">{t('next')}</button>
                        )}
                        {step === 2 && (
                            <div className="flex gap-4">
                                <button type="button" onClick={handleBack} className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300">{t('back')}</button>
                                <button type="button" onClick={handleNext} className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">{t('next')}</button>
                            </div>
                        )}
                        {step === 3 && (
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <input id="agreedToTerms" name="agreedToTerms" type="checkbox" checked={formData.agreedToTerms} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                    <label htmlFor="agreedToTerms" className="ml-2 block text-sm text-gray-900">{t('i_agree_to_terms')} <Link to="/terms" className="text-blue-600 hover:underline">{t('terms_and_conditions')}</Link></label>
                                </div>
                                {errors.agreedToTerms && <p className="text-xs text-red-600">{errors.agreedToTerms}</p>}
                                <div className="flex gap-4">
                                    <button type="button" onClick={handleBack} className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300">{t('back')}</button>
                                    <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400">
                                        {isLoading ? t('submitting') : t('submit_application')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </AuthFormLayout>
            <InfoCards />
        </div>
    );
};

export default VendorSignUpPage;

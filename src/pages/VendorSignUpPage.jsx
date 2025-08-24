import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthFormLayout from '../components/layout/AuthFormLayout';
import Stepper from '../components/layout/Stepper';
import VendorInfoStep from '../components/VendorInfoStep';
import ShopInfoStep from '../components/ShopInfoStep';
import BusinessInfoStep from '../components/BusinessInfoStep'; // New import

// --- Reusable Form Components ---
export const InputField = ({ id, label, type, value, onChange, error, required = true }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <input id={id} type={type} value={value} onChange={onChange} required={required} className={`mt-1 block w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`} />
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
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1
        firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', vendorImage: null,
        // Step 2
        shopName: '', shopAddress: '', shopLogo: null, shopBanner: null,
        // Step 3
        tin: '', tinExpireDate: '', tinCertificate: null,
        // Final
        agreedToTerms: false,
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [id]: type === 'checkbox' ? checked : value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.files[0] }));
    };

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Final Vendor Submission:', formData);
    };

    return (
        <AuthFormLayout>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Create an Account</h2>
            
            <Stepper currentStep={step} />

            <form onSubmit={handleSubmit} className="space-y-8">
                {step === 1 && <VendorInfoStep formData={formData} handleChange={handleChange} handleFileChange={handleFileChange} errors={errors} />}
                {step === 2 && <ShopInfoStep formData={formData} handleChange={handleChange} handleFileChange={handleFileChange} errors={errors} />}
                {step === 3 && <BusinessInfoStep formData={formData} handleChange={handleChange} handleFileChange={handleFileChange} errors={errors} />}
                
                <div className="pt-4">
                    {step === 1 && (
                        <button type="button" onClick={handleNext} className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Next</button>
                    )}
                    {step === 2 && (
                        <div className="flex gap-4">
                            <button type="button" onClick={handleBack} className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300">Back</button>
                            <button type="button" onClick={handleNext} className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Next</button>
                        </div>
                    )}
                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <input id="agreedToTerms" name="agreedToTerms" type="checkbox" checked={formData.agreedToTerms} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label htmlFor="agreedToTerms" className="ml-2 block text-sm text-gray-900">I agree to the <Link to="/terms" className="text-blue-600 hover:underline">terms and conditions</Link></label>
                            </div>
                            <div className="flex gap-4">
                                <button type="button" onClick={handleBack} className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300">Back</button>
                                <button type="submit" className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Submit Application</button>
                            </div>
                        </div>
                    )}
                </div>
            </form>
        </AuthFormLayout>
    );
};

export default VendorSignUpPage;
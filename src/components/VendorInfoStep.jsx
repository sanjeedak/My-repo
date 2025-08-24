import React from 'react';
// We will import the InputField from the main sign-up page
import { InputField,FileUpload} from '../pages/VendorSignUpPage';

const VendorInfoStep = ({ formData, handleChange, handleFileChange, errors }) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField id="firstName" label="First Name" type="text" value={formData.firstName} onChange={handleChange} error={errors.firstName} />
                <InputField id="lastName" label="Last Name" type="text" value={formData.lastName} onChange={handleChange} error={errors.lastName} />
                <InputField id="email" label="Email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
                <InputField id="phone" label="Phone Number" type="tel" value={formData.phone} onChange={handleChange} error={errors.phone} />
                <InputField id="password" label="Password" type="password" value={formData.password} onChange={handleChange} error={errors.password} />
                <InputField id="confirmPassword" label="Confirm Password" type="password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
            </div>
            <FileUpload 
                id="vendorImage" 
                label="Vendor Image" 
                onChange={handleFileChange} 
                fileName={formData.vendorImage?.name}
                helpText="Image ratio 1:1, Max size 2MB"
            />
        </div>
    );
};

export default VendorInfoStep;
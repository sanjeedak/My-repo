import React from 'react';
// Assuming InputField is exported from the main sign-up page
import { InputField } from '../pages/VendorSignUpPage';

const VendorInfoStep = ({ formData, handleChange, errors }) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField id="first_name" label="First Name" type="text" value={formData.first_name} onChange={handleChange} error={errors.first_name} />
                <InputField id="last_name" label="Last Name" type="text" value={formData.last_name} onChange={handleChange} error={errors.last_name} />
                <InputField id="email" label="Email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
                <InputField id="phone" label="Phone Number" type="tel" value={formData.phone} onChange={handleChange} error={errors.phone} />
                <InputField id="password" label="Password" type="password" value={formData.password} onChange={handleChange} error={errors.password} />
                <InputField id="confirmPassword" label="Confirm Password" type="password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
            </div>
        </div>
    );
};

export default VendorInfoStep;

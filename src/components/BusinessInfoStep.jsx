import React from 'react';
// Assuming InputField is exported from the main sign-up page
import { InputField } from '../pages/VendorSignUpPage';

const BusinessInfoStep = ({ formData, handleChange, errors }) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField 
                    id="gst_number" 
                    label="GST Number" 
                    type="text" 
                    value={formData.gst_number} 
                    onChange={handleChange} 
                    error={errors.gst_number} 
                />
                <InputField 
                    id="pan_number" 
                    label="PAN Number" 
                    type="text" 
                    value={formData.pan_number} 
                    onChange={handleChange} 
                    error={errors.pan_number} 
                    required={false} // PAN is nullable in your API response
                />
            </div>
        </div>
    );
};

export default BusinessInfoStep;

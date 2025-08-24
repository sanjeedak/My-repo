import React from 'react';
import { InputField, FileUpload } from '../pages/VendorSignUpPage';

const BusinessInfoStep = ({ formData, handleChange, handleFileChange, errors }) => {
    return (
        <div className="space-y-6">
            <InputField 
                id="tin" 
                label="Taxpayer Identification Number (TIN)" 
                type="text" 
                value={formData.tin} 
                onChange={handleChange} 
                error={errors.tin} 
            />
            <InputField 
                id="tinExpireDate" 
                label="Expire Date" 
                type="date" 
                value={formData.tinExpireDate} 
                onChange={handleChange} 
                error={errors.tinExpireDate} 
            />
            <FileUpload 
                id="tinCertificate" 
                label="TIN Certificate" 
                onChange={handleFileChange} 
                fileName={formData.tinCertificate?.name}
                helpText="PDF, DOC, JPG. Max size 5MB"
            />
        </div>
    );
};

export default BusinessInfoStep;
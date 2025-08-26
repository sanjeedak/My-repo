import React from 'react';
import { InputField, FileUpload } from '../pages/VendorSignUpPage';

const ShopInfoStep = ({ formData, handleChange, handleFileChange, errors }) => {
    return (
        <div className="space-y-6">
            <InputField id="name" label="Store Name" type="text" value={formData.name} onChange={handleChange} error={errors.name} />
            <InputField id="address" label="Address" type="text" value={formData.address} onChange={handleChange} error={errors.address} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField id="city" label="City" type="text" value={formData.city} onChange={handleChange} error={errors.city} />
                <InputField id="state" label="State" type="text" value={formData.state} onChange={handleChange} error={errors.state} />
                <InputField id="country" label="Country" type="text" value={formData.country} onChange={handleChange} error={errors.country} />
                <InputField id="postal_code" label="Postal Code" type="text" value={formData.postal_code} onChange={handleChange} error={errors.postal_code} />
            </div>
            <FileUpload 
                id="logo" 
                label="Upload Logo" 
                onChange={handleFileChange} 
                fileName={formData.logo?.name}
                helpText="Image ratio 1:1, Max size 2MB"
            />
            <FileUpload 
                id="banner" 
                label="Upload Banner" 
                onChange={handleFileChange} 
                fileName={formData.banner?.name} 
                helpText="Image ratio 2:1, Max size 2MB"
            />
        </div>
    );
};

export default ShopInfoStep;

import React from 'react';
import { InputField, FileUpload } from '../pages/VendorSignUpPage';

const ShopInfoStep = ({ formData, handleChange, handleFileChange, errors }) => {
    return (
        <div className="grid grid-cols-1 gap-6">
            <InputField id="shopName" label="Shop Name" type="text" value={formData.shopName} onChange={handleChange} error={errors.shopName} />
            <InputField id="shopAddress" label="Shop Address" type="text" value={formData.shopAddress} onChange={handleChange} error={errors.shopAddress} />
            <FileUpload 
                id="shopLogo" 
                label="Upload Logo" 
                onChange={handleFileChange} 
                fileName={formData.shopLogo?.name}
                helpText="Image ratio 1:1, Max size 2MB"
            />
            <FileUpload 
                id="shopBanner" 
                label="Upload Banner" 
                onChange={handleFileChange} 
                fileName={formData.shopBanner?.name} 
                helpText="Image ratio 2:1, Max size 2MB"
            />
        </div>
    );
};

export default ShopInfoStep;
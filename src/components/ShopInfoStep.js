import React from 'react';
import { InputField, FileUpload } from '../pages/VendorSignUpPage'; // We'll export these from the main page

const ShopInfoStep = ({ formData, handleChange, handleFileChange, errors }) => {
    return (
        <div className="grid grid-cols-1 gap-6">
            <InputField id="shopName" label="Shop Name" type="text" value={formData.shopName} onChange={handleChange} error={errors.shopName} />
            <InputField id="shopAddress" label="Shop Address" type="text" value={formData.shopAddress} onChange={handleChange} error={errors.shopAddress} />
            <FileUpload id="shopLogo" label="Shop Logo" onChange={handleFileChange} fileName={formData.shopLogo?.name} />
            <FileUpload id="shopBanner" label="Shop Banner (Optional)" onChange={handleFileChange} fileName={formData.shopBanner?.name} required={false} />
        </div>
    );
};

export default ShopInfoStep;
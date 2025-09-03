import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { InputField } from './VendorSignUpPage';
import { Lock, LogOut, Camera, Save } from 'lucide-react';

const ProfilePage = () => {
    const { user, login, logout } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        profileImage: null,
        profileImageUrl: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                phone: user.phone || '',
                profileImage: null,
                profileImageUrl: user.vendorImage || '',
            });
        }
    }, [user]);

    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({
                ...prev,
                profileImage: file,
                profileImageUrl: URL.createObjectURL(file)
            }));
        }
    };
    
    const validate = () => {
        const newErrors = {};
        if (!formData.first_name) newErrors.first_name = "First name is required.";
        if (!formData.last_name) newErrors.last_name = "Last name is required.";
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        
        console.log("Updated user data:", formData);
        const updatedUser = {
            ...user,
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone,
            vendorImage: formData.profileImageUrl,
        };
        login(updatedUser);
        alert("Profile saved successfully!");
    };
    
    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };
    
    const generateAvatarUrl = () => {
        if (formData.first_name && formData.last_name) {
            return `https://ui-avatars.com/api/?name=${formData.first_name}+${formData.last_name}&background=EBF4FF&color=7F9CF5&size=128`;
        }
        return 'https://placehold.co/128x128?text=User';
    };

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: User Card & Actions */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                            <div className="relative w-32 h-32 mx-auto">
                                <img
                                    src={formData.profileImageUrl || generateAvatarUrl()}
                                    alt="Profile"
                                    className="w-full h-full rounded-full object-cover ring-4 ring-blue-100"
                                />
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />
                                <button 
                                    onClick={handleImageClick}
                                    className="absolute bottom-1 right-1 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-transform hover:scale-110 shadow-md"
                                    aria-label="Change profile picture"
                                >
                                   <Camera className="h-5 w-5" />
                                </button>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mt-4">{`${formData.first_name} ${formData.last_name}`}</h2>
                            <p className="text-gray-500 mt-1">{formData.email}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-lg">
                             <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">{t('account_actions')}</h3>
                             <div className="space-y-3">
                                 <button 
                                    onClick={() => navigate('/reset-password')}
                                    className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                                >
                                    <Lock className="h-5 w-5 text-gray-500" /> {t('reset_password')}
                                </button>
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                                >
                                    <LogOut className="h-5 w-5 text-gray-500" /> {t('logout')}
                                </button>
                             </div>
                        </div>
                    </div>

                    {/* Right Column: Edit Form */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-8 rounded-2xl shadow-lg">
                             <h3 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-slate-100">{t('edit_profile')}</h3>
                             <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField name="first_name" id="first_name" label={t('first_name')} type="text" value={formData.first_name} onChange={handleChange} error={errors.first_name} />
                                    <InputField name="last_name" id="last_name" label={t('last_name')} type="text" value={formData.last_name} onChange={handleChange} error={errors.last_name} />
                                </div>
                                <InputField name="email" id="email" label={t('email')} type="email" value={formData.email} onChange={handleChange} error={errors.email} />
                                <InputField
                                    name="phone"
                                    id="phone"
                                    label={t('phone_number')}
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    error={errors.phone}
                                    disabled={true}
                                    placeholder={formData.phone ? "" : "N/A"}
                                />
                                
                                <div className="flex justify-end pt-4">
                                    <button type="submit" className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md">
                                        <Save className="h-5 w-5" /> {t('save_changes')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
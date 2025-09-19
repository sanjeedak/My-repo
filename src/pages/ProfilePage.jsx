import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { InputField } from './VendorSignUpPage'; // Assuming this is a shared component
import { Lock, LogOut, Camera, Save, ShoppingCart, MapPin, CreditCard, Edit, X, User } from 'lucide-react';

const ProfilePage = () => {
    const { user, login, logout } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    // State to toggle between viewing and editing profile
    const [isEditMode, setIsEditMode] = useState(false);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        profileImage: null,
        profileImageUrl: '',
    });

    // Dummy order data - You can replace this with an API call
    const [orders] = useState([
        { id: '12345', date: '2023-10-26', status: 'Delivered', total: '₹1,250' },
        { id: '67890', date: '2023-10-28', status: 'Shipped', total: '₹890' },
    ]);

    const [activeSection, setActiveSection] = useState('profile');

    // Load user data into form state when component mounts or user changes
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

    // Handle form submission when in edit mode
    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        
        const updatedUser = {
            ...user,
            ...formData,
        };
        login(updatedUser); // Update user data in context and local storage
        setIsEditMode(false); // Switch back to view mode after saving
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

    // Renders content based on the active section (Profile, Orders, etc.)
    const renderSection = () => {
        switch (activeSection) {
            case 'profile':
                return isEditMode ? (
                    // EDIT MODE: Show a form with input fields
                    <form onSubmit={handleSubmit} className="space-y-6">
                         <h3 className="text-2xl font-bold text-gray-800">Edit Personal Information</h3>
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
                        />
                        
                        <div className="flex justify-end pt-4 gap-4">
                            <button type="button" onClick={() => setIsEditMode(false)} className="flex items-center gap-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                                <X className="h-5 w-5" /> Cancel
                            </button>
                            <button type="submit" className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md">
                                <Save className="h-5 w-5" /> {t('save_changes')}
                            </button>
                        </div>
                    </form>
                ) : (
                    // VIEW MODE: Show user details as text
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                             <h3 className="text-2xl font-bold text-gray-800">Personal Information</h3>
                             <button onClick={() => setIsEditMode(true)} className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200 transition-colors">
                                <Edit className="h-4 w-4" /> Edit Profile
                            </button>
                        </div>
                        <div className="p-4 border rounded-lg bg-slate-50 space-y-3">
                            <p><strong>First Name:</strong> {formData.first_name || 'N/A'}</p>
                            <p><strong>Last Name:</strong> {formData.last_name || 'N/A'}</p>
                            <p><strong>Email:</strong> {formData.email || 'N/A'}</p>
                            <p><strong>Phone:</strong> {formData.phone || 'N/A'}</p>
                        </div>
                    </div>
                );
            case 'orders':
                return (
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h3>
                        <div className="space-y-4">
                            {orders.length > 0 ? orders.map(order => (
                                <div key={order.id} className="bg-gray-50 p-4 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800">Order ID: #{order.id}</p>
                                        <p className="text-sm text-gray-500">Date: {order.date}</p>
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm font-semibold ${order.status === 'Delivered' ? 'text-green-600' : 'text-yellow-600'}`}>{order.status}</p>
                                        <p className="font-semibold text-gray-800">{order.total}</p>
                                    </div>
                                    <Link to={`/track-order?id=${order.id}`} className="bg-blue-500 text-white text-sm font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors self-start sm:self-center">
                                        Track Order
                                    </Link>
                                </div>
                            )) : <p>You have no orders yet.</p>}
                        </div>
                    </div>
                );
            case 'addresses':
                return (
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">My Addresses</h3>
                        <p className="text-gray-500">Manage your shipping and billing addresses. (Feature coming soon)</p>
                    </div>
                );
            case 'payment':
                return (
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Payment Methods</h3>
                        <p className="text-gray-500">Manage your saved cards and payment options. (Feature coming soon)</p>
                    </div>
                );
            default:
                return null;
        }
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
                             <div className="space-y-2">
                                 <button onClick={() => setActiveSection('profile')} className={`w-full text-left flex items-center gap-3 py-3 px-4 rounded-lg font-medium text-gray-700 transition-colors ${activeSection === 'profile' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}>
                                     <User className="h-5 w-5" /> My Profile
                                 </button>
                                 <button onClick={() => setActiveSection('orders')} className={`w-full text-left flex items-center gap-3 py-3 px-4 rounded-lg font-medium text-gray-700 transition-colors ${activeSection === 'orders' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}>
                                     <ShoppingCart className="h-5 w-5" /> My Orders
                                 </button>
                                 <button onClick={() => setActiveSection('addresses')} className={`w-full text-left flex items-center gap-3 py-3 px-4 rounded-lg font-medium text-gray-700 transition-colors ${activeSection === 'addresses' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}>
                                     <MapPin className="h-5 w-5" /> My Addresses
                                 </button>
                                 <button onClick={() => setActiveSection('payment')} className={`w-full text-left flex items-center gap-3 py-3 px-4 rounded-lg font-medium text-gray-700 transition-colors ${activeSection === 'payment' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}>
                                     <CreditCard className="h-5 w-5" /> Payment Methods
                                 </button>
                                <hr className="my-2"/>
                                 <button 
                                    onClick={() => navigate('/reset-password')}
                                    className="w-full text-left flex items-center gap-3 py-3 px-4 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    <Lock className="h-5 w-5" /> {t('reset_password')}
                                </button>
                                <button 
                                    onClick={handleLogout}
                                    className="w-full text-left flex items-center gap-3 py-3 px-4 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    <LogOut className="h-5 w-5" /> {t('logout')}
                                </button>
                             </div>
                        </div>
                    </div>

                    {/* Right Column: Content Area */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-8 rounded-2xl shadow-lg min-h-[400px]">
                            {renderSection()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
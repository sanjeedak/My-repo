import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../components/layout/apiService';

const ProfilePage = () => {
    const { user, logout, login } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(user);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [updateForm, setUpdateForm] = useState({
        first_name: '',
        last_name: '',
    });

    const [passwordForm, setPasswordForm] = useState({
        current_password: '',
        new_password: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) {
                navigate('/signin');
                return;
            }
            try {
                const data = await apiService('/api/user-auth/profile');
                if (data.success) {
                    setProfile(data.data.user);
                    setUpdateForm({
                        first_name: data.data.user.first_name,
                        last_name: data.data.user.last_name,
                    });
                } else {
                    throw new Error(data.message || 'Failed to fetch profile.');
                }
            } catch (err) {
                setError(err.message);
                if (err.message.toLowerCase().includes('unauthorized')) {
                    logout();
                    navigate('/signin');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user, navigate, logout]);

    const handleInfoChange = (e) => {
        setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const response = await apiService('/api/user-auth/profile', {
                method: 'PUT',
                body: updateForm,
            });
            if (response.success) {
                setSuccess('Profile updated successfully!');
                const token = localStorage.getItem('token');
                login(response.data.user, token); // Update context and local storage
            }
        } catch (err) {
            setError(err.message || 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const response = await apiService('/api/user-auth/change-password', {
                method: 'POST',
                body: passwordForm,
            });
            if (response.success) {
                setSuccess('Password changed successfully!');
                setPasswordForm({ current_password: '', new_password: '' });
            }
        } catch (err) {
            setError(err.message || 'Failed to change password.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (loading && !profile) {
        return <div className="container mx-auto px-4 py-10 text-center">Loading profile...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
                    {error && <p className="mt-2 text-center text-red-500 bg-red-50 p-3 rounded-md">{error}</p>}
                    {success && <p className="mt-2 text-center text-green-500 bg-green-50 p-3 rounded-md">{success}</p>}
                </div>

                {/* Update Profile Form */}
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <h2 className="text-2xl font-semibold text-slate-700 border-b pb-2">Update Information</h2>
                    <div>
                        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
                        <input type="text" name="first_name" id="first_name" value={updateForm.first_name} onChange={handleInfoChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input type="text" name="last_name" id="last_name" value={updateForm.last_name} onChange={handleInfoChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    </div>
                     <div className="pt-2">
                        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold transition-colors disabled:bg-blue-300">
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>

                {/* Change Password Form */}
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <h2 className="text-2xl font-semibold text-slate-700 border-b pb-2">Change Password</h2>
                    <div>
                        <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">Current Password</label>
                        <input type="password" name="current_password" id="current_password" value={passwordForm.current_password} onChange={handlePasswordChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">New Password</label>
                        <input type="password" name="new_password" id="new_password" value={passwordForm.new_password} onChange={handlePasswordChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    </div>
                     <div className="pt-2">
                        <button type="submit" disabled={loading} className="w-full bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-800 font-semibold transition-colors disabled:bg-gray-400">
                           {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </form>
                
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-semibold transition-colors"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default ProfilePage;
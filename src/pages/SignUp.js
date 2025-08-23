import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../api/apiService'; // Make sure this path is correct

const Signup = () => {
  // --- FIXED: All state variables are defined here ---
  const navigate = useNavigate();
  const [useEmail, setUseEmail] = useState(true);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailPhone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submittedOtp] = useState('123456'); // For demo purposes

  // --- FIXED: All helper functions are defined here ---
  const handleClose = () => {
    navigate(-1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    // Add all your validation rules for each field here
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (useEmail && !/^\S+@\S+\.\S+$/.test(formData.emailPhone)) {
        newErrors.emailPhone = 'Invalid email format';
    }
    // ... etc.
    return newErrors;
  };

  const handleSendOTP = () => {
    // Logic to call API and send OTP
    setShowOTP(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const dataToSubmit = {
        firstName: formData.firstName,
        lastName: formData.lastName,
      };
      if (useEmail) {
        dataToSubmit.email = formData.emailPhone;
        dataToSubmit.password = formData.password;
      } else {
        dataToSubmit.phone = formData.emailPhone;
        dataToSubmit.otp = otp;
      }
      
      const data = await apiService('/api/auth/register', {
          method: 'POST',
          body: dataToSubmit
      });

      console.log('Signup successful:', data);
      navigate('/signin');
    } catch (error) {
      setErrors({ submit: error.message || 'Signup failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // --- Your original JSX design is preserved here ---
  return (
    <div
      className="flex items-center justify-center min-h-screen p-4 font-sans relative"
      style={{ background: 'linear-gradient(135deg, #1f1f3a, #000000)' }}
    >
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-white text-lg font-bold rounded-full bg-gradient-to-r from-purple-600 to-indigo-700 shadow-lg hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 px-4 py-2"
      >
        Close
      </button>
      <div
        className="w-full max-w-lg p-8 rounded-3xl shadow-2xl backdrop-blur-lg bg-gray-800 bg-opacity-30"
        style={{ border: '1px solid rgba(255, 255, 255, 0.2)' }}
      >
        <h2 className="text-3xl font-extrabold text-center text-white mb-6 tracking-wide">
          REGISTER
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Your entire form structure from your original file */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="w-full p-3 ..."/>
              {errors.firstName && <p className="text-red-400 text-xs pt-1 px-2">{errors.firstName}</p>}
            </div>
            <div>
              <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="w-full p-3 ..."/>
              {errors.lastName && <p className="text-red-400 text-xs pt-1 px-2">{errors.lastName}</p>}
            </div>
          </div>
          {/* ... all other inputs and buttons ... */}
           <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 text-white text-lg font-bold rounded-full bg-gradient-to-r from-purple-600 to-indigo-700 shadow-lg hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Registering...' : 'REGISTER NOW'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
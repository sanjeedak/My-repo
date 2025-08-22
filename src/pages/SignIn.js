import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// This is the main Signin component.
// It is designed to be a modern and responsive sign-in form.
const Signin = () => {
  const navigate = useNavigate();
  const [useEmail, setUseEmail] = useState(true); // Toggle between email and phone
  const [showOTP, setShowOTP] = useState(false); // Show OTP field when true
  const [otp, setOtp] = useState(''); // Store OTP input
  const [formData, setFormData] = useState({
    emailPhone: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false); // Track if OTP was sent
  const [submittedOtp, setSubmittedOtp] = useState('123456'); // Simulated OTP for demo

  const handleClose = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.emailPhone.trim()) {
        newErrors.emailPhone = 'This field is required';
    } else if (useEmail) {
        // Email validation
        if (!/^\S+@\S+\.\S+$/.test(formData.emailPhone)) {
            newErrors.emailPhone = 'Invalid email format';
        }
    } else {
        // --- FIXED: More specific phone number validation ---
        // 1. Check if it contains any non-digit characters
        if (/\D/.test(formData.emailPhone)) {
            newErrors.emailPhone = 'Phone number must contain only numbers';
        // 2. Check if the length is not exactly 10
        } else if (formData.emailPhone.length !== 10) {
            newErrors.emailPhone = 'Phone must be exactly 10 digits';
        }
    }

    if (useEmail && !formData.password) {
        newErrors.password = 'Password is required';
    } else if (useEmail && formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
    }

    if (!useEmail && showOTP && otp !== submittedOtp) {
        newErrors.otp = 'Invalid OTP';
    }
    
    return newErrors;
  };

  const handleSendOTP = () => {
    const newErrors = validateForm();
    if (newErrors.emailPhone) {
      setErrors({ emailPhone: newErrors.emailPhone });
      return;
    }
    setOtpSent(true); // Simulate OTP sent
    setShowOTP(true); // Show OTP input
    setSubmittedOtp('123456'); // Simulated OTP (replace with API response in real app)
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
      // Simulate API call for sign-in
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      const mockUsers = {
        'test@example.com': 'password123',
        '9876543210': '123456', // phone:otp mapping
      };
      const credential = useEmail ? formData.password : otp;
      if (mockUsers[formData.emailPhone] !== credential) {
        throw new Error('Invalid credentials');
      }
      console.log('Signin successful:', formData);
      navigate('/dashboard'); // Redirect to dashboard on success
    } catch (error) {
      setErrors({ submit: 'Invalid credentials. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4 font-sans relative"
      style={{
        background: 'linear-gradient(135deg, #1f1f3a, #000000)',
      }}
    >
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-white text-lg font-bold rounded-full bg-gradient-to-r from-purple-600 to-indigo-700 shadow-lg hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 px-4 py-2"
      >
        Close
      </button>
      <div
        className="w-full max-w-lg p-10 rounded-3xl shadow-2xl backdrop-blur-lg bg-gray-800 bg-opacity-30"
        style={{ border: '1px solid rgba(255, 255, 255, 0.2)' }}
      >
        <h2 className="text-4xl font-extrabold text-center text-white mb-8 tracking-wide">
          SIGN IN
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email/Phone Toggle */}
          <div className="flex justify-center space-x-6 mb-4">
            <label className="flex items-center text-white cursor-pointer">
              <input
                type="radio"
                checked={useEmail}
                onChange={() => {
                  setUseEmail(true);
                  setShowOTP(false);
                  setOtpSent(false);
                  setFormData({ emailPhone: '', password: '' });
                  setErrors({});
                }}
                className="mr-2 h-5 w-5 appearance-none rounded-full border-2 border-gray-400 checked:bg-purple-500 checked:border-transparent transition-colors duration-300"
              />
              <span>Email</span>
            </label>
            <label className="flex items-center text-white cursor-pointer">
              <input
                type="radio"
                checked={!useEmail}
                onChange={() => {
                  setUseEmail(false);
                  setShowOTP(false);
                  setOtpSent(false);
                  setFormData({ emailPhone: '', password: '' });
                  setErrors({});
                }}
                className="mr-2 h-5 w-5 appearance-none rounded-full border-2 border-gray-400 checked:bg-purple-500 checked:border-transparent transition-colors duration-300"
              />
              <span>Phone</span>
            </label>
          </div>

          <div>
            <input
              type={useEmail ? 'email' : 'tel'}
              name="emailPhone"
              placeholder={useEmail ? 'Email' : 'Phone Number'}
              value={formData.emailPhone}
              onChange={handleChange}
              className="w-full p-4 text-white placeholder-gray-400 border border-transparent rounded-full bg-gray-700 bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
            />
            {errors.emailPhone && <p className="text-red-400 text-xs mt-1 pl-2">{errors.emailPhone}</p>}
          </div>

          {!useEmail && !showOTP && (
            <button
              type="button"
              onClick={handleSendOTP}
              disabled={isLoading}
              className="w-full py-2 text-white font-bold rounded-full bg-gradient-to-r from-purple-600 to-indigo-700 shadow-lg hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
          )}

          {showOTP && (
            <div>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-4 text-white placeholder-gray-400 border border-transparent rounded-full bg-gray-700 bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
              />
              {errors.otp && <p className="text-red-400 text-xs mt-1 pl-2">{errors.otp}</p>}
            </div>
          )}

          {useEmail && (
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-4 text-white placeholder-gray-400 border border-transparent rounded-full bg-gray-700 bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1 pl-2">{errors.password}</p>}
            </div>
          )}

          <div className="flex justify-end text-sm">
            <a
              href="/forgot-password"
              className="font-semibold text-purple-300 hover:text-purple-100 transition-colors duration-300"
            >
              Forgot Password?
            </a>
          </div>

          {errors.submit && <p className="text-red-400 text-xs text-center">{errors.submit}</p>}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 text-white text-lg font-bold rounded-full bg-gradient-to-r from-purple-600 to-indigo-700 shadow-lg hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Signing In...' : 'SIGN IN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;

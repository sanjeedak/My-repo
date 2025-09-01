import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../components/layout/apiService';
import { sanitizeInput, validateEmailPhone } from '../utils/sanatize';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/forms/InputField';
import RadioButton from '../components/forms/RadioButton';
import { endpoints } from '../api/endpoints';

const SignInPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [useEmail, setUseEmail] = useState(true);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState({
    emailPhone: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: sanitizeInput(value) }));
    setErrors((prev) => ({ ...prev, [name]: '', submit: '' }));
  };

  const handleRadioChange = (isEmail) => {
    if (formData.emailPhone || formData.password || otp) {
      if (!window.confirm('Switching will clear the form. Continue?')) return;
    }
    setUseEmail(isEmail);
    setShowOTP(false);
    setOtp('');
    setFormData({ emailPhone: '', password: '' });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    newErrors.emailPhone = validateEmailPhone(formData.emailPhone, useEmail);
    if (useEmail) {
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    }
    if (!useEmail && showOTP) {
      if (!/^\d{6}$/.test(otp)) newErrors.otp = 'OTP must be a 6-digit number';
    }
    return Object.fromEntries(Object.entries(newErrors).filter(([_, v]) => v));
  };

  const handleSendOTP = async () => {
    const emailPhoneError = validateEmailPhone(formData.emailPhone, false);
    if (emailPhoneError) {
      setErrors({ emailPhone: emailPhoneError });
      return;
    }
    setIsLoading(true);
    try {
      await apiService(endpoints.sendOtp, {
        method: 'POST',
        body: { phone: formData.emailPhone },
      });
      setShowOTP(true);
      setOtp('');
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to send OTP. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);
    setErrors({});
    try {
      const payload = useEmail
        ? { email: formData.emailPhone, password: formData.password }
        : { phone: formData.emailPhone, otp };

      const response = await apiService(endpoints.userLogin, {
        method: 'POST',
        body: payload,
      });
      
      if (response.success && response.data.user) {
        login(response.data.user, response.data.token);
        navigate('/');
      } else {
        throw new Error(response.message || 'Login failed.');
      }
    } catch (error) {
       if (error.message.includes('Failed to fetch')) {
            setErrors({ submit: 'Cannot connect to server. Please check your connection or try again later.' });
        } else {
            setErrors({ submit: error.message || 'Invalid credentials. Please try again.' });
        }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <Link to="/">
                <img src="/img/logo_shopzeo.png" alt="Shopzeo Logo" className="h-12 mx-auto" />
            </Link>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
                Welcome Back!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
                Sign in to continue
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="flex justify-center space-x-6 mb-4">
                  <RadioButton id="email" label="Email" checked={useEmail} onChange={() => handleRadioChange(true)} value="Email" />
                  <RadioButton id="phone" label="Phone" checked={!useEmail} onChange={() => handleRadioChange(false)} value="Phone" />
              </div>

              <InputField 
                id="emailPhone" 
                name="emailPhone" 
                label={useEmail ? "Email" : "Phone Number"}
                type={useEmail ? "email" : "tel"} 
                value={formData.emailPhone}
                onChange={handleChange}
                error={errors.emailPhone}
              />

              {useEmail ? (
                <InputField 
                    id="password" 
                    name="password"
                    label="Password" 
                    type="password" 
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                />
              ) : showOTP ? (
                 <InputField 
                    id="otp" 
                    name="otp"
                    label="OTP" 
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    error={errors.otp}
                />
              ) : null}

              {!useEmail && !showOTP && (
                <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
                >
                    {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
                </div>
                <div className="text-sm">
                    <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                        Forgot password?
                    </Link>
                </div>
              </div>

              {errors.submit && <p className="text-red-500 text-xs text-center">{errors.submit}</p>}
               
              <div>
                  <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 transition-colors"
                  >
                      {isLoading ? 'Signing In...' : 'Sign In'}
                  </button>
              </div>
          </form>

          <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-semibold text-blue-600 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
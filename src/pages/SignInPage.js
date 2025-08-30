import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../components/layout/apiService';
import { sanitizeInput, validateEmailPhone } from '../utils/sanatize';
import { useAuth } from '../context/AuthContext';
import InfoCards from '../components/layout/InfoCards';
import { Eye, EyeOff } from 'lucide-react';

const InputField = ({ id, label, type, name, placeholder, value, onChange, error, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';

  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">{label}</label>
      <input
        id={id}
        type={isPasswordField && showPassword ? 'text' : type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full p-4 text-white placeholder-gray-400 border border-transparent rounded-full bg-gray-700 bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 pr-12"
        aria-label={label}
        {...props}
      />
      {isPasswordField && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      )}
      {error && <p className="text-red-400 text-xs mt-1 pl-2">{error}</p>}
    </div>
  );
};

const RadioButton = ({ id, label, checked, onChange, value }) => (
  <label className="flex items-center text-white cursor-pointer">
    <input
      id={id}
      type="radio"
      checked={checked}
      onChange={onChange}
      className="mr-2 h-5 w-5 appearance-none rounded-full border-2 border-gray-400 checked:bg-purple-500 checked:border-transparent transition-colors duration-300"
      aria-label={label}
    />
    <span>{value}</span>
  </label>
);

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
      await apiService('/api/user-auth/login', {
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

      // Updated API endpoint
      const response = await apiService('/api/user-auth/login', {
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
      setErrors({ submit: error.message || 'Invalid credentials. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (formData.emailPhone || formData.password || otp) {
      if (!window.confirm('Are you sure you want to close? Unsaved changes will be lost.')) return;
    }
    navigate(-1);
  };

  return (
    <>
      <div
        className="flex items-center justify-center min-h-screen p-4 font-sans relative"
        style={{ background: 'linear-gradient(135deg, #1f1f3a, #000000)' }}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white text-lg font-bold rounded-full bg-gradient-to-r from-purple-600 to-indigo-700 shadow-lg hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 px-4 py-2"
          aria-label="Close sign-in form"
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
            <div className="flex justify-center space-x-6 mb-4">
              <RadioButton
                id="email"
                label="Use Email"
                checked={useEmail}
                onChange={() => handleRadioChange(true)}
                value="Email"
              />
              <RadioButton
                id="phone"
                label="Use Phone"
                checked={!useEmail}
                onChange={() => handleRadioChange(false)}
                value="Phone"
              />
            </div>
            <InputField
              id="emailPhone"
              label={useEmail ? 'Email' : 'Phone Number'}
              type={useEmail ? 'email' : 'tel'}
              name="emailPhone"
              placeholder={useEmail ? 'Email' : 'Phone Number'}
              value={formData.emailPhone}
              onChange={handleChange}
              error={errors.emailPhone}
            />
            {!useEmail && !showOTP && (
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={isLoading}
                className="w-full py-2 text-white font-bold rounded-full bg-gradient-to-r from-purple-600 to-indigo-700 shadow-lg hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 disabled:opacity-50"
                aria-label="Send OTP"
              >
                {isLoading ? 'Sending...' : 'Send OTP'}
              </button>
            )}
            {showOTP && (
              <InputField
                id="otp"
                label="Enter OTP"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 6) setOtp(value);
                }}
                error={errors.otp}
              />
            )}
            {useEmail && (
              <InputField
                id="password"
                label="Password"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />
            )}
            <div className="flex justify-end text-sm">
              <a
                href="/forgot-password"
                className="font-semibold text-purple-300 hover:text-purple-100 transition-colors duration-300"
                aria-label="Forgot Password"
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
                aria-label="Sign In"
              >
                {isLoading ? 'Signing In...' : 'SIGN IN'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <InfoCards />
    </>
  );
};

export default SignInPage;
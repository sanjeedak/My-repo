import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../components/layout/apiService';
import { sanitizeInput, validateEmailPhone } from '../utils/sanatize';
import InfoCards from '../components/layout/InfoCards'; // Import InfoCards

const InputField = ({ id, label, type, name, placeholder, value, onChange, error, ...props }) => (
  <div>
    <label htmlFor={id} className="sr-only">{label}</label>
    <input
      id={id}
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-4 text-white placeholder-gray-400 border border-transparent rounded-full bg-gray-700 bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
      aria-label={label}
      {...props}
    />
    {error && <p className="text-red-400 text-xs mt-1 pl-2">{error}</p>}
  </div>
);

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

const SignUpPage = () => {
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
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: sanitizeInput(value) }));
    setErrors((prev) => ({ ...prev, [name]: '', submit: '', terms: '' }));
  };

  const handleRadioChange = (isEmail) => {
    if (formData.firstName || formData.lastName || formData.emailPhone || formData.password || formData.confirmPassword || otp) {
      if (!window.confirm('Switching will clear the form. Continue?')) return;
    }
    setUseEmail(isEmail);
    setShowOTP(false);
    setOtp('');
    setFormData({ firstName: '', lastName: '', emailPhone: '', password: '', confirmPassword: '' });
    setErrors({});
  };

  const validateTextField = (value, fieldName) => {
    if (!value.trim()) return `${fieldName} is required`;
    if (!/^[a-zA-Z\s]{1,30}$/.test(value))
      return `${fieldName} must contain only letters and be max 30 characters`;
    return '';
  };

  const validateForm = () => {
    const newErrors = {};

    newErrors.firstName = validateTextField(formData.firstName, 'First name');
    newErrors.lastName = validateTextField(formData.lastName, 'Last name');
    newErrors.emailPhone = validateEmailPhone(formData.emailPhone, useEmail);

    if (useEmail) {
      if (!formData.password) newErrors.password = 'Password is required';
      else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/.test(formData.password))
        newErrors.password = 'Password must be 6-20 characters with at least one letter and one number';
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
      else if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!useEmail && showOTP) {
      if (!/^\d{6}$/.test(otp)) newErrors.otp = 'OTP must be a 6-digit number';
    }

    if (!acceptedTerms) newErrors.terms = 'You must accept the Terms of Use';

    return Object.fromEntries(Object.entries(newErrors).filter(([_, v]) => v));
  };

  const handleSendOTP = async () => {
    const newErrors = validateForm();
    if (newErrors.emailPhone) {
      setErrors({ emailPhone: newErrors.emailPhone });
      return;
    }

    setIsLoading(true);
    try {
      await apiService('/auth/send-otp', {
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
    try {
      const payload = useEmail
        ? {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.emailPhone,
            password: formData.password,
          }
        : {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.emailPhone,
            otp,
          };
      const response = await apiService('/auth/signup', {
        method: 'POST',
        body: payload,
      });
      console.log('Signup successful:', response.data);
      navigate('/signin');
    } catch (error) {
      setErrors({ submit: error.message || 'Signup failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (formData.firstName || formData.lastName || formData.emailPhone || formData.password || formData.confirmPassword || otp) {
      if (!window.confirm('Are you sure you want to close? Unsaved changes will be lost.')) return;
    }
    navigate(-1);
  };

  return (
    <div className="bg-slate-50">
      <div
        className="flex items-center justify-center min-h-screen p-4 font-sans relative"
        style={{ background: 'linear-gradient(135deg, #1f1f3a, #000000)' }}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white text-lg font-bold rounded-full bg-gradient-to-r from-purple-600 to-indigo-700 shadow-lg hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 px-4 py-2"
          aria-label="Close signup form"
        >
          Close
        </button>
        <div
          className="w-full max-w-lg p-10 rounded-3xl shadow-2xl backdrop-blur-lg bg-gray-800 bg-opacity-30"
          style={{ border: '1px solid rgba(255, 255, 255, 0.2)' }}
        >
          <h2 className="text-4xl font-extrabold text-center text-white mb-8 tracking-wide">
            REGISTER
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                id="firstName"
                label="First Name"
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
              />
              <InputField
                id="lastName"
                label="Last Name"
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
              />
            </div>

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
              <>
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
                <InputField
                  id="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                />
              </>
            )}

            <div className="flex items-center justify-center pt-1">
              <label className="flex items-center text-white cursor-pointer select-none space-x-2">
                <input
                  id="terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="h-5 w-5 appearance-none rounded-md border-2 border-gray-400 checked:bg-purple-500 checked:border-transparent transition-colors duration-300"
                  aria-label="Accept Terms of Use"
                />
                <span className="text-sm text-gray-300">
                  I accept{' '}
                  <a
                    href="/terms"
                    className="underline font-semibold text-purple-300 hover:text-purple-100 transition-colors duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms of Use
                  </a>
                </span>
              </label>
            </div>

            {errors.terms && <p className="text-red-400 text-xs text-center">{errors.terms}</p>}
            {errors.submit && <p className="text-red-400 text-xs text-center">{errors.submit}</p>}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 text-white text-lg font-bold rounded-full bg-gradient-to-r from-purple-600 to-indigo-700 shadow-lg hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 disabled:opacity-50"
                aria-label="Register"
              >
                {isLoading ? 'Registering...' : 'REGISTER NOW'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <InfoCards />
    </div>
  );
};

export default SignUpPage;
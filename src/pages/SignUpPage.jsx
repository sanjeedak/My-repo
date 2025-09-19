import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../components/layout/apiService';
import { sanitizeInput, validateEmailPhone } from '../utils/sanatize';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/forms/InputField';
import RadioButton from '../components/forms/RadioButton';
import { endpoints } from '../api/endpoints';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
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
  const [apiMessage, setApiMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: sanitizeInput(value) }));
    setErrors((prev) => ({ ...prev, [name]: '', submit: '' }));
    setApiMessage('');
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
      else if (!/^(?=.*[A-Za-z])(?=.*\d).{6,20}$/.test(formData.password))
        newErrors.password = 'Password must be 6-20 characters with at least one letter and one number.';
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
    setApiMessage('');
    try {
      const basePayload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        role: 'customer'
      };

      const payload = useEmail
        ? {
            ...basePayload,
            email: formData.emailPhone,
            password: formData.password,
          }
        : {
            ...basePayload,
            phone: formData.emailPhone,
            otp,
          };

      const response = await apiService(endpoints.userSignup, {
        method: 'POST',
        body: payload,
      });

      if (response.success) {
        login(response.data.user, response.data.token);
        navigate('/profile');
      } else {
        throw new Error(response.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      setErrors({ submit: error.message || 'Signup failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center p-4 font-sans" 
      style={{backgroundImage: "url('/img/auth-background.jpg')"}}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
            <Link to="/">
                <img src="/img/logo_shopzeo.png" alt="Shopzeo Logo" className="h-10 mx-auto" />
            </Link>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                Create an Account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
                Join us and start shopping!
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                id="firstName"
                name="firstName"
                label="First Name"
                type="text"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
              />
              <InputField
                id="lastName"
                name="lastName"
                label="Last Name"
                type="text"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
              />
            </div>

            <div className="flex justify-center space-x-8 pt-2">
                <RadioButton id="email" label="Use Email" checked={useEmail} onChange={() => handleRadioChange(true)} value="Email" />
                <RadioButton id="phone" label="Use Phone" checked={!useEmail} onChange={() => handleRadioChange(false)} value="Phone" />
            </div>

            <InputField
              id="emailPhone"
              name="emailPhone"
              label={useEmail ? 'Email' : 'Phone Number'}
              type={useEmail ? 'email' : 'tel'}
              placeholder={useEmail ? 'Enter your email here' : 'Enter your phone number here'}
              value={formData.emailPhone}
              onChange={handleChange}
              error={errors.emailPhone}
            />

            {!useEmail && !showOTP && (
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                {isLoading ? 'Sending...' : 'Send OTP'}
              </button>
            )}

            {showOTP && (
              <InputField
                id="otp"
                name="otp"
                label="Enter OTP"
                type="text"
                placeholder="Enter 6-digit OTP here"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                error={errors.otp}
              />
            )}

            {useEmail && (
              <>
                <InputField
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password here"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                />
                <InputField
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                />
              </>
            )}

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I accept the <Link to="/terms" className="font-medium text-indigo-600 hover:text-indigo-500">Terms of Use</Link>
              </label>
            </div>
            
            {apiMessage && <p className="text-green-600 text-sm text-center font-medium">{apiMessage}</p>}
            {errors.terms && <p className="text-red-500 text-xs">{errors.terms}</p>}
            {errors.submit && <p className="text-red-500 text-xs text-center">{errors.submit}</p>}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-colors"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
          
           <div className="mt-8 text-center text-sm">
                <p className="text-gray-600">
                    Already have an account?{' '}
                    <Link to="/signin" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
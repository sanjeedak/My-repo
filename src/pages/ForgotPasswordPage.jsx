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

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setEmail(sanitizeInput(e.target.value));
    setError('');
    setMessage('');
  };

  const validateForm = () => {
    const emailError = validateEmailPhone(email, true);
    if (emailError) {
      setError(emailError);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      // API call to send password reset link
      await apiService('/auth/forgot-password', {
        method: 'POST',
        body: { email },
      });
      setMessage('A password reset link has been sent to your email.');
    } catch (error) {
      setError(error.message || 'Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (email) {
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
          aria-label="Close form"
        >
          Close
        </button>
        <div
          className="w-full max-w-lg p-10 rounded-3xl shadow-2xl backdrop-blur-lg bg-gray-800 bg-opacity-30"
          style={{ border: '1px solid rgba(255, 255, 255, 0.2)' }}
        >
          <h2 className="text-4xl font-extrabold text-center text-white mb-8 tracking-wide">
            FORGOT PASSWORD
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <InputField
              id="email"
              label="Email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleChange}
              error={error}
            />
            {message && <p className="text-green-400 text-xs text-center">{message}</p>}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 text-white text-lg font-bold rounded-full bg-gradient-to-r from-purple-600 to-indigo-700 shadow-lg hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 disabled:opacity-50"
                aria-label="Submit"
              >
                {isLoading ? 'Sending...' : 'SUBMIT'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <InfoCards />
    </div>
  );
};

export default ForgotPasswordPage;
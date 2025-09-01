import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../components/layout/apiService';
import { sanitizeInput, validateEmailPhone } from '../utils/sanatize';
import InputField from '../components/forms/InputField';
import { endpoints } from '../api/endpoints';

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
      await apiService(endpoints.userForgotPassword, {
        method: 'POST',
        body: { email },
      });
      setMessage('A password reset link has been sent to your email.');
      setError('');
    } catch (error) {
      setError(error.message || 'Failed to send reset link. Please try again.');
      setMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
            <Link to="/">
                <img src="/img/logo_shopzeo.png" alt="Shopzeo Logo" className="h-10 mx-auto" />
            </Link>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                Forgot Password
            </h2>
            <p className="mt-2 text-sm text-gray-600">
                Enter your email to receive a reset link.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <InputField
              id="email"
              label="Email"
              type="email"
              name="email"
              placeholder="sanjeeda126@gmail.com"
              value={email}
              onChange={handleChange}
              error={error}
            />
            {message && <p className="text-green-600 text-sm text-center font-medium">{message}</p>}
            {error && !message && <p className="text-red-500 text-xs text-center">{error}</p>}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-colors"
                aria-label="Submit"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
          </form>
            <div className="mt-8 text-center text-sm">
                <p className="text-gray-600">
                    Suddenly remember it?{' '}
                    <button onClick={() => navigate(-1)} className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none">
                        Go Back
                    </button>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
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
  const [submittedOtp] = useState('123456');

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

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    else if (!/^[a-zA-Z\s]{1,30}$/.test(formData.firstName))
      newErrors.firstName = 'First name must contain only letters and be max 30 characters';

    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    else if (!/^[a-zA-Z\s]{1,30}$/.test(formData.lastName))
      newErrors.lastName = 'Last name must contain only letters and be max 30 characters';

    if (!formData.emailPhone.trim()) {
      newErrors.emailPhone = 'This field is required';
    } else if (useEmail) {
      if (!/^\S+@\S+\.\S+$/.test(formData.emailPhone)) {
        newErrors.emailPhone = 'Invalid email format';
      }
    } else {
      if (/\D/.test(formData.emailPhone)) {
        newErrors.emailPhone = 'Phone number must contain only numbers';
      } else if (formData.emailPhone.length !== 10) {
        newErrors.emailPhone = 'Phone must be exactly 10 digits';
      }
    }

    if (useEmail) {
      if (!formData.password) newErrors.password = 'Password is required';
      else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/.test(formData.password))
        newErrors.password = 'Password must be 6-20 characters with at least one letter and one number';
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
      else if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!useEmail && showOTP && !/^\d{6}$/.test(otp))
      newErrors.otp = 'OTP must be a 6-digit number';
    else if (!useEmail && showOTP && otp !== submittedOtp)
      newErrors.otp = 'Invalid OTP';

    return newErrors;
  };

  const handleSendOTP = () => {
    const newErrors = validateForm();
    if (newErrors.emailPhone) {
      setErrors({ emailPhone: newErrors.emailPhone });
      return;
    }
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Signup successful:', formData);
      navigate('/login');
    } catch (error) {
      setErrors({ submit: 'Signup failed. Please try again.' });
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
        className="w-full max-w-lg p-8 rounded-3xl shadow-2xl backdrop-blur-lg bg-gray-800 bg-opacity-30"
        style={{ border: '1px solid rgba(255, 255, 255, 0.2)' }}
      >
        <h2 className="text-3xl font-extrabold text-center text-white mb-6 tracking-wide">
          REGISTER
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-3 text-white placeholder-gray-400 border border-transparent rounded-full bg-gray-700 bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
              />
              {errors.firstName && <p className="text-red-400 text-xs pt-1 px-2">{errors.firstName}</p>}
            </div>
            <div>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-3 text-white placeholder-gray-400 border border-transparent rounded-full bg-gray-700 bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
              />
              {errors.lastName && <p className="text-red-400 text-xs pt-1 px-2">{errors.lastName}</p>}
            </div>
          </div>

          <div className="flex justify-center space-x-6 py-1">
            <label className="flex items-center text-white cursor-pointer">
              <input
                type="radio"
                checked={useEmail}
                onChange={() => {
                  setUseEmail(true);
                  setShowOTP(false);
                  setFormData((prev) => ({ ...prev, emailPhone: '', password: '', confirmPassword: '' }));
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
                  setFormData((prev) => ({ ...prev, emailPhone: '', password: '', confirmPassword: '' }));
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
              className="w-full p-3 text-white placeholder-gray-400 border border-transparent rounded-full bg-gray-700 bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
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
                className="w-full p-3 text-white placeholder-gray-400 border border-transparent rounded-full bg-gray-700 bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
              />
              {errors.otp && <p className="text-red-400 text-xs mt-1 pl-2">{errors.otp}</p>}
            </div>
          )}

          {useEmail && (
            <>
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 text-white placeholder-gray-400 border border-transparent rounded-full bg-gray-700 bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
                />
                {errors.password && <p className="text-red-400 text-xs mt-1 pl-2">{errors.password}</p>}
              </div>
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-3 text-white placeholder-gray-400 border border-transparent rounded-full bg-gray-700 bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
                />
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1 pl-2">{errors.confirmPassword}</p>}
              </div>
            </>
          )}

          <div className="flex items-center justify-center pt-1">
            <label className="flex items-center text-white cursor-pointer select-none space-x-2">
              <input
                type="checkbox"
                className="h-5 w-5 appearance-none rounded-md border-2 border-gray-400 checked:bg-purple-500 checked:border-transparent transition-colors duration-300"
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

          {errors.submit && <p className="text-red-400 text-xs text-center">{errors.submit}</p>}

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

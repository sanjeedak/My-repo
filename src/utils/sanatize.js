export const sanitizeInput = (value) => {
  return value.trim().replace(/[<>&;]/g, '').slice(0, 100);
};

export const validateEmailPhone = (value, useEmail) => {
  if (!value.trim()) return 'This field is required';
  if (useEmail) {
    if (!/^\S+@\S+\.\S+$/.test(value)) return 'Invalid email format';
  } else {
    if (!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(value)) return 'Please enter a valid 10-digit phone number, with an optional country code.';
  }
  return '';
};
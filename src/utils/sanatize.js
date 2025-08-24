export const sanitizeInput = (value) => {
  return value.trim().replace(/[<>&;]/g, '').slice(0, 100); // Add max length
};

export const validateEmailPhone = (value, useEmail) => {
  if (!value.trim()) return 'This field is required';
  if (useEmail) {
    if (!/^\S+@\S+\.\S+$/.test(value)) return 'Invalid email format';
  } else {
    if (/\D/.test(value)) return 'Phone number must contain only numbers';
    if (value.length !== 10) return 'Phone must be exactly 10 digits';
  }
  return '';
};
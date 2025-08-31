export const sanitizeInput = (value) => {
  return value.trim().replace(/[<>&;]/g, '').slice(0, 100);
};

export const validateEmailPhone = (value, useEmail) => {
  if (!value.trim()) return 'This field is required';
  if (useEmail) {
    if (!/^\S+@\S+\.\S+$/.test(value)) return 'Invalid email format';
  } else {
    const sanitizedPhone = value.replace(/\s/g, '');
    if (!/^(?:\+91)?\d{10}$/.test(sanitizedPhone)) {
      return 'Please enter a valid 10-digit phone number, with an optional country code.';
    }
  }
  return '';
};

export const validateName = (name, fieldName) => {
  if (!name.trim()) return `${fieldName} is required.`;
  if (!/^[a-zA-Z\s'-]{1,50}$/.test(name)) {
    return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes.`;
  }
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required.';
  if (password.length < 8) return 'Password must be at least 8 characters long.';
  if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
    return 'Password must include at least one letter, one number, and one special character (@$!%*?&).';
  }
  return '';
};


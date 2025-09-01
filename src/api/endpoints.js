// src/api/endpoints.js
export const endpoints = {
  // Products
  products: '/api/products',
  topSellers: '/api/products/top-sellers',

  // Brands
  brands: '/api/brands',
  
  // Stores (Vendors)
  stores: '/api/stores', // <-- ADDED THIS LINE

  // Banners
  banners: '/api/banners',

  // Categories
  categories: '/api/categories',

  // Orders
  orders: '/api/orders',

  // User Authentication
  userLogin: '/api/user-auth/login',
  userSignup: '/api/user-auth/signup',
  userProfile: '/api/user-auth/profile',
  userChangePassword: '/api/user-auth/change-password',
  userForgotPassword: '/api/user-auth/forgot-password',
  userVerifyOtp: '/api/user-auth/verify-otp',
  resetPassword: '/api/user-auth/reset-password',

  // Vendor Authentication
  vendorLogin: '/api/auth/vendor/login',
  vendorSignup: '/api/auth/vendor/signup',
  vendorForgotPassword: '/api/auth/vendor/forgot-password',
};


// src/api/endpoints.js
export const endpoints = {
  // Products
  products: '/products',
  topSellers: '/products/top-sellers',

  // Brands
  brands: '/brands',

  // Banners
  banners: '/banners',

  // Categories
  categories: '/categories',

  // Orders
  orders: '/orders',

  // User Authentication
  userLogin: '/api/user-auth/login',
  userSignup: '/user-auth/signup',
  userProfile: '/api/user-auth/profile',
  userChangePassword: '/api/user-auth/change-password',
  userForgotPassword: '/api/user-auth/forgot-password',

  // Vendor Authentication
  vendorLogin: '/auth/vendor/login',
  vendorSignup: '/auth/vendor/signup',
  vendorForgotPassword: '/auth/vendor/forgot-password',

  // OTP
  sendOtp: '/auth/send-otp'
};
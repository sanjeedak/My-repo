// src/api/endpoints.js
export const endpoints = {
  // Products
  products: '/api/products',
  productDetails: (slug) => `/api/products/${slug}`, // Add this new endpoint
  productSearch: '/api/products/search',
  topSellers: '/api/products/top-sellers',

  // Brands
  brands: '/api/brands',
  
  // Stores (Vendors)
  stores: '/api/stores',

  // Banners
  banners: '/api/banners',

  // Categories
  categories: '/api/categories',

  // Orders
   createCodOrder: '/orders', // यह COD के लिए है
    getRazorpayKey: '/payments/razorpay/get-key',
    createRazorpayOrder: '/payments/razorpay/create-order',
    verifyRazorpayPayment: '/payments/razorpay/verify-payment',

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
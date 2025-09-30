// src/api/endpoints.js
export const endpoints = {
  // Products
  products: '/api/products',
  productDetails: (id) => `/api/products/${id}`,
  productsByStore: (storeId) => `/api/products/store/${storeId}`,
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
 
  // Cart
  getCart: '/api/cart',
  addToCart: '/api/cart',
  updateCartItem: (id) => `/api/cart/${id}`,
  removeFromCart: (id) => `/api/cart/${id}`,
  clearCart: '/api/cart',

  // Wishlist
  getWishlist: '/api/wishlist',
  addToWishlist: '/api/wishlist/add', 
  removeFromWishlist: (id) => `/api/wishlist/remove/${id}`, 

  // Orders
  orders: '/api/orders',
  getOrderByNumber: (orderNumber) => `/api/track/${orderNumber}`,
  cancelOrder: (orderId) => `/api/orders/${orderId}/cancel`,

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

  // Payment
  createRazorpayOrder: '/api/payments/create-order',
  verifyRazorpayPayment: '/api/payments/verify-payment',
};
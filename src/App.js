import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { MapProvider } from './context/MapProvider';

// Layout Components
import Header from './components/layout/Header';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Loading Spinner Component
const FullPageSpinner = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-600 border-t-transparent"></div>
  </div>
);

// Lazy-loaded Page Components
const HomePage = lazy(() => import('./pages/HomePage'));
const BrandPage = lazy(() => import('./pages/BrandPage'));
const VendorsPage = lazy(() => import('./pages/VendorsPage'));
const OffersPage = lazy(() => import('./pages/OffersPage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
const SignInPage = lazy(() => import('./pages/SignInPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const VendorSignUpPage = lazy(() => import('./pages/VendorSignUpPage'));
const VendorSignInPage = lazy(() => import('./pages/VendorSignInPage'));
const VendorForgotPasswordPage = lazy(() => import('./pages/VendorForgotPasswordPage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const ContactUsPage = lazy(() => import('./pages/ContactUsPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const TrackOrderPage = lazy(() => import('./pages/TrackOrderPage'));
const CancellationPolicyPage = lazy(() => import('./pages/CancellationPolicyPage'));
const ReturnPolicyPage = lazy(() => import('./pages/ReturnPolicyPage'));
const TermsPage = lazy(() => import('./pages/TermPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const RefundPolicyPage = lazy(() => import('./pages/RefundPolicyPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));

const MainLayout = () => (
  <div className="bg-slate-50 min-h-screen font-sans flex flex-col">
    <Header />
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <MapProvider>
            <Router>
              <Suspense fallback={<FullPageSpinner />}>
                <Routes>
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="brands" element={<BrandPage />} />
                    <Route path="vendors" element={<VendorsPage />} />
                    <Route path="categories" element={<CategoriesPage />} />
                    <Route path="deals" element={<OffersPage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="wishlist" element={<WishlistPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route path="products" element={<ProductsPage />} />
                    <Route
                      path="profile"
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="about" element={<AboutUsPage />} />
                    <Route path="contact" element={<ContactUsPage />} />
                    <Route path="faq" element={<FAQPage />} />
                    <Route path="blog" element={<BlogPage />} />
                    <Route path="order-success" element={<OrderSuccessPage />} />
                    <Route path="track-order/:orderNumber" element={<TrackOrderPage />} />
                    <Route path="cancellation" element={<CancellationPolicyPage />} />
                    <Route path="return" element={<ReturnPolicyPage />} />
                    <Route path="privacy" element={<PrivacyPolicyPage />} />
                    <Route path="terms" element={<TermsPage />} />
                    <Route path="refund" element={<RefundPolicyPage />} />
                    <Route path="category/:slug" element={<ProductsPage />} />
                    <Route path="product/:id" element={<ProductDetailsPage />} />
                    <Route path="search" element={<ProductsPage />} />
                    <Route path="signin" element={<SignInPage />} />
                    <Route path="signup" element={<SignUpPage />} />
                    <Route path="reset-password" element={<ResetPasswordPage />} />
                    <Route path="forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="vendor/signin" element={<VendorSignInPage />} />
                    <Route path="vendor/signup" element={<VendorSignUpPage />} />
                    <Route path="vendor/forgot-password" element={<VendorForgotPasswordPage />} />
                  </Route>
                </Routes>
              </Suspense>
            </Router>
          </MapProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
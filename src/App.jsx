import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // Import Toaster
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { MapProvider } from './context/MapProvider';

// Layout Components
import Header from './components/layout/Header';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Something went wrong</h1>
            <p className="mt-2 text-gray-600">{this.state.error?.message || 'An unexpected error occurred'}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Not Found Component
const NotFoundPage = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
      <p className="mt-2 text-gray-600">The page you're looking for doesn't exist.</p>
      <a
        href="/"
        className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Go to Home
      </a>
    </div>
  </div>
);

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
const OrderCancelledPage = lazy(() => import('./pages/OrderCancelledPage'));
const CancellationPolicyPage = lazy(() => import('./pages/CancellationPolicyPage'));
const ReturnPolicyPage = lazy(() => import('./pages/ReturnPolicyPage'));
const TermsPage = lazy(() => import('./pages/TermPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const RefundPolicyPage = lazy(() => import('./pages/RefundPolicyPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));

// Scroll Restoration Component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const MainLayout = () => (
  <div className="bg-slate-50 min-h-screen font-sans flex flex-col">
    <Toaster position="top-center" reverseOrder={false} />
    <Header />
    <Navbar />
    <main className="flex-grow">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-t-transparent"></div>
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <MapProvider>
              <Router>
                <ScrollToTop />
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
                      <Route
                        path="checkout"
                        element={
                          <ProtectedRoute>
                            <CheckoutPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="products" element={<ProductsPage />} />
                      <Route path="store/:storeId" element={<ProductsPage />} />
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
                      <Route
                        path="order-success/:orderNumber"
                        element={
                          <ProtectedRoute>
                            <OrderSuccessPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="track-order/:orderNumber"
                        element={
                          <ProtectedRoute>
                            <TrackOrderPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="order-cancelled" element={<OrderCancelledPage />} />
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
                      <Route path="*" element={<NotFoundPage />} />
                    </Route>
                  </Routes>
                </Suspense>
              </Router>
            </MapProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
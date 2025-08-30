import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import CheckoutPage from './pages/CheckoutPage';

// Layout Components
import Header from './components/layout/Header';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Page Components
import HomePage from './pages/HomePage';
import BrandPage from './pages/BrandPage';
import OffersPage from './pages/OffersPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import VendorSignUpPage from './pages/VendorSignUpPage';
import VendorSignInPage from './pages/VendorSignInPage';
import VendorForgotPasswordPage from './pages/VendorForgotPasswordPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import FAQPage from './pages/FAQPage';
import BlogPage from './pages/BlogPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import TrackOrderPage from './pages/TrackOrderPage';
import CancellationPolicyPage from './pages/CancellationPolicyPage'; // <-- Import the new page
import ReturnPolicyPage from './pages/ReturnPolicyPage';
import TermsPage from './pages/TermPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import RefundPolicyPage from './pages/RefundPolicyPage';

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
          <Router>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="brands" element={<BrandPage />} />
                <Route path="deals" element={<OffersPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="wishlist" element={<WishlistPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="about" element={<AboutUsPage />} />
                <Route path="contact" element={<ContactUsPage />} />
                <Route path="faq" element={<FAQPage />} />
                <Route path="blog" element={<BlogPage />} />
                <Route path="order-success" element={<OrderSuccessPage />} />
                <Route path="track-order" element={<TrackOrderPage />} />
                <Route path="cancellation" element={<CancellationPolicyPage />} />
                <Route path="return" element={<ReturnPolicyPage />} />
                <Route path="privacy" element={<PrivacyPolicyPage />} />
                <Route path="terms" element={<TermsPage />} />
                <Route path="refund" element={<RefundPolicyPage />} />
                <Route path="category/:slug" element={<ProductsPage />} />
                <Route path="product/:slug" element={<ProductDetailsPage />} />
                <Route path="search" element={<ProductsPage />} />

                {/* Auth and Vendor pages */}
                <Route path="signin" element={<SignInPage />} />
                <Route path="signup" element={<SignUpPage />} />
                <Route path="forgot-password" element={<ForgotPasswordPage />} />
                <Route path="vendor/signin" element={<VendorSignInPage />} />
                <Route path="vendor/signup" element={<VendorSignUpPage />} />
                <Route path="vendor/forgot-password" element={<VendorForgotPasswordPage />} />
              </Route>
            </Routes>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
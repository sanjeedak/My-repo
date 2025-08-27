import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import CheckoutPage from './pages/CheckoutPage';

// Layout Components
import Header from './components/layout/Header';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Page Components
import HomePage from './pages/HomePage';
import BrandPage from './pages/BrandPage';
import OffersPage from './pages/OffersPage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import CartPage from './pages/CartPage';
import VendorSignUpPage from './pages/VendorSignUpPage';
import VendorSignInPage from './pages/VendorSignInPage';

// --- Main Layout Component ---

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
        <Router>
          <Routes>
            {/* All pages now render inside the MainLayout */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="brands" element={<BrandPage />} />
              <Route path="deals" element={<OffersPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />   {/* ✅ fixed */}
              <Route path="category/:slug" element={<ProductListPage />} />
              <Route path="product/:slug" element={<ProductDetailsPage />} />

              <Route path="search" element={<ProductListPage />} />

              {/* Auth and Vendor pages */}
              <Route path="signin" element={<SignInPage />} />
              <Route path="signup" element={<SignUpPage />} />
              <Route path="vendor/signin" element={<VendorSignInPage />} />
              <Route path="vendor/signup" element={<VendorSignUpPage />} />
            </Route>

          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

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


// Layout Wrapper
const Layout = ({ children }) => (
  <div className="bg-slate-50 min-h-screen font-sans">
    <Header />
    <Navbar />
    <main>{children}</main>
    <Footer />
  </div>
);

// Auth Layout (bina header/footer ke)
const AuthLayout = ({ children }) => (
    <div className="min-h-screen font-sans">
        {children}
    </div>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/brands" element={<Layout><BrandPage /></Layout>} />
            <Route path="/deals" element={<Layout><OffersPage /></Layout>} />
            <Route path="/cart" element={<Layout><CartPage /></Layout>} />
            <Route path="/category/:slug" element={<Layout><ProductListPage /></Layout>} />
            <Route path="/product/:slug" element={<Layout><ProductDetailsPage /></Layout>} />
            <Route path="/search" element={<Layout><ProductListPage /></Layout>} />
            
            <Route path="/signin" element={<AuthLayout><SignInPage /></AuthLayout>} />
            <Route path="/signup" element={<AuthLayout><SignUpPage /></AuthLayout>} />

             <Route path="/vendor/signin" element={<AuthLayout><VendorSignInPage /></AuthLayout>} />
            <Route path="/vendor/signup" element={<AuthLayout><VendorSignUpPage /></AuthLayout>} />
          </Routes>
        </Router>
       
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

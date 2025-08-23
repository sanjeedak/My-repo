import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- Context Provider ---
import { CartProvider } from './context/CartContext';

// --- Component Imports ---
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';

// --- Page Imports ---
import HomePage from './pages/HomePage';
import BrandPage from './pages/BrandPage';
import OffersPage from './pages/OffersPage';
import VendorsPage from './pages/VendorsPage';
import ProductListPage from './components/ProductListPage';
import Rating from './components/Rating';
import Signin from './pages/SignIn';
import Signup from './pages/SignUp';

// --- Layout Wrapper for consistency ---
const Layout = ({ children }) => (
  <div className="bg-gray-50 min-h-screen font-sans relative">
    <Header />
    <Navbar />
    <main className="container mx-auto px-4 mt-4 pb-8">
      {children}
    </main>
    <Footer />
    <FloatingButtons />
  </div>
);

const App = () => {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* MODIFIED: Added /home route */}
          <Route
            path="/home"
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />
          <Route
            path="/brand"
            element={
              <Layout>
                <BrandPage />
              </Layout>
            }
          />
          <Route
            path="/offers"
            element={
              <Layout>
                <OffersPage />
              </Layout>
            }
          />
          <Route
            path="/vendors"
            element={
              <Layout>
                <VendorsPage />
              </Layout>
            }
          />
          <Route
            path="/products/:category"
            element={
              <Layout>
                <ProductListPage />
              </Layout>
            }
          />
          <Route
            path="/rating"
            element={
              <Layout>
                <Rating />
              </Layout>
            }
          />
          <Route
            path="/signin"
            element={
              <Layout>
                <Signin />
              </Layout>
            }
          />
          <Route
            path="/signup"
            element={
              <Layout>
                <Signup />
              </Layout>
            }
          />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
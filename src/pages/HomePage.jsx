import React from 'react';
import CategoriesBar from '../components/CategoriesBar';
import HeroBanner from '../components/HeroBanner';
import { FlashDeal, FeaturedProducts, TopSellers } from '../components/products/ProductSections';
import { CategoriesSection } from '../components/CategoriesAndDeals';
import InfoCards from '../components/layout/InfoCards';
import DeliveryInfo from '../components/layout/DeliveryInfo'; // <-- IMPORT THE NEW DELIVERY COMPONENT

const HomePage = () => {
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-20">
      {/* Top section with categories and hero banner */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
        <div className="hidden lg:block lg:col-span-1">
          <CategoriesBar />
        </div>
        <div className="lg:col-span-3">
          <HeroBanner />
        </div>
      </div>

      {/* Page content sections */}
      <div className="space-y-12 mt-8">
        <FlashDeal />
        <FeaturedProducts />
        <TopSellers />
        <CategoriesSection />
        <DeliveryInfo /> {/* <-- ADD THE DELIVERY CARDS HERE */}
        <InfoCards /> {/* <-- ADD THE COMPANY INFO CARDS HERE */}
      </div>
    </div>
  );
};

export default HomePage;
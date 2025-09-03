import React from 'react';
import CategoriesBar from '../components/CategoriesBar';
import HeroBanner from '../components/HeroBanner';
import { FlashDeal, FeaturedProducts, TopSellers } from '../components/products/ProductSections';
import { CategoriesSection } from '../components/CategoriesAndDeals';
import InfoCards from '../components/layout/InfoCards';
import DeliveryInfo from '../components/layout/DeliveryInfo';

const HomePage = () => {
  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top section with categories and hero banner */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="hidden lg:block lg:col-span-1">
            <CategoriesBar />
          </div>
          <div className="lg:col-span-3">
            <HeroBanner />
          </div>
        </div>
      </div>

      {/* Page content sections */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-16">
          <FlashDeal />
          <FeaturedProducts />
          <TopSellers />
          <CategoriesSection />
          <DeliveryInfo />
          <InfoCards />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
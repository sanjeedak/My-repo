import React from 'react';
import CategoriesBar from '../components/CategoriesBar';
import HeroBanner from '../components/HeroBanner';
import { FlashDeal, FeaturedProducts, TopSellers } from '../components/products/ProductSections';
import { CategoriesSection } from '../components/CategoriesAndDeals';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4">
      {/* Top section with categories and hero banner */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-4">
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
      </div>
    </div>
  );
};

export default HomePage;
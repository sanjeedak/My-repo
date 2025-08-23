import React from 'react';
import CategoriesBar from '../components/CategoriesBar';
import HeroBanner from '../components/HeroBanner';
import { FlashDeal, FeaturedProducts } from '../components/ProductSections';
// FIXED: Changed to a named import for the two components
import { CategoriesSection, FeaturedDealSection } from '../components/CategoriesAndDeals';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
        <div className="hidden lg:block lg:col-span-1">
          <CategoriesBar />
        </div>
        <div className="lg:col-span-3">
          <HeroBanner />
        </div>
      </div>
      <div className="space-y-8 mt-8">
        <FlashDeal />
        <FeaturedProducts />
        {/* FIXED: Use the correctly imported components */}
        <CategoriesSection />
        <FeaturedDealSection />
      </div>
    </div>
  );
};

export default HomePage;
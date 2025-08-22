import React from 'react';
import CategoriesBar from '../components/CategoriesBar';
import HeroBanner from '../components/HeroBanner';
import { FlashDeal, FeaturedProducts } from '../components/ProductSections';
import CategoriesAndDeals from '../components/CategoriesAndDeals';
// import BusinessSection from '../components/BusinessSection';

const HomePage = () => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <CategoriesBar />
        </div>
        <div className="lg:col-span-3">
          <HeroBanner />
        </div>
      </div>

      <div className="space-y-6 mt-6">
        <FlashDeal />
        <FeaturedProducts />
        <CategoriesAndDeals />
      </div>

      {/* <BusinessSection /> */}
    </>
  );
};

export default HomePage;

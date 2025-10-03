import React, { useEffect, useRef } from 'react';
import CategoriesBar from '../components/CategoriesBar';
import HeroBanner from '../components/HeroBanner';
import { FlashDeal, FeaturedProducts, TopRatedProducts, LatestProducts, TopSellers } from '../components/products/ProductSections';
import { CategoriesSection, BrandsSection } from '../components/CategoriesAndDeals';
import AppPromotion from '../components/layout/AppPromotion';
import DeliveryInfo from '../components/layout/DeliveryInfo';
import InfoCards from '../components/layout/InfoCards';

const HomePage = () => {
  // 1. Create a ref that we will assign to the wrapper div
  const deliveryInfoRef = useRef(null);

  useEffect(() => {
    const wrapperElement = deliveryInfoRef.current;

    // 2. This function will prevent link clicks inside the wrapper
    const preventLinkClick = (event) => {
      // Check if the user clicked on a link
      if (event.target.tagName === 'A' || event.target.closest('a')) {
        // Link ko navigate karne se rokein
        event.preventDefault();
        event.stopPropagation();
      }
    };

    // 3. Add a permanent click listener to the wrapper div
    if (wrapperElement) {
      // Use 'capture: true' to catch the event before the link can act on it
      wrapperElement.addEventListener('click', preventLinkClick, { capture: true });
    }
    // 4. Clean up the listener when the component unmounts
    return () => {
      if (wrapperElement) {
        wrapperElement.removeEventListener('click', preventLinkClick, { capture: true });
      }
    };
  }, []); // This useEffect will run only once when the component loads


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
        <div className="space-y-12">
          <FlashDeal />
          <FeaturedProducts />
          <TopRatedProducts />
          <LatestProducts />
          <BrandsSection />
          <TopSellers />
          <CategoriesSection />
          <AppPromotion />

          {/* 5. Ref ko yahaan wrapper div par laga dein */}
          <div ref={deliveryInfoRef} style={{ cursor: 'default' }}>
            <DeliveryInfo />
          </div>

          <InfoCards />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
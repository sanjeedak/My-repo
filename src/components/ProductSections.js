import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { apiService } from '../api/apiService';
import { transformProductData } from '../utils/transformProductData';

// --- SVG Icons for Carousel Navigation ---
const ChevronLeftIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg> );
const ChevronRightIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg> );

// --- CountdownTimer Component ---
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const calculateTimeLeft = () => {
        const difference = +new Date().setHours(new Date().getHours() + 72) - +new Date();
        let times = {};
        if (difference > 0) {
            times = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return times;
    };
    const timer = setTimeout(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);
  
  const timerItems = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 my-4">
      {timerItems.map(({label, value}) => (
        <div key={label} className="text-center">
            <div className="text-2xl font-bold">{String(value || 0).padStart(2, '0')}</div>
            <div className="text-xs">{label}</div>
        </div>
      ))}
    </div>
  );
};

// --- FlashDeal Component ---
const FlashDeal = () => {
  // FIXED: Added missing state and ref definitions
  const [flashProducts, setFlashProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const getDeals = async () => {
      try {
        const data = await apiService('/api/products?limit=10');
        setFlashProducts(data.products.map(transformProductData));
      } catch (error) {
        console.error("Failed to load flash deals:", error);
      } finally {
        setLoading(false);
      }
    };
    getDeals();
  }, []);
  
  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="container mx-auto px-4 my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 uppercase">FLASH DEAL</h2>
        <Link to="/deals" className="text-sm text-blue-600 font-semibold hover:underline">View All &gt;</Link>
      </div>
      <div className="flex gap-6 items-stretch">
        <div className="hidden lg:flex flex-col justify-center text-center bg-blue-600 text-white rounded-lg p-6 w-full max-w-xs">
          <h3 className="font-semibold">Hurry Up! The offer is limited. Grab while it lasts</h3>
          <CountdownTimer />
        </div>
        <div className="relative flex-1">
          <div ref={scrollRef} className="flex space-x-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide h-full">
            {loading 
              ? Array.from({length: 4}).map((_, i) => <div key={i} className="flex-none w-60 h-full bg-gray-200 rounded-lg animate-pulse snap-start"></div>)
              : flashProducts.map(p => (
                  <div key={p.id} className="flex-none w-60 snap-start">
                      <ProductCard product={p} />
                  </div>
              ))
            }
          </div>
          <button onClick={() => handleScroll('left')} className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors z-10">
              <ChevronLeftIcon />
          </button>
          <button onClick={() => handleScroll('right')} className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors z-10">
              <ChevronRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- FeaturedProducts Component ---
const FeaturedProducts = () => {
  // FIXED: Added missing state definitions
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFeatured = async () => {
      try {
        const data = await apiService('/api/products?is_featured=true&limit=12');
        setFeaturedProducts(data.products.map(transformProductData));
      } catch (error) {
        console.error("Failed to load featured products:", error);
      } finally {
        setLoading(false);
      }
    };
    getFeatured();
  }, []);

  return (
    <div className="container mx-auto px-4 my-12">
      <div className="relative text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Featured products</h2>
        <Link to="/products?featured=true" className="absolute right-0 top-1/2 -translate-y-1/2 text-sm text-blue-600 font-semibold hover:underline">View All &gt;</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {loading
          ? Array.from({length: 6}).map((_, i) => <div key={i} className="w-full h-80 bg-gray-200 rounded-lg animate-pulse"></div>)
          : featuredProducts.map(p => <ProductCard key={p.id} product={p} />)
        }
      </div>
    </div>
  );
};

export { FlashDeal, FeaturedProducts };
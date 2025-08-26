import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { apiService } from '../layout/apiService';
import { transformProductData } from '../../utils/transformProductData';
import { API_BASE_URL } from '../../api/config';

// --- ICONS ---
const ChevronLeftIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg> );
const ChevronRightIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg> );
const StarIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg> );

// --- REUSABLE HELPER COMPONENTS ---

/**
 * A standardized, stylish header for each section.
 */
const SectionHeader = ({ title, linkTo }) => (
    <div className="flex items-center justify-between border-b pb-3 mb-6">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h2>
        <Link 
            to={linkTo} 
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
        >
            View All
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </Link>
    </div>
);

/**
 * A visually enhanced countdown timer.
 */
const CountdownTimer = ({ hours = 48 }) => {
  const [targetDate] = useState(() => {
    const date = new Date();
    date.setHours(date.getHours() + hours);
    return date;
  });
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
        const difference = +targetDate - +new Date();
        if (difference > 0) {
            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            });
        } else {
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            clearInterval(timer);
        }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const timerItems = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Mins', value: timeLeft.minutes },
    { label: 'Secs', value: timeLeft.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {timerItems.map(({label, value}) => (
        <div key={label} className="text-center bg-white/20 p-3 rounded-lg">
            <div className="text-3xl font-bold">{String(value || 0).padStart(2, '0')}</div>
            <div className="text-xs uppercase tracking-wider">{label}</div>
        </div>
      ))}
    </div>
  );
};

/**
 * A redesigned, professional Seller Card, now adapted for the 'stores' API model.
 */
const SellerCard = ({ seller: store }) => ( // Prop is aliased to 'store' for clarity
    <Link to={`/store/${store.slug}`} className="group bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <img 
                src={store.logo ? `${API_BASE_URL}/${store.logo}` : 'https://placehold.co/80x80?text=Store'} 
                alt={store.name}
                className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-md"
            />
        </div>
        <div className="p-4 text-center">
            <h3 className="font-bold text-gray-800 text-lg truncate group-hover:text-blue-600">{store.name}</h3>
            <div className="flex items-center justify-center text-sm text-gray-500 mt-1">
                <StarIcon />
                <span className="ml-1">{parseFloat(store.rating || 0).toFixed(1)} Rating</span>
            </div>
            <div className="mt-4 text-xs text-gray-400">
                <span>{store.total_products || 0} Products</span>
            </div>
        </div>
    </Link>
);


// --- MAIN SECTION COMPONENTS ---

const FlashDeal = () => {
  const [flashProducts, setFlashProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    apiService('/products?on_sale=true&limit=10')
      .then(data => setFlashProducts(data.products.map(transformProductData)))
      .catch(error => console.error("Failed to load flash deals:", error))
      .finally(() => setLoading(false));
  }, []);
  
  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="my-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
        {/* Left Countdown Section */}
        <div className="lg:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-lg p-6 flex flex-col justify-center text-center shadow-lg">
            <h3 className="text-3xl font-extrabold tracking-tight">Flash Deals</h3>
            <p className="my-3 text-blue-100">Hurry up! The offer is limited.</p>
            <CountdownTimer hours={24} />
        </div>
        
        {/* Right Product Carousel Section */}
        <div className="relative lg:col-span-3 group">
          <div ref={scrollRef} className="flex space-x-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide h-full py-2">
            {loading 
              ? Array.from({length: 4}).map((_, i) => <div key={i} className="flex-none w-64 h-full bg-gray-200 rounded-lg animate-pulse snap-start"></div>)
              : flashProducts.map(p => (
                  <div key={p.id} className="flex-none w-64 snap-start">
                      <ProductCard product={p} />
                  </div>
              ))
            }
          </div>
          {/* Navigation Buttons */}
          <button onClick={() => handleScroll('left')} className="absolute top-1/2 left-0 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-lg hover:bg-white transition-all z-10 opacity-0 group-hover:opacity-100 -translate-x-4">
              <ChevronLeftIcon />
          </button>
          <button onClick={() => handleScroll('right')} className="absolute top-1/2 right-0 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-lg hover:bg-white transition-all z-10 opacity-0 group-hover:opacity-100 translate-x-4">
              <ChevronRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService('/products?is_featured=true&limit=12')
      .then(data => setFeaturedProducts(data.products.map(transformProductData)))
      .catch(error => console.error("Failed to load featured products:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="my-12">
      <SectionHeader title="Featured Products" linkTo="/products?featured=true" />
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {loading
          ? Array.from({length: 6}).map((_, i) => <div key={i} className="w-full h-80 bg-gray-200 rounded-lg animate-pulse"></div>)
          : featuredProducts.map(p => <ProductCard key={p.id} product={p} />)
        }
      </div>
    </div>
  );
};

const TopSellers = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiService('/stores?top=true&limit=4')
            .then(data => {
                if (data.success && data.data.stores) {
                    setStores(data.data.stores);
                }
            })
            .catch(error => console.error("Failed to fetch top stores:", error))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="my-12">
            <SectionHeader title="Top Stores" linkTo="/stores" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>)
                ) : (
                    stores.map(store => <SellerCard key={store.id} seller={store} />)
                )}
            </div>
        </div>
    );
};

export { FlashDeal, FeaturedProducts, TopSellers };

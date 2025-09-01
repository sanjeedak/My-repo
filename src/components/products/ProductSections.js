import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { apiService } from '../layout/apiService';
import { transformProductData } from '../../utils/transformProductData';
import { API_BASE_URL } from '../../api/config';
import { endpoints } from '../../api/endpoints'; // Import endpoints
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// --- ICONS ---
const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

// --- REUSABLE COMPONENTS ---
const SectionHeader = ({ title, linkTo }) => (
  <div className="flex items-center justify-between border-b pb-3 mb-6">
    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h2>
    <Link 
      to={linkTo} 
      className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
    >
      View All
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </Link>
  </div>
);

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
    <div className="mt-4 flex justify-center gap-3">
      {timerItems.map((item, i) => (
        <div key={i} className="bg-white/20 px-3 py-2 rounded-lg text-center">
          <div className="text-lg font-bold">{item.value ?? 0}</div>
          <div className="text-xs uppercase text-blue-100">{item.label}</div>
        </div>
      ))}
    </div>
  );
};


const ProductCardSkeleton = () => (
    <div className="border rounded-lg shadow-sm animate-pulse">
        <div className="w-full h-40 bg-gray-200 rounded-t-lg"></div>
        <div className="p-4 space-y-3">
            <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
            <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
            <div className="w-1/3 h-5 bg-gray-200 rounded"></div>
        </div>
    </div>
);

// --- PRODUCT SECTIONS ---

export const FlashDeal = () => {
  const [flashProducts, setFlashProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // UPDATED: Use endpoints object for API call
    apiService(`${endpoints.products}?on_sale=true&limit=10`)
      .then(data => setFlashProducts((data.products || []).map(transformProductData)))
      .catch(error => console.error("Failed to load flash deals:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="my-12">
      <SectionHeader title="Flash Deals" linkTo="/products?section=flash_deal" />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
        <div className="lg:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-lg p-6 flex flex-col justify-center text-center shadow-lg">
          <h3 className="text-3xl font-extrabold tracking-tight">Flash Deals</h3>
          <p className="my-3 text-blue-100">Hurry up! The offer is limited.</p>
          <CountdownTimer hours={48} />
        </div>
        <div className="relative lg:col-span-3">
            <Swiper
              modules={[Navigation]}
              navigation
              spaceBetween={16}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
            >
              {loading 
                ? Array.from({length: 3}).map((_, i) => <SwiperSlide key={i}><ProductCardSkeleton /></SwiperSlide>)
                : flashProducts.map(p => (
                    <SwiperSlide key={p.id}>
                      <ProductCard product={p} />
                    </SwiperSlide>
                ))
              }
            </Swiper>
        </div>
      </div>
    </div>
  );
};


const ProductSectionLayout = ({ title, linkTo, endpoint }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiService(endpoint);
        const items = data.products || (data.data && data.data.products) || [];
        setProducts(items.map(transformProductData));
      } catch (error) {
        console.error(`Failed to load products for ${title}:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [endpoint, title]);

  return (
    <div className="my-12">
      <SectionHeader title={title} linkTo={linkTo} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
        ) : products.length > 0 ? (
          products.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          <div className="col-span-full text-center text-gray-500 py-10">
            🚀 No products available right now.
          </div>
        )}
      </div>
    </div>
  );
};


export const FeaturedProducts = () => (
    <ProductSectionLayout 
        title="Featured Products" 
        linkTo="/products?section=featured" 
        endpoint={`${endpoints.products}?is_featured=true&limit=12`}
    />
);

export const LatestProducts = () => (
    <ProductSectionLayout 
        title="Latest Products" 
        linkTo="/products?sortBy=created_at" 
        endpoint={`${endpoints.products}?sortBy=created_at&order=desc&limit=12`}
    />
);

// --- TOP SELLERS ---
const SellerCard = ({ seller: store }) => (
  <Link to={`/products?brand=${store.slug}`} className="group bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full">
    <div className="h-24 bg-gradient-to-r from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <img 
        src={store.logo && store.logo.startsWith('http') ? store.logo : `${API_BASE_URL}/${store.logo}`} 
        alt={store.name}
        className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-md"
        onError={(e) => { e.target.src = 'https://placehold.co/80x80?text=Store'; }}
      />
    </div>
    <div className="p-4 text-center flex-grow flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-gray-800 text-lg truncate group-hover:text-blue-600">{store.name}</h3>
        <div className="flex items-center justify-center text-sm text-gray-500 mt-1">
          <StarIcon />
          <span className="ml-1">{parseFloat(store.rating || 0).toFixed(1)} Rating</span>
        </div>
      </div>
      <div className="mt-4 text-xs text-gray-400">
        <span>{store.total_products || 0} Products</span>
      </div>
    </div>
  </Link>
);

export const TopSellers = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // UPDATED: Use endpoints object for API call
    apiService(`${endpoints.stores}?top=true&limit=10`)
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
      <SectionHeader title="Top Sellers" linkTo="/vendors" />
       <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={16}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
          }}
        >
        {loading 
          ? Array.from({ length: 5 }).map((_, i) => (
              <SwiperSlide key={i}>
                <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse"></div>
              </SwiperSlide>
            ))
          : stores.map(store => (
              <SwiperSlide key={store.id} className="h-full">
                <SellerCard seller={store} />
              </SwiperSlide>
            ))
        }
      </Swiper>
    </div>
  );
};


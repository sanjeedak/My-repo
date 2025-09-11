import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { motion } from 'framer-motion';

import ProductCard from './ProductCard';
import { apiService } from '../layout/apiService';
import { transformProductData } from '../../utils/transformProductData';
import { API_BASE_URL } from '../../api/config';
import { endpoints } from '../../api/endpoints';
import { StarIcon } from '../../assets/icons';

import 'swiper/css';
import 'swiper/css/navigation';

// --- SECTION HEADER ---
const SectionHeader = ({ title, linkTo }) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between border-b pb-2 mb-4">
      <h2 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h2>
      <Link
        to={linkTo}
        className="text-xs font-medium text-blue-600 hover:bg-blue-100 px-2 py-1 rounded transition-all flex items-center gap-1"
      >
        {t('view_all')}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    </div>
  );
};

// --- COUNTDOWN TIMER ---
const CountdownTimer = ({ hours = 48 }) => {
  const { t } = useTranslation();
  const [targetDate] = useState(() => {
    const date = new Date();
    date.setHours(date.getHours() + hours);
    return date;
  });
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = +targetDate - +new Date();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const items = [
    { label: t('days'), value: timeLeft.days },
    { label: t('hours'), value: timeLeft.hours },
    { label: t('mins'), value: timeLeft.minutes },
    { label: t('secs'), value: timeLeft.seconds },
  ];

  return (
    <div className="mt-3 flex justify-center gap-2">
      {items.map((item, i) => (
        <div key={i} className="bg-white/20 px-2 py-1 rounded text-center text-xs w-12">
          <div className="text-base font-bold">{item.value ?? 0}</div>
          <div className="text-[10px] uppercase text-blue-100">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

// --- PRODUCT CARD SKELETON ---
const ProductCardSkeleton = ({ small = false }) => (
  <div className={`border rounded-md shadow-sm animate-pulse ${small ? "max-w-[140px]" : ""}`}>
    <div className={`w-full ${small ? "aspect-[3/4]" : "aspect-[1/1]"} bg-gray-200 rounded-t-md`}></div>
    <div className="p-2 space-y-1">
      <div className="w-3/4 h-2.5 bg-gray-200 rounded"></div>
      <div className="w-1/2 h-2.5 bg-gray-200 rounded"></div>
      <div className="w-1/3 h-3 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// --- FLASH DEAL ---
export const FlashDeal = () => {
  const { t } = useTranslation();
  const [flashProducts, setFlashProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService(`${endpoints.products}?on_sale=true&limit=10`)
      .then(data => setFlashProducts((data.products || []).map(transformProductData)))
      .catch(err => console.error("Flash deals error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="my-8">
      <SectionHeader title={t('flash_deals')} linkTo="/products?section=flash_deal" />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 items-stretch">
        
        {/* LEFT INFO BOX */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-lg p-4 flex flex-col justify-center text-center shadow-md"
        >
          <h3 className="text-lg font-bold flex items-center justify-center gap-1">
            ⚡ {t('flash_deals')}
          </h3>
          <p className="my-1 text-blue-100 text-xs">{t('hurry_up_offer_limited')}</p>
          <CountdownTimer hours={48} />
        </motion.div>

        {/* PRODUCT SLIDER */}
        <div className="relative lg:col-span-4">
          <Swiper
            modules={[Navigation]}
            navigation={{ nextEl: ".flash-next", prevEl: ".flash-prev" }}
            spaceBetween={10}
            slidesPerView={2}
            breakpoints={{
              360: { slidesPerView: 2.3 },
              480: { slidesPerView: 3 },
              640: { slidesPerView: 3.5 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
              1280: { slidesPerView: 6 },
            }}
          >
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <SwiperSlide key={i}>
                    <ProductCardSkeleton small />
                  </SwiperSlide>
                ))
              : flashProducts.map(p => (
                  <SwiperSlide key={p.id}>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <ProductCard product={p} small />
                    </motion.div>
                  </SwiperSlide>
                ))}
          </Swiper>

          {/* CUSTOM NAV BUTTONS */}
          <button className="flash-prev absolute -left-3 top-1/2 -translate-y-1/2 bg-white text-gray-600 p-2 rounded-full shadow hover:bg-gray-100 z-10">
            ‹
          </button>
          <button className="flash-next absolute -right-3 top-1/2 -translate-y-1/2 bg-white text-gray-600 p-2 rounded-full shadow hover:bg-gray-100 z-10">
            ›
          </button>
        </div>
      </div>
    </div>
  );
};

// --- PRODUCT SECTION LAYOUT ---
const ProductSectionLayout = ({ title, linkTo, endpoint }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await apiService(endpoint);
        const items = data.products || [];
        setProducts(items.map(transformProductData));
      } catch (error) {
        console.error(`Failed to load products for ${title}:`, error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [endpoint, title]);

  return (
    <div className="my-8">
      <SectionHeader title={title} linkTo={linkTo} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} small />)
        ) : products.length > 0 ? (
          products.map((p) => <ProductCard key={p.id} product={p} small />)
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            <img src="/no-products.svg" alt="No products" className="w-32 mx-auto mb-3" />
            <p className="text-sm">🚀 No products available right now.</p>
            <Link to="/products" className="mt-2 inline-block text-blue-600 font-medium hover:underline">
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

// --- FEATURED & LATEST PRODUCTS ---
export const FeaturedProducts = () => {
  const { t } = useTranslation();
  return (
    <ProductSectionLayout
      title={t('featured_products')}
      linkTo="/products?section=featured"
      endpoint={`${endpoints.products}?sortBy=created_at&order=desc&limit=6`}
    />
  );
};

export const LatestProducts = () => {
  const { t } = useTranslation();
  return (
    <ProductSectionLayout
      title={t('latest_products')}
      linkTo="/products?sortBy=created_at"
      endpoint={`${endpoints.products}?sortBy=created_at&order=desc&limit=18`}
    />
  );
};

// --- SELLER CARD ---
const SellerCard = ({ seller: store }) => (
  <Link
    to={`/products?brand=${store.slug}`}
    className="group bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full"
  >
    <div className="h-16 bg-gradient-to-r from-blue-50 to-indigo-100 flex items-center justify-center p-2">
      <img
        src={store.logo && store.logo.startsWith('http') ? store.logo : `${API_BASE_URL}/${store.logo}`}
        alt={store.name}
        className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-md group-hover:scale-110 transition-transform"
        onError={(e) => { e.target.src = 'https://placehold.co/64x64?text=Store'; }}
      />
    </div>
    <div className="p-2 text-center flex-grow flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-gray-800 text-sm truncate group-hover:text-blue-600">{store.name}</h3>
        <div className="flex items-center justify-center text-[11px] text-gray-500 mt-0.5">
          <StarIcon className="w-3 h-3 text-yellow-500" />
          <span className="ml-0.5">{parseFloat(store.rating || 0).toFixed(1)} Rating</span>
        </div>
      </div>
      <div className="mt-1 text-[11px] text-gray-400">
        <span>{store.total_products || 0} Products</span>
      </div>
    </div>
  </Link>
);

// --- TOP SELLERS ---
export const TopSellers = () => {
  const { t } = useTranslation();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService(endpoints.stores)
      .then(data => {
        if (data.success && Array.isArray(data.stores)) {
          setStores(data.stores);
        }
      })
      .catch(error => console.error("Failed to fetch top stores:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="my-8">
      <SectionHeader title={t('top_sellers')} linkTo="/vendors" />
      <div className="relative">
        <Swiper
          modules={[Navigation]}
          navigation={{ nextEl: ".seller-next", prevEl: ".seller-prev" }}
          spaceBetween={12}
          slidesPerView={2}
          breakpoints={{
            480: { slidesPerView: 3 },
            640: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
        >
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <SwiperSlide key={i}>
                  <div className="w-full h-32 bg-gray-200 rounded-md animate-pulse"></div>
                </SwiperSlide>
              ))
            : stores.map(store => (
                <SwiperSlide key={store.id} className="h-full">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <SellerCard seller={store} />
                  </motion.div>
                </SwiperSlide>
              ))}
        </Swiper>

        {/* CUSTOM NAV BUTTONS */}
        <button className="seller-prev absolute -left-3 top-1/2 -translate-y-1/2 bg-white text-gray-600 p-2 rounded-full shadow hover:bg-gray-100 z-10">
          ‹
        </button>
        <button className="seller-next absolute -right-3 top-1/2 -translate-y-1/2 bg-white text-gray-600 p-2 rounded-full shadow hover:bg-gray-100 z-10">
          ›
        </button>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiService } from './layout/apiService';
import { API_BASE_URL } from '../api/config';
import { endpoints } from '../api/endpoints';
import { transformProductData } from '../utils/transformProductData';
import ProductCard from './products/ProductCard';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

import { Eye } from 'lucide-react';
import Pagination from './Pagination';

/* -------------------------------
   Helper for category/brand images
---------------------------------*/
const getImageUrl = (path, fallbackText = 'Item') => {
  if (!path) return `https://placehold.co/80x80/EBF4FF/7F9CF5?text=${fallbackText}`;
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}/${path}`;
};

/* -------------------------------
   Categories Section
---------------------------------*/
export const CategoriesSection = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await apiService(`${endpoints.categories}?page=${pagination.currentPage}&limit=12`);
        if (data?.data?.categories) {
          const formatted = data.data.categories.map((cat) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            image: getImageUrl(cat.image, cat.name.split(' ')[0])
          }));
          setCategories(formatted);
          if (data.data.pagination) setPagination(data.data.pagination);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [pagination.currentPage]);

  const handleCategoryClick = (slug) => navigate(`/category/${slug}`);
  const handlePageChange = (page) => setPagination(prev => ({ ...prev, currentPage: page }));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">{t('categories')}</h2>
        <Link to="/products" className="text-sm text-blue-600 hover:underline">
          {t('view_all')} →
        </Link>
      </div>
      {loading ? (
        <div className="text-center text-gray-500">Loading categories...</div>
      ) : (
        <>
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={12}
            slidesPerView={2}
            breakpoints={{
              320: { slidesPerView: 2, spaceBetween: 10 },
              480: { slidesPerView: 3, spaceBetween: 12 },
              768: { slidesPerView: 4, spaceBetween: 14 },
              1024: { slidesPerView: 5, spaceBetween: 16 },
              1280: { slidesPerView: 6, spaceBetween: 18 },
            }}
            className="!px-2"
          >
            {categories.map((cat) => (
              <SwiperSlide key={cat.id}>
                <div
                  onClick={() => handleCategoryClick(cat.slug)}
                  className="cursor-pointer group flex flex-col items-center text-center"
                >
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden border group-hover:border-blue-500 transition-all">
                    <img src={cat.image} alt={cat.name} className="max-w-full max-h-full object-contain" />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <Eye className="text-white w-5 h-5 md:w-6 md:h-6" />
                    </div>
                  </div>
                  <p className="mt-1 text-xs md:text-sm text-gray-700 group-hover:text-blue-600 truncate max-w-[80px]">
                    {cat.name}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <Pagination pagination={pagination} handlePageChange={handlePageChange} />
        </>
      )}
    </div>
  );
};

/* -------------------------------
   Brands Section
---------------------------------*/
export const BrandsSection = () => {
  const { t } = useTranslation();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const data = await apiService(`${endpoints.brands}?page=${pagination.currentPage}&limit=12`);
        if (data?.data?.brands) {
          setBrands(data.data.brands);
          if (data.data.pagination) setPagination(data.data.pagination);
        }
      } catch (error) {
        console.error('Failed to fetch brands:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, [pagination.currentPage]);

  const handlePageChange = (page) => setPagination(prev => ({ ...prev, currentPage: page }));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">{t('brands')}</h2>
        <Link to="/brands" className="text-sm text-blue-600 hover:underline">
          {t('view_all_brands')} →
        </Link>
      </div>
      {loading ? (
        <div className="text-center text-gray-500">Loading brands...</div>
      ) : (
        <>
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={12}
            slidesPerView={2}
            breakpoints={{
              320: { slidesPerView: 2, spaceBetween: 10 },
              480: { slidesPerView: 3, spaceBetween: 12 },
              768: { slidesPerView: 5, spaceBetween: 14 },
              1024: { slidesPerView: 7, spaceBetween: 16 },
              1280: { slidesPerView: 8, spaceBetween: 18 },
            }}
            className="!px-2"
          >
            {brands.map((brand) => (
              <SwiperSlide key={brand.id}>
                <Link
                  to={`/products?brand=${brand.slug}`}
                  className="cursor-pointer group flex flex-col items-center text-center p-2 border rounded-md hover:shadow-md transition"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
                    <img
                      src={getImageUrl(brand.logo, 'Brand')}
                      alt={brand.name}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => { e.target.src = 'https://placehold.co/80x80/EBF4FF/7F9CF5?text=Brand'; }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-700 group-hover:text-blue-600 truncate w-full">
                    {brand.name}
                  </p>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
          <Pagination pagination={pagination} handlePageChange={handlePageChange} />
        </>
      )}
    </div>
  );
};

/* -------------------------------
   Featured Deal Section
---------------------------------*/
export const FeaturedDealSection = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        const data = await apiService(`${endpoints.products}?is_featured=true&page=${pagination.currentPage}&limit=12`);
        if (data?.data?.products) {
          const enhanced = data.data.products.map(transformProductData);
          setDeals(enhanced);
          if (data.data.pagination) setPagination(data.data.pagination);
        }
      } catch (error) {
        console.error('Failed to fetch deals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, [pagination.currentPage]);

  const handlePageChange = (page) => setPagination(prev => ({ ...prev, currentPage: page }));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Featured Deal</h2>
          <p className="text-sm text-gray-500">See the latest deals and exciting new offers!</p>
        </div>
        <Link to="/products?section=featured" className="text-sm text-blue-600 hover:underline">
          View All →
        </Link>
      </div>
      {loading ? (
        <div className="text-center text-gray-500">Loading deals...</div>
      ) : (
        <>
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={12}
            slidesPerView={1}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 10 },
              480: { slidesPerView: 2, spaceBetween: 12 },
              768: { slidesPerView: 3, spaceBetween: 14 },
              1024: { slidesPerView: 4, spaceBetween: 16 },
            }}
            className="!px-2"
          >
            {deals.map((p) => (
              <SwiperSlide key={p.id}>
                <ProductCard product={p} />
              </SwiperSlide>
            ))}
          </Swiper>
          <Pagination pagination={pagination} handlePageChange={handlePageChange} />
        </>
      )}
    </div>
  );
};

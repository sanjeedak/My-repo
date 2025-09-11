import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiService } from './layout/apiService';
import { API_BASE_URL } from '../api/config';
import { endpoints } from '../api/endpoints'; // Import endpoints
import { transformProductData } from '../utils/transformProductData';
import ProductCard from './products/ProductCard';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

// Eye icon (lucide or heroicons)
import { Eye } from 'lucide-react';

// Helper function to get the correct image URL for categories
const getCategoryImageUrl = (imagePath, categoryName) => {
  if (imagePath && imagePath.startsWith('http')) {
    return imagePath;
  }
  if (imagePath) {
    return `${API_BASE_URL}/${imagePath}`;
  }
  const firstWord = categoryName.split(' ')[0];
  return `https://placehold.co/80x80/EBF4FF/7F9CF5?text=${encodeURIComponent(firstWord)}`;
};


// --- Categories Section ---
export const CategoriesSection = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // UPDATED: Use the centralized endpoints object
        const data = await apiService(endpoints.categories);
        const formatted = data.data.categories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          image: getCategoryImageUrl(cat.image, cat.name)
        }));
        setCategories(formatted);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (slug) => {
    navigate(`/category/${slug}`);
  };

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
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={16}
          slidesPerView={4}
          breakpoints={{
            640: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
          }}
        >
          {categories.map((cat) => (
            <SwiperSlide key={cat.id}>
              <div
                onClick={() => handleCategoryClick(cat.slug)}
                className="cursor-pointer group flex flex-col items-center text-center"
              >
                <div className="relative w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden border group-hover:border-blue-500 transition-all">
                  <img src={cat.image} alt={cat.name} className="max-w-full max-h-full object-contain" />
                  {/* Eye Icon overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <Eye className="text-white w-6 h-6" />
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-700 group-hover:text-blue-600">{cat.name}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

// --- Brands Section ---
export const BrandsSection = () => {
    const { t } = useTranslation();
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    const getBrandImageUrl = (logo) => {
        if (!logo) return 'https://placehold.co/80x80/EBF4FF/7F9CF5?text=Brand';
        if (logo.startsWith('http')) return logo;
        return `${API_BASE_URL}/${logo}`;
    };

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const data = await apiService(`${endpoints.brands}?limit=12`);
                if (data.success && Array.isArray(data.data?.brands)) {
                    setBrands(data.data.brands);
                }
            } catch (error) {
                console.error('Failed to fetch brands:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBrands();
    }, []);

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
                <Swiper
                    modules={[Navigation]}
                    navigation
                    spaceBetween={16}
                    slidesPerView={4}
                    breakpoints={{
                        640: { slidesPerView: 5 },
                        1024: { slidesPerView: 8 },
                    }}
                >
                    {brands.map((brand) => (
                        <SwiperSlide key={brand.id}>
                            <Link
                                to={`/products?brand=${brand.slug}`}
                                className="cursor-pointer group flex flex-col items-center text-center p-2 border rounded-md hover:shadow-md transition"
                            >
                                <div className="w-20 h-20 flex items-center justify-center">
                                    <img 
                                        src={getBrandImageUrl(brand.logo)} 
                                        alt={brand.name} 
                                        className="max-w-full max-h-full object-contain"
                                        onError={(e) => { e.target.src = 'https://placehold.co/80x80/EBF4FF/7F9CF5?text=Brand'; }}
                                    />
                                </div>
                                <p className="mt-2 text-xs text-gray-700 group-hover:text-blue-600 truncate w-full">{brand.name}</p>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
};


// --- Featured Deal Section ---
export const FeaturedDealSection = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        // UPDATED: Use the centralized endpoints object
        const data = await apiService(`${endpoints.products}?is_featured=true`);
        const enhanced = data.products.map(transformProductData);
        setDeals(enhanced);
      } catch (error) {
        console.error('Failed to fetch deals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

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
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={16}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
        >
          {deals.map((p) => (
            <SwiperSlide key={p.id}>
              <ProductCard product={p} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};
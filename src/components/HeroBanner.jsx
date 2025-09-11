import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from './layout/apiService';
import { endpoints } from '../api/endpoints';
import { API_BASE_URL } from '../api/config';
import { transformProductData } from '../utils/transformProductData';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const heroBannerStyles = `
  .hero-swiper .swiper-button-next,
  .hero-swiper .swiper-button-prev {
    color: white;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    transition: background-color 0.2s;
  }
  .hero-swiper .swiper-button-next:hover,
  .hero-swiper .swiper-button-prev:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }
  .hero-swiper .swiper-button-next::after,
  .hero-swiper .swiper-button-prev::after {
    font-size: 16px;
    font-weight: bold;
  }
  .hero-swiper .swiper-pagination-bullet {
    background-color: rgba(255, 255, 255, 0.7);
    width: 10px;
    height: 10px;
    opacity: 1;
  }
  .hero-swiper .swiper-pagination-bullet-active {
    background-color: white;
    transform: scale(1.2);
  }
`;

const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://placehold.co/1200x400?text=Promotion';
  }
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  return `${API_BASE_URL}/${imagePath}`;
};

const HeroBanner = () => {
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannerData, productData] = await Promise.all([
          apiService(endpoints.banners),
          apiService(endpoints.products)
        ]);

        setBanners(bannerData.data.banners || []);

        if (productData && productData.products) {
          const transformed = productData.products.map(transformProductData);
          setProducts(transformed);
        }

      } catch (err) {
        setError(`Failed to load data: ${err.message}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSlideClick = (banner) => {
    if (banner.product_id) {
      const productToLink = products.find(p => p.id === banner.product_id);
      if (productToLink && productToLink.slug) {
        navigate(`/product/${productToLink.slug}`);
        return;
      }
    }

    let url = banner.button_url;
    if (!url) return;

    if (url.startsWith('/products/')) {
        const slug = url.substring('/products/'.length);
        if (slug && !slug.includes('?')) {
            url = `/category/${slug}`;
        }
    }

    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      navigate(url);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-[380px] bg-gray-200 rounded-lg animate-pulse"></div>;
  if (error) return <div className="flex items-center justify-center h-[380px] bg-red-50 text-red-500 rounded-lg">{error}</div>;
  if (banners.length === 0) return <div className="flex items-center justify-center h-[380px] bg-gray-100 rounded-lg">No banners available.</div>;

  return (
    <>
      <style>{heroBannerStyles}</style>
      <div className="relative h-[40vh] md:h-[380px] text-white overflow-hidden rounded-lg">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          className="h-full hero-swiper"
          spaceBetween={0}
          slidesPerView={1}
          navigation={banners.length > 1}
          pagination={{ clickable: true }}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
        >
          {banners.map((banner, index) => (
            <SwiperSlide
              key={banner.id}
              onClick={() => handleSlideClick(banner)}
              style={{ cursor: (banner.button_url || banner.product_id) ? 'pointer' : 'default' }}
              className="bg-gray-100"
            >
               <img
                src={getImageUrl(banner.image)}
                alt={`Promotion ${index + 1}`}
                className="w-full h-full object-contain md:object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchpriority={index === 0 ? 'high' : 'auto'}
                decoding="async"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default HeroBanner;
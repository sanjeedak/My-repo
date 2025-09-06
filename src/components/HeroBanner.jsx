import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from './layout/apiService';
import { endpoints } from '../api/endpoints';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

// Swiper button and pagination styles (unchanged)
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
  if (imagePath && imagePath.startsWith('http')) {
    return imagePath;
  }
  return 'https://placehold.co/1200x400?text=Promotion';
};

const HeroBanner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await apiService(endpoints.banners);
        setBanners(data.data.banners || []);
      } catch (err) {
        setError(`Failed to load banners: ${err.message}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // Handler for clicking the entire slide
  const handleSlideClick = (url) => {
    if (url) {
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
          {banners.map((banner) => (
            <SwiperSlide
              key={banner.id}
              onClick={() => handleSlideClick(banner.button_url)}
              style={{ cursor: banner.button_url ? 'pointer' : 'default' }}
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${getImageUrl(banner.image)})`
                }}
              >
                {/* All text and button elements have been removed from here */}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default HeroBanner;
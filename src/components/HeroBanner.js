import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from './layout/apiService';
import { endpoints } from '../api/endpoints'; // Import endpoints
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

// Custom styles for a more polished look
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

// Simplified helper for image URLs, as the API provides absolute paths.
const getImageUrl = (imagePath) => {
  if (imagePath && imagePath.startsWith('http')) {
    return imagePath;
  }
  // Provide a descriptive placeholder if the image is missing
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
        const data = await apiService(endpoints.banners); // CORRECTED
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

  const handleActionClick = (url) => {
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
            <SwiperSlide key={banner.id}>
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${getImageUrl(banner.image)})`
                }}
              >
                <div className="container mx-auto px-8 md:px-12 h-full flex flex-col justify-center items-start text-left">
                  <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-3">
                    {banner.title}
                  </h1>
                  <p className="text-base md:text-lg text-gray-200 mb-6 max-w-lg">
                    {banner.description}
                  </p>
                  {banner.button_text && (
                     <button
                        onClick={() => handleActionClick(banner.button_url)}
                        className="bg-blue-600 text-white font-bold px-6 py-3 rounded-md hover:bg-blue-700 transition-transform transform hover:scale-105 duration-300"
                      >
                        {banner.button_text}
                      </button>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default HeroBanner;

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { apiService } from './layout/apiService';
import { API_BASE_URL } from '../api/config'; // Import the shared base URL

// Helper function to fix the malformed image URLs from the API
const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return '/fallback-banner.jpg'; // Provide a default fallback image
  }

  // This logic handles cases where the API might return a full URL nested inside another URL string.
  const malformedSegment = 'http://localhost:5000/uploads/banners/';
  if (imagePath.includes(malformedSegment)) {
    return imagePath.substring(imagePath.indexOf(malformedSegment));
  }
  
  // If the URL is already a correct, absolute URL, return it as is.
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Use the imported API_BASE_URL for relative paths
  return `${API_BASE_URL}/${imagePath}`;
};


const HeroBanner = () => {
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await apiService('/banners');
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
  
  const handleNext = useCallback(() => {
    if (banners.length > 0) {
      setCurrentBannerIndex(prevIndex => (prevIndex + 1) % banners.length);
    }
  }, [banners.length]);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        handleNext();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length, currentBannerIndex, handleNext]); // Added handleNext to dependency array

  const currentBanner = banners[currentBannerIndex];

  const handlePrimaryAction = () => {
    if (currentBanner?.button_url) {
      navigate(currentBanner.button_url);
    }
  };

  const handlePrev = () => {
    if (banners.length > 0) {
      setCurrentBannerIndex(prevIndex => (prevIndex - 1 + banners.length) % banners.length);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-[380px] bg-gray-200 rounded-lg animate-pulse"></div>;
  if (error) return <div className="flex items-center justify-center h-[380px] bg-red-50 text-red-500 rounded-lg">{error}</div>;
  if (banners.length === 0) return <div className="flex items-center justify-center h-[380px] bg-gray-100 rounded-lg">No banners available.</div>;

  return (
    <div className="relative h-[40vh] md:h-[380px] text-white overflow-hidden rounded-lg">
      {banners.map((banner, index) => {
        const imageUrl = getImageUrl(banner.image);
        return (
          <div
            key={banner.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
              index === currentBannerIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{ 
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {index === currentBannerIndex && (
              <div className="container mx-auto px-8 md:px-12 h-full flex flex-col justify-center items-start text-left">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-3 animate-fade-in-down">
                  {banner.title}
                </h1>
                <p className="text-base md:text-lg text-gray-200 mb-6 max-w-lg animate-fade-in-up">
                  {banner.description}
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={handlePrimaryAction}
                    className="bg-blue-600 text-white font-bold px-6 py-3 rounded-md hover:bg-blue-700 transition-transform transform hover:scale-105 duration-300 animate-fade-in-up"
                  >
                    {banner.button_text || 'Shop Now'}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {banners.length > 1 && (
        <>
          <button onClick={handlePrev} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-40 hover:bg-opacity-60 transition-colors z-20">
            <ChevronLeft size={24} />
          </button>
          <button onClick={handleNext} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-40 hover:bg-opacity-60 transition-colors z-20">
            <ChevronRight size={24} />
          </button>
        </>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBannerIndex(index)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === currentBannerIndex ? 'bg-white scale-125 w-4' : 'bg-white bg-opacity-50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;


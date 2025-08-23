import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroBanner = () => {
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch('https://linkiin.in/api/banners');
        if (!res.ok) {
          throw new Error(`Failed to fetch banners: ${res.statusText}`);
        }
        const data = await res.json();
        
        // Correctly parse the API response structure {data: {banners: [...]}}
        if (data && data.data && Array.isArray(data.data.banners)) {
          setBanners(data.data.banners);
        } else {
          throw new Error('API response is not in the expected format.');
        }

      } catch (err) {
        setError(`Failed to load banners: ${err.message}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // Automatic slider functionality
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        handleNext();
      }, 5000); // Change slide every 5 seconds
      return () => clearInterval(interval);
    }
  }, [banners]);

  const currentBanner = banners[currentBannerIndex];

  // Use the button_url from the API for the primary action
  const handlePrimaryAction = () => {
    if (currentBanner?.button_url) {
      navigate(currentBanner.button_url);
    }
  };
  
  // Navigate to the product details page using the banner's ID
  const handleLearnMore = () => {
    if (currentBanner?.id) {
      navigate(`/product/${currentBanner.id}`);
    }
  };
  
  // Manual navigation handlers
  const handlePrev = () => {
    setCurrentBannerIndex(prevIndex => (prevIndex - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentBannerIndex(prevIndex => (prevIndex + 1) % banners.length);
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading banner...</div>;
  if (error) return <div className="text-center py-20 text-red-500 font-semibold">{error}</div>;
  if (banners.length === 0) return <div className="text-center py-20 text-gray-500">No banners available.</div>;

  return (
    <div className="relative bg-gray-900 h-[60vh] md:h-[70vh] flex items-center text-white overflow-hidden">
      {/* Banners */}
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
            index === currentBannerIndex ? 'opacity-100 z-10' : 'opacity-0'
          }`}
          style={{ 
              backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${banner.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
          }}
        >
          <div className="container mx-auto px-6 h-full flex flex-col justify-center items-center text-center md:items-start md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">{banner.title}</h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">{banner.description}</p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handlePrimaryAction}
                className="bg-teal-500 text-white font-bold px-8 py-3 rounded-full hover:bg-teal-600 transition-transform transform hover:scale-105 duration-300"
              >
                {banner.button_text || 'Shop Now'}
              </button>
              <button
                onClick={handleLearnMore}
                className="bg-transparent border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white hover:text-gray-900 transition duration-300"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-40 hover:bg-opacity-60 transition-colors z-20"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-40 hover:bg-opacity-60 transition-colors z-20"
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBannerIndex(index)}
            className={`h-3 w-3 rounded-full transition-all duration-300 ${
              index === currentBannerIndex ? 'bg-white scale-125' : 'bg-white bg-opacity-50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
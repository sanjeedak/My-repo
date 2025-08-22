import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HERO_API = 'https://dummyjson.com/products/1';

/**
 * ProductDetailModal Component
 * A simple modal to display product details when "Learn More" is clicked.
 */
const ProductDetailModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white text-gray-800 p-8 rounded-xl shadow-2xl max-w-lg w-full relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-3xl font-bold mb-4">{product.title}</h2>
        <p className="text-gray-600">{product.description}</p>
      </div>
    </div>
  );
};


const HeroBanner = () => {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slideIn, setSlideIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await fetch(HERO_API);
        const data = await res.json();
        setBanner({
          id: data.id,
          title: data.title,
          description: data.description,
          image: data.images[0],
          primaryCTA: 'Buy Now',
          secondaryCTA: 'Learn More'
        });
      } catch (err) {
        setError('Failed to load banner');
        console.error(err);
      } finally {
        setLoading(false);
        setSlideIn(true);
      }
    };
    fetchBanner();
  }, []);

  const handleBuyNow = () => {
    if (banner && banner.id) {
      navigate(`/product/${banner.id}`);
    }
  };

  const handleLearnMore = () => {
    setIsModalOpen(true);
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading banner...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <>
      <div className="bg-gradient-to-r from-slate-800 to-gray-900 text-white overflow-hidden">
        <div className="container mx-auto px-4 py-20 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div
            className={`text-center md:text-left transform transition-all duration-1000 ease-out ${
              slideIn ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
            }`}
          >
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">{banner.title}</h1>
            <p className="text-lg text-slate-300 mb-8">{banner.description}</p>
            <div className="flex justify-center md:justify-start space-x-4">
              <button 
                onClick={handleBuyNow}
                className="bg-teal-500 text-white px-6 py-3 rounded-full hover:bg-teal-600 transition duration-300"
              >
                {banner.primaryCTA} →
              </button>
              <button 
                onClick={handleLearnMore}
                className="bg-transparent border-2 border-teal-500 text-teal-500 px-6 py-3 rounded-full hover:bg-teal-500 hover:text-white transition duration-300"
              >
                {banner.secondaryCTA} →
              </button>
            </div>
          </div>

          {/* Image */}
          <div
            className={`relative hidden md:block transform transition-all duration-1000 ease-out ${
              slideIn ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            } hover:scale-105`}
          >
            <div className="bg-white p-4 rounded-xl shadow-2xl">
              <img
                src={banner.image}
                alt="Banner"
                className="rounded-lg"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400'; }}
              />
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && <ProductDetailModal product={banner} onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default HeroBanner;

// src/pages/OfferPage.jsx
import React, { useEffect, useState } from 'react';
import { apiService } from '../components/layout/apiService';
import { endpoints } from '../api/endpoints'; // Import endpoints

const OfferPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        // UPDATED: Replaced hardcoded string with endpoints object
        const data = await apiService(`${endpoints.products}?on_sale=true&limit=8`); 
        
        // Your existing data transformation logic
        const formatted = data.products.map((item) => ({
          id: item.id,
          title: item.name,
          price: parseFloat(item.selling_price),
          discount: Math.round(((parseFloat(item.mrp) - parseFloat(item.selling_price)) / parseFloat(item.mrp)) * 100),
          rating: Math.round(parseFloat(item.rating)),
          thumbnail: item.image_1,
          description: item.description.slice(0, 60) + '...',
        }));

        setOffers(formatted);
      } catch (err) {
        console.error('Error fetching offers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  // Your original JSX design is fully preserved below
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white ...">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-pink-700 text-center mb-10">Today's Hot Offers</h1>
        {loading ? (
            <div className="text-center text-gray-500 text-lg">Loading offers...</div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {offers.map((product) => (
                    // All your original card styling is preserved
                    <div key={product.id} className="bg-white border ...">
                        {/* ... */}
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default OfferPage;

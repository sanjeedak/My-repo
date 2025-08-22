// src/pages/OfferPage.jsx

import React, { useEffect, useState } from 'react';
import { StarIcon } from '../assets/icons'; // Update this path if icons are elsewhere

const FAKE_OFFER_API = 'https://dummyjson.com/products?limit=8'; // Simulated offers

const OfferPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch(FAKE_OFFER_API);
        const data = await res.json();

        const formatted = data.products.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          discount: item.discountPercentage,
          rating: Math.round(item.rating),
          thumbnail: item.thumbnail,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-pink-700 text-center mb-10">Today's Hot Offers</h1>

        {loading ? (
          <div className="text-center text-gray-500 text-lg">Loading offers...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {offers.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-100 rounded-xl shadow hover:shadow-md transition-shadow duration-300 p-5 flex flex-col"
              >
                <div className="relative">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-40 w-full object-contain rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/300x200?text=Product';
                    }}
                  />
                  <span className="absolute top-2 left-2 bg-pink-600 text-white text-xs px-2 py-1 rounded">
                    -{product.discount}%
                  </span>
                </div>

                <h2 className="text-md font-semibold mt-4 text-gray-800 truncate">{product.title}</h2>
                <p className="text-xs text-gray-500 mt-1">{product.description}</p>

                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} filled={i < product.rating} />
                  ))}
                </div>

                <div className="flex justify-between items-center mt-3">
                  <span className="text-lg font-bold text-pink-700">${product.price}</span>
                  <button className="text-sm bg-pink-600 text-white px-3 py-1 rounded-full hover:bg-pink-700 transition-colors">
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferPage;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../api/apiService';
import { API_BASE_URL } from '../api/config';

// Skeleton component for a better loading experience
const BrandCardSkeleton = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center animate-pulse">
        <div className="h-20 w-20 bg-gray-300 rounded-full mb-4"></div>
        <div className="h-4 w-2/3 bg-gray-300 rounded mb-2"></div>
        <div className="h-3 w-1/2 bg-gray-300 rounded"></div>
    </div>
);

const BrandPage = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await apiService('/api/brands');
        
        if (data.success && Array.isArray(data.data.brands)) {
            setBrands(data.data.brands);
        } else {
            throw new Error('Invalid data format from API');
        }
      } catch (err) {
        console.error('Error fetching brand data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 text-center mb-10">
          All Brands
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <BrandCardSkeleton key={index} />
            ))
          ) : (
            brands.map((brand) => (
              <Link
                to={`/products?brand=${brand.slug}`}
                key={brand.id}
                className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-rose-500 transition-all duration-300"
              >
                <img
                  src={`${API_BASE_URL}/${brand.logo}`}
                  alt={`${brand.name} logo`}
                  className="h-20 w-auto object-contain mb-4"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/80x80?text=Brand';
                  }}
                />
                <h2 className="text-md font-semibold text-gray-800">{brand.name}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {brand.total_products} Products
                </p>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandPage;
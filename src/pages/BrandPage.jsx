import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../components/layout/apiService';
import { API_BASE_URL } from '../api/config';

// A function to construct the correct image URL
const getImageUrl = (url) => {
  if (!url) {
    return 'https://placehold.co/80x80?text=Brand';
  }
  // If the URL is already absolute, use it directly. Otherwise, prepend the base URL.
  if (url.startsWith('http')) {
    return url;
  }
  return `${API_BASE_URL}/${url}`;
};

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
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');

  const fetchBrands = async (pageNum) => {
    setLoading(true);
    try {
      const data = await apiService(`/brands?page=${pageNum}`);
      
      if (data.success && Array.isArray(data.data.brands)) {
          setBrands(prevBrands => pageNum === 1 ? data.data.brands : [...prevBrands, ...data.data.brands]);
          setPagination(data.data.pagination);
      } else {
          throw new Error('Invalid data format from API');
      }
    } catch (err) {
      console.error('Error fetching brand data:', err);
      setError('Could not fetch brands. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands(page);
  }, [page]);

  const handleLoadMore = () => {
    if (pagination && page < pagination.totalPages) {
        setPage(prevPage => prevPage + 1);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 text-center mb-10">
          All Brands
        </h1>

        {error && <p className="text-center text-red-500 bg-red-100 p-3 rounded-md mb-6">{error}</p>}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {page === 1 && loading ? (
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
                  src={getImageUrl(brand.logo)}
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

        {pagination && page < pagination.totalPages && (
            <div className="text-center mt-10">
                <button 
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                >
                    {loading ? 'Loading...' : 'Load More'}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default BrandPage;
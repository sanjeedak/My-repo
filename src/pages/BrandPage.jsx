import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../components/layout/apiService';
import { API_BASE_URL } from '../api/config';
import { endpoints } from '../api/endpoints';
import { Building2 } from 'lucide-react'; // Using an icon for visual appeal

// Helper function to get the correct image URL
const getImageUrl = (url) => {
  if (!url) {
    return 'https://placehold.co/80x80/EBF4FF/7F9CF5?text=Brand';
  }
  if (url.startsWith('http')) {
    return url;
  }
  return `${API_BASE_URL}/${url}`;
};

// Skeleton component for a better loading experience
const BrandCardSkeleton = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center animate-pulse">
        <div className="w-full h-20 bg-gray-200 rounded-md mb-[-32px] z-0"></div>
        <div className="h-16 w-16 bg-gray-300 rounded-full border-4 border-white z-10"></div>
        <div className="h-4 w-2/3 bg-gray-200 rounded mt-3 mb-2"></div>
        <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
    </div>
);

const BrandPage = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');

  const fetchBrands = async (pageNum) => {
    // Set loading to true only for the initial fetch
    if (pageNum === 1) setLoading(true);
    
    try {
      const data = await apiService(`${endpoints.brands}?page=${pageNum}`);
      
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
        <div className="text-center mb-10">
            <Building2 className="mx-auto h-12 w-12 text-blue-500" />
            <h1 className="text-4xl font-extrabold text-slate-800 mt-4">
              All Brands
            </h1>
            <p className="mt-2 text-gray-500">
                Explore products from our curated list of top-rated brands.
            </p>
        </div>

        {error && <p className="text-center text-red-500 bg-red-100 p-3 rounded-md mb-6">{error}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {page === 1 && loading ? (
            Array.from({ length: 12 }).map((_, index) => (
              <BrandCardSkeleton key={index} />
            ))
          ) : (
            brands.map((brand) => (
              <Link
                to={`/products?brand=${brand.slug}`}
                key={brand.id}
                className="group bg-white border border-gray-200 rounded-lg flex flex-col items-center text-center shadow-sm hover:shadow-lg hover:-translate-y-1 active:scale-95 active:shadow-inner transition-all duration-300"
              >
                <div className="w-full h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-t-lg"></div>
                <img
                  src={getImageUrl(brand.logo)}
                  alt={`${brand.name} logo`}
                  className="h-16 w-16 -mt-8 rounded-full object-contain border-4 border-white bg-white transition-transform group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/80x80?text=Brand';
                  }}
                />
                <div className="p-4 pt-2 w-full">
                    <h2 className="text-md font-semibold text-gray-800 group-hover:text-blue-600 truncate">{brand.name}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {brand.total_products} Products
                    </p>
                </div>
              </Link>
            ))
          )}
        </div>
        
         {brands.length === 0 && !loading && !error && (
            <div className="text-center py-16 col-span-full">
                <h2 className="text-xl font-semibold text-gray-700">No Brands Found</h2>
                <p className="text-gray-500 mt-2">We couldn't find any brands at the moment. Please check back later.</p>
            </div>
        )}

        {pagination && page < pagination.totalPages && (
            <div className="text-center mt-10">
                <button 
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                >
                    {loading && page > 1 ? 'Loading...' : 'Load More'}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default BrandPage;


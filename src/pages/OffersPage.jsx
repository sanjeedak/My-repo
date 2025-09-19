import React, { useEffect, useState } from 'react';
import { apiService } from '../components/layout/apiService';
import { endpoints } from '../api/endpoints';
import ProductCard from '../components/products/ProductCard';
import Pagination from '../components/Pagination';

const OfferPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  useEffect(() => {
    const fetchOffers = async (page) => {
      setLoading(true);
      try {
        const data = await apiService(`${endpoints.products}?on_sale=true&page=${page}&limit=10`); 
        
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
        if (data.data && data.data.pagination) {
          setPagination(data.data.pagination);
        }
      } catch (err) {
        console.error('Error fetching offers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers(pagination.currentPage);
  }, [pagination.currentPage]);

  const handlePageChange = (page) => {
    setPagination(prev => ({...prev, currentPage: page}));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
      <div className="max-w-7xl mx-auto py-10 px-4">
        <h1 className="text-4xl font-extrabold text-pink-700 text-center mb-10">Today's Hot Offers</h1>
        {loading ? (
            <div className="text-center text-gray-500 text-lg">Loading offers...</div>
        ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {offers.map((product) => (
                      <ProductCard key={product.id} product={product} />
                  ))}
              </div>
              <Pagination pagination={pagination} handlePageChange={handlePageChange} />
            </>
        )}
      </div>
    </div>
  );
};

export default OfferPage;
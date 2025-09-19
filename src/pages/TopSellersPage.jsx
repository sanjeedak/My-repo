import React, { useEffect, useState } from 'react';
import ProductCard from '../components/products/ProductCard';
import { apiService } from '../components/layout/apiService';
import { endpoints } from '../api/endpoints';
import Pagination from '../components/Pagination';

const TopSellersPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  useEffect(() => {
    const fetchTopSellers = async () => {
      setLoading(true);
      try {
        const data = await apiService(`${endpoints.topSellers}?page=${pagination.currentPage}&limit=10`);
        setProducts(data.products);
        if (data.data && data.data.pagination) {
          setPagination(data.data.pagination);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSellers();
  }, [pagination.currentPage]);

  const handlePageChange = (page) => {
    setPagination(prev => ({...prev, currentPage: page}));
  };

  if (loading && pagination.currentPage === 1) return <p>Loading top sellers...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Top Selling Products</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(product => (
            <ProductCard key={product.id} product={product} />
        ))}
        </div>
        <Pagination pagination={pagination} handlePageChange={handlePageChange} />
    </div>
  );
};

export default TopSellersPage;
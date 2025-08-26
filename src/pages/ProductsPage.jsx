import React, { useState, useEffect } from 'react';
import { apiService } from '../components/layout/apiService';
import ProductFilters from '../components/ProductFilters';
import ProductGrid from '../components/ProductGrid';
import Pagination from '../components/Pagination';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  
  const [queryParams, setQueryParams] = useState({
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    order: 'desc',
    page: 1,
    limit: 12
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, value]) => {
          if (value) {
            params.append(key, value);
          }
        });

        const response = await apiService(`/api/products?${params.toString()}`);
        setProducts(response.data);
        setPagination(response.pagination);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [queryParams]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setQueryParams(prev => ({
      ...prev,
      [name]: value,
      page: 1
    }));
  };

  const handlePageChange = (newPage) => {
    setQueryParams(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="container">
      <h1>Our Products</h1>
      <ProductFilters queryParams={queryParams} handleFilterChange={handleFilterChange} />
      <ProductGrid products={products} loading={loading} />
      <Pagination pagination={pagination} queryParams={queryParams} handlePageChange={handlePageChange} />
    </div>
  );
};

export default ProductsPage;
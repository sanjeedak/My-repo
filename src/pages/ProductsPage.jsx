import React, { useEffect, useState } from 'react';
import ProductFilters from './ProductFilters';
import ProductGrid from './ProductGrid';
import { apiService } from '../components/layout/apiService';

const ProductsPage = () => {
  const [queryParams, setQueryParams] = useState({
    category: '',
    subcategory: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    order: 'asc',
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setQueryParams((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch products whenever filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Build query string
        const qs = new URLSearchParams();
        if (queryParams.category) qs.append('category_id', queryParams.category);
        if (queryParams.subcategory) qs.append('subcategory_id', queryParams.subcategory);
        if (queryParams.minPrice) qs.append('minPrice', queryParams.minPrice);
        if (queryParams.maxPrice) qs.append('maxPrice', queryParams.maxPrice);
        if (queryParams.sortBy) qs.append('sortBy', queryParams.sortBy);
        if (queryParams.order) qs.append('order', queryParams.order);

        const data = await apiService(`/products?${qs.toString()}`);
        setProducts(data.products || []);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [queryParams]);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Filters */}
      <ProductFilters queryParams={queryParams} handleFilterChange={handleFilterChange} />

      {/* Products */}
      <ProductGrid products={products} loading={loading} />
    </div>
  );
};

export default ProductsPage;

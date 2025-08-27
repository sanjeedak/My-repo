import React, { useEffect, useState } from 'react';
import { apiService } from '../components/layout/apiService';

const ProductFilters = ({ queryParams, handleFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  // Load categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiService('/categories');
        setCategories(data.categories || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Load subcategories when category changes
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!queryParams.category) return;
      try {
        const data = await apiService(`/subcategories?category_id=${queryParams.category}`);
        setSubcategories(data.subcategories || []);
      } catch (err) {
        console.error('Failed to fetch subcategories:', err);
      }
    };
    fetchSubcategories();
  }, [queryParams.category]);

  return (
    <div className="p-4 bg-white rounded shadow mb-6">
      {/* Category Filter */}
      <select
        name="category"
        value={queryParams.category || ''}
        onChange={handleFilterChange}
        className="border rounded px-3 py-2 mr-2"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Subcategory Filter */}
      {subcategories.length > 0 && (
        <select
          name="subcategory"
          value={queryParams.subcategory || ''}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2 mr-2"
        >
          <option value="">All Subcategories</option>
          {subcategories.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>
      )}

      {/* Price filters */}
      <input
        type="number"
        name="minPrice"
        placeholder="Min Price"
        value={queryParams.minPrice || ''}
        onChange={handleFilterChange}
        className="border rounded px-3 py-2 mr-2 w-28"
      />
      <input
        type="number"
        name="maxPrice"
        placeholder="Max Price"
        value={queryParams.maxPrice || ''}
        onChange={handleFilterChange}
        className="border rounded px-3 py-2 mr-2 w-28"
      />

      {/* Sort */}
      <select
        name="sortBy"
        value={queryParams.sortBy || 'createdAt'}
        onChange={handleFilterChange}
        className="border rounded px-3 py-2 mr-2"
      >
        <option value="createdAt">Newest</option>
        <option value="price">Price</option>
        <option value="name">Name</option>
      </select>

      <select
        name="order"
        value={queryParams.order || 'asc'}
        onChange={handleFilterChange}
        className="border rounded px-3 py-2"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
};

export default ProductFilters;

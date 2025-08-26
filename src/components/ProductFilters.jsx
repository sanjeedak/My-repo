import React from 'react';

const ProductFilters = ({ queryParams, handleFilterChange }) => {
  return (
    <div className="filters">
      <select name="category" value={queryParams.category} onChange={handleFilterChange}>
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="books">Books</option>
      </select>
      
      <input
        type="number"
        name="minPrice"
        placeholder="Min Price"
        value={queryParams.minPrice}
        onChange={handleFilterChange}
      />
      <input
        type="number"
        name="maxPrice"
        placeholder="Max Price"
        value={queryParams.maxPrice}
        onChange={handleFilterChange}
      />

      <select name="sortBy" value={queryParams.sortBy} onChange={handleFilterChange}>
        <option value="createdAt">Newest</option>
        <option value="price">Price</option>
        <option value="name">Name</option>
      </select>

      <select name="order" value={queryParams.order} onChange={handleFilterChange}>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
};

export default ProductFilters;
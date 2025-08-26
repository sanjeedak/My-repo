import React from 'react';

const ProductGrid = ({ products, loading }) => {
  if (loading) {
    return <p className="loading-text">Loading products...</p>;
  }

  if (products.length === 0) {
    return <p className="loading-text">No products found.</p>;
  }
  
  return (
    <div className="product-grid">
      {products.map(product => (
        <div key={product._id} className="product-card">
          <h3>{product.name}</h3>
          <p>Category: {product.category}</p>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
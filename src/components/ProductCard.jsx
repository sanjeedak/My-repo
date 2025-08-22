import React from 'react';
import { useCart } from '../context/CartContext'; 

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    alert(`Added ${product.title} to cart!`); 
  };

  const StarIcon = ({ filled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
      <img src={product.image} alt={product.title} className="w-full h-48 object-cover rounded-md" />
      <h3 className="text-lg font-semibold mt-2">{product.title}</h3>
      <div className="flex items-center mt-1">
        {[...Array(5)].map((_, i) => (
          <StarIcon key={i} filled={i < Math.floor(product.rating?.rate || 0)} />
        ))}
        <span className="text-xs text-gray-500 ml-1">({product.rating?.count || 0})</span>
      </div>
      <p className="text-gray-600 mt-1">
        {product.originalPrice && <span className="line-through mr-2">${product.originalPrice.toFixed(2)}</span>}
        ${product.price.toFixed(2)}
      </p>
      {product.discount && <p className="text-red-500 text-sm">-{product.discount}%</p>}
      <button
        onClick={handleAddToCart}
        className="mt-2 bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-teal-600 transition duration-300"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
import React from 'react';
import { useCart } from '../context/CartContext'; 

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  // --- Helper to normalize product data for the cart context ---
  const handleAddToCart = () => {
    // Pass a clean, consistent object to the cart
    const itemToAdd = {
      id: product.id,
      name: product.name, // Use name instead of title
      price: parseFloat(product.selling_price), // Use selling_price
      image: product.image_1, // Use image_1
    };
    addToCart(itemToAdd);
    alert(`Added ${itemToAdd.name} to cart!`); 
  };
  
  // --- Calculate discount from MRP and Selling Price ---
  const mrp = parseFloat(product.mrp);
  const sellingPrice = parseFloat(product.selling_price);
  let discountPercent = 0;
  if (mrp > sellingPrice) {
    discountPercent = Math.round(((mrp - sellingPrice) / mrp) * 100);
  }

  const rating = parseFloat(product.rating);
  const totalReviews = product.total_reviews || 0;

  const StarIcon = ({ filled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <img src={product.image_1} alt={product.name} className="w-full h-48 object-contain rounded-md" />
      <div className="mt-2 flex-grow">
        <h3 className="text-md font-semibold text-gray-800">{product.name}</h3>
        <div className="flex items-center mt-1">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} filled={i < rating} />
          ))}
          <span className="text-xs text-gray-500 ml-1">({totalReviews})</span>
        </div>
        <div className="mt-2">
          {mrp > sellingPrice && <span className="text-sm text-gray-500 line-through mr-2">${mrp.toFixed(2)}</span>}
          <span className="text-lg font-bold text-gray-900">${sellingPrice.toFixed(2)}</span>
        </div>
        {discountPercent > 0 && <p className="text-green-600 text-sm font-semibold">{discountPercent}% OFF</p>}
      </div>
      <button
        onClick={handleAddToCart}
        className="mt-4 w-full bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-teal-600 transition duration-300"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
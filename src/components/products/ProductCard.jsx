import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext'; 

// --- SVG Icon Components ---
const StarIcon = ({ filled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);
// FIXED: Added the missing PlusIcon definition
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);


const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { 
    id, 
    name, 
    price,
    originalPrice,
    discount,
    image, 
    rating, 
    totalReviews,
    slug 
  } = product;

  const handleAddToCart = (e) => {
    e.preventDefault();
    const itemToAdd = { id, name, price, image };
    addToCart(itemToAdd);
  };
  
  const numericRating = parseFloat(rating);

  return (
    <div className="group bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col relative overflow-hidden">
      
      {discount > 0 && (
        <div className="absolute top-2 right-2 bg-rose-500 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
          -{discount}%
        </div>
      )}

      <Link to={`/product/${slug}`} className="flex flex-col h-full">
        <div className="relative pt-[100%]">
          <img 
            src={image} 
            alt={name} 
            className="absolute top-0 left-0 w-full h-full object-contain p-4" 
          />
           <button
            onClick={handleAddToCart}
            className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-blue-700 z-10"
            aria-label={`Add ${name} to cart`}
          >
            <PlusIcon />
          </button>
        </div>

        <div className="p-4 flex-grow flex flex-col">
          <div className="flex items-center text-xs text-gray-500">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} filled={i < numericRating} />
            ))}
            <span className="ml-1">({totalReviews || 0})</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-800 mt-1 truncate" title={name}>
            {name}
          </h3>
          <div className="mt-2 flex-grow"></div>
          <div className="flex items-baseline space-x-2">
            <span className="text-lg font-bold text-blue-600">₹{price.toFixed(2)}</span>
            {originalPrice > price && (
              <span className="text-sm text-gray-500 line-through">₹{originalPrice.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;

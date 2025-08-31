import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api/config";
import { Eye as EyeIcon, Heart, Star } from "lucide-react"; // Renamed for clarity
import { useWishlist } from "../../context/WishlistContext";

const ProductCard = ({ product, onQuickView }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const { addToWishlist, isInWishlist } = useWishlist();

  const handleNavigateDetails = () => {
    if (product?.slug) {
      navigate(`/product/${product.slug}`);
    } else if (product?.id) {
      navigate(`/product/${product.id}`);
    }
  };

  const handleQuickView = (e) => {
    e.stopPropagation(); // Prevent navigating to the details page
    if (onQuickView) {
      onQuickView(product);
    }
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    if (!isInWishlist(product.id)) {
      addToWishlist(product);
    }
  };

  const getImageUrl = (img) => {
    if (!img) return "https://placehold.co/300x300?text=No+Image";
    return img.startsWith("http") ? img : `${API_BASE_URL}/${img}`;
  };

  return (
    <div
      onClick={handleNavigateDetails}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer text-left relative overflow-hidden group"
    >
      <div className="p-4 relative">
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
            {product.discount}% OFF
          </div>
        )}
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className="h-40 w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <button
            onClick={handleQuickView}
            className="p-3 rounded-full bg-white text-gray-800 hover:bg-gray-200 transform scale-0 group-hover:scale-100 transition-transform duration-200"
            aria-label="Quick view"
          >
            <EyeIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="p-4 border-t flex flex-col flex-grow">
        <h3
          className="font-semibold text-gray-800 text-sm mb-2 truncate"
          title={product.name}
        >
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
            <span className="text-xs text-gray-500">({product.totalReviews})</span>
        </div>
        <div className="flex items-baseline gap-2 mt-auto">
          <p className="text-blue-600 font-bold text-lg">₹{product.price}</p>
          {product.discount > 0 && (
            <p className="text-gray-500 line-through text-sm">₹{product.originalPrice}</p>
          )}
        </div>
      </div>
       <div className="absolute bottom-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button onClick={handleAddToWishlist} className="p-2 rounded-full bg-white shadow-md hover:bg-red-100">
                <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-gray-500'}`} />
            </button>
        </div>
    </div>
  );
};

export default ProductCard;
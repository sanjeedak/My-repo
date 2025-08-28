import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api/config";
import { Eye as EyeIcon } from "lucide-react"; // Renamed for clarity

const ProductCard = ({ product, onQuickView }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

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

  const getImageUrl = (img) => {
    if (!img) return "https://placehold.co/300x300?text=No+Image";
    return img.startsWith("http") ? img : `${API_BASE_URL}/${img}`;
  };

  return (
    <div
      onClick={handleNavigateDetails}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col cursor-pointer text-center relative overflow-hidden"
    >
      <div className="p-4 relative">
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className="h-40 w-full object-contain"
        />
        {/* Eye effect overlay - RESTORED */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <button 
            onClick={handleQuickView} 
            className="p-2 rounded-full bg-white text-gray-800 hover:bg-gray-200"
            aria-label="Quick view"
          >
            <EyeIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="p-4 border-t flex flex-col flex-grow justify-between">
        <h3
          className="font-medium text-gray-700 text-sm mb-2 truncate"
          title={product.name}
        >
          {product.name}
        </h3>
        <p className="text-brand-blue font-bold">₹{product.price}</p>
      </div>
    </div>
  );
};

export default ProductCard;

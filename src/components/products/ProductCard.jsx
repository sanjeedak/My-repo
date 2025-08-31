import React from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api/config";
import { Eye as EyeIcon, Heart, Star, ShoppingCart } from "lucide-react"; 
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

const ProductCard = ({ product, onQuickView }) => {
  const navigate = useNavigate();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleNavigateDetails = () => {
    if (product?.slug) {
      navigate(`/product/${product.slug}`);
    } else if (product?.id) {
      navigate(`/product/${product.id}`);
    }
  };

  const handleQuickView = (e) => {
    e.stopPropagation(); 
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
  
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const getImageUrl = (img) => {
    if (!img) return "https://placehold.co/300x300?text=No+Image";
    return img.startsWith("http") ? img : `${API_BASE_URL}/${img}`;
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer text-left relative overflow-hidden group h-full"
    >
      {/* Image Container */}
      <div className="p-3 relative aspect-square" onClick={handleNavigateDetails}>
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10">
            {product.discount}% OFF
          </div>
        )}
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
        <div
          className="absolute top-2 right-2 flex flex-col gap-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        >
          <button
            onClick={handleQuickView}
            className="p-1.5 rounded-full bg-white text-gray-800 hover:bg-gray-200 shadow-md"
            aria-label="Quick view"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
           <button onClick={handleAddToWishlist} className="p-1.5 rounded-full bg-white shadow-md hover:bg-red-100">
                <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-gray-500'}`} />
            </button>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex items-center gap-1 mb-1">
            {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
            <span className="text-xs text-gray-500">({product.totalReviews})</span>
        </div>

        <h3
          className="font-semibold text-gray-700 text-sm mb-2 h-10 overflow-hidden"
          title={product.name}
        >
          {product.name}
        </h3>
        
        <div className="flex items-baseline gap-2 mt-auto">
          <p className="text-blue-600 font-bold text-base">₹{product.price}</p>
          {product.discount > 0 && (
            <p className="text-gray-500 line-through text-xs">₹{product.originalPrice}</p>
          )}
        </div>
      </div>
      
        {/* Add to Cart Button - Appears on Hover */}
       <div 
         onClick={handleAddToCart}
         className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white py-1.5 text-center font-semibold text-xs transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-1.5"
       >
         <ShoppingCart className="w-3.5 h-3.5" />
         <span>Add to Cart</span>
       </div>
    </div>
  );
};

export default ProductCard;


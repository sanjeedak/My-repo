import React from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api/config";
import { Eye as EyeIcon, Heart, Star, ShoppingCart } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { toast } from 'react-hot-toast';

const ProductCard = ({ product, onQuickView }) => {
  const navigate = useNavigate();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleNavigateDetails = () => {
    if (product?.id) {
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
    if (product && product.id) {
        addToWishlist(product);
    } else {
        toast.error("Could not add to wishlist, invalid product data.");
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (product && product.id && product.name) {
     const productWithStoreId = {
      ...product,
      store_id: product.store?.id 
    };
    // **FIX:** Yahan 'productWithStoreId' ko pass karein
    addToCart(productWithStoreId); 
      toast.success(`${product.name} added to cart!`);
    } else {
      console.error("Invalid product data:", product);
      toast.error("Sorry, this item cannot be added to the cart right now.");
    }
  };

  const getImageUrl = (img) => {
    if (!img) return "https://placehold.co/300x300?text=No+Image";
    return img.startsWith("http") ? img : `${API_BASE_URL}/${img}`;
  };

  if (!product) {
    return null;
  }

  return (
    <div
      className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white text-left shadow-sm transition-all duration-300 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden border-b border-gray-200" onClick={handleNavigateDetails}>
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 z-10 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
            {product.discount}% OFF
          </div>
        )}
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-0 right-0 m-2 flex flex-col gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <button
              onClick={handleQuickView}
              className="rounded-full bg-white p-1.5 text-gray-800 shadow-md hover:bg-gray-200"
              aria-label="Quick view"
            >
              <EyeIcon className="h-4 w-4" />
            </button>
            <button onClick={handleAddToWishlist} className="rounded-full bg-white p-1.5 shadow-md hover:bg-red-100">
              <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current text-red-500' : 'text-gray-500'}`} />
            </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-2">
        <div className="mb-1 flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(product.rating || 0) ? 'fill-current text-yellow-400' : 'text-gray-300'}`} />
            ))}
            <span className="text-xs text-gray-500">({product.totalReviews || 0})</span>
        </div>

        <h3
          className="mb-2 h-10 overflow-hidden text-sm font-semibold text-gray-700"
          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
          title={product.name}
        >
          {product.name}
        </h3>

        <div className="mt-auto flex items-baseline gap-2">
          <p className="text-base font-bold text-blue-600">₹{product.price}</p>
          {product.discount > 0 && (
            <p className="text-xs text-gray-500 line-through">₹{product.originalPrice}</p>
          )}
        </div>
      </div>
      
      <div
        onClick={handleAddToCart}
        className="absolute bottom-0 left-0 right-0 flex translate-y-full cursor-pointer items-center justify-center gap-1.5 bg-blue-600 py-2 text-center text-sm font-semibold text-white transition-transform duration-300 group-hover:translate-y-0"
      >
        <ShoppingCart className="h-4 w-4" />
        <span>Add to Cart</span>
      </div>
    </div>
  );
};

export default ProductCard;
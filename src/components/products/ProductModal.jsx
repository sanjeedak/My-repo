import React from "react";
import { X, ShoppingCart, Zap } from "lucide-react";
import { API_BASE_URL } from "../../api/config";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from 'react-hot-toast';

const ProductModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (!product) return null;

  const getImageUrl = (img) => {
    if (!img) return "https://placehold.co/400x400?text=No+Image";
    return img.startsWith("http") ? img : `${API_BASE_URL}/${img}`;
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please log in to continue.");
      navigate('/signin');
      return;
    }

    const storeId = product?.store?.id || product?.store_id;

    if (!product || !product.id || !product.name || !storeId) {
        console.error("Invalid product data (missing store_id):", product);
        toast.error("Cannot buy this item: missing store information.");
        return;
    }
    
    const promise = addToCart({ ...product, store_id: storeId });

    toast.promise(promise, {
        loading: 'Preparing for checkout...',
        success: () => {
            onClose();
            navigate("/checkout");
            return 'Redirecting to checkout...';
        },
        error: (err) => `Error: ${err.message || 'Could not prepare for checkout.'}`
    });
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please log in to add items to your cart.");
      navigate('/signin');
      return;
    }
    
    const storeId = product?.store?.id || product?.store_id;

    if (!product || !product.id || !product.name || !storeId) {
        console.error("Invalid product data (missing store_id):", product);
        toast.error("Cannot add this item: missing store information.");
        return;
    }
    
    const promise = addToCart({ ...product, store_id: storeId });

    toast.promise(promise, {
        loading: 'Adding to cart...',
        success: (result) => {
            if(result.success) onClose();
            return `${product.name} added to cart!`;
        },
        error: (err) => `Error: ${err.message || 'Could not add to cart.'}`
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* IMAGE SECTION */}
        <div className="w-full md:w-1/2 p-4 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="max-w-full max-h-80 object-contain rounded-md shadow-sm"
          />
        </div>

        {/* INFO SECTION */}
        <div className="w-full md:w-1/2 p-6 flex flex-col">
          {/* HEADER */}
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-xl font-bold text-gray-800 leading-tight">
              {product.name}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-1.5 rounded-full text-gray-500 hover:bg-gray-200 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* PRICE & META */}
          <div className="mb-4">
            <p className="text-2xl font-extrabold text-blue-600">
              ₹{product.price}
            </p>
            {product.originalPrice && (
              <p className="text-sm text-gray-500 line-through">
                ₹{product.originalPrice}
              </p>
            )}
            {product.quantity && (
              <p className="text-xs mt-1 text-green-600">
                {product.quantity} items in stock
              </p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="text-sm text-gray-600 mb-6 overflow-y-auto pr-1 custom-scroll flex-grow">
            <p>{product.description || "No description available."}</p>
          </div>

          {/* ACTIONS */}
          <div className="pt-4 border-t mt-auto">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold shadow-md"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold shadow-md"
              >
                <Zap className="w-5 h-5" />
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Simple fade-in animation */}
      <style>
        {`
          .animate-fadeIn {
            animation: fadeIn 0.25s ease-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .custom-scroll::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scroll::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
          }
        `}
      </style>
    </div>
  );
};

export default ProductModal;

import React from 'react';
import { X } from 'lucide-react';
import { API_BASE_URL } from '../../api/config';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const ProductModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (!product) return null;

  const getImageUrl = (img) => {
    if (!img) return "https://placehold.co/400x400?text=No+Image";
    return img.startsWith("http") ? img : `${API_BASE_URL}/${img}`;
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    addToCart(product);
    onClose();
    navigate("/checkout");
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="w-full md:w-1/2 p-4 flex items-center justify-center bg-gray-50">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="max-w-full max-h-96 object-contain"
          />
        </div>
        <div className="w-full md:w-1/2 p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
            <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-200">
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-2xl font-bold text-blue-600 mb-4">₹{product.price}</p>
          <div className="text-sm text-gray-600 space-y-2 mb-6 overflow-y-auto">
            <p>{product.description || "No description available."}</p>
          </div>
          <div className="mt-auto pt-4 border-t">
             <div className="flex gap-3">
               <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  Buy Now
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
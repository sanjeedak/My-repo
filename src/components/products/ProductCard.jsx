import React from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api/config";
import { EyeIcon } from "lucide-react";
import { useCart } from "../../context/CartContext";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Navigate to ProductDetailsPage with slug
  const handleNavigateDetails = () => {
    if (product.slug) {
      navigate(`/product/${product.slug}`); // ✅ matches your route
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  // Buy Now → add to cart then go to checkout
  const handleBuyNow = (e) => {
    e.stopPropagation(); // prevent card click
    addToCart(product);
    navigate("/checkout"); // ✅ direct to checkout page
  };

  // Add to Cart → go to Cart page
  const handleAddToCart = (e) => {
    e.stopPropagation(); // prevent card click
    addToCart(product);
    navigate("/cart"); // ✅ redirect to Cart page
  };

  // Image URL builder
  const getImageUrl = (img) => {
    if (!img) return "https://placehold.co/300x300?text=No+Image";
    return img.startsWith("http") ? img : `${API_BASE_URL}/${img}`;
  };

  return (
    <div
      onClick={handleNavigateDetails}
      className="relative group bg-white border rounded-lg shadow hover:shadow-lg transition flex flex-col cursor-pointer"
    >
      {/* Image */}
      <div className="relative">
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className="h-48 w-full object-contain p-4"
        />
        {/* Eye Icon (center overlay) */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
          <EyeIcon className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <h3
          className="font-semibold text-gray-800 mb-2 truncate"
          title={product.name}
        >
          {product.name}
        </h3>
        <p className="text-blue-600 font-bold mb-4">₹{product.price}</p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

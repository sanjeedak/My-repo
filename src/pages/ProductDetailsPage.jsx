import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiService } from "../components/layout/apiService";
import { API_BASE_URL } from "../api/config";
import { useCart } from "../context/CartContext";

const ProductDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        // ✅ fetch by slug
        const data = await apiService(`/products/slug/${slug}`);
        if (data?.product) {
          setProduct(data.product);
        } else {
          // fallback if slug route fails → try /products/:id
          const alt = await apiService(`/products/${slug}`);
          setProduct(alt.product || null);
        }
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProductDetails();
    }
  }, [slug]);

  // ✅ Image handler
  const getImageUrl = (img) => {
    if (!img) return "https://placehold.co/400x400?text=No+Image";
    return img.startsWith("http") ? img : `${API_BASE_URL}/${img}`;
  };

  const handleAddToCart = () => {
    addToCart(product);
    alert("Product added to cart!");
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate("/checkout");
  };

  if (loading) {
    return <div className="text-center py-10">Loading product details...</div>;
  }

  if (!product) {
    return <div className="text-center py-10 text-red-500">Product not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="flex justify-center items-center bg-white border rounded-lg p-6 shadow">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="max-h-96 object-contain"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-blue-600 text-2xl font-semibold mt-3">
            ₹{product.price}
          </p>
          <p className="mt-4 text-gray-600 leading-relaxed">
            {product.description || "No description available for this product."}
          </p>

          {/* Buttons */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleAddToCart}
              className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiService } from "../components/layout/apiService";
import { transformProductData } from "../utils/transformProductData";
import { useCart } from "../context/CartContext";
import { API_BASE_URL } from "../api/config";
import ProductImageGallery from "../components/products/ProductImageGallery";
import SellerInfo from "../components/products/SellerInfo";
import ProductTabs from "../components/products/ProductTab";

const ProductDetailsPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);
            setError('');
            if (!slug) {
                setError('No product specified.');
                setLoading(false);
                return;
            }

            try {
                // Fetch all products and find the one that matches the slug
                const data = await apiService('/products');

                if (data && data.products) {
                    const transformedProducts = (data.products).map(transformProductData);
                    const foundProduct = transformedProducts.find(p => p.slug === slug);

                    if (foundProduct) {
                        setProduct(foundProduct);
                    } else {
                        setError('Product not found.');
                    }
                } else {
                    setError('Product data is missing or in an incorrect format.');
                }
            } catch (err) {
                console.error("Failed to fetch product details:", err);
                setError('Could not fetch product details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [slug]);

    const handleAddToCart = () => {
        if (product) {
            addToCart(product);
            alert("Product added to cart!");
        }
    };

    const handleBuyNow = () => {
        if (product) {
            addToCart(product);
            navigate("/checkout");
        }
    };

    // Fallback for image URLs
    const getImageUrl = (img) => {
        if (!img) return "https://placehold.co/400x400?text=No+Image";
        return img.startsWith("http") ? img : `${API_BASE_URL}/${img}`;
    };

    if (loading) {
        return <div className="text-center py-10">Loading product details...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    if (!product) {
        return <div className="text-center py-10">Product not found.</div>;
    }
    
    const imageUrls = product.images.map(getImageUrl);

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Image Gallery */}
                <ProductImageGallery images={imageUrls} productName={product.name} />

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
                            className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 font-semibold"
                        >
                            Add to Cart
                        </button>
                        <button
                            onClick={handleBuyNow}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold"
                        >
                            Buy Now
                        </button>
                    </div>

                    <SellerInfo seller={product.store} />
                </div>
            </div>
            <div className="mt-10">
                <ProductTabs
                    description={product.description}
                    specifications={product.specifications}
                    reviews={[]} // You can pass reviews here when available from the API
                />
            </div>
        </div>
    );
};

export default ProductDetailsPage;
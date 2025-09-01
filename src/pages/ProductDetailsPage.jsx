import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiService } from "../components/layout/apiService";
import { transformProductData } from "../utils/transformProductData";
import { useCart } from "../context/CartContext";
import { API_BASE_URL } from "../api/config";
import { endpoints } from "../api/endpoints";
import ProductImageGallery from "../components/products/ProductImageGallery";
import SellerInfo from "../components/products/SellerInfo";
import ProductTabs from "../components/products/ProductTab";
import { Plus, Minus, ShoppingCart } from 'lucide-react';

const ProductDetailsPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [addToCartMessage, setAddToCartMessage] = useState('');

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
                // This fetches all products. For a large catalog, a dedicated API endpoint 
                // like /api/products/{slug} would be more efficient.
                const data = await apiService(endpoints.products);

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

    const handleQuantityChange = (amount) => {
        setQuantity(prev => {
            const newQuantity = prev + amount;
            if (newQuantity < 1) return 1;
            // Add a check against product stock if available
            // if (newQuantity > product.stock) return product.stock; 
            return newQuantity;
        });
    };

    const handleAddToCart = () => {
        if (product) {
            addToCart({ ...product, quantity });
            setAddToCartMessage(`${quantity} × "${product.name}" added to cart!`);
            setTimeout(() => setAddToCartMessage(''), 3000); // Hide message after 3 seconds
        }
    };

    const handleBuyNow = () => {
        if (product) {
            addToCart({ ...product, quantity });
            navigate("/checkout");
        }
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
    
    const imageUrls = product.images.map(img => 
        img && img.startsWith("http") ? img : `${API_BASE_URL}/${img}`
    );

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Image Gallery */}
                <ProductImageGallery images={imageUrls} productName={product.name} />

                {/* Product Info */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
                    <div className="flex items-baseline gap-3 mt-3">
                        <p className="text-blue-600 text-3xl font-bold">₹{product.price}</p>
                        {product.discount > 0 && (
                            <p className="text-gray-500 line-through text-lg">₹{product.originalPrice}</p>
                        )}
                    </div>
                    
                    {/* Add to Cart Message */}
                    {addToCartMessage && (
                        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md text-center transition-opacity duration-300">
                            {addToCartMessage}
                        </div>
                    )}

                    <p className="mt-4 text-gray-600 leading-relaxed">
                        {product.description || "No description available for this product."}
                    </p>

                    {/* Quantity Selector */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity:</label>
                        <div className="flex items-center border border-gray-300 rounded-md w-fit">
                            <button onClick={() => handleQuantityChange(-1)} className="p-3 hover:bg-gray-100 rounded-l-md"><Minus size={16}/></button>
                            <span className="px-5 font-semibold">{quantity}</span>
                            <button onClick={() => handleQuantityChange(1)} className="p-3 hover:bg-gray-100 rounded-r-md"><Plus size={16}/></button>
                        </div>
                    </div>


                    {/* Action Buttons */}
                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 font-semibold transition-colors"
                        >
                            <ShoppingCart size={20} /> Add to Cart
                        </button>
                        <button
                            onClick={handleBuyNow}
                            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold transition-colors"
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


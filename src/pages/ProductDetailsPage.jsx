import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { apiService } from '../components/layout/apiService';
import { transformProductData } from '../utils/transformProductData';

// NOTE: Unused imports and variables have been removed.

const ProductDetailsPage = () => {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProductDetails = async () => {
            if (!slug) return;
            setLoading(true);
            try {
                const productData = await apiService(`/api/products/slug/${slug}`);
                const mainProduct = transformProductData(productData.product);
                setProduct(mainProduct);

                // This logic can be re-added when you use the related products data.
                // if (mainProduct.category_id) { ... }

            } catch (err) {
                console.error("Failed to fetch product details:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [slug]);

    const handleAddToCart = () => {
        if (product) {
            addToCart({ ...product, quantity });
            alert(`${quantity} ${product.name}(s) have been added to your cart!`);
        }
    };

    if (loading) return <div className="text-center p-10">Loading product...</div>;
    if (!product) return <div className="text-center p-10">Product not found.</div>;

    return (
        <div className="bg-slate-50 py-8">
            <div className="container mx-auto px-4">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <img src={product.image} alt={product.name} className="w-full h-96 object-contain rounded-lg border p-2" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">{product.name}</h1>
                            <div className="my-4">
                                <span className="text-3xl font-bold text-blue-600">₹{product.price.toFixed(2)}</span>
                                {product.originalPrice > product.price && (
                                    <span className="text-lg text-gray-400 line-through ml-3">₹{product.originalPrice.toFixed(2)}</span>
                                )}
                            </div>
                            <div className={`text-sm font-semibold ${product.quantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                            </div>
                            <div className="mt-6 flex items-center gap-4">
                                <button onClick={handleAddToCart} disabled={product.quantity === 0} className="flex-1 bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
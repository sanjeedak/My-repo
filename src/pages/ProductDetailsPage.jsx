import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { apiService } from "../components/layout/apiService";
import { transformProductData } from "../utils/transformProductData";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { API_BASE_URL } from "../api/config";
import { endpoints } from "../api/endpoints";
import ProductImageGallery from "../components/products/ProductImageGallery";
import SellerInfo from "../components/products/SellerInfo";
import ProductTabs from "../components/products/ProductTab";
import { 
    Plus, Minus, ShoppingCart, ChevronRight, CheckCircle, 
    ShieldCheck, Heart, ListChecks, Truck, RefreshCw, XCircle
} from 'lucide-react';

const ProductDetailsPage = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { addToWishlist } = useWishlist();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [toast, setToast] = useState({ show: false, message: '', success: false });

    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await apiService(endpoints.productDetails(id));
                if (response && response.product) {
                    setProduct(transformProductData(response.product));
                } else {
                    setError('Product not found.');
                }
            } catch (err) {
                console.error("Error fetching product:", err);
                setError('An error occurred. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchProductDetails();
    }, [id]);

    const handleQuantityChange = (amount) => {
        setQuantity(prev => {
            const newQuantity = prev + amount;
            if (newQuantity < 1) return 1;
            if (product && product.quantity && newQuantity > product.quantity) return product.quantity;
            return newQuantity;
        });
    };
    
    const handleAddToCart = () => {
        if (product && product.quantity > 0) {
            const productWithStoreId = {
                ...product,
                quantity,
                store_id: product.store?.id 
            };
            try {
                addToCart(productWithStoreId);
                setToast({ 
                    show: true, 
                    message: t('Added to cart'), 
                    success: true 
                });
            } catch (err) {
                console.error("Error adding to cart:", err);
                setToast({ 
                    show: true, 
                    message: t('Cart add error'), 
                    success: false 
                });
            }
        } else {
            setToast({ 
                show: true, 
                message: t('Out of stock'), 
                success: false 
            });
        }
        setTimeout(() => setToast({ show: false, message: '', success: false }), 3000);
    };
    
    const handleAddToWishlist = () => {
        if (product) {
            addToWishlist(product);
            setToast({ 
                show: true, 
                message: t('Added to wishlist'), 
                success: true 
            });
            setTimeout(() => setToast({ show: false, message: '', success: false }), 3000);
        }
    };

    const handleBuyNow = () => {
        if (product && product.quantity > 0) {
            const productWithStoreId = {
                ...product,
                quantity,
                store_id: product.store?.id 
            };
            addToCart(productWithStoreId);
            navigate("/checkout");
        } else {
            setToast({ 
                show: true, 
                message: t('Out of stock'), 
                success: false 
            });
            setTimeout(() => setToast({ show: false, message: '', success: false }), 3000);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="text-center py-20 px-4 text-red-600 bg-red-50 p-6">{error}</div>;
    if (!product) return <div className="text-center py-20 text-gray-600">Product not found.</div>;
    
    const imageUrls = product.images.map(img => img.startsWith("http") ? img : `${API_BASE_URL}/${img}`);

    return (
        <div className="bg-gray-100">
            <div className="container mx-auto px-4 py-10 max-w-7xl">
                <nav className="flex items-center text-sm text-gray-500 mb-6">
                    <Link to="/" className="hover:text-gray-700">{t('home')}</Link>
                    <ChevronRight size={16} className="mx-2" />
                    <Link to="/products" className="hover:text-gray-700">{t('products')}</Link>
                    <ChevronRight size={16} className="mx-2" />
                    <span className="text-gray-900 font-semibold truncate max-w-xs">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <ProductImageGallery images={imageUrls} productName={product.name} />

                    <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col space-y-4">
                        <div className="flex justify-between items-start">
                            <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
                            <button onClick={handleAddToWishlist} className="p-2 rounded-full text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors">
                                <Heart size={22} />
                            </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-3">
                                <p className="text-3xl font-bold text-blue-600">₹{product.price.toLocaleString('en-IN')}</p>
                                {product.discount > 0 && <p className="text-md text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</p>}
                            </div>
                            {product.quantity > 0 ? (
                                <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">In Stock</span>
                            ) : (
                                <span className="text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">Out of Stock</span>
                            )}
                        </div>

                        <div className="border-t pt-4">
                             <h3 className="flex items-center gap-2 text-md font-semibold text-gray-700 mb-2">
                                <ListChecks size={20}/> Key Features
                             </h3>
                             <ul className="space-y-1.5 text-sm text-gray-600 list-disc list-inside">
                                 <li>High-quality durable material</li>
                                 <li>1 Year Manufacturer Warranty</li>
                             </ul>
                        </div>
                        
                        <div className="border-t pt-4 space-y-4">
                            <div className="flex items-center gap-6">
                                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                                <div className="flex items-center border rounded-md">
                                    <button onClick={() => handleQuantityChange(-1)} className="p-2.5 text-gray-500 hover:bg-gray-50"><Minus size={14}/></button>
                                    <span className="px-5 font-semibold text-gray-800">{quantity}</span>
                                    <button onClick={() => handleQuantityChange(1)} disabled={quantity >= product.quantity} className="p-2.5 text-gray-500 hover:bg-gray-50 disabled:opacity-40"><Plus size={14}/></button>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.quantity === 0}
                                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold transition hover:bg-blue-700 disabled:bg-gray-400"
                                >
                                    <ShoppingCart size={18} /> {t('Add to cart')}
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    disabled={product.quantity === 0}
                                    className="flex-1 bg-green-600 text-white px-5 py-3 rounded-lg font-semibold transition hover:bg-green-700 disabled:bg-gray-400"
                                >
                                    {t('Buy now')}
                                </button>
                            </div>
                        </div>

                        <div className="border-t pt-4 flex items-center justify-around text-xs text-gray-500">
                           <div className="flex items-center gap-2"> <ShieldCheck size={16}/> Secure Payments </div>
                           <div className="flex items-center gap-2"> <Truck size={16}/> Fast Delivery </div>
                           <div className="flex items-center gap-2"> <RefreshCw size={16}/> Easy Returns </div>
                        </div>
                        
                        <SellerInfo seller={product.store} />
                    </div>
                </div>
                
                <div className="mt-12">
                    <ProductTabs description={product.description} specifications={product.specifications} reviews={[]} />
                </div>
            </div>

            {toast.show && (
                <div className={`fixed bottom-5 right-5 text-white py-2 px-5 rounded-lg shadow-lg ${toast.success ? 'bg-green-600' : 'bg-red-600'}`}>
                    {toast.success ? <CheckCircle size={18} /> : <XCircle size={18} />}
                    <p className="text-sm font-medium">{toast.message}</p>
                </div>
            )}
        </div>
    );
};

export default ProductDetailsPage;
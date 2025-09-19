import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { apiService } from "../components/layout/apiService";
import { transformProductData } from "../utils/transformProductData";
import { useCart } from "../context/CartContext";
import { API_BASE_URL } from "../api/config";
import { endpoints } from "../api/endpoints";
import ProductImageGallery from "../components/products/ProductImageGallery";
import SellerInfo from "../components/products/SellerInfo";
import ProductTabs from "../components/products/ProductTab";
import { Plus, Minus, ShoppingCart, ChevronRight } from 'lucide-react';

const ProductDetailsPage = () => {
    const { t } = useTranslation();
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
                setError('कोई प्रोडक्ट निर्दिष्ट नहीं है।');
                setLoading(false);
                return;
            }

            try {
                // पहले slug से प्रोडक्ट लाने की कोशिश करें
                let data = await apiService(endpoints.productDetails(slug));

                // यदि slug से कोई प्रोडक्ट नहीं मिला, तो नाम से खोजने का प्रयास करें
                if (!data || !data.product) {
                    const productName = slug.replace(/-/g, ' ');
                    const searchData = await apiService(`${endpoints.products}?q=${encodeURIComponent(productName)}&limit=1`);

                    if (searchData && searchData.products && searchData.products.length > 0) {
                        data = { product: searchData.products[0] };
                    }
                }

                if (data && data.product) {
                    setProduct(transformProductData(data.product));
                } else {
                    setError('प्रोडक्ट नहीं मिला।');
                    setProduct(null);
                }
            } catch (err) {
                console.error("प्रोडक्ट डिटेल्स लाने में असफल:", err);
                setError('प्रोडक्ट डिटेल्स लाने में कोई त्रुटि हुई। कृपया बाद में पुनः प्रयास करें।');
                setProduct(null);
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
            if (product.stock && newQuantity > product.stock) return product.stock;
            return newQuantity;
        });
    };

    const handleAddToCart = () => {
        if (product) {
            addToCart({ ...product, quantity });
            setAddToCartMessage(`${quantity} × "${product.name}" cart में जोड़ा गया!`);
            setTimeout(() => setAddToCartMessage(''), 3000);
        }
    };

    const handleBuyNow = () => {
        if (product) {
            addToCart({ ...product, quantity });
            navigate("/checkout");
        }
    };

    if (loading) {
        return <div className="text-center py-20">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-20 text-red-500">{error}</div>;
    }

    if (!product) {
        return <div className="text-center py-20">प्रोडक्ट नहीं मिला।</div>;
    }

    const imageUrls = product.images.map(img =>
        img && img.startsWith("http") ? img : `${API_BASE_URL}/${img}`
    );

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* ब्रेडक्रंब्स */}
                <nav className="flex items-center text-sm text-gray-500 mb-4">
                    <Link to="/" className="hover:text-blue-600">होम</Link>
                    <ChevronRight size={16} className="mx-1" />
                    {product.category && (
                        <>
                            <Link to={`/category/${product.category.slug}`} className="hover:text-blue-600">{product.category.name}</Link>
                            <ChevronRight size={16} className="mx-1" />
                        </>
                    )}
                    <span className="font-medium text-gray-700 truncate">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* प्रोडक्ट इमेज गैलरी */}
                    <div>
                        <ProductImageGallery images={imageUrls} productName={product.name} />
                    </div>

                    {/* प्रोडक्ट जानकारी */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
                        <div className="flex items-baseline gap-3 mt-2">
                            <p className="text-blue-600 text-3xl font-bold">₹{product.price}</p>
                            {product.discount > 0 && (
                                <p className="text-gray-500 line-through text-lg">₹{product.originalPrice}</p>
                            )}
                        </div>

                        {addToCartMessage && (
                            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md text-center transition-opacity duration-300">
                                {addToCartMessage}
                            </div>
                        )}

                        <p className="mt-4 text-gray-600 leading-relaxed text-sm">
                            {product.description || "इस प्रोडक्ट के लिए कोई विवरण उपलब्ध नहीं है।"}
                        </p>

                        <div className="mt-6 border-t pt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('quantity')}</label>
                            <div className="flex items-center border border-gray-300 rounded-md w-fit">
                                <button onClick={() => handleQuantityChange(-1)} className="p-3 hover:bg-gray-100 rounded-l-md"><Minus size={16}/></button>
                                <span className="px-6 font-semibold text-md">{quantity}</span>
                                <button onClick={() => handleQuantityChange(1)} className="p-3 hover:bg-gray-100 rounded-r-md"><Plus size={16}/></button>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors shadow-sm"
                            >
                                <ShoppingCart size={20} /> {t('add_to_cart')}
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold transition-colors shadow-sm"
                            >
                                {t('buy_now')}
                            </button>
                        </div>

                        <SellerInfo seller={product.store} />
                    </div>
                </div>
                <div className="mt-12">
                    <ProductTabs
                        description={product.description}
                        specifications={product.specifications}
                        reviews={[]}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;

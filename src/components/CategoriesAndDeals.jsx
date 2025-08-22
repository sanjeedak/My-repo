import React, { useState, useEffect } from 'react';
import { StarIcon } from '../assets/icons';
import { useNavigate } from 'react-router-dom';

// Simulated API endpoints
const CATEGORY_API = 'https://fakestoreapi.com/products/categories';
const PRODUCTS_API = 'https://fakestoreapi.com/products?limit=4'; // limit to 4 for featured

// --- Categories Section with async API fetch ---
export const CategoriesSection = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const res = await fetch(CATEGORY_API);
                const data = await res.json();

                const formatted = data.map((name) => ({
                    name: name.charAt(0).toUpperCase() + name.slice(1),
                    image: `https://placehold.co/80x80?text=${encodeURIComponent(name)}`
                }));

                setCategories(formatted);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryClick = (category) => {
        navigate(`/categories/${encodeURIComponent(category)}`);
        console.log(`Clicked category: ${category}`);
    };

    const handleViewAllCategories = () => {
        navigate('/categories');
        console.log("View All Categories clicked");
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Categories</h2>
                <button
                    onClick={handleViewAllCategories}
                    className="text-sm text-blue-600 hover:underline"
                    aria-label="View all categories"
                >
                    View All →
                </button>
            </div>

            {loading ? (
                <div className="text-center text-gray-500">Loading categories...</div>
            ) : (
                <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                    {categories.map((cat, i) => (
                        <button
                            key={i}
                            onClick={() => handleCategoryClick(cat.name)}
                            className="flex flex-col items-center text-center group focus:outline-none"
                            aria-label={`View ${cat.name} category`}
                        >
                            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden border group-hover:border-blue-500 transition-all">
                                <img src={cat.image} alt={cat.name} className="max-w-full max-h-full object-contain" />
                            </div>
                            <p className="mt-2 text-sm text-gray-700 group-hover:text-blue-600">{cat.name}</p>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- Featured Deal Section with async API fetch ---
export const FeaturedDealSection = () => {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                setLoading(true);
                const res = await fetch(PRODUCTS_API);
                const data = await res.json();

                const enhanced = data.map((item) => ({
                    name: item.title,
                    price: `$${item.price.toFixed(2)}`,
                    oldPrice: `$${(item.price + 10).toFixed(2)}`,
                    discount: '-10%',
                    rating: Math.floor(Math.random() * 5) + 1,
                    reviews: Math.floor(Math.random() * 50) + 1,
                    image: item.image
                }));

                setDeals(enhanced);
            } catch (error) {
                console.error('Failed to fetch deals:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDeals();
    }, []);

    const handleDealClick = (deal) => {
        navigate(`/deals/${encodeURIComponent(deal)}`);
        console.log(`View details for ${deal}`);
    };

    const handleAddToCart = (deal) => {
        console.log(`Added ${deal} to cart`);
        // Add cart logic here
    };

    const handleViewAllDeals = () => {
        navigate('/deals');
        console.log("View All Deals clicked");
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Featured Deal</h2>
                    <p className="text-sm text-gray-500">See the latest deals and exciting new offers!</p>
                </div>
                <button
                    onClick={handleViewAllDeals}
                    className="text-sm text-blue-600 hover:underline"
                    aria-label="View all deals"
                >
                    View All →
                </button>
            </div>

            {loading ? (
                <div className="text-center text-gray-500">Loading deals...</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {deals.map((p, i) => (
                        <div key={i} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg p-4 relative">
                            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">{p.discount}</div>
                            <img src={p.image} alt={p.name} className="h-32 mx-auto mb-4 object-contain" />
                            <h3 className="text-sm font-medium text-gray-800 truncate">{p.name}</h3>
                            <div className="flex items-center my-1">
                                {[...Array(5)].map((_, idx) => (
                                    <StarIcon key={idx} filled={idx < p.rating} />
                                ))}
                                <span className="text-xs text-gray-500 ml-1">({p.reviews})</span>
                            </div>
                            <div className="flex items-baseline space-x-2 mb-2">
                                <div className="text-lg font-bold text-blue-600">{p.price}</div>
                                <div className="text-sm text-gray-500 line-through">{p.oldPrice}</div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleDealClick(p.name)}
                                    className="flex-1 bg-gray-100 text-gray-800 text-xs py-1 px-2 rounded hover:bg-gray-200"
                                    aria-label={`View details for ${p.name}`}
                                >
                                    View
                                </button>
                                <button
                                    onClick={() => handleAddToCart(p.name)}
                                    className="flex-1 bg-green-600 text-white text-xs py-1 px-2 rounded hover:bg-green-700"
                                    aria-label={`Add ${p.name} to cart`}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- Combined Component ---
const CategoriesAndDeals = () => {
    return (
        <div className="space-y-6">
            <CategoriesSection />
            <FeaturedDealSection />
        </div>
    );
};

export default CategoriesAndDeals;
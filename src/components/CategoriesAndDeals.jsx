import React, { useState, useEffect } from 'react'; // FIXED: Removed quotes around useEffect
import { useNavigate, Link } from 'react-router-dom';
import { StarIcon } from '../assets/icons';
import { apiService } from '../api/apiService';
import { API_BASE_URL } from '../api/config';
import { transformProductData } from '../utils/transformProductData';
import ProductCard from '../components/ProductCard';

// --- Categories Section ---
export const CategoriesSection = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await apiService('/api/categories');
                const formatted = data.data.categories.map((cat) => ({
                    id: cat.id,
                    name: cat.name,
                    slug: cat.slug,
                    image: cat.image 
                        ? `${API_BASE_URL}/${cat.image}` 
                        : `https://placehold.co/80x80?text=${encodeURIComponent(cat.name)}`
                }));
                setCategories(formatted.slice(0, 8));
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryClick = (slug) => {
        navigate(`/category/${slug}`);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Categories</h2>
                <Link to="/categories" className="text-sm text-blue-600 hover:underline">
                    View All →
                </Link>
            </div>
            {loading ? (
                <div className="text-center text-gray-500">Loading categories...</div>
            ) : (
                <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.slug)}
                            className="flex flex-col items-center text-center group focus:outline-none"
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

// --- Featured Deal Section ---
export const FeaturedDealSection = () => {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const data = await apiService('/api/products?is_featured=true&limit=4');
                const enhanced = data.products.map(transformProductData);
                setDeals(enhanced);
            } catch (error) {
                console.error('Failed to fetch deals:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDeals();
    }, []);

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Featured Deal</h2>
                    <p className="text-sm text-gray-500">See the latest deals and exciting new offers!</p>
                </div>
                <Link to="/deals?featured=true" className="text-sm text-blue-600 hover:underline">
                    View All →
                </Link>
            </div>
            {loading ? (
                <div className="text-center text-gray-500">Loading deals...</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {deals.map((p) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            )}
        </div>
    );
};
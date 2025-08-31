import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../components/layout/apiService';
import { API_BASE_URL } from '../api/config';

// Helper function to get the correct image URL for categories
const getCategoryImageUrl = (imagePath, categoryName) => {
    if (imagePath && imagePath.startsWith('http')) {
        return imagePath;
    }
    if (imagePath) {
        return `${API_BASE_URL}/${imagePath}`;
    }
    const firstWord = categoryName.split(' ')[0];
    return `https://placehold.co/80x80/EBF4FF/7F9CF5?text=${encodeURIComponent(firstWord)}`;
};

const CategoryCardSkeleton = () => (
    <div className="bg-white p-4 rounded-lg shadow-sm animate-pulse">
        <div className="h-8 w-3/4 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-2">
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
            <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
        </div>
    </div>
);

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiService('/categories');
                if (response.success && Array.isArray(response.data?.categories)) {
                    // Filter for top-level categories only
                    const topLevelCategories = response.data.categories.filter(cat => cat.parent_id === null);
                    setCategories(topLevelCategories);
                } else {
                    throw new Error('Could not retrieve category data.');
                }
            } catch (err) {
                setError('Failed to fetch categories. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className="bg-slate-50 py-12 min-h-screen">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-800">
                        All Categories
                    </h1>
                    <p className="mt-2 text-gray-500">
                        Find what you're looking for in our wide range of categories.
                    </p>
                </div>

                {error && (
                    <div className="text-center text-red-500 font-semibold bg-red-50 p-4 rounded-md">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {loading ? (
                        Array.from({ length: 8 }).map((_, i) => <CategoryCardSkeleton key={i} />)
                    ) : categories.length > 0 ? (
                        categories.map(category => (
                            <div key={category.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                                <Link to={`/category/${category.slug}`} className="flex items-center gap-4 mb-4">
                                    <img 
                                        src={getCategoryImageUrl(category.image, category.name)} 
                                        alt={category.name}
                                        className="w-12 h-12 rounded-full object-cover border"
                                    />
                                    <h2 className="text-lg font-bold text-gray-800 hover:text-blue-600">{category.name}</h2>
                                </Link>
                                {category.subcategories && category.subcategories.length > 0 && (
                                    <ul className="space-y-2 border-t pt-4">
                                        {category.subcategories.map(sub => (
                                            <li key={sub.id}>
                                                <Link to={`/category/${sub.slug}`} className="text-sm text-gray-600 hover:text-blue-600 hover:underline">
                                                    {sub.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-16">
                             <h2 className="text-xl font-semibold text-gray-700">No Categories Found</h2>
                             <p className="text-gray-500 mt-2">Please check back later.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoriesPage;

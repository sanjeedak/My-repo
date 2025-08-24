import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { apiService } from '../components/layout/apiService';
import { transformProductData } from '../utils/transformProductData';
import ProductCard from '../components/products/ProductCard';

const ProductCardSkeleton = () => (
    <div className="group bg-white border border-gray-200 rounded-lg shadow-sm animate-pulse">
        <div className="relative pt-[100%] bg-gray-200"></div>
        <div className="p-4">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-5 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2"></div>
        </div>
    </div>
);

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [title, setTitle] = useState('Products');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { slug } = useParams();
    const location = useLocation();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError('');
            const params = new URLSearchParams(location.search);
            const searchQuery = params.get('q');
            const brandQuery = params.get('brand');

            let endpoint = '/api/products';
            let pageTitle = 'All Products';

            if (slug) {
                endpoint += `?category_slug=${slug}`;
                pageTitle = `Category: ${slug.replace(/-/g, ' ')}`;
            } else if (searchQuery) {
                endpoint += `?search=${searchQuery}`;
                pageTitle = `Search results for: "${searchQuery}"`;
            } else if (brandQuery) {
                endpoint += `?brand_slug=${brandQuery}`;
                pageTitle = `Brand: ${brandQuery.replace(/-/g, ' ')}`;
            }
            setTitle(pageTitle);

            try {
                const data = await apiService(endpoint);
                setProducts(data.products.map(transformProductData));
            } catch (err) {
                setError('Could not fetch products. Please try again later.');
                console.error("Failed to fetch products:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [slug, location.search]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 capitalize">{title}</h1>
            
            {error && <p className="text-center text-red-500">{error}</p>}

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {loading ? (
                    Array.from({ length: 10 }).map((_, i) => <ProductCardSkeleton key={i} />)
                ) : products.length > 0 ? (
                    products.map(product => <ProductCard key={product.id} product={product} />)
                ) : (
                    <div className="col-span-full text-center py-12">
                        <h2 className="text-xl font-semibold text-gray-700">No Products Found</h2>
                        <p className="text-gray-500 mt-2">Try adjusting your search or category selection.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductListPage;
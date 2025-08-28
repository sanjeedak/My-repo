import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import FilterSidebar from '../components/products/FilterSidebar';
import Pagination from '../components/Pagination';
import ProductModal from '../components/products/ProductModal';
import { apiService } from '../components/layout/apiService';
import { transformProductData } from '../utils/transformProductData';
import { Search } from 'lucide-react';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [availableBrands, setAvailableBrands] = useState([]);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [filters, setFilters] = useState({
        maxPrice: 4000,
        brands: [],
        minRating: 0,
        sortBy: 'created_at',
        order: 'desc',
    });

    const location = useLocation();

    useEffect(() => {
        apiService('/brands').then(brandData => {
            if (brandData.success) setAvailableBrands(brandData.data.brands);
        }).catch(err => console.error("Failed to fetch brands:", err));
    }, []);
    
    const handlePageChange = (page) => {
        if (page > 0 && page <= pagination.totalPages && page !== pagination.currentPage) {
            setPagination(prev => ({ ...prev, currentPage: page }));
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError('');
            
            const params = new URLSearchParams(location.search);
            params.set('page', pagination.currentPage);
            params.set('sort_by', filters.sortBy);
            params.set('order', filters.order);
            if (filters.maxPrice < 100000) params.set('max_price', filters.maxPrice);
            if (filters.brands.length > 0) params.set('brand_slug', filters.brands.join(','));
            if (filters.minRating > 0) params.set('rating', filters.minRating);

            try {
                const data = await apiService(`/products?${params.toString()}`);
                const transformed = (data.products || []).map(transformProductData);
                setProducts(transformed);
                setPagination(prev => ({
                    ...prev,
                    totalPages: data.last_page || Math.ceil((data.total || transformed.length) / 10) || 1
                }));
            } catch (err) {
                setError('Could not fetch products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [filters, pagination.currentPage, location.search]);

    return (
        <>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap justify-between items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Category Products</h2>
                        <p className="text-sm text-gray-500">{products.length} items found</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <input type="text" placeholder="Search for items..." className="border rounded-md py-2 pl-10 pr-4 text-sm w-full sm:w-48"/>
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                        <select
                            value={`${filters.sortBy}-${filters.order}`}
                            onChange={(e) => {
                                const [sortBy, order] = e.target.value.split('-');
                                setFilters(prev => ({ ...prev, sortBy, order, currentPage: 1 }));
                            }}
                            className="border-gray-300 rounded-md shadow-sm text-sm"
                        >
                            <option value="created_at-desc">Sort by Default</option>
                            <option value="name-asc">Name (A-Z)</option>
                            <option value="name-desc">Name (Z-A)</option>
                            <option value="price-asc">Price (Low to High)</option>
                            <option value="price-desc">Price (High to Low)</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <aside className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm h-fit">
                        <FilterSidebar 
                            filters={filters} 
                            setFilters={setFilters} 
                            availableBrands={availableBrands} 
                        />
                    </aside>
                    <main className="lg:col-span-3">
                        {error && <p className="text-center text-red-500 bg-red-100 p-4 rounded">{error}</p>}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {loading ? (
                                Array.from({ length: 9 }).map((_, i) => (
                                    <div key={i} className="border rounded-lg shadow-sm"><div className="w-full h-80 bg-gray-200 animate-pulse"></div></div>
                                ))
                            ) : products.length > 0 ? (
                                products.map(product => (
                                    <ProductCard 
                                        key={product.id} 
                                        product={product}
                                        onQuickView={() => setSelectedProduct(product)}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-16">
                                    <h2 className="text-xl font-semibold text-gray-700">No Products Found</h2>
                                    <p className="text-gray-500 mt-2">Try adjusting your filters.</p>
                                </div>
                            )}
                        </div>
                        <Pagination 
                            pagination={pagination} 
                            handlePageChange={handlePageChange} 
                        />
                    </main>
                </div>
            </div>
            {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
        </>
    );
};

export default ProductsPage;
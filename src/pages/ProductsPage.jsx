import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import FilterSidebar from '../components/products/FilterSidebar';
import Pagination from '../components/Pagination';
import ProductModal from '../components/products/ProductModal';
import { apiService } from '../components/layout/apiService';
import { transformProductData } from '../utils/transformProductData';
import { Search } from 'lucide-react';
import InfoCards from '../components/layout/InfoCards';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [availableBrands, setAvailableBrands] = useState([]);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [filters, setFilters] = useState({
        maxPrice: 4000,
        brands: [],
        minRating: 0,
        sortBy: 'created_at',
        order: 'desc',
    });

    const location = useLocation();
    const { slug: categorySlugFromPath } = useParams();
    const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

    const pageTitle = useMemo(() => {
        const section = searchParams.get('section');
        const brandSlug = searchParams.get('brand');
        const categorySlug = categorySlugFromPath || searchParams.get('category');
        
        if (section === 'featured') return 'Featured Products';
        if (section === 'flash_deal') return 'Flash Deals';
        if (section === 'top_sellers') return 'Top Selling Products';
        if (categorySlug) return `Products in ${categorySlug.replace(/-/g, ' ')}`;
        if (brandSlug) return `Products from ${brandSlug.replace(/-/g, ' ')}`;
        return 'All Products';
    }, [searchParams, categorySlugFromPath]);

    useEffect(() => {
        apiService('/brands').then(brandData => {
            if (brandData.success && Array.isArray(brandData.data?.brands)) {
                setAvailableBrands(brandData.data.brands);
            }
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
            
            const currentParams = new URLSearchParams(location.search);
            const section = currentParams.get('section');
            let endpoint = '/products';
            const queryParams = new URLSearchParams();

            queryParams.set('page', pagination.currentPage);

            // Special case for top-sellers endpoint which might not support other filters
            if (section === 'top_sellers') {
                endpoint = '/products/top-sellers';
            } else {
                // Apply general filters for all other cases
                queryParams.set('sort_by', filters.sortBy);
                queryParams.set('order', filters.order);
                if (filters.maxPrice < 4000) queryParams.set('max_price', filters.maxPrice);
                if (filters.brands.length > 0) queryParams.set('brand_slug', filters.brands.join(','));
                if (filters.minRating > 0) queryParams.set('rating', filters.minRating);

                // Handle category from either URL path or query param
                const categorySlug = categorySlugFromPath || currentParams.get('category');
                if (categorySlug) {
                    queryParams.set('category_slug', categorySlug);
                }
                
                // Handle brand from query param
                const brandSlug = currentParams.get('brand');
                if(brandSlug){
                    queryParams.set('brand_slug', brandSlug);
                }

                // Section-specific flags
                if (section === 'featured') {
                    queryParams.set('is_featured', 'true');
                } else if (section === 'flash_deal') {
                    queryParams.set('on_sale', 'true');
                }
            }

            try {
                const finalUrl = `${endpoint}?${queryParams.toString()}`;
                const data = await apiService(finalUrl);
                
                const productList = data.products || (data.data && data.data.products) || [];
                const transformed = productList.map(transformProductData);
                setProducts(transformed);

                const paginationData = data.pagination || (data.data && data.data.pagination);
                if (paginationData) {
                    setPagination(prev => ({
                        ...prev,
                        totalPages: paginationData.totalPages || 1,
                        totalItems: paginationData.totalItems || 0,
                    }));
                } else {
                     setPagination({ 
                        currentPage: data.current_page || 1, 
                        totalPages: data.last_page || 1,
                        totalItems: data.total || productList.length,
                     });
                }

            } catch (err) {
                setError('Could not fetch products. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [filters, pagination.currentPage, location.search, categorySlugFromPath]);

    return (
        <>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap justify-between items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 capitalize">{pageTitle}</h2>
                        <p className="text-sm text-gray-500">{pagination?.totalItems || products.length} items found</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <input type="text" placeholder="Search for items..." className="border-gray-300 rounded-md py-2 pl-10 pr-4 text-sm w-full sm:w-48 focus:ring-brand-blue focus:border-brand-blue"/>
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                        <select
                            value={`${filters.sortBy}-${filters.order}`}
                            onChange={(e) => {
                                const [sortBy, order] = e.target.value.split('-');
                                setFilters(prev => ({ ...prev, sortBy, order, currentPage: 1 }));
                            }}
                            className="border-gray-300 rounded-md shadow-sm text-sm focus:ring-brand-blue focus:border-brand-blue"
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
            <InfoCards />
            {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
        </>
    );
};

export default ProductsPage;


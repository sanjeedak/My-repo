import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProductCard from '../components/products/ProductCard';
import FilterSidebar from '../components/products/FilterSidebar';
import Pagination from '../components/Pagination';
import ProductModal from '../components/products/ProductModal';
import { apiService } from '../components/layout/apiService';
import { transformProductData } from '../utils/transformProductData';
import { Search } from 'lucide-react';
import InfoCards from '../components/layout/InfoCards';
import { endpoints } from '../api/endpoints';
import appConfigs from '../config/appConfigs';

const ProductsPage = () => {
    // --- HOOKS INITIALIZATION ---
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { slug: categorySlugFromPath } = useParams();
    const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

    // --- COMPONENT STATE ---
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [availableBrands, setAvailableBrands] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [filters, setFilters] = useState({
        maxPrice: appConfigs.maxPrice,
        brands: [],
        minRating: 0,
        sortBy: 'created_at',
        order: 'desc',
    });

    const itemsPerPage = appConfigs.itemsPerPage;

    // --- DERIVED STATE & MEMOIZED VALUES ---
    const pageTitle = useMemo(() => {
        const searchQuery = searchParams.get('q');
        if (searchQuery) return `${t('search_results_for')} "${searchQuery}"`;
        
        const section = searchParams.get('section');
        if (section === 'featured') return t('featured_products');
        if (section === 'flash_deal') return t('flash_deals');
        if (section === 'top_sellers') return t('top_sellers');
        
        const categorySlug = categorySlugFromPath || searchParams.get('category');
        if (categorySlug) return `${t('products_in')} ${categorySlug.replace(/-/g, ' ')}`;
        
        const brandSlug = searchParams.get('brand');
        if (brandSlug) return `${t('products_from')} ${brandSlug.replace(/-/g, ' ')}`;
        
        return t('all_products');
    }, [searchParams, categorySlugFromPath, t]);

    // --- DATA FETCHING ---
    useEffect(() => {
        apiService(endpoints.brands)
            .then(brandData => {
                if (brandData.success && Array.isArray(brandData.data?.brands)) {
                    setAvailableBrands(brandData.data.brands);
                }
            })
            .catch(err => console.error("Failed to fetch brands:", err));
    }, []);

    const fetchProducts = useCallback(async (pageToFetch) => {
        setLoading(true);
        setError('');
        try {
            const queryParams = new URLSearchParams({
                page: pageToFetch,
                limit: itemsPerPage,
                sortBy: filters.sortBy,
                order: filters.order,
                maxPrice: filters.maxPrice,
                minRating: filters.minRating,
            });

            if (filters.brands.length > 0) {
                queryParams.set('brands', filters.brands.join(','));
            }

            const categorySlug = categorySlugFromPath || searchParams.get('category');
            if (categorySlug) queryParams.set('category', categorySlug);

            const brandSlug = searchParams.get('brand');
            if (brandSlug) queryParams.set('brand', brandSlug);

            const section = searchParams.get('section');
            if (section) queryParams.set('section', section);

            const searchQuery = searchParams.get('q');
            if (searchQuery) queryParams.set('q', searchQuery);

            const data = await apiService(`${endpoints.products}?${queryParams.toString()}`);
            const productList = data?.products || data?.data?.products || [];
            const transformed = productList.map(transformProductData);

            setProducts(transformed);
            setPaginationInfo({
                currentPage: data?.pagination?.currentPage || 1,
                totalPages: data?.pagination?.totalPages || 1,
                totalItems: data?.pagination?.totalItems || 0,
            });

            if (transformed.length === 0) {
                setError(t('no_products_found'));
            }
        } catch (err) {
            console.error("ProductsPage API error:", err);
            setError('Could not fetch products. Please try again later.');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [filters, itemsPerPage, categorySlugFromPath, searchParams, t]);

    useEffect(() => {
        const currentPage = parseInt(searchParams.get('page') || '1', 10);
        fetchProducts(currentPage);
    }, [fetchProducts, searchParams]);

    // --- EVENT HANDLERS ---
    const handlePageChange = (page) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('page', page);
        navigate(`${location.pathname}?${newSearchParams.toString()}`);
    };
    
    const handleSearch = (e) => {
        e.preventDefault();
        const newSearchParams = new URLSearchParams(searchParams);
        if (searchTerm.trim()) {
            newSearchParams.set('q', searchTerm.trim());
        } else {
            newSearchParams.delete('q');
        }
        newSearchParams.set('page', '1');
        navigate(`/products?${newSearchParams.toString()}`);
    };
    
    // ============== YAHAN BADLAV KIYA GAYA HAI ==============
    useEffect(() => {
        const newSearchParams = new URLSearchParams(searchParams);
        const currentPage = newSearchParams.get('page');

        if (currentPage !== '1') {
           newSearchParams.set('page', '1');
        }
    // Dependency array ko theek kar diya gaya hai
    }, [filters, categorySlugFromPath, searchParams, location.search, navigate]);
    // ==========================================================

    return (
        <>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap justify-between items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 capitalize">{pageTitle}</h2>
                        <p className="text-sm text-gray-500">{paginationInfo.totalItems} {t('items_found')}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={t('search_placeholder')}
                                className="border-gray-300 rounded-md py-2 pl-10 pr-4 text-sm w-full sm:w-48 focus:ring-brand-blue focus:border-brand-blue"
                            />
                            <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400">
                                <Search className="w-full h-full" />
                            </button>
                        </form>
                        <select
                            value={`${filters.sortBy}-${filters.order}`}
                            onChange={(e) => {
                                const [sortBy, order] = e.target.value.split('-');
                                setFilters(prev => ({ ...prev, sortBy, order }));
                            }}
                            className="border-gray-300 rounded-md shadow-sm text-sm focus:ring-brand-blue focus:border-brand-blue"
                        >
                            <option value="created_at-desc">{t('sort_by_default')}</option>
                            <option value="name-asc">{t('sort_name_asc')}</option>
                            <option value="name-desc">{t('sort_name_desc')}</option>
                            <option value="price-asc">{t('sort_price_asc')}</option>
                            <option value="price-desc">{t('sort_price_desc')}</option>
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
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {Array.from({ length: 9 }).map((_, i) => (
                                    <div key={i} className="border rounded-lg shadow-sm"><div className="w-full h-80 bg-gray-200 animate-pulse"></div></div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {products.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onQuickView={() => setSelectedProduct(product)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="col-span-full text-center py-16">
                                <h2 className="text-xl font-semibold text-gray-700">{error || t('no_products_found')}</h2>
                                <p className="text-gray-500 mt-2">{t('adjust_filters_prompt')}</p>
                            </div>
                        )}
                        <Pagination
                            pagination={paginationInfo}
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
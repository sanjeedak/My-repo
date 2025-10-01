import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
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
    const { slug: categorySlugFromPath, storeId } = useParams();
    const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const mainContentRef = useRef(null); // Ref for scrolling to the top of the content

    // --- COMPONENT STATE ---
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [availableBrands, setAvailableBrands] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [filters, setFilters] = useState({
        maxPrice: appConfigs.maxPrice,
        brands: [],
        minRating: 0,
        sortBy: 'created_at',
        order: 'desc',
    });

    const itemsPerPage = 12;

    // --- DERIVED STATE & MEMOIZED VALUES ---
    const pageTitle = useMemo(() => {
        const searchQuery = searchParams.get('search');
        if (searchQuery) return `${t('Search results for')} "${searchQuery}"`;
        const categorySlug = categorySlugFromPath || searchParams.get('category');
        if (categorySlug) return `${t('Products in')} ${categorySlug.replace(/-/g, ' ')}`;
        const brandSlug = searchParams.get('brand');
        if (brandSlug) return `${t('Products from')} ${brandSlug.replace(/-/g, ' ')}`;
        return t('All Products');
    }, [searchParams, categorySlugFromPath, t]);

    // --- DATA FETCHING ---
    useEffect(() => {
        apiService(endpoints.brands).then(res => res.success && Array.isArray(res.data?.brands) && setAvailableBrands(res.data.brands));
        apiService(`${endpoints.categories}?limit=1000`).then(res => res.success && Array.isArray(res.data?.categories) && setAllCategories(res.data.categories));
    }, []);

    useEffect(() => {
        const searchQuery = searchParams.get('search');
        if (searchQuery && allCategories.length > 0 && !categorySlugFromPath && !storeId) {
            const lowerCaseSearch = searchQuery.toLowerCase().trim();
            const matchedCategory = allCategories.find(cat => cat.name.toLowerCase() === lowerCaseSearch);
            if (matchedCategory) {
                navigate(`/category/${matchedCategory.slug}`, { replace: true });
            }
        }
    }, [searchParams, allCategories, navigate, categorySlugFromPath, storeId]);

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

            let endpointUrl = storeId ? endpoints.productsByStore(storeId) : endpoints.products;

            if (filters.brands.length > 0) queryParams.set('brands', filters.brands.join(','));
            const categorySlug = categorySlugFromPath || searchParams.get('category');
            if (categorySlug) queryParams.set('category', categorySlug);
            const brandSlug = searchParams.get('brand');
            if (brandSlug) queryParams.set('brand', brandSlug);
            const searchQuery = searchParams.get('search');
            if (searchQuery) queryParams.set('search', searchQuery);

            const data = await apiService(`${endpointUrl}?${queryParams.toString()}`);
            const productList = data?.products || data?.data?.products || [];
            const transformed = productList.map(transformProductData);

            setProducts(transformed);
            setPaginationInfo({
                currentPage: data?.pagination?.page || 1,
                totalPages: data?.pagination?.pages || 1,
                totalItems: data?.pagination?.total || 0,
            });
            if (transformed.length === 0) setError(t('No products found'));
        } catch (err) {
            setError('Could not fetch products. Please try again later.');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [filters, categorySlugFromPath, searchParams, storeId, t]);

    useEffect(() => {
        const currentPage = parseInt(searchParams.get('page') || '1', 10);
        fetchProducts(currentPage);
    }, [location.search, fetchProducts]);
    
    // --- SCROLL TO TOP ON PAGE CHANGE ---
    useEffect(() => {
        if (mainContentRef.current) {
            mainContentRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [products, loading]); // Trigger scroll on product load

    // --- EVENT HANDLERS ---
    const handlePageChange = (page) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('page', String(page));
        navigate({ search: newSearchParams.toString() });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const newSearchParams = new URLSearchParams();
        if (searchTerm.trim()) {
            newSearchParams.set('search', searchTerm.trim());
        }
        newSearchParams.set('page', '1');
        navigate(`/products?${newSearchParams.toString()}`);
    };

    return (
        <>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8" ref={mainContentRef}>
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
                                placeholder={t('Search placeholder')}
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
                            <option value="name-asc">{t('Sort name asc')}</option>
                            <option value="name-desc">{t('Sort name desc')}</option>
                            <option value="price-asc">{t('Sort price asc')}</option>
                            <option value="price-desc">{t('Sort price desc')}</option>
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
                                <h2 className="text-xl font-semibold text-gray-700">{error || t('No products found')}</h2>
                                <p className="text-gray-500 mt-2">{t('Adjust filters prompt')}</p>
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
import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProductCard from '../components/products/ProductCard';
import FilterSidebar from '../components/products/FilterSidebar';
import Pagination from '../components/Pagination';
import ProductModal from '../components/products/ProductModal';
import { apiService } from '../components/layout/apiService';
import { transformProductData } from '../utils/transformProductData';
import { Search } from 'lucide-react';
import InfoCards from '../components/layout/InfoCards';
import { endpoints } from '../api/endpoints'; // Import endpoints

const ProductsPage = () => {
    const { t } = useTranslation();
    const [allProducts, setAllProducts] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [availableBrands, setAvailableBrands] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
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

    const itemsPerPage = 12;

    const pageTitle = useMemo(() => {
        const section = searchParams.get('section');
        const brandSlug = searchParams.get('brand');
        const categorySlug = categorySlugFromPath || searchParams.get('category');
        
        if (section === 'featured') return t('featured_products');
        if (section === 'flash_deal') return t('flash_deals');
        if (section === 'top_sellers') return t('top_sellers');
        if (categorySlug) return `Products in ${categorySlug.replace(/-/g, ' ')}`;
        if (brandSlug) return `Products from ${brandSlug.replace(/-/g, ' ')}`;
        return 'All Products';
    }, [searchParams, categorySlugFromPath, t]);

    useEffect(() => {
        // UPDATED: Use endpoints object for API call
        apiService(endpoints.brands).then(brandData => {
            if (brandData.success && Array.isArray(brandData.data?.brands)) {
                setAvailableBrands(brandData.data.brands);
            }
        }).catch(err => console.error("Failed to fetch brands:", err));
        
        const fetchAllProducts = async () => {
            setLoading(true);
            setError('');
            try {
                // UPDATED: Use endpoints object for API call
                const data = await apiService(`${endpoints.products}?limit=1000`); 
                const productList = data.products || (data.data && data.data.products) || [];
                const transformed = productList.map(transformProductData);
                setAllProducts(transformed);
            } catch (err) {
                setError('Could not fetch products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchAllProducts();
    }, []);

    useEffect(() => {
        let filtered = [...allProducts];
        const categorySlug = categorySlugFromPath || searchParams.get('category');
        const brandSlug = searchParams.get('brand');

        if (categorySlug) {
            filtered = filtered.filter(p => p.category && p.category.slug && p.category.slug.startsWith(categorySlug));
        }
        if (brandSlug) {
            // Use startsWith for a more flexible match to handle slug inconsistencies
            filtered = filtered.filter(p => p.store && p.store.slug && p.store.slug.startsWith(brandSlug));
        }

        if (filters.brands.length > 0) {
            filtered = filtered.filter(p => p.store && filters.brands.includes(p.store.slug));
        }
        filtered = filtered.filter(p => p.price <= filters.maxPrice);
        if (filters.minRating > 0) {
            filtered = filtered.filter(p => p.rating >= filters.minRating);
        }

        filtered.sort((a, b) => {
            if (filters.sortBy === 'name') {
                return filters.order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            }
            if (filters.sortBy === 'price') {
                return filters.order === 'asc' ? a.price - b.price : b.price - a.price;
            }
            return a.name.localeCompare(b.name);
        });

        const totalFilteredItems = filtered.length;
        const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);
        
        const startIndex = (paginationInfo.currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setDisplayedProducts(filtered.slice(startIndex, endIndex));

        setPaginationInfo(prev => ({
            ...prev,
            totalPages: totalPages,
            totalItems: totalFilteredItems,
        }));

    }, [allProducts, filters, paginationInfo.currentPage, categorySlugFromPath, searchParams]);

    const handlePageChange = (page) => {
        if (page > 0 && page <= paginationInfo.totalPages) {
            setPaginationInfo(prev => ({ ...prev, currentPage: page }));
        }
    };
    
    useEffect(() => {
        setPaginationInfo(prev => ({ ...prev, currentPage: 1 }));
    }, [filters, categorySlugFromPath, searchParams]);

    return (
        <>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap justify-between items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 capitalize">{pageTitle}</h2>
                        <p className="text-sm text-gray-500">{paginationInfo?.totalItems || 0} {t('items_found')}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <input type="text" placeholder={t('search_placeholder')} className="border-gray-300 rounded-md py-2 pl-10 pr-4 text-sm w-full sm:w-48 focus:ring-brand-blue focus:border-brand-blue"/>
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
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
                        {error && <p className="text-center text-red-500 bg-red-100 p-4 rounded">{error}</p>}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {loading ? (
                                Array.from({ length: 9 }).map((_, i) => (
                                    <div key={i} className="border rounded-lg shadow-sm"><div className="w-full h-80 bg-gray-200 animate-pulse"></div></div>
                                ))
                            ) : displayedProducts.length > 0 ? (
                                displayedProducts.map(product => (
                                    <ProductCard 
                                        key={product.id} 
                                        product={product}
                                        onQuickView={() => setSelectedProduct(product)}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-16">
                                    <h2 className="text-xl font-semibold text-gray-700">{t('no_products_found')}</h2>
                                    <p className="text-gray-500 mt-2">{t('adjust_filters_prompt')}</p>
                                </div>
                            )}
                        </div>
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
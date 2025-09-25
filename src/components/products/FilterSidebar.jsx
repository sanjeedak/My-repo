import React from 'react';
import PropTypes from 'prop-types';
import { StarIcon } from '../../assets/icons';
import appConfigs from '../../config/appConfigs';

const FilterSidebar = ({ filters, setFilters, availableStores = [] }) => {
    // Ensure maxPrice is a number and handle NaN
    const maxPrice = Number(filters.maxPrice) || appConfigs.maxPrice;
    const priceStep = 100;
    const maxPriceLimit = appConfigs.maxPrice || 10000; // Fallback value

    const handleStoreChange = (storeSlug) => {
        const newStores = filters.stores.includes(storeSlug)
            ? filters.stores.filter(s => s !== storeSlug)
            : [...filters.stores, storeSlug];
        setFilters(prev => ({ ...prev, stores: newStores, currentPage: 1 }));
    };

    const handleRatingChange = (rating) => {
        setFilters(prev => ({ ...prev, minRating: rating, currentPage: 1 }));
    };

    const handlePriceChange = (e) => {
        const value = Number(e.target.value);
        if (!isNaN(value)) {
            setFilters(prev => ({ ...prev, maxPrice: value, currentPage: 1 }));
        }
    };

    const clearFilters = () => {
        setFilters({
            maxPrice: maxPriceLimit,
            stores: [],
            minRating: 0,
            sortBy: 'created_at',
            order: 'desc',
        });
    };

    const currentMaxPrice = filters.maxPrice ?? appConfigs.maxPrice;

    return (
        <aside className="space-y-6 w-full">
            <h3 className="text-lg font-bold border-b pb-2 text-gray-800">Filter By</h3>
            
            <div>
                <h4 className="font-semibold mb-3 text-gray-700">Price Range</h4>
                <div className="px-2">
                    <input
                        type="range"
                        min="0"
                        max={maxPriceLimit}
                        step={priceStep}
                        value={maxPrice}
                        onChange={handlePriceChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                    />
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-3">
                    <span>₹0</span>
                    <span>₹{maxPrice.toLocaleString('en-IN')}</span>
                </div>
            </div>

            <div>
                <h4 className="font-semibold mb-3 text-gray-700">Stores</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {availableStores.length > 0 ? (
                        availableStores.map(store => (
                            <label
                                key={store.id}
                                className="flex items-center text-sm cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={filters.stores.includes(store.slug)}
                                    onChange={() => handleStoreChange(store.slug)}
                                    className="h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                                />
                                <span className="ml-2 text-gray-700">{store.name}</span>
                            </label>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No stores available</p>
                    )}
                </div>
            </div>

            <div>
                <h4 className="font-semibold mb-3 text-gray-700">Minimum Rating</h4>
                <div className="flex flex-col items-start space-y-1">
                    {[4, 3, 2, 1].map(rating => (
                        <button
                            key={rating}
                            onClick={() => handleRatingChange(rating)}
                            className={`flex items-center text-sm p-1 rounded-md transition-colors w-full ${
                                filters.minRating === rating
                                    ? 'bg-blue-100 text-brand-blue'
                                    : 'hover:bg-gray-100'
                            }`}
                        >
                            {[...Array(5)].map((_, i) => (
                                <StarIcon key={i} filled={i < rating} />
                            ))}
                            <span className="ml-2 text-gray-600">& Up</span>
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={clearFilters}
                className="w-full text-center text-sm font-semibold text-brand-blue hover:bg-blue-50 py-2 rounded-md transition-colors"
            >
                Clear All Filters
            </button>
        </aside>
    );
};

FilterSidebar.propTypes = {
    filters: PropTypes.shape({
        maxPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        stores: PropTypes.arrayOf(PropTypes.string),
        minRating: PropTypes.number,
        sortBy: PropTypes.string,
        order: PropTypes.string,
    }).isRequired,
    setFilters: PropTypes.func.isRequired,
    availableStores: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            slug: PropTypes.string,
        })
    ),
};

export default FilterSidebar;
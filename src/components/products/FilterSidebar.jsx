import React from 'react';
import { StarIcon } from '../../assets/icons';
import  appConfigs  from '../../config/appConfigs'; // Import new config

const FilterSidebar = ({ filters, setFilters, availableBrands = [] }) => {
    
    const handleBrandChange = (brandSlug) => {
        const newBrands = filters.brands.includes(brandSlug)
            ? filters.brands.filter(b => b !== brandSlug)
            : [...filters.brands, brandSlug];
        setFilters(prev => ({ ...prev, brands: newBrands, currentPage: 1 }));
    };

    const handleRatingChange = (rating) => {
        setFilters(prev => ({ ...prev, minRating: rating, currentPage: 1 }));
    };

    const handlePriceChange = (e) => {
        setFilters(prev => ({ ...prev, maxPrice: e.target.value, currentPage: 1 }));
    };
    
    const clearFilters = () => {
        setFilters({ 
            maxPrice: appConfigs.defaultMaxPrice,
            brands: [],
            minRating: 0,
            sortBy: 'created_at',
            order: 'desc',
        });
    }

    return (
        <aside className="space-y-6">
            <h3 className="text-lg font-bold border-b pb-2">Filter By</h3>
            <div>
                <h4 className="font-semibold mb-3">Price</h4>
                <div className='px-1'>
                    <input
                        type="range"
                        min="0"
                        max={appConfigs.defaultMaxPrice} // Set max from config
                        step="100"
                        value={filters.maxPrice}
                        onChange={handlePriceChange}
                    />
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>₹0</span>
                    <span>₹{Number(filters.maxPrice).toLocaleString()}</span>
                </div>
            </div>

            <div>
                <h4 className="font-semibold mb-3">Brands</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {availableBrands.map(brand => (
                        <label key={brand.slug} className="flex items-center text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters.brands.includes(brand.slug)}
                                onChange={() => handleBrandChange(brand.slug)}
                                className="h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                            />
                            <span className="ml-2 text-gray-700">{brand.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="font-semibold mb-3">Rating</h4>
                <div className="flex flex-col items-start space-y-1">
                    {[4, 3, 2, 1].map(rating => (
                        <button
                            key={rating}
                            onClick={() => handleRatingChange(rating)}
                            className={`flex items-center text-sm p-1 rounded-md transition-colors w-full ${filters.minRating === rating ? 'bg-blue-100 text-brand-blue' : 'hover:bg-gray-100'}`}
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
                className="w-full text-center text-sm font-semibold text-brand-blue hover:underline mt-4"
            >
                Clear All Filters
            </button>
        </aside>
    );
};

export default FilterSidebar;

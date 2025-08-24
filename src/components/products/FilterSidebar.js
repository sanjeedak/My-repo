import React from 'react';
import { StarIcon } from '../../assets/icons'; // Assuming you have a shared icon

const FilterSidebar = ({ filters, setFilters, availableBrands = [] }) => {
    
    const handleBrandChange = (brandSlug) => {
        const newBrands = filters.brands.includes(brandSlug)
            ? filters.brands.filter(b => b !== brandSlug)
            : [...filters.brands, brandSlug];
        setFilters(prev => ({ ...prev, brands: newBrands }));
    };

    const handleRatingChange = (rating) => {
        setFilters(prev => ({ ...prev, minRating: rating }));
    };

    const handlePriceChange = (e) => {
        setFilters(prev => ({ ...prev, maxPrice: e.target.value }));
    };

    return (
        <aside className="space-y-6">
            {/* Price Filter */}
            <div>
                <h3 className="text-lg font-semibold mb-3">Price Range</h3>
                <label className="flex flex-col text-sm">
                    <span>Up to ₹{Number(filters.maxPrice).toLocaleString()}</span>
                    <input
                        type="range"
                        min="500"
                        max="100000"
                        step="500"
                        value={filters.maxPrice}
                        onChange={handlePriceChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
                    />
                </label>
            </div>

            {/* Brands Filter */}
            <div>
                <h3 className="text-lg font-semibold mb-3">Brands</h3>
                <div className="space-y-2">
                    {availableBrands.map(brand => (
                        <label key={brand.slug} className="flex items-center text-sm">
                            <input
                                type="checkbox"
                                checked={filters.brands.includes(brand.slug)}
                                onChange={() => handleBrandChange(brand.slug)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-gray-700">{brand.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Rating Filter */}
            <div>
                <h3 className="text-lg font-semibold mb-3">Rating</h3>
                <div className="flex flex-col items-start space-y-1">
                    {[4, 3, 2, 1].map(rating => (
                        <button
                            key={rating}
                            onClick={() => handleRatingChange(rating)}
                            className={`flex items-center text-sm p-1 rounded-md transition-colors w-full ${filters.minRating === rating ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
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
                onClick={() => setFilters({ maxPrice: 100000, brands: [], minRating: 0 })}
                className="w-full text-center text-sm text-blue-600 hover:underline"
            >
                Clear All Filters
            </button>
        </aside>
    );
};

export default FilterSidebar;
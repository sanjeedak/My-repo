import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon } from '../../assets/icons';
import { API_BASE_URL } from '../../api/config';

const SellerInfo = ({ seller }) => {
    if (!seller) return null;

    const rating = parseFloat(seller.rating || 0).toFixed(1);
    // Store ke products page ka sahi link banayein
    const storeProductsLink = `/products?brand=${seller.slug}`;

    return (
        <div className="bg-slate-100 border border-slate-200 rounded-lg p-4 mt-6">
            <h3 className="font-bold text-slate-800 mb-3">Sold by:</h3>
            <div className="flex items-center space-x-4">
                <img
                    src={`${API_BASE_URL}/${seller.logo}`}
                    alt={`${seller.name} logo`}
                    className="w-16 h-16 rounded-full object-cover border"
                    onError={(e) => { e.target.src = 'https://placehold.co/64x64?text=Store'; }}
                />
                <div className="flex-grow">
                    <Link to={storeProductsLink} className="font-semibold text-blue-600 hover:underline">
                        {seller.name}
                    </Link>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                        <StarIcon />
                        <span className="ml-1 font-bold text-slate-700">{rating} Rating</span>
                    </div>
                </div>
                <Link
                    to={storeProductsLink}
                    className="bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-2 rounded-md hover:bg-blue-200 transition-colors"
                >
                    Visit Store
                </Link>
            </div>
        </div>
    );
};

export default SellerInfo;
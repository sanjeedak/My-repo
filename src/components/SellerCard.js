import React from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../api/config';
import { StarIcon } from '../assets/icons';

const SellerCard = ({ seller }) => {
     const storeLink = `/store/${seller.id}`;
    // Create a URL-friendly slug from the seller's name if one doesn't exist
    // const sellerSlug = seller.slug || (seller.name ? seller.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : seller.id);

    return (
        <Link
            to={storeLink}
            className="group relative block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-95 active:shadow-inner"
        >
            <div className="p-6">
                <div className="flex items-center gap-4">
                    <img
                        src={seller.logo ? `${API_BASE_URL}/${seller.logo}` : 'https://placehold.co/64x64/EBF4FF/7F9CF5?text=Store'}
                        alt={`${seller.name} Logo`}
                        className="h-16 w-16 flex-shrink-0 rounded-full border object-contain"
                        onError={(e) => { e.target.src = 'https://placehold.co/64x64/EBF4FF/7F9CF5?text=Store'; }}
                    />
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600">
                            {seller.name}
                        </h3>
                        <div className="mt-1 flex items-center">
                            <StarIcon />
                            <span className="ml-1.5 text-sm text-gray-600">
                                {parseFloat(seller.rating || 0).toFixed(1)} Rating
                            </span>
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex justify-between rounded-lg bg-gray-50 p-3 text-center text-sm text-gray-500">
                    <div>
                        <div className="font-bold text-gray-800">{seller.total_products || 0}</div>
                        <div>Products</div>
                    </div>
                    <div>
                        <div className="font-bold text-gray-800">{seller.total_reviews || 0}</div>
                        <div>Reviews</div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default SellerCard;


import React from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../api/config';
import { StarIcon } from '../assets/icons';

const SellerCard = ({ seller }) => {
  const storeLink = `/store/${seller.id}`;

  // Helper for logo handling
  const getLogoUrl = (logo) => {
    if (!logo) return 'https://placehold.co/64x64/EBF4FF/7F9CF5?text=Store';
    if (logo.startsWith('http')) return logo;
    return `${API_BASE_URL}/${logo}`;
  };

  return (
    <Link
      to={storeLink}
      className="group relative block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-95 active:shadow-inner"
    >
      <div className="p-6">
        {/* Store Header */}
        <div className="flex items-center gap-4">
          <img
            src={getLogoUrl(seller.logo)}
            alt={`${seller.name} Logo`}
            className="h-16 w-16 flex-shrink-0 rounded-full border object-cover bg-white"
            onError={(e) => {
              e.target.src = 'https://placehold.co/64x64/EBF4FF/7F9CF5?text=Store';
            }}
          />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 truncate">
              {seller.name}
            </h3>
            <div className="mt-1 flex items-center text-yellow-500">
              {/* Star icon with rating */}
              <StarIcon className="w-4 h-4 fill-current" />
              <span className="ml-1.5 text-sm text-gray-600">
                {parseFloat(seller.rating || 0).toFixed(1)} / 5
              </span>
            </div>
          </div>
        </div>

        {/* Store Stats */}
        <div className="mt-4 grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4 text-center text-sm">
          <div>
            <div className="font-bold text-gray-800 text-lg">
              {seller.total_products || 0}
            </div>
            <div className="text-gray-500">Products</div>
          </div>
          <div>
            <div className="font-bold text-gray-800 text-lg">
              {seller.total_reviews || 0}
            </div>
            <div className="text-gray-500">Reviews</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SellerCard;

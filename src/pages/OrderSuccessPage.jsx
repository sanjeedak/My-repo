import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const OrderSuccessPage = () => {
  const location = useLocation();
  const { orderId } = location.state || { orderId: 'N/A' }; 
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-lg mx-auto">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-green-600 mb-4">{t('order_placed_successfully')}</h1>
        <p className="text-gray-700 mb-2">
          {t('thank_you_for_shopping')}
        </p>
        <p className="text-gray-700 mb-6">
          {t('your_order_id_is')} <strong className="text-slate-800">{orderId}</strong>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={`/track-order?id=${orderId}`}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold transition-colors"
          >
            {t('track_order')}
          </Link>
          <Link
            to="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
          >
            {t('continue_shopping')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const OrderCancelledPage = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const { orderNumber, message } = state || {};

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {t('orderCancelled')}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {message || t('Order Cancelled Success')}
            {orderNumber && (
              <span>
                {' '}
                {t('For Order')} #{orderNumber}
              </span>
            )}
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/products"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105"
            >
              {t('Continue Shopping')}
            </Link>
            <Link
              to="/profile"
              className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-transform transform hover:scale-105"
            >
              {t('View Orders')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCancelledPage;
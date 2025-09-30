import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const OrderSuccessPage = () => {
  const location = useLocation();
  const { orderNumbers } = location.state || {};
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-2xl mx-auto">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-green-600 mb-4">{t('Order placed successfully')}</h1>
        <p className="text-gray-700 mb-2">{t('Thank you for shopping')}</p>

        {orderNumbers && orderNumbers.length > 0 && (
          <div className="text-left my-8 p-6 border rounded-lg bg-gray-50">
            <h2 className="text-xl font-bold mb-4 text-center">Order Summary</h2>
            <p className="text-center mb-4">Your order numbers are:</p>
            <ul className="list-disc list-inside text-center">
              {orderNumbers.map(orderNumber => (
                <li key={orderNumber}><strong>{orderNumber}</strong></li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
        
          <Link
            to="/profile#orders"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold transition-colors"
          >
            {t('View orders')}
          </Link>
          <Link
            to="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
          >
            {t('Continue shopping')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
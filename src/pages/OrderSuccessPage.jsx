import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiService } from '../components/layout/apiService';
import { endpoints } from '../api/endpoints';

const OrderSuccessPage = () => {
  const location = useLocation();
  const { orderId } = location.state || {}; 
  const { t } = useTranslation();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setError('No order ID found.');
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await apiService(endpoints.getOrderByNumber(orderId));
        if (response.success) {
          setOrder(response.data);
        } else {
          throw new Error(response.message || 'Could not find order details.');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching your order.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-2xl mx-auto">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-green-600 mb-4">{t('order_placed_successfully')}</h1>
        <p className="text-gray-700 mb-2">{t('thank_you_for_shopping')}</p>
        
        {loading && <p className="text-gray-600 my-6">Loading order details...</p>}
        {error && <p className="text-red-500 my-6">{error}</p>}

        {order && (
          <div className="text-left my-8 p-6 border rounded-lg bg-gray-50">
            <h2 className="text-xl font-bold mb-4 text-center">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">{t('your_order_id_is')}</span>
              <strong className="text-slate-800">{order.orderNumber}</strong>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Order Date:</span>
              <span className="text-slate-800">{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Payment Method:</span>
              <span className="text-slate-800">{order.paymentMethod}</span>
            </div>
            <div className="border-t pt-4 mt-4 flex justify-between text-2xl font-bold">
              <span>Total:</span>
              <span className="text-blue-600">₹{parseFloat(order.totalAmount).toFixed(2)}</span>
            </div>
          </div>
        )}

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
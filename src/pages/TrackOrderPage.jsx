import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // useParams ko import karein
import { useTranslation } from 'react-i18next';
import { apiService } from '../components/layout/apiService';
import { endpoints } from '../api/endpoints';

const TrackOrderPage = () => {
  const { orderNumber } = useParams(); // URL se orderNumber prapt karein
  const { t } = useTranslation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderNumber) {
      setLoading(false);
      setError('No order number provided.');
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await apiService(endpoints.getOrderByNumber(orderNumber));
        if (response.success) {
          setOrder(response.data);
        } else {
          throw new Error(response.message || 'Could not find order details.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderNumber]);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">{t('track_your_order')}</h1>
      {loading && <p className="text-center">{t('loading_order_details')}</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {order && (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          {/* Order details yahan dikhayein */}
          <p>Order Number: {order.orderNumber}</p>
          <p>Status: {order.status}</p>
        </div>
      )}
      <div className="text-center mt-8">
        <Link to="/products" className="bg-blue-600 text-white px-6 py-3 rounded-lg">
          {t('continue_shopping')}
        </Link>
      </div>
    </div>
  );
};

export default TrackOrderPage;
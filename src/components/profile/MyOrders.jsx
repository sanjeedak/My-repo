import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiService } from '../layout/apiService';
import { endpoints } from '../../api/endpoints';
import { useAuth } from '../../context/AuthContext';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useTranslation();
  const { token } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await apiService(endpoints.getMyOrders, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.success) {
          setOrders(response.data);
        } else {
          throw new Error(response.message || 'Failed to fetch orders.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) {
    return <p>{t('loading_orders')}</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t('my_orders')}</h2>
      {orders.length === 0 ? (
        <p>{t('no_orders_found')}</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/track-order/${order.orderNumber}`}
              className="block border rounded-lg p-4 hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg">
                    {t('order')} #{order.orderNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t('placed_on')}: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-xl">
                    ₹{parseFloat(order.totalAmount).toFixed(2)}
                  </p>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {t(order.status)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
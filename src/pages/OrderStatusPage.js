import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../components/layout/apiService';
import { endpoints } from '../api/endpoints';

const OrderStatusPage = () => {
  const { user, token } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [orderNumber, setOrderNumber] = useState('');
  const [orders, setOrders] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await apiService(endpoints.orders, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.success) {
        setOrders(response.data);
      } else {
        setError(t('failed_to_fetch_orders'));
      }
    } catch (error) {
      setError(t('unexpected_error'));
    }
  }, [token, t]);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    fetchOrders();
  }, [user, navigate, fetchOrders]);

  const handleCheckStatus = async (orderId) => {
    setIsLoading(true);
    setError('');
    setPaymentStatus(null);

    try {
      const response = await apiService(`/api/payments/status/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.success) {
        setPaymentStatus(response.data);
      } else {
        setError(response.message || t('failed_to_check_status'));
      }
    } catch (error) {
      setError(t('unexpected_error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const order = orders.find((o) => o.orderNumber === orderNumber);
    if (!order) {
      setError(t('order_not_found'));
      return;
    }
    await handleCheckStatus(order.id);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h2 className="text-2xl font-bold mb-4">{t('please_login')}</h2>
        <button
          onClick={() => navigate('/signin')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          {t('login')}
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">{t('check_payment_status')}</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder={t('enter_order_number')}
            className="border px-4 py-2 rounded w-full md:w-1/2"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? t('checking') : t('check_status')}
          </button>
        </div>
      </form>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <h3 className="text-xl font-semibold mb-4">{t('your_orders')}</h3>
      {orders.length === 0 ? (
        <p>{t('no_orders_found')}</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border p-4 rounded-lg">
              <p>
                <strong>{t('order_number')}:</strong> {order.orderNumber}
              </p>
              <p>
                <strong>{t('status')}:</strong> {order.status}
              </p>
              <p>
                <strong>{t('total')}:</strong> {order.currency} {order.totalAmount.toFixed(2)}
              </p>
              <button
                onClick={() => handleCheckStatus(order.id)}
                disabled={isLoading}
                className={`mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {t('check_payment_status')}
              </button>
            </div>
          ))}
        </div>
      )}
      {paymentStatus && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">{t('payment_status_details')}</h3>
          <p>
            <strong>{t('order_number')}:</strong> {paymentStatus.orderNumber}
          </p>
          <p>
            <strong>{t('payment_number')}:</strong> {paymentStatus.paymentNumber}
          </p>
          <p>
            <strong>{t('status')}:</strong> {paymentStatus.status}
          </p>
          <p>
            <strong>{t('amount')}:</strong> {paymentStatus.currency} {paymentStatus.amount.toFixed(2)}
          </p>
          <p>
            <strong>{t('method')}:</strong> {paymentStatus.method}
          </p>
          {paymentStatus.gatewayTransactionId && (
            <p>
              <strong>{t('transaction_id')}:</strong> {paymentStatus.gatewayTransactionId}
            </p>
          )}
          {paymentStatus.processedAt && (
            <p>
              <strong>{t('processed_at')}:</strong>{' '}
              {new Date(paymentStatus.processedAt).toLocaleString()}
            </p>
          )}
          {paymentStatus.failureReason && (
            <p>
              <strong>{t('failure_reason')}:</strong> {paymentStatus.failureReason}
            </p>
          )}
          {paymentStatus.razorpayStatus && (
            <div>
              <h4 className="font-semibold mt-4">{t('razorpay_status')}</h4>
              <p>
                <strong>{t('status')}:</strong> {paymentStatus.razorpayStatus.status}
              </p>
              <p>
                <strong>{t('method')}:</strong> {paymentStatus.razorpayStatus.method}
              </p>
              <p>
                <strong>{t('captured')}:</strong>{' '}
                {paymentStatus.razorpayStatus.captured ? t('yes') : t('no')}
              </p>
              <p>
                <strong>{t('amount')}:</strong>{' '}
                {paymentStatus.razorpayStatus.currency}{' '}
                {paymentStatus.razorpayStatus.amount.toFixed(2)}
              </p>
              <p>
                <strong>{t('last_updated')}:</strong>{' '}
                {new Date(paymentStatus.razorpayStatus.last_updated).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderStatusPage;
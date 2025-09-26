import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../components/layout/apiService';
import { endpoints } from '../api/endpoints';

const TrackOrderPage = () => {
  const { orderNumber } = useParams();
  const location = useLocation();
  const { t } = useTranslation();
  const { token } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderNumber) {
        setLoading(false);
        setError(t('No order number provided'));
        return;
      }
      try {
        setLoading(true);
        const response = await apiService(endpoints.getOrderByNumber(orderNumber), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.success && response.data) {
          setOrder(response.data);
        } else {
          throw new Error(response.message || t('Could not find order details'));
        }
      } catch (err) {
        console.error('Fetch order error:', err);
        setError(err.message || t('Could not find order details'));
      } finally {
        setLoading(false);
      }
    };

    const passedOrder = location.state?.order;
    if (passedOrder) {
      setOrder(passedOrder);
      setLoading(false);
    } else {
      fetchOrderDetails();
    }
  }, [orderNumber, location.state, t, token]);

  // Status Timeline
  const statuses = ['pending', 'confirmed', 'shipped', 'delivered'];
  const currentStatusIndex = order ? statuses.indexOf(order.status) : -1;

  // Parse shippingAddress
  const shippingAddress = useMemo(() => {
    if (!order?.shippingAddress) return null;
    try {
      return JSON.parse(order.shippingAddress);
    } catch (e) {
      console.error('Failed to parse shipping address:', e);
      return null;
    }
  }, [order?.shippingAddress]);

  // Cancel Order
  const handleCancelOrder = async () => {
    if (!order || cancelLoading) return;
    if (!token) {
      setError(t('Please login to cancel'));
      return;
    }
    if (!['pending', 'confirmed'].includes(order.status)) {
      setError(t('order cannot be cancelled'));
      return;
    }
    setCancelLoading(true);
    try {
      console.log('Attempting to cancel order:', order.id, 'Endpoint:', endpoints.cancelOrder(order.id));
      const response = await apiService(endpoints.cancelOrder(order.id), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Cancel order response:', response);
      if (response.success) {
        setOrder((prev) => ({ ...prev, status: 'Cancelled' }));
      } else {
        throw new Error(response.message || t('Failed to cancel order'));
      }
    } catch (err) {
      console.error('Cancel order error:', err);
      setError(err.message || t('failed to cancel order'));
    } finally {
      setCancelLoading(false);
    }
  };

  // Generate Invoice
  const generateInvoice = async () => {
    if (!order) return;
    try {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(`Invoice for Order #${order.orderNumber}`, 20, 20);
        doc.setFontSize(12);
        doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 30);
        doc.text(`Total: ₹${parseFloat(order.totalAmount).toFixed(2)}`, 20, 40);
        if (shippingAddress) {
          doc.text('Shipping Address:', 20, 50);
          doc.text(`${shippingAddress.firstName} ${shippingAddress.lastName}`, 20, 60);
          doc.text(shippingAddress.addressLine1, 20, 70);
          doc.text(`${shippingAddress.city} - ${shippingAddress.postalCode}`, 20, 80);
          doc.text(shippingAddress.country, 20, 90);
        }
        doc.text('Items:', 20, 100);
        let y = 110;
        order.items.forEach((item) => {
          doc.text(
            `${item.productName} x ${item.quantity} - ₹${parseFloat(item.totalPrice).toFixed(2)}`,
            20,
            y
          );
          y += 10;
        });
        doc.save(`invoice_${order.orderNumber}.pdf`);
        document.body.removeChild(script);
      };
      script.onerror = () => {
        setError(t('Failed to load jspdf'));
      };
    } catch (err) {
      console.error('Invoice generation error:', err);
      setError(t('error generating invoice') + ': ' + err.message);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          {t('track your order')}
        </h1>

        {loading && <p className="text-center text-lg">{t('Loading order details')}</p>}
        {error && <p className="text-center text-red-500 text-lg">{error}</p>}

        {order && (
          <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-lg">
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h2>
                <p className="text-sm text-gray-500">
                  Placed on{' '}
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="mt-3 sm:mt-0 text-left sm:text-right">
                <p className="text-lg font-semibold text-gray-700">
                  Total: ₹{parseFloat(order.totalAmount).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Status Tracker Timeline */}
            <div className="mb-10">
              <div className="flex items-center justify-between">
                {statuses.map((status, index) => (
                  <React.Fragment key={status}>
                    <div className="flex flex-col items-center w-1/4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg transition-colors duration-300 ${
                          index <= currentStatusIndex ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span>&#10003;</span>
                      </div>
                      <p
                        className={`mt-2 text-xs sm:text-sm font-semibold text-center capitalize ${
                          index <= currentStatusIndex ? 'text-blue-600' : 'text-gray-500'
                        }`}
                      >
                        {status}
                      </p>
                    </div>
                    {index < statuses.length - 1 && (
                      <div
                        className={`flex-1 h-1 transition-colors duration-300 ${
                          index < currentStatusIndex ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      ></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Items */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Items in your order</h3>
              <div className="space-y-4">
                {order.items &&
                  order.items.map((item) => (
                    <div key={item.id} className="flex items-center bg-gray-50 p-4 rounded-lg">
                      <img
                        src={item.product?.image_1 || 'https://via.placeholder.com/100'}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded-md mr-4 shadow-sm"
                      />
                      <div className="flex-grow">
                        <p className="font-semibold text-gray-800">{item.productName}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-800">
                        ₹{parseFloat(item.totalPrice).toFixed(2)}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Address + Payment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-200 pt-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Shipping Address</h3>
                {shippingAddress ? (
                  <div className="text-gray-600 leading-relaxed">
                    <p className="font-bold">
                      {shippingAddress.firstName} {shippingAddress.lastName}
                    </p>
                    <p>{shippingAddress.addressLine1}</p>
                    <p>
                      {shippingAddress.city} - {shippingAddress.postalCode}
                    </p>
                    <p>{shippingAddress.country}</p>
                    <p>Phone: {shippingAddress.phone}</p>
                  </div>
                ) : (
                  <p>Address not available.</p>
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-800">
                      ₹{parseFloat(order.subtotal).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-gray-800">
                      ₹{parseFloat(order.shippingAmount).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">
                      ₹{parseFloat(order.totalAmount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex justify-end gap-4">
              {['pending', 'confirmed'].includes(order.status) && (
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelLoading}
                  className={`bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 ${
                    cancelLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {cancelLoading ? t('cancelling') : t('Cancel order')}
                </button>
              )}
              <button
                onClick={generateInvoice}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                {t('Download invoice')}
              </button>
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            to="/products"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105"
          >
            {t('Continue shopping')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;
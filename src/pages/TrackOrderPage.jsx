import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../components/layout/apiService';
import { endpoints } from '../api/endpoints';

const TrackOrderPage = () => {
  const { orderNumber: orderNumberFromParams } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { token } = useAuth();

  const [orderInput, setOrderInput] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async (orderNum) => {
      if (!orderNum) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await apiService(endpoints.getOrderByNumber(orderNum), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.success && response.data) {
          setOrder(response.data);
        } else {
          throw new Error(response.message || t('Could Not Find Order Details'));
        }
      } catch (err) {
        console.error('Fetch order error:', err);
        setError(err.message || t('Could Not Find Order Details'));
      } finally {
        setLoading(false);
      }
    };

    const passedOrder = location.state?.order;
    if (passedOrder) {
      setOrder(passedOrder);
      setLoading(false);
    } else if (orderNumberFromParams) {
      fetchOrderDetails(orderNumberFromParams);
    } else {
      setLoading(false);
    }
  }, [orderNumberFromParams, location.state, t, token]);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (orderInput.trim()) {
      navigate(`/track-order/${orderInput.trim()}`);
    }
  };

  const statuses = ['pending', 'confirmed', 'shipped', 'delivered'];
  const currentStatusIndex = order ? statuses.indexOf(order.status) : -1;

  const shippingAddress = useMemo(() => {
    if (!order?.shippingAddress) return null;
    try {
      return JSON.parse(order.shippingAddress);
    } catch (e) {
      console.error('Failed to parse shipping address:', e);
      return null;
    }
  }, [order?.shippingAddress]);

  const billingAddress = useMemo(() => {
    if (!order?.billingAddress) return null;
    try {
      return JSON.parse(order.billingAddress);
    } catch (e) {
      console.error('Failed to parse billing address:', e);
      return null;
    }
  }, [order?.billingAddress]);

  const handleCancelOrder = async () => {
    if (!order || cancelLoading) return;
    if (!token) {
      setError(t('Please Login To Cancel'));
      return;
    }
    if (!['pending', 'confirmed'].includes(order.status)) {
      setError(t('Order Can not Be Cancelled'));
      return;
    }
    setCancelLoading(true);
    try {
      const response = await apiService(endpoints.cancelOrder(order.id), {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.success) {
        navigate('/order-cancelled', {
          state: { orderNumber: order.orderNumber, message: t('Order Cancelled Success') },
        });
      } else {
        throw new Error(response.message || t('Failed To Cancel Order'));
      }
    } catch (err) {
      console.error('Cancel order error:', err);
      setError(err.message || t('Failed To Cancel Order'));
    } finally {
      setCancelLoading(false);
    }
  };

  const generateInvoice = async () => {
    if (!order) return;
    setInvoiceLoading(true);
    try {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.async = true;
      document.body.appendChild(script);
      script.onload = async () => {
        try {
          const autoTableScript = document.createElement('script');
          autoTableScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js';
          autoTableScript.async = true;
          document.body.appendChild(autoTableScript);
          autoTableScript.onload = () => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
              orientation: 'portrait',
              unit: 'mm',
              format: 'a4',
            });
            doc.setFont('helvetica');
            doc.setFontSize(20);
            doc.setTextColor(0, 0, 0);
            doc.text('ShopZeo', 20, 20);
            doc.setFontSize(10);
            doc.text('123 Commerce Street, Bangalore, India', 20, 28);
            doc.text('Email: support@shopzeo.com | Phone: +91-123-456-7890', 20, 34);
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text(`Invoice #${order.orderNumber}`, 140, 20, { align: 'right' });
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text(`Order Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, 140, 28, { align: 'right' });
            doc.text(`Invoice Date: ${new Date().toLocaleDateString('en-IN')}`, 140, 34, { align: 'right' });
            let yOffset = 40;
            doc.autoTable({
              startY: yOffset,
              head: [['Item', 'Quantity', 'Unit Price', 'Total']],
              body: (order.items || []).map((item) => [
                item.productName || 'Unknown Product',
                item.quantity || 0,
                `₹${parseFloat(item.unitPrice || item.totalPrice / (item.quantity || 1)).toFixed(2)}`,
                `₹${parseFloat(item.totalPrice || 0).toFixed(2)}`,
              ]),
            });
            doc.save(`invoice_${order.orderNumber}.pdf`);
            document.body.removeChild(autoTableScript);
            document.body.removeChild(script);
          };
          autoTableScript.onerror = () => setError(t('Failed To Load Autotable'));
        } catch (err) {
          setError(t('Error Generating Invoice') + ': ' + err.message);
        }
      };
      script.onerror = () => setError(t('failedToLoadJspdf'));
    } catch (err) {
      setError(t('Error Generating Invoice') + ': ' + err.message);
    } finally {
      setInvoiceLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          {t('Track Your Order')}
        </h1>

        {!orderNumberFromParams && !order && (
          <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
            <form onSubmit={handleTrackSubmit}>
              <label htmlFor="order-number-input" className="block text-sm font-medium text-gray-700 mb-2">
                {t('enter_order_id')}
              </label>
              <div className="flex gap-2">
                <input
                  id="order-number-input"
                  type="text"
                  value={orderInput}
                  onChange={(e) => setOrderInput(e.target.value)}
                  placeholder="Enter your order number"
                  className="flex-grow border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
                >
                  {t('track_order')}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading && <p className="text-center text-lg">{t('loadingOrderDetails')}</p>}
        {error && <p className="text-center text-red-500 text-lg">{error}</p>}

        {order && (
          <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-lg">
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

            <div className="mb-10">
              <div className="flex items-center justify-between">
                {statuses.map((status, index) => (
                  <React.Fragment key={status}>
                    <div className="flex flex-col items-center w-1/4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg transition-colors duration-300 ${index <= currentStatusIndex ? 'bg-blue-600' : 'bg-gray-300'}`}>
                        <span>&#10003;</span>
                      </div>
                      <p className={`mt-2 text-xs sm:text-sm font-semibold text-center capitalize ${index <= currentStatusIndex ? 'text-blue-600' : 'text-gray-500'}`}>
                        {status}
                      </p>
                    </div>
                    {index < statuses.length - 1 && (
                      <div className={`flex-1 h-1 transition-colors duration-300 ${index < currentStatusIndex ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

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
            <div className="mt-8 flex justify-end gap-4">
              {['pending', 'confirmed'].includes(order.status) && (
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelLoading}
                  className={`bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 ${cancelLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {cancelLoading ? t('cancelling') : t('Cancel Order')}
                </button>
              )}
              <button
                onClick={generateInvoice}
                disabled={invoiceLoading}
                className={`bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 ${invoiceLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {invoiceLoading ? t('Generating Invoice') : t('Download Invoice')}
              </button>
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            to="/products"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105"
          >
            {t('Continue Shopping')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;
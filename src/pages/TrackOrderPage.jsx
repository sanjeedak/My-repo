import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../components/layout/apiService';
import { endpoints } from '../api/endpoints';

const TrackOrderPage = () => {
  const { orderNumber } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { token } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderNumber) {
        setLoading(false);
        setError(t('noOrderNumberProvided'));
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
          throw new Error(response.message || t('couldNotFindOrderDetails'));
        }
      } catch (err) {
        console.error('Fetch order error:', err);
        setError(err.message || t('couldNotFindOrderDetails'));
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

  // Parse billingAddress (if available)
  const billingAddress = useMemo(() => {
    if (!order?.billingAddress) return null;
    try {
      return JSON.parse(order.billingAddress);
    } catch (e) {
      console.error('Failed to parse billing address:', e);
      return null;
    }
  }, [order?.billingAddress]);

  // Cancel Order
  const handleCancelOrder = async () => {
    if (!order || cancelLoading) return;
    if (!token) {
      setError(t('pleaseLoginToCancel'));
      return;
    }
    if (!['pending', 'confirmed'].includes(order.status)) {
      setError(t('orderCannotBeCancelled'));
      return;
    }
    setCancelLoading(true);
    try {
      console.log('Attempting to cancel order:', order.id, 'Endpoint:', endpoints.cancelOrder(order.id));
      const response = await apiService(endpoints.cancelOrder(order.id), {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Cancel order response:', response);
      if (response.success) {
        navigate('/order-cancelled', {
          state: { orderNumber, message: t('orderCancelledSuccess') },
        });
      } else {
        throw new Error(response.message || t('failedToCancelOrder'));
      }
    } catch (err) {
      console.error('Cancel order error:', err);
      setError(err.message || t('failedToCancelOrder'));
    } finally {
      setCancelLoading(false);
    }
  };

  // Generate Invoice
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

            // Company Branding
            doc.setFont('helvetica');
            doc.setFontSize(20);
            doc.setTextColor(0, 0, 0);
            doc.text('ShopZeo', 20, 20);
            doc.setFontSize(10);
            doc.text('123 Commerce Street, Bangalore, India', 20, 28);
            doc.text('Email: support@shopzeo.com | Phone: +91-123-456-7890', 20, 34);

            // Invoice Header
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text(`Invoice #${order.orderNumber}`, 140, 20, { align: 'right' });
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text(`Order Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, 140, 28, { align: 'right' });
            doc.text(`Invoice Date: ${new Date().toLocaleDateString('en-IN')}`, 140, 34, { align: 'right' });

            // Addresses
            let yOffset = 40;
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Billing Address:', 20, yOffset);
            doc.setFont('helvetica', 'normal');
            yOffset += 6;
            if (billingAddress) {
              doc.text(`${billingAddress.firstName || ''} ${billingAddress.lastName || ''}`.trim(), 20, yOffset);
              yOffset += 6;
              doc.text(billingAddress.addressLine1 || '', 20, yOffset);
              yOffset += 6;
              doc.text(`${billingAddress.city || ''} - ${billingAddress.postalCode || ''}`.trim(), 20, yOffset);
              yOffset += 6;
              doc.text(billingAddress.country || '', 20, yOffset);
              yOffset += 6;
              doc.text(`Phone: ${billingAddress.phone || ''}`, 20, yOffset);
            } else {
              doc.text('Same as shipping address', 20, yOffset);
              yOffset += 6;
            }
            yOffset += 6;

            doc.setFont('helvetica', 'bold');
            doc.text('Shipping Address:', 20, yOffset);
            doc.setFont('helvetica', 'normal');
            yOffset += 6;
            if (shippingAddress) {
              doc.text(`${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim(), 20, yOffset);
              yOffset += 6;
              doc.text(shippingAddress.addressLine1 || '', 20, yOffset);
              yOffset += 6;
              doc.text(`${shippingAddress.city || ''} - ${shippingAddress.postalCode || ''}`.trim(), 20, yOffset);
              yOffset += 6;
              doc.text(shippingAddress.country || '', 20, yOffset);
              yOffset += 6;
              doc.text(`Phone: ${shippingAddress.phone || ''}`, 20, yOffset);
            } else {
              doc.text('Not available', 20, yOffset);
            }
            yOffset += 10;

            // Items Table
            doc.autoTable({
              startY: yOffset,
              head: [['Item', 'Quantity', 'Unit Price', 'Total']],
              body: (order.items || []).map((item) => [
                item.productName || 'Unknown Product',
                item.quantity || 0,
                `₹${parseFloat(item.unitPrice || item.totalPrice / (item.quantity || 1)).toFixed(2)}`,
                `₹${parseFloat(item.totalPrice || 0).toFixed(2)}`,
              ]),
              styles: { fontSize: 10, cellPadding: 3, halign: 'left', valign: 'middle' },
              headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255], fontSize: 12, halign: 'center' },
              alternateRowStyles: { fillColor: [245, 245, 245] },
              margin: { left: 20, right: 20 },
              didDrawPage: (data) => {
                if (data.pageNumber < doc.internal.getNumberOfPages()) {
                  yOffset = 20;
                }
              },
            });
            yOffset = doc.lastAutoTable.finalY + 10;

            // Payment Summary
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Payment Summary:', 20, yOffset);
            doc.setFont('helvetica', 'normal');
            yOffset += 6;
            doc.text(`Subtotal: ₹${parseFloat(order.subtotal || 0).toFixed(2)}`, 20, yOffset);
            yOffset += 6;
            doc.text(`Shipping: ₹${parseFloat(order.shippingAmount || 0).toFixed(2)}`, 20, yOffset);
            yOffset += 6;
            doc.setFont('helvetica', 'bold');
            doc.text(`Total: ₹${parseFloat(order.totalAmount || 0).toFixed(2)}`, 20, yOffset);
            yOffset += 10;

            // Footer
            doc.setFontSize(10);
            doc.setFont('helvetica', 'italic');
            doc.text('Thank you for shopping with ShopZeo!', 20, yOffset);
            yOffset += 6;
            doc.text('For support, contact: support@shopzeo.com', 20, yOffset);

            // Add page numbers
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
              doc.setPage(i);
              doc.text(`Page ${i} of ${pageCount}`, 200, 290, { align: 'right' });
            }

            doc.save(`invoice_${order.orderNumber}.pdf`);
            document.body.removeChild(autoTableScript);
            document.body.removeChild(script);
          };
          autoTableScript.onerror = () => setError(t('failedToLoadAutotable'));
        } catch (err) {
          console.error('Invoice generation error (autoTable):', err);
          setError(t('errorGeneratingInvoice') + ': ' + err.message);
        }
      };
      script.onerror = () => setError(t('failedToLoadJspdf'));
    } catch (err) {
      console.error('Invoice generation error (jsPDF):', err);
      setError(t('errorGeneratingInvoice') + ': ' + err.message);
    } finally {
      setInvoiceLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          {t('trackYourOrder')}
        </h1>

        {loading && <p className="text-center text-lg">{t('loadingOrderDetails')}</p>}
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

            {/* Status Timeline */}
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
                  {cancelLoading ? t('cancelling') : t('cancelOrder')}
                </button>
              )}
              <button
                onClick={generateInvoice}
                disabled={invoiceLoading}
                className={`bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 ${
                  invoiceLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {invoiceLoading ? t('generatingInvoice') : t('downloadInvoice')}
              </button>
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            to="/products"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105"
          >
            {t('continueShopping')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;
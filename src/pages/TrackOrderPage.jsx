import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiService } from '../components/layout/apiService';
import { endpoints } from '../api/endpoints'; // endpoints ko import karein

const TrackOrderPage = () => {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('id') || '');
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchOrderDetails = async (idToFetch) => {
    if (!idToFetch) return;

    setLoading(true);
    setError('');
    setOrderDetails(null);

    try {
      // UPDATED: Sahi endpoint function ka istemal kiya gaya hai
      const data = await apiService(endpoints.getOrderByNumber(idToFetch));
      
      if (data && data.success) {
        // API response ke structure ke hisaab se data.data.order use karein
        setOrderDetails(data.data.order); 
      } else {
        throw new Error(data.message || 'Order not found.');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch order details.');
      setOrderDetails(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const orderIdFromUrl = searchParams.get('id');
    if (orderIdFromUrl) {
      fetchOrderDetails(orderIdFromUrl);
    }
  }, [searchParams]);

  const handleTrackOrder = (e) => {
    e.preventDefault();
    if (!orderId.trim()) {
      setError('Please enter an order ID.');
      return;
    }
    fetchOrderDetails(orderId.trim());
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-800">Track Your Order</h1>
            <p className="mt-2 text-gray-500">Enter your order ID below to see its status and track its progress.</p>
          </div>
          
          <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row items-center gap-2 mb-8">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter your order ID"
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg px-4 py-3"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-blue-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {loading ? 'Searching...' : 'Track Order'}
            </button>
          </form>

          {error && <p className="text-center text-red-500 bg-red-50 p-3 rounded-md">{error}</p>}

          {loading && <div className="text-center text-gray-500">Loading order details...</div>}

          {orderDetails && (
            <div className="border-t pt-6">
              <h3 className="text-2xl font-bold mb-4 text-slate-700">Order Details</h3>
              <div className="space-y-3 text-gray-600">
                <p><strong>Order ID:</strong> {orderDetails.orderNumber}</p>
                <p><strong>Status:</strong> <span className="font-semibold text-green-600">{orderDetails.status}</span></p>
                <p><strong>Estimated Delivery:</strong> {orderDetails.estimatedDelivery || 'Not available'}</p>
                
                <h4 className="font-bold text-slate-700 pt-4">Items:</h4>
                <ul className="list-disc list-inside pl-2">
                  {orderDetails.items && orderDetails.items.map((item, index) => (
                    <li key={index}>
                      {item.name} (x{item.quantity})
                    </li>
                  ))}
                </ul>

                <h4 className="font-bold text-slate-700 pt-4">Tracking History:</h4>
                <ol className="relative border-l border-gray-200 ml-2">
                  {orderDetails.trackingHistory?.map((event, index) => (
                    <li key={index} className="mb-6 ml-4">
                      <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white"></div>
                      <time className="mb-1 text-sm font-normal leading-none text-gray-400">{event.date}</time>
                      <h3 className="text-lg font-semibold text-gray-900">{event.status}</h3>
                      <p className="text-base font-normal text-gray-500">{event.location}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;
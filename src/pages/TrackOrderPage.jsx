import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiService } from '../components/layout/apiService'; // Apne project ke path ke anusaar badlein
import { endpoints } from '../api/endpoints'; // Apne project ke path ke anusaar badlein

const TrackOrderPage = () => {
    const { orderNumber } = useParams();
    const location = useLocation();
    const { t } = useTranslation();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderNumber) {
                setLoading(false);
                setError('No order number provided.');
                return;
            }
            try {
                setLoading(true);
                const response = await apiService(endpoints.getOrderByNumber(orderNumber));
                if (response.success && response.data) {
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
        
        const passedOrder = location.state?.order;
        if (passedOrder) {
            setOrder(passedOrder);
            setLoading(false);
        } else {
            fetchOrderDetails();
        }
    }, [orderNumber, location.state]);

    // Status Timeline ke liye
    const statuses = ['pending', 'confirmed', 'shipped', 'delivered'];
    const currentStatusIndex = order ? statuses.indexOf(order.status) : -1;

    // shippingAddress string ko JSON object mein convert karein
    const shippingAddress = useMemo(() => {
        if (!order?.shippingAddress) return null;
        try {
            return JSON.parse(order.shippingAddress);
        } catch (e) {
            console.error("Failed to parse shipping address:", e);
            return null;
        }
    }, [order?.shippingAddress]);


    return (
        <div className="bg-gray-100 min-h-screen py-10">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">{t('track_your_order')}</h1>
                
                {loading && <p className="text-center text-lg">{t('loading_order_details')}</p>}
                {error && <p className="text-center text-red-500 text-lg">{error}</p>}
                
                {order && (
                    <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-lg">

                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h2>
                                <p className="text-sm text-gray-500">
                                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                            <div className="mt-3 sm:mt-0 text-left sm:text-right">
                                <p className="text-lg font-semibold text-gray-700">Total: ₹{parseFloat(order.totalAmount).toFixed(2)}</p>
                            </div>
                        </div>

                        {/* Status Tracker Timeline */}
                        <div className="mb-10">
                            <div className="flex items-center justify-between">
                                {statuses.map((status, index) => (
                                    <React.Fragment key={status}>
                                        <div className="flex flex-col items-center w-1/4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg transition-colors duration-300 ${index <= currentStatusIndex ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                                <span>&#10003;</span>
                                            </div>
                                            <p className={`mt-2 text-xs sm:text-sm font-semibold text-center capitalize ${index <= currentStatusIndex ? 'text-blue-600' : 'text-gray-500'}`}>{status}</p>
                                        </div>
                                        {index < statuses.length - 1 && (
                                            <div className={`flex-1 h-1 transition-colors duration-300 ${index < currentStatusIndex ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                        
                        {/* Items in Order */}
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Items in your order</h3>
                            <div className="space-y-4">
                                {order.items && order.items.map(item => (
                                    <div key={item.id} className="flex items-center bg-gray-50 p-4 rounded-lg">
                                        {/* CHANGE: Image 'item.product?.image_1' se aa rahi hai */}
                                        <img src={item.product?.image_1 || 'https://via.placeholder.com/100'} alt={item.productName} className="w-16 h-16 object-cover rounded-md mr-4 shadow-sm" />
                                        <div className="flex-grow">
                                            {/* CHANGE: Product ka naam 'item.productName' se aa raha hai */}
                                            <p className="font-semibold text-gray-800">{item.productName}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        {/* CHANGE: Total price 'item.totalPrice' se aa raha hai */}
                                        <p className="font-semibold text-gray-800">₹{parseFloat(item.totalPrice).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Address and Payment Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-200 pt-8">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Shipping Address</h3>
                                {/* CHANGE: Parsed address ka istemal kiya gaya hai */}
                                {shippingAddress ? (
                                    <div className="text-gray-600 leading-relaxed">
                                        <p className="font-bold">{shippingAddress.firstName} {shippingAddress.lastName}</p>
                                        <p>{shippingAddress.addressLine1}</p>
                                        <p>{shippingAddress.city} - {shippingAddress.postalCode}</p>
                                        <p>{shippingAddress.country}</p>
                                        <p>Phone: {shippingAddress.phone}</p>
                                    </div>
                                ) : <p>Address not available.</p>}
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Summary</h3>
                                <div className="space-y-2">
                                    {/* CHANGE: API se subtotal, shipping, aur total amount aa raha hai */}
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-semibold text-gray-800">₹{parseFloat(order.subtotal).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-semibold text-gray-800">₹{parseFloat(order.shippingAmount).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-2 mt-2">
                                        <span className="text-lg font-bold text-gray-900">Total</span>
                                        <span className="text-lg font-bold text-gray-900">₹{parseFloat(order.totalAmount).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}

                <div className="text-center mt-8">
                    <Link to="/products" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105">
                        {t('continue_shopping')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TrackOrderPage;
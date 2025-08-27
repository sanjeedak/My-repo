import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccessPage = () => {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <div className="bg-white p-10 rounded-lg shadow max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Order Placed Successfully!</h1>
        <p className="text-gray-700 mb-6">
          Thank you for shopping with us. Your order has been placed and is being processed.
        </p>
        <Link
          to="/products"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;

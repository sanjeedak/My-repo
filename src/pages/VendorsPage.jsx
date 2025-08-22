// src/pages/VendorsPage.jsx

import React, { useEffect, useState } from 'react';

const FAKE_VENDOR_API = 'https://dummyjson.com/users?limit=9'; // Simulated vendor list

const VendorsPage = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await fetch(FAKE_VENDOR_API);
        const data = await res.json();

        const formatted = data.users.map((user) => ({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          company: user.company?.name || 'Independent Seller',
          email: user.email,
          image: user.image || `https://i.pravatar.cc/150?u=${user.id}`,
          phone: user.phone,
        }));

        setVendors(formatted);
      } catch (err) {
        console.error('Error fetching vendors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-yellow-800 text-center mb-10">Trusted Vendors</h1>

        {loading ? (
          <div className="text-center text-gray-500 text-lg">Loading vendors...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {vendors.map((vendor) => (
              <div
                key={vendor.id}
                className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center text-center"
              >
                <img
                  src={vendor.image}
                  alt={vendor.name}
                  className="h-20 w-20 rounded-full object-cover mb-4 border-2 border-yellow-400"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/80x80?text=Vendor';
                  }}
                />
                <h2 className="text-lg font-bold text-gray-800">{vendor.name}</h2>
                <p className="text-sm text-gray-500">{vendor.company}</p>
                <p className="text-xs text-gray-500 mt-1">{vendor.email}</p>
                <p className="text-xs text-gray-500">{vendor.phone}</p>
                <button className="mt-4 text-sm bg-yellow-600 text-white px-4 py-2 rounded-full hover:bg-yellow-700 transition-colors">
                  View Products
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorsPage;

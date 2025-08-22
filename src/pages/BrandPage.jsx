import React, { useEffect, useState } from 'react';

const FAKE_BRAND_API = 'https://dummyjson.com/products?limit=6'; // Simulated product brands

const BrandPage = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulated API call
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch(FAKE_BRAND_API);
        const data = await res.json();

        // Transform fake products into brand-style cards
        const formatted = data.products.map((item) => ({
          name: item.brand || item.title.split(' ')[0],
          logo: item.thumbnail,
          description: item.description.slice(0, 80) + '...',
        }));

        setBrands(formatted);
      } catch (err) {
        console.error('Error fetching brand data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-purple-900 text-center mb-12">Top Brands</h1>

        {loading ? (
          <div className="text-center text-gray-500 text-lg">Loading brands...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {brands.map((brand, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center text-center"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-16 w-16 object-contain mb-4"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/64x64?text=Brand';
                  }}
                />
                <h2 className="text-xl font-semibold text-gray-800">{brand.name}</h2>
                <p className="text-sm text-gray-600 mt-2">{brand.description}</p>
                <button className="mt-4 bg-purple-700 text-white text-sm px-4 py-2 rounded-full hover:bg-purple-800 transition-colors">
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

export default BrandPage;

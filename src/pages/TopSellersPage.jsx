import React, { useEffect, useState } from 'react';
import ProductCard from '../components/products/ProductCard'; // Corrected path
import { apiService } from '../components/layout/apiService'; // Corrected path
import { endpoints } from '../api/endpoints'; // Import endpoints

const TopSellersPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopSellers = async () => {
      try {
        // UPDATED: Use the centralized endpoints object
        const data = await apiService(endpoints.topSellers);
        setProducts(data.products); // assuming response format: { success: true, products: [...] }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSellers();
  }, []);

  if (loading) return <p>Loading top sellers...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Top Selling Products</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(product => (
            <ProductCard key={product.id} product={product} />
        ))}
        </div>
    </div>
  );
};

export default TopSellersPage;

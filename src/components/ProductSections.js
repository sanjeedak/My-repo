import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { StarIcon } from '../assets/icons';

// ProductCard: adapted for fakestore API (image is string, add random discount)
const addMockDiscount = (product) => {
  if (Math.random() > 0.5) {
    product.originalPrice = product.price * 1.2;
    product.discount = 15;
  }
  return product;
};

// FlashDeal
const FlashDeal = () => {
  const [flashProducts, setFlashProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products?limit=4')
      .then(res => res.json())
      .then(data => {
        setFlashProducts(data.map(addMockDiscount));
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching flash deals:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6">Loading Flash Deals...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">FLASH DEAL</h2>
        <a href="#" className="text-sm text-blue-600 hover:underline">View All &gt;</a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-1 bg-blue-600 text-white rounded-lg p-6 flex flex-col justify-center text-center">
          <h3 className="font-semibold">Hurry Up! The offer is limited.</h3>
          <div className="grid grid-cols-4 gap-2 my-4">
            <div className="bg-white text-blue-600 rounded p-2"><div className="text-2xl font-bold">864</div><div className="text-xs">Days</div></div>
            <div className="bg-white text-blue-600 rounded p-2"><div className="text-2xl font-bold">22</div><div className="text-xs">Hours</div></div>
            <div className="bg-white text-blue-600 rounded p-2"><div className="text-2xl font-bold">51</div><div className="text-xs">Mins</div></div>
            <div className="bg-white text-blue-600 rounded p-2"><div className="text-2xl font-bold">23</div><div className="text-xs">Secs</div></div>
          </div>
        </div>
        <div className="md:col-span-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {flashProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
};

// FeaturedProducts
const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products?limit=6')
      .then(res => res.json())
      .then(data => {
        setFeaturedProducts(data.map(addMockDiscount));
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching featured products:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6">Loading Featured Products...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Featured products</h2>
        <a href="/products" className="text-sm text-blue-600 hover:underline">View All &gt;</a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
};

export { FlashDeal, FeaturedProducts };
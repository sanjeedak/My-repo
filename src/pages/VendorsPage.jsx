import React, { useEffect, useState } from 'react';
import { apiService } from '../components/layout/apiService';
import SellerCard from '../components/SellerCard'; // Using the existing SellerCard component

// A skeleton that matches the SellerCard design
const SellerCardSkeleton = () => (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex animate-pulse items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gray-200"></div>
            <div className="flex-1 space-y-2">
                <div className="h-5 w-3/4 rounded bg-gray-200"></div>
                <div className="h-4 w-1/2 rounded bg-gray-200"></div>
            </div>
        </div>
        <div className="mt-4 flex h-16 justify-between rounded-lg bg-gray-200 p-3"></div>
    </div>
);


const VendorsPage = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStores = async () => {
        try {
            const data = await apiService('/stores');
            if (data.success && Array.isArray(data.data.stores)) {
                setStores(data.data.stores);
            } else {
                throw new Error('Could not retrieve store data.');
            }
        } catch (err) {
            setError('Failed to fetch stores. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    fetchStores();
  }, []);

  return (
    <div className="bg-slate-50 py-12 min-h-screen">
        <div className="container mx-auto px-4">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-800">
                  Our Trusted Stores
                </h1>
                <p className="mt-2 text-gray-500">
                  Explore products from our curated list of top-rated stores.
                </p>
            </div>
            
            {error && (
                <div className="text-center text-red-500 font-semibold bg-red-50 p-4 rounded-md">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    Array.from({ length: 6 }).map((_, i) => <SellerCardSkeleton key={i} />)
                ) : (
                    stores.map(store => <SellerCard key={store.id} seller={store} />)
                )}
            </div>
        </div>
    </div>
  );
};

export default VendorsPage;


import React, { useEffect, useState } from 'react';
import { apiService } from '../../../api/apiService';
import SellerCard from '../components/SellerCard'; // Use the new component

// A skeleton that matches the new SellerCard design
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
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVendors = async () => {
        try {
            const data = await apiService('/sellers');
            if (data.success && Array.isArray(data.data.sellers)) {
                setVendors(data.data.sellers);
            } else {
                throw new Error('Could not retrieve vendor data.');
            }
        } catch (err) {
            setError('Failed to fetch vendors. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    fetchVendors();
  }, []);

  return (
    <div className="bg-slate-50 py-12 min-h-screen">
        <div className="container mx-auto px-4">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-800">
                  Our Trusted Sellers
                </h1>
                <p className="mt-2 text-gray-500">
                  Explore products from our curated list of top-rated vendors.
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
                    vendors.map(seller => <SellerCard key={seller.id} seller={seller} />)
                )}
            </div>
        </div>
    </div>
  );
};

export default VendorsPage;
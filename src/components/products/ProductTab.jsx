import React, { useState } from 'react';
import { StarIcon } from '../../assets/icons'; // Assuming you have a shared StarIcon

const ProductTabs = ({ description, specifications = [], reviews = [] }) => {
    const [activeTab, setActiveTab] = useState('description');

    const renderSpecifications = () => {
        if (specifications.length === 0) {
            return <p className="text-gray-500">No specifications available for this product.</p>;
        }
        return (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <tbody>
                        {specifications.map((spec, index) => (
                            <tr key={index} className="bg-white border-b last:border-b-0">
                                <th scope="row" className="px-6 py-3 font-medium text-gray-900 bg-gray-50 w-1/3">
                                    {spec.name}
                                </th>
                                <td className="px-6 py-3">
                                    {spec.value}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };
    
    const renderReviews = () => {
        if (reviews.length === 0) {
            return <p className="text-gray-500">There are no reviews for this product yet.</p>;
        }
        return (
            <div className="space-y-6">
                {reviews.map((review) => (
                    <div key={review.id} className="flex space-x-4 border-b pb-4 last:border-b-0">
                        <img src={review.author_avatar || 'https://placehold.co/48x48?text=User'} alt={review.author} className="w-12 h-12 rounded-full" />
                        <div>
                            <h4 className="font-semibold">{review.author}</h4>
                            <div className="flex items-center my-1">
                                {[...Array(5)].map((_, i) => (
                                    <StarIcon key={i} filled={i < review.rating} />
                                ))}
                            </div>
                            <p className="text-gray-600 text-sm">{review.comment}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white border border-gray-200 rounded-md">
            <div className="border-b">
                <nav className="flex space-x-2 px-4">
                    <button
                        onClick={() => setActiveTab('description')}
                        className={`py-3 px-4 font-semibold border-b-2 transition-colors ${
                            activeTab === 'description' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-700'
                        }`}
                    >
                        Description
                    </button>
                     <button
                        onClick={() => setActiveTab('specifications')}
                        className={`py-3 px-4 font-semibold border-b-2 transition-colors ${
                            activeTab === 'specifications' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-700'
                        }`}
                    >
                        Specifications
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`py-3 px-4 font-semibold border-b-2 transition-colors ${
                            activeTab === 'reviews' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-700'
                        }`}
                    >
                        Reviews
                    </button>
                </nav>
            </div>
            <div className="p-6">
                {activeTab === 'description' && (
                    <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: description || 'No description available.' }} />
                )}
                 {activeTab === 'specifications' && renderSpecifications()}
                {activeTab === 'reviews' && renderReviews()}
            </div>
        </div>
    );
};

export default ProductTabs;
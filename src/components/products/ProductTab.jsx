import React, { useState } from "react";

const ProductTabs = ({ description, specifications = [], reviews = [] }) => {
  const [activeTab, setActiveTab] = useState("description");

  const renderSpecifications = () => {
    if (specifications.length === 0) {
      return (
        <p className="text-gray-500 text-sm">
          No specifications available for this product.
        </p>
      );
    }
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
          <tbody>
            {specifications.map((spec, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } border-b last:border-b-0`}
              >
                <th
                  scope="row"
                  className="px-4 py-2 font-medium text-gray-900 w-1/3"
                >
                  {spec.name}
                </th>
                <td className="px-4 py-2 text-gray-700">{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderReviews = () => {
    if (reviews.length === 0) {
      return (
        <p className="text-gray-500 text-sm">
          There are no reviews for this product yet.
        </p>
      );
    }
    return (
      <div className="space-y-5">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="flex space-x-4 bg-gray-50 rounded-lg p-4 shadow-sm"
          >
            <img
              src={
                review.author_avatar ||
                "https://placehold.co/48x48?text=User"
              }
              alt={review.author}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800">
                {review.author}
              </h4>
              <div className="flex items-center my-1">
                {/* You can re-import StarIcon if you intend to use it here */}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {review.comment}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      {/* Tabs */}
      <div className="border-b">
        <nav className="flex flex-wrap gap-2 px-3 py-2">
          {["description", "specifications", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === "description" && (
          <div
            className="prose max-w-none text-gray-700 text-sm"
            dangerouslySetInnerHTML={{
              __html: description || "No description available.",
            }}
          />
        )}
        {activeTab === "specifications" && renderSpecifications()}
        {activeTab === "reviews" && renderReviews()}
      </div>
    </div>
  );
};

export default ProductTabs;
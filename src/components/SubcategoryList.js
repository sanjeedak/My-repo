import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react"; // Using an icon for better UI

const SubcategoryList = ({ categorySlug, categoryName, subcategories }) => {
  return (
    <div className="p-4">
      {/* Main Category Header Link */}
      <Link to={`/category/${categorySlug}`} className="block mb-4 group">
        <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
          {categoryName}
        </h3>
        <p className="text-sm text-blue-600 group-hover:underline">
          View all in this category →
        </p>
      </Link>

      {/* Subcategory Grid */}
      <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
        {subcategories.map((sub) => (
          <li key={sub.id}>
            <Link
              to={`/category/${sub.slug}`}
              className="flex items-center text-sm text-gray-600 hover:text-blue-600 hover:font-semibold transition-all duration-200 group"
            >
              <ChevronRight className="w-4 h-4 mr-2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200 flex-shrink-0" />
              <span>{sub.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubcategoryList;

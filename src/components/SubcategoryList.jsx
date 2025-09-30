import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const SubcategoryList = ({ categorySlug, categoryName, subcategories }) => {
  return (
    <div className="p-4">
      {/* Main Category Title */}
      <Link to={`/category/${categorySlug}`} className="block mb-4 group">
        <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
          {categoryName}
        </h3>
        <p className="text-xs text-blue-600 group-hover:underline">
          View all in this category →
        </p>
      </Link>

      {/* Horizontal Separator */}
      <hr className="my-4 border-gray-100" />

      {/* Subcategories Grid */}
      <div className="grid grid-cols-3 gap-x-6 gap-y-4">
        {(subcategories || []).map((sub) => (
          <div key={sub.id} className="border-r border-gray-100 pr-6 last:border-r-0 last:pr-0">
            {/* Subcategory Title */}
            <Link
              to={`/category/${sub.slug}`} 
              className="font-semibold text-sm text-gray-700 hover:text-blue-600 hover:underline mb-2 block"
            >
              {sub.name}
            </Link>
            
            {/* Sub-Subcategories List */}
            {sub.subcategories && sub.subcategories.length > 0 && (
              <ul className="space-y-1.5 pl-1 border-l-2 border-gray-100">
                {sub.subcategories.map((subSub) => (
                  <li key={subSub.id}>
                    <Link
                      to={`/category/${subSub.slug}`} 
                      className="flex items-center text-xs text-gray-500 hover:text-blue-600"
                    >
                       <ChevronRight className="w-3 h-3 mr-1.5 flex-shrink-0" />
                      <span>{subSub.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};  

export default SubcategoryList;


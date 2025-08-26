// src/components/SubcategoryList.js
import React from 'react';
import { Link } from 'react-router-dom';

const SubcategoryList = ({ categorySlug, subcategories }) => {
  return (
    <ul className="absolute left-full top-0 bg-white border border-gray-200 rounded-lg shadow-md mt-[-1px] ml-2 py-2 w-56 z-20">
      {subcategories && subcategories.length > 0 ? (
        subcategories.map((subcategory) => (
          <li key={subcategory.id} className="hover:bg-blue-50 transition-colors duration-200">
            <Link
              // --- MODIFIED LINE ---
              // This now creates a URL like: /products?category_id=350&data_from=category
              to={`/products?category_id=${subcategory.id}&data_from=category`}
              className="block w-full px-4 py-2 text-sm text-gray-700 text-left font-medium hover:text-blue-600"
            >
              {subcategory.name}
            </Link>
          </li>
        ))
      ) : (
        <li className="px-4 py-2 text-sm text-gray-500">No subcategories</li>
      )}
    </ul>
  );
};

export default SubcategoryList;
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubcategoryList = ({ category, subcategories }) => {
  const navigate = useNavigate();

  const handleSubcategoryClick = (subcategory) => {
    navigate(`/products/${encodeURIComponent(category)}/${encodeURIComponent(subcategory)}`);
  };

  return (
    <ul className="absolute left-full top-0 bg-white border border-gray-200 rounded-lg shadow-md mt-[-8px] ml-2 py-2 w-48 z-10">
      {subcategories && subcategories.length > 0 ? (
        subcategories.map((subcategory, index) => (
          <li key={index} className="px-4 py-1 hover:bg-gray-100 transition-colors duration-200">
            <button
              onClick={() => handleSubcategoryClick(subcategory)}
              className="w-full text-sm text-gray-700 text-left font-medium hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`View ${subcategory} under ${category}`}
            >
              {subcategory}
            </button>
          </li>
        ))
      ) : (
        <li className="px-4 py-1 text-sm text-gray-500">No subcategories available</li>
      )}
    </ul>
  );
};

export default SubcategoryList;
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Now expects categorySlug (string) and subcategories (array of objects)
const SubcategoryList = ({ categorySlug, subcategories }) => {
  const navigate = useNavigate();

  // Navigate using the subcategory's slug for a clean URL
  const handleSubcategoryClick = (subcategory) => {
    // Example URL: /products/electronics/laptops
    navigate(`/products/${categorySlug}/${subcategory.slug}`);
  };

  return (
    <ul className="absolute left-full top-0 bg-white border border-gray-200 rounded-lg shadow-md mt-[-8px] ml-2 py-2 w-48 z-10">
      {subcategories && subcategories.length > 0 ? (
        // Map over array of objects, using id for key and name for display
        subcategories.map((subcategory) => (
          <li key={subcategory.id} className="px-4 py-1 hover:bg-gray-100 transition-colors duration-200">
            <button
              onClick={() => handleSubcategoryClick(subcategory)}
              className="w-full text-sm text-gray-700 text-left font-medium hover:text-blue-600 focus:outline-none"
            >
              {subcategory.name}
            </button>
          </li>
        ))
      ) : (
        <li className="px-4 py-1 text-sm text-gray-500">No subcategories found</li>
      )}
    </ul>
  );
};

export default SubcategoryList;
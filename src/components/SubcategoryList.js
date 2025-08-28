// src/components/SubcategoryList.js
import React from "react";
import { Link } from "react-router-dom";

const SubcategoryList = ({ categorySlug, categoryName, subcategories }) => {
  return (
    <div>
      <h3 className="font-semibold text-lg mb-3">{categoryName}</h3>
      <ul className="grid grid-cols-2 gap-2">
        {subcategories.map((sub) => (
          <li key={sub.id}>
            <Link
              to={`/category/${categorySlug}/${sub.slug}`}
              className="block text-sm text-gray-600 hover:text-blue-600"
            >
              {sub.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubcategoryList;

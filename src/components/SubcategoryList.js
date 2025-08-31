import React from "react";
import { Link } from "react-router-dom";

const SubcategoryList = ({ categorySlug, categoryName, subcategories }) => {
  return (
    <div>
      <h3 className="font-bold text-lg mb-4 pb-2 border-b border-gray-200 text-gray-800">{categoryName}</h3>
      <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">
        {subcategories.map((sub) => (
          <li key={sub.id}>
            <Link
              to={`/category/${sub.slug}`}
              className="block text-sm text-gray-600 hover:text-blue-600 hover:underline"
            >
              {sub.name}
            </Link>
          </li>
        ))}
         <li className="col-span-full mt-4">
            <Link
              to={`/category/${categorySlug}`}
              className="font-semibold text-blue-600 hover:underline text-sm"
            >
              View all in {categoryName} &rarr;
            </Link>
          </li>
      </ul>
    </div>
  );
};

export default SubcategoryList;

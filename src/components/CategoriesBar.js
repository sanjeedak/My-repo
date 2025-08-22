import React, { useState } from 'react';
import { ChevronRightIcon } from '../assets/icons';
import { useNavigate } from 'react-router-dom';
import SubcategoryList from './SubcategoryList';
import { categoryIcons } from '../assets/categories_icons';

// Static subcategory data
const subcategoryData = {
  "Men's Fashion": ["Men's Watch", "Boots", "Clothing", "Accessories"],
  "Women's Fashion": ["Dresses", "Heels", "Tops", "Handbags"],
  "Kid's Fashion": ["Clothing", "Shoes", "Toys"],
  "Health & Beauty": ["Skincare", "Haircare", "Makeup"],
  "Pet Supplies": ["Pet Food", "Toys", "Grooming Kits"],
  "Home & Kitchen": ["Cookware", "Decor", "Appliances"],
  "Baby & Toddler": ["Baby Clothes", "Diapers", "Strollers"],
  "Sports & Outdoor": ["Sports Gear", "Apparel", "Camping Equipment"],
  "Phone & Gadgets": ["Smartphones", "Headphones", "Smartwatches"],
  "Books & Stationery": ["Novels", "Notebooks", "Pens"],
  "Groceries": ["Fruits", "Vegetables", "Dairy"],
  "Toys & Games": ["Board Games", "Action Figures", "Puzzles"],
  "Watches": ["Men's Watches", "Women's Watches", "Luxury Watches"],
  "Jewelry": ["Necklaces", "Rings", "Earrings"],
  "Automobile": ["Car Parts", "Accessories", "Tires"],
  "Tools & Hardware": ["Hand Tools", "Power Tools", "Safety Gear"],
};

const CategoriesBar = () => {
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const categories = Object.keys(categoryIcons);

  const handleClick = (category) => {
    navigate(`/products/${encodeURIComponent(category)}`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm w-full max-h-[500px] overflow-y-auto relative">
      <ul className="divide-y divide-gray-200">
        {categories.map((category, index) => (
          <li
            key={index}
            className="px-4 py-2.5 hover:bg-gray-50 relative"
            onMouseEnter={() => setHoveredCategory(category)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <button
              onClick={() => handleClick(category)}
              className="flex justify-between items-center w-full text-sm text-gray-700 text-left"
            >
              <span className="flex items-center gap-2">
                {categoryIcons[category] || (
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a8 8 0 110 16 8 8 0 010-16z" />
                  </svg>
                )}
                {category}
              </span>
              <ChevronRightIcon />
            </button>
            {hoveredCategory === category && (
              <SubcategoryList category={category} subcategories={subcategoryData[category] || []} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesBar;
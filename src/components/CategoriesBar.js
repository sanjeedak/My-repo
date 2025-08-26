// src/components/CategoriesBar.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from './layout/apiService';
import SubcategoryList from './SubcategoryList';
import { categoryIcons } from '../assets/categories_icons';
import { ChevronRightIcon } from '../assets/icons';

const CategoriesBar = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiService('/categories');
        const topLevel = data.data.categories.filter(cat => cat.parent_id === null);
        setCategories(topLevel);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleMouseEnter = async (category) => {
    setHoveredCategory(category);
    if (subcategories[category.id]) return; // Don't re-fetch if already loaded

    try {
      const data = await apiService(`/categories?parent_id=${category.id}`);
      setSubcategories(prev => ({ ...prev, [category.id]: data.data.categories || [] }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm w-full h-[380px] overflow-y-auto relative">
      <ul className="divide-y divide-gray-200">
        {loading ? (
          <li className="p-4 text-center text-gray-500">Loading...</li>
        ) : (
          categories.map((category) => (
            <li
              key={category.id}
              className="hover:bg-gray-50 relative"
              onMouseEnter={() => handleMouseEnter(category)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <Link
                to={`/category/${category.slug}`}
                className="flex justify-between items-center w-full text-sm text-gray-700 text-left px-4 py-2.5"
              >
                <span className="flex items-center gap-2">
                  {categoryIcons[category.name] || <div className="w-5 h-5 bg-gray-200 rounded-full"></div>}
                  {category.name}
                </span>
                <ChevronRightIcon />
              </Link>
              {hoveredCategory && hoveredCategory.id === category.id && (
                <SubcategoryList 
                  categorySlug={category.slug}
                  subcategories={subcategories[category.id]} 
                />
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default CategoriesBar;
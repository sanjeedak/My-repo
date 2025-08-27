// src/components/CategoriesBar.js
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from './layout/apiService';
import SubcategoryList from './SubcategoryList';
import { categoryIcons } from '../assets/categories_icons';
import { ChevronRightIcon } from '../assets/icons';


const buildCategoryTree = (categories) => {
  const categoryMap = new Map();
  const topLevelCategories = [];


  categories.forEach(cat => {
    categoryMap.set(cat.id, { ...cat, subcategories: [] });
  });

  categoryMap.forEach(cat => {
    if (cat.parent_id) {
      const parent = categoryMap.get(cat.parent_id);
      if (parent) {
        parent.subcategories.push(cat);
      }
    } else {
      topLevelCategories.push(cat);
    }
  });

  return topLevelCategories;
};


// --- The Component ---
const CategoriesBar = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hoverTimeoutRef = useRef(null);


  useEffect(() => {
    const fetchAndProcessCategories = async () => {
      try {
        setLoading(true);
     
        const response = await apiService('/categories'); 
        const categoryTree = buildCategoryTree(response.data.categories);
        setCategories(categoryTree);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };
    fetchAndProcessCategories();
  }, []); 

  const handleMouseEnter = (category) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
 
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveCategory(category);
    }, 200);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    hoverTimeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
    }, 300);
  };
  

  const handlePanelMouseEnter = () => {
      if(hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
      }
  }

  if (error) {
    return <div className="p-4 text-center text-red-500 bg-white border border-gray-200 rounded-lg shadow-sm h-[380px]">{error}</div>;
  }

  return (
    <div className="flex bg-white border border-gray-200 rounded-lg shadow-sm h-[380px] w-full relative">
      {/* Main Categories List */}
      <ul className="divide-y divide-gray-200 w-full overflow-y-auto">
        {loading ? (
                Array.from({ length: 8 }).map((_, index) => (
            <li key={index} className="p-4">
              <div className="flex items-center gap-3 animate-pulse">
                <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
              </div>
            </li>
          ))
        ) : (
          categories.map((category) => (
            <li
              key={category.id}
              onMouseEnter={() => handleMouseEnter(category)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to={`/category/${category.slug}`}
                className="flex justify-between items-center w-full text-sm text-gray-700 text-left px-4 py-2.5 hover:bg-gray-50"
              
                onFocus={() => handleMouseEnter(category)} 
                onBlur={handleMouseLeave}
              >
                <span className="flex items-center gap-3">
                  {categoryIcons[category.name] || <div className="w-5 h-5 bg-gray-200 rounded-full"></div>}
                  <span className="font-medium">{category.name}</span>
                </span>
                {category.subcategories?.length > 0 && <ChevronRightIcon />}
              </Link>
            </li>
          ))
        )}
      </ul>

      {/* Subcategories Panel */}
      <div
        onMouseEnter={handlePanelMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`
          absolute left-full top-0 w-[550px] h-full bg-white border-l border-gray-200 shadow-lg z-10 p-5
          transition-opacity duration-300 ease-in-out
          ${activeCategory && activeCategory.subcategories?.length > 0 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
        {activeCategory && (
          <SubcategoryList 
            key={activeCategory.id} 
            categorySlug={activeCategory.slug}
            categoryName={activeCategory.name}
            subcategories={activeCategory.subcategories} 
          />
        )}
      </div>
    </div>
  );
};

export default CategoriesBar;
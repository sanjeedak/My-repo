import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { apiService } from "./layout/apiService";
import SubcategoryList from "./SubcategoryList";
import { ChevronRightIcon } from "../assets/icons";
import { API_BASE_URL } from "../api/config";
import { endpoints } from "../api/endpoints";

const getImageUrl = (imagePath, categoryName) => {
  if (imagePath && imagePath.startsWith('http')) {
    return imagePath;
  }
  if (imagePath) {
    return `${API_BASE_URL}/${imagePath}`;
  }
  const firstWord = categoryName.split(' ')[0];
  return `https://placehold.co/40x40/EBF4FF/7F9CF5?text=${encodeURIComponent(firstWord.charAt(0))}`;
};

const CategoriesBar = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hoverTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await apiService(endpoints.categories);
        
        const cats = response?.data?.categories || [];
        setCategories(cats);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleMouseEnter = (category) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);

    hoverTimeoutRef.current = setTimeout(() => {
      setActiveCategory(category);
    }, 150); // Faster activation
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
    }, 200); // Faster deactivation
  };

  const handlePanelMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
  };

  if (error) {
    return (
      <div className="p-4 text-center text-red-500 bg-white border border-gray-200 rounded-lg shadow-sm h-[380px]">
        {error}
      </div>
    );
  }

  return (
    <div 
      onMouseLeave={handleMouseLeave} 
      className="flex bg-white border border-gray-200 rounded-lg shadow-sm h-[380px] w-full relative"
    >
      <ul className="divide-y divide-gray-100 w-full overflow-y-auto scrollbar-hide">
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
              className={`transition-colors duration-200 ${activeCategory?.id === category.id ? 'bg-blue-50' : ''}`}
            >
              <Link
                to={`/category/${category.slug}`}
                className="flex justify-between items-center w-full text-sm text-gray-700 text-left px-4 py-2.5 "
              >
                <span className="flex items-center gap-3">
                  <img
                    src={getImageUrl(category.image, category.name)}
                    alt={category.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className={`font-medium ${activeCategory?.id === category.id ? 'text-blue-600' : ''}`}>
                    {category.name}
                  </span>
                </span>
                {category.subcategories && category.subcategories.length > 0 && <ChevronRightIcon />}
              </Link>
            </li>
          ))
        )}
      </ul>

      <div
        onMouseEnter={handlePanelMouseEnter}
        className={`
          absolute left-full top-0 w-[550px] h-full bg-white border-l border-gray-200 shadow-lg z-10 p-5
          transition-all duration-300 ease-in-out
          ${activeCategory && activeCategory.subcategories && activeCategory.subcategories.length > 0
            ? "opacity-100 pointer-events-auto transform-none" 
            : "opacity-0 pointer-events-none transform -translate-x-2"}
        `}
      >
        {activeCategory && (
          <SubcategoryList
            key={activeCategory.id}
            categorySlug={activeCategory.slug}
            categoryName={activeCategory.name}
            subcategories={activeCategory.subcategories || []}
          />
        )}
      </div>
    </div>
  );
};

export default CategoriesBar;

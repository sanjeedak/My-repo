import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { apiService } from "./layout/apiService";
import SubcategoryList from "./SubcategoryList";
import { ChevronRightIcon } from "../assets/icons";
import { API_BASE_URL } from "../api/config"; // Import your API base URL

// Helper function to get the correct image URL
const getImageUrl = (imagePath, categoryName) => {
  if (imagePath && imagePath.startsWith('http')) {
    return imagePath;
  }
  if (imagePath) {
    return `${API_BASE_URL}/${imagePath}`;
  }
  // UPDATED: Use the first word for a more descriptive placeholder
  const firstWord = categoryName.split(' ')[0];
  return `https://placehold.co/40x40/EBF4FF/7F9CF5?text=${encodeURIComponent(firstWord)}`;
};

const CategoriesBar = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);
  const [error, setError] = useState(null);
  const hoverTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await apiService("/categories");
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

    hoverTimeoutRef.current = setTimeout(async () => {
      setActiveCategory(category);
      setSubcategories([]); 
      try {
        setSubLoading(true);
        const res = await apiService(`/subcategories?category_id=${category.id}`);
        const subs =  res?.data?.subCategories || [];
        setSubcategories(subs);
      } catch (err) {
        console.error("Failed to fetch subcategories:", err);
        setSubcategories([]);
      } finally {
        setSubLoading(false);
      }
    }, 200);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
      setSubcategories([]);
    }, 300);
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
    <div className="flex bg-white border border-gray-200 rounded-lg shadow-sm h-[380px] w-full relative">
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
              >
                <span className="flex items-center gap-3">
                  <img 
                    src={getImageUrl(category.image, category.name)} 
                    alt={category.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="font-medium">{category.name}</span>
                </span>
                <ChevronRightIcon />
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
          ${activeCategory ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      >
        {activeCategory && (
          subLoading ? (
            <div className="p-4 text-gray-500">Loading...</div>
          ) : subcategories.length > 0 ? (
            <SubcategoryList
              key={activeCategory.id}
              categorySlug={activeCategory.slug}
              categoryName={activeCategory.name}
              subcategories={subcategories}
            />
          ) : (
            <div className="p-4 text-gray-500">No subcategories</div>
          )
        )}
      </div>
    </div>
  );
};

export default CategoriesBar;


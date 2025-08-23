import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

// Mock brands for demo
const mockBrands = [
  { name: "Keithston", count: 31 },
  { name: "BrandX", count: 15 },
  { name: "BrandY", count: 20 },
];

const subcategoryData = {
  "Men's Fashion": ["Men's Watch", "Boots", "Clothing", "Accessories"],
  "Women's Fashion": ["Dresses", "Heels", "Tops", "Handbags"],
  // Add other categories as needed
};

const categoryMapping = {
  "Men's Fashion": "men's clothing",
  "Women's Fashion": "women's clothing",
  "Jewelry": "jewelery",
  "Phone & Gadgets": "electronics",
  // Add mappings for other categories
};

const ProductListPage = () => {
  const { category, subcategory: urlSubcategory } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [productType, setProductType] = useState('All');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(4000);
  const [size, setSize] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(urlSubcategory || ''); // Initialize with URL param or empty

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let url = 'https://linkiin.in/api/products';
      if (category && categoryMapping[category]) {
        url += `/category/${categoryMapping[category]}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      // Add mock discount and brands
      const enhancedData = data.map((p, index) => ({
        ...p,
        brand: mockBrands[index % mockBrands.length].name,
        discount: Math.random() > 0.5 ? 15 : 0,
        originalPrice: Math.random() > 0.5 ? p.price * 1.2 : null,
      }));
      setProducts(enhancedData);
      setFilteredProducts(enhancedData);
      setLoading(false);
    };
    fetchProducts();
  }, [category]);

  useEffect(() => {
    let filtered = products;
    if (selectedSubcategory) {
      filtered = filtered.filter((p) => p.title.toLowerCase().includes(selectedSubcategory.toLowerCase()));
    }
    if (searchTerm) {
      filtered = filtered.filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (productType === 'Discounted') {
      filtered = filtered.filter((p) => p.discount > 0);
    }
    filtered = filtered.filter((p) => p.price >= minPrice && p.price <= maxPrice);
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) => selectedBrands.includes(p.brand));
    }
    // Size filter skipped as no size data

    if (sortBy === 'priceLowToHigh') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceHighToLow') {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  }, [selectedSubcategory, searchTerm, productType, minPrice, maxPrice, selectedBrands, sortBy, products]);

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) => 
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 flex">
      {/* Left Sidebar */}
      <div className="w-1/4 pr-4">
        <h2 className="text-lg font-semibold mb-4">Filter By</h2>

        {/* Product Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Product Type</label>
          <select value={productType} onChange={(e) => setProductType(e.target.value)} className="w-full border rounded p-2">
            <option>All</option>
            <option>Discounted</option>
            <option>New Arrivals</option>
          </select>
        </div>

        {/* Price */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Price</label>
          <div className="flex space-x-2">
            <input type="number" value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} placeholder="Min" className="w-1/2 border rounded p-2" />
            <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} placeholder="Max" className="w-1/2 border rounded p-2" />
          </div>
          <input type="range" min="0" max="4000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full" />
        </div>

        {/* Categories (Subcategories) */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Categories</label>
          <ul>
            {subcategoryData[category] ? subcategoryData[category].map((sub) => (
              <li key={sub}>
                <button onClick={() => setSelectedSubcategory(sub)} className="text-blue-600 hover:underline">
                  {sub}
                </button>
              </li>
            )) : (
              <p>No subcategories available.</p>
            )}
          </ul>
        </div>

        {/* Brands */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Brands</label>
          <input type="text" placeholder="Search by brands" className="w-full border rounded p-2 mb-2" />
          {mockBrands.map((brand) => (
            <div key={brand.name} className="flex items-center">
              <input type="checkbox" checked={selectedBrands.includes(brand.name)} onChange={() => handleBrandChange(brand.name)} className="mr-2" />
              <label>{brand.name} ({brand.count})</label>
            </div>
          ))}
        </div>

        {/* Size */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Size</label>
          <select value={size} onChange={(e) => setSize(e.target.value)} className="w-full border rounded p-2">
            <option value="">All</option>
            <option>S</option>
            <option>M</option>
            <option>L</option>
            <option>XL</option>
          </select>
        </div>
      </div>

      {/* Right Content */}
      <div className="w-3/4 pl-4">
        <div className="flex justify-between mb-4">
          <span>{filteredProducts.length} items found</span>
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search for items..." className="border rounded p-2 w-1/3" />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded p-2">
            <option value="default">Sort By Default</option>
            <option value="priceLowToHigh">Price Low to High</option>
            <option value="priceHighToLow">Price High to Low</option>
          </select>
          <button className="border rounded p-2">Filter By</button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;
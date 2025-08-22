// Category-specific icons (inlined SVGs)
export const Icon = ({ color, path }) => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path className={color} d={path} />
  </svg>
);

export const categoryIcons = {
  "Men's Fashion": <Icon color="text-blue-500" path="M10 2a2 2 0 100 4 2 2 0 000-4zM8 8a2 2 0 114 0v2a2 2 0 01-4 0V8zM4 15a4 4 0 018 0v1H4v-1z" />,
  "Women's Fashion": <Icon color="text-pink-500" path="M10 2a2 2 0 100 4 2 2 0 000-4zM10 8a4 4 0 100 8 4 4 0 000-8z" />,
  "Kid's Fashion": <Icon color="text-yellow-500" path="M10 2a2 2 0 11.001 3.999A2 2 0 0110 2zM6 8a4 4 0 018 0v2H6V8zM4 13h12v1H4z" />,
  "Health & Beauty": <Icon color="text-rose-500" path="M12 2a6 6 0 00-6 6v1H4v2h2v1a6 6 0 006 6 6 6 0 006-6v-4a6 6 0 00-6-6z" />,
  "Pet Supplies": <Icon color="text-amber-500" path="M10 2a2 2 0 110 4 2 2 0 010-4zm4 2a2 2 0 100 4 2 2 0 000-4zM6 4a2 2 0 100 4 2 2 0 000-4zM8 10a4 4 0 108 0v1H8v-1z" />,
  "Home & Kitchen": <Icon color="text-green-600" path="M4 10l6-6 6 6v8a2 2 0 01-2 2h-8a2 2 0 01-2-2v-8z" />,
  "Baby & Toddler": <Icon color="text-fuchsia-600" path="M12 2a2 2 0 100 4 2 2 0 000-4zM8 7a5 5 0 0110 0v3H8V7zM6 12h12v2H6z" />,
  "Sports & Outdoor": <Icon color="text-teal-600" path="M4 6a4 4 0 100 8 4 4 0 000-8zm12 0a4 4 0 100 8 4 4 0 000-8z" />,
  "Phone & Gadgets": <Icon color="text-indigo-600" path="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 15a1 1 0 110-2 1 1 0 010 2z" />,
  "Books & Stationery": <Icon color="text-purple-600" path="M4 3h12v2H4zM4 7h12v10H4z" />,
  "Groceries": <Icon color="text-emerald-600" path="M4 4h12v2H4zM4 8h12v8H4z" />,
  "Toys & Games": <Icon color="text-yellow-600" path="M10 2a6 6 0 110 12A6 6 0 0110 2zM8 14h4v4H8z" />,
  "Watches": <Icon color="text-gray-600" path="M10 2a2 2 0 00-2 2v12a2 2 0 104 0V4a2 2 0 00-2-2z" />,
  "Jewelry": <Icon color="text-amber-600" path="M10 2a4 4 0 00-4 4c0 2.2 4 6 4 6s4-3.8 4-6a4 4 0 00-4-4z" />,
  "Automobile": <Icon color="text-red-600" path="M4 6h12l2 6H2l2-6zM5 16a2 2 0 104 0 2 2 0 00-4 0zm10 0a2 2 0 104 0 2 2 0 00-4 0z" />,
  "Tools & Hardware": <Icon color="text-slate-700" path="M14 2a2 2 0 00-2 2v2H6V4a2 2 0 00-2-2v16a2 2 0 002-2v-2h6v2a2 2 0 002 2V2z" />,
};

// ProductGrid.jsx
import { Link } from "react-router-dom";

const ProductGrid = ({ products, loading }) => {
  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <Link
          key={product._id}
          to={`/product/${product.slug}`} // 👈 IMPORTANT: use slug or id based on your API
          className="border rounded-lg p-4 shadow hover:shadow-lg transition"
        >
          <img
            src={product.image}
            alt={product.name}
            className="h-40 w-full object-cover"
          />
          <h2 className="mt-2 text-lg font-bold">{product.name}</h2>
          <p className="text-blue-600 font-semibold">₹{product.price}</p>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;

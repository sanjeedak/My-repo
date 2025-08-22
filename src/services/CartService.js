import React, { useState, useEffect } from 'react';

// This is the complete App component, now with a mock API call.
// In a real-world application, this would be broken down into multiple files.
// The mock API logic demonstrates how to handle asynchronous data fetching.

// We will use Tailwind CSS for styling.

// Helper function to format currency
const formatCurrency = (amount) => {
  return `$${amount.toFixed(2)}`;
};

// Main App component
export default function App() {
  // State for products, cart, total, and API status
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Mock API Call (Simulating a network request) ---
  // In a real app, this would be a fetch() call to a real endpoint.
  const fetchProducts = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock data. In a real app, this would be the data from the server.
        const mockProducts = [
          { id: 1, name: 'Vintage Camera', price: 299.99, imageUrl: 'https://placehold.co/400x300/F0F4F8/6C7A89?text=Camera' },
          { id: 2, name: 'Wireless Headphones', price: 199.50, imageUrl: 'https://placehold.co/400x300/F0F4F8/6C7A89?text=Headphones' },
          { id: 3, name: 'Leather Satchel Bag', price: 150.00, imageUrl: 'https://placehold.co/400x300/F0F4F8/6C7A89?text=Bag' },
        ];
        // Simulate a successful API response
        resolve(mockProducts);
        // To simulate an error, you would call reject() instead.
        // reject(new Error("Failed to fetch products."));
      }, 1500); // Simulate 1.5 seconds of network latency
    });
  };

  // useEffect hook to fetch products when the component mounts.
  useEffect(() => {
    setIsLoading(true);
    fetchProducts()
      .then(fetchedProducts => {
        setProducts(fetchedProducts);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []); // The empty dependency array ensures this runs only once on mount.

  // useEffect hook to recalculate the total whenever the cart state changes.
  useEffect(() => {
    const newTotal = cart.reduce((acc, cartItem) => {
      const product = products.find(p => p.id === cartItem.productId);
      return acc + (product ? product.price * cartItem.quantity : 0);
    }, 0);
    setTotal(newTotal);
  }, [cart, products]); // The effect now also depends on 'products' to handle initial load.

  // --- CartService-like functions ---
  // In a real app, these would be in src/services/CartService.js

  // Function to add a product to the cart.
  const addToCart = (productId) => {
    setCart(prevCart => {
      // Check if the item already exists in the cart
      const existingItem = prevCart.find(item => item.productId === productId);
      if (existingItem) {
        // If it exists, increment the quantity
        return prevCart.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If it doesn't exist, add it to the cart with a quantity of 1
        return [...prevCart, { productId, quantity: 1 }];
      }
    });
  };

  // Function to remove a product from the cart.
  const removeFromCart = (productId) => {
    setCart(prevCart => {
      // Find the item in the cart
      const existingItem = prevCart.find(item => item.productId === productId);
      if (existingItem.quantity > 1) {
        // If quantity is greater than 1, decrement it
        return prevCart.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        // If quantity is 1, remove the item entirely from the cart
        return prevCart.filter(item => item.productId !== productId);
      }
    });
  };

  // Function to clear the entire cart.
  const clearCart = () => {
    setCart([]);
  };

  // --- UI Rendering ---

  // Component for displaying a single product card
  const ProductCard = ({ product }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="rounded-lg mb-4 w-full h-auto object-cover"
      />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
      <p className="text-gray-600 mb-4">{formatCurrency(product.price)}</p>
      <button
        onClick={() => addToCart(product.id)}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
      >
        Add to Cart
      </button>
    </div>
  );

  // Component for displaying the shopping cart
  const Cart = ({ cartItems }) => (
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
        <span className="text-xl font-bold text-gray-800">{cart.length} item(s)</span>
      </div>
      {cartItems.length > 0 ? (
        cartItems.map(item => {
          const product = products.find(p => p.id === item.productId);
          return product ? (
            <div key={item.productId} className="flex items-center justify-between py-4 border-b last:border-b-0">
              <div className="flex items-center">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-16 h-16 rounded-md mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{product.name}</h4>
                  <p className="text-gray-600">
                    {formatCurrency(product.price)} x {item.quantity}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => addToCart(item.productId)}
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-lg leading-none hover:bg-gray-300"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="bg-red-500 text-white px-3 py-1 rounded-full text-lg leading-none hover:bg-red-600"
                >
                  -
                </button>
              </div>
            </div>
          ) : null;
        })
      ) : (
        <p className="text-center text-gray-500 py-8">Your cart is empty.</p>
      )}
      {cartItems.length > 0 && (
        <div className="mt-6 pt-4 border-t flex justify-between items-center">
          <p className="text-xl font-bold text-gray-800">Total:</p>
          <p className="text-xl font-bold text-blue-600">{formatCurrency(total)}</p>
        </div>
      )}
      {cartItems.length > 0 && (
        <button
          onClick={clearCart}
          className="w-full mt-4 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition duration-300"
        >
          Clear Cart
        </button>
      )}
    </div>
  );

  // The main layout of the application
  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="container mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Shopping Cart Demo
          </h1>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Products Section */}
          <section className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Products</h2>
            {isLoading && <div className="text-center text-gray-600">Loading products...</div>}
            {error && <div className="text-center text-red-500">Error: {error}</div>}
            {!isLoading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>

          {/* Cart Section */}
          <aside className="lg:col-span-1">
            <Cart cartItems={cart} />
          </aside>
        </main>
      </div>
    </div>
  );
}

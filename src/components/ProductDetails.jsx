import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const { addToCart } = useCart();

    useEffect(() => {
        fetch(`https://linkiin.in/api/products/${id}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                // Fetch related products from same category
                fetch(`https://linkiin.in/api/categories/${data.category}?limit=4`)
                    .then(res => res.json())
                    .then(related => setRelatedProducts(related.filter(p => p.id !== data.id)));
            })
            .catch(err => console.error(err));
    }, [id]);

    if (!product) return <div className="text-center p-6">Loading product...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
            <div className="grid md:grid-cols-2 gap-6">
                <img src={product.image} alt={product.title} className="object-contain h-64" />
                <div>
                    <h2 className="text-xl font-bold">{product.title}</h2>
                    <p className="text-gray-700 mt-2">{product.description}</p>
                    <div className="mt-4 text-2xl text-green-600 font-bold">${product.price}</div>
                    <button
                        onClick={() => addToCart(product)}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
            <div className="mt-8">
                <h3 className="text-lg font-semibold">Related Products</h3>
                <div className="grid grid-cols-4 gap-4 mt-4">
                    {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
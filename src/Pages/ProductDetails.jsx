import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import products from "../data/products";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    const adminProducts = JSON.parse(localStorage.getItem("adminProducts"));
    const source = adminProducts && adminProducts.length ? adminProducts : products;
    const found = source.find((p) => p.id === parseInt(id));
    setProduct(found);
  }, [id]);

  if (!product) {
    return <p className="not-found">Product not found.</p>;
  }

  const handleAddToCart = () => {
    addToCart(product, "product");
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2000);
  };

  return (
    <div className="pet-details">
      <div className="pet-details-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="pet-details-info">
        <h1>{product.name}</h1>
        <p><strong>Category:</strong> {product.category}</p>
        <p><strong>Brand:</strong> {product.brand}</p>
        <p><strong>Price:</strong> ₹{product.fee}</p>
        <p><strong>Status:</strong> {product.status}</p>
        <p><strong>Stock Available:</strong> {product.stock}</p>
        <p className="pet-description">{product.description}</p>

        {addedMessage && <p className="success-text">Added to cart!</p>}

        {product.status === "Available" ? (
          <div className="btn-group">
            <button onClick={handleAddToCart} className="btn-secondary">Add to Cart</button>
          </div>
        ) : (
          <p className="status-adopted">This product is currently out of stock.</p>
        )}

        <Link to="/products" className="back-link">← Back to Products</Link>
      </div>
    </div>
  );
};

export default ProductDetails;
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import products from "../data/products";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const Products = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    const adminProducts = JSON.parse(localStorage.getItem("adminProducts"));
    setAllProducts(adminProducts && adminProducts.length ? adminProducts : products);
  }, []);

  const filteredProducts = allProducts.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (product) => {
    addToCart(product, "product");
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="pets-page">
      <h1>Pet Products & Accessories</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search product by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="pets-grid">
        {filteredProducts.length === 0 && <p>No products found.</p>}
        {filteredProducts.map((product) => (
          <div className="pet-card" key={product.id}>
            <div className="wishlist-img-wrapper">
              <img src={product.image} alt={product.name} />
              <button
                className={`wishlist-heart-btn ${isWishlisted(product.id, "product") ? "active" : ""}`}
                onClick={() => toggleWishlist(product, "product")}
                title="Save to wishlist"
              >
                {isWishlisted(product.id, "product") ? "❤️" : "🤍"}
              </button>
            </div>
            <h3>{product.name}</h3>
            <p>{product.category} • {product.brand}</p>
            <p className="pet-details-info"><strong>₹{product.fee}</strong></p>
            <div className="btn-group" style={{ justifyContent: "center" }}>
              <button onClick={() => handleAddToCart(product)} className="btn-secondary">
                {addedId === product.id ? "Added ✓" : "Add to Cart"}
              </button>
              <Link to={`/products/${product.id}`} className="btn-secondary">View Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
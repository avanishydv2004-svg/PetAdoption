import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (item) => {
    addToCart(item, item.itemType);
  };

  return (
    <div className="pets-page">
      <h1>Your Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="empty-cart">
          <p>Your wishlist is empty.</p>
          <Link to="/pets" className="btn-primary">Browse Pets</Link>
        </div>
      ) : (
        <div className="pets-grid">
          {wishlist.map((item) => (
            <div className="pet-card" key={`${item.itemType}-${item.id}`}>
              <div className="wishlist-img-wrapper">
                <img src={item.image} alt={item.name} />
                <button
                  className="wishlist-heart-btn active"
                  onClick={() => removeFromWishlist(item.id, item.itemType)}
                  title="Remove from wishlist"
                >
                  ❤️
                </button>
              </div>
              <h3>{item.name}</h3>
              <p>
                {item.itemType === "pet"
                  ? `${item.breed} • ${item.age}`
                  : `${item.category} • ${item.brand}`}
              </p>
              <p><strong>₹{item.fee}</strong></p>
              <div className="btn-group" style={{ justifyContent: "center" }}>
                <button onClick={() => handleAddToCart(item)} className="btn-secondary">
                  Add to Cart
                </button>
                <Link
                  to={item.itemType === "pet" ? `/pets/${item.id}` : `/products/${item.id}`}
                  className="btn-secondary"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
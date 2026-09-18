import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cart, removeFromCart, increaseQty, decreaseQty } = useCart();
  const navigate = useNavigate();

  const petItems = cart.filter((item) => item.itemType === "pet");
  const productItems = cart.filter((item) => item.itemType === "product");

  const petTotal = petItems.reduce((sum, p) => sum + p.fee * p.quantity, 0);
  const productTotal = productItems.reduce((sum, p) => sum + p.fee * p.quantity, 0);
  const grandTotal = petTotal + productTotal;

  const handleCheckout = () => {
    if (petItems.length > 0) {
      navigate("/adopt-cart");
    } else if (productItems.length > 0) {
      navigate("/order-cart");
    }
  };

  const renderItem = (item) => (
    <div className="cart-item" key={`${item.itemType}-${item.id}`}>
      <img src={item.image} alt={item.name} />
      <div className="cart-item-info">
        <h3>{item.name}</h3>
        <p>{item.itemType === "pet" ? `${item.breed} • ${item.age}` : `${item.category} • ${item.brand}`}</p>
        <p>Fee: ₹{item.fee} each</p>
        <p className="stock-text">Available: {item.stock}</p>
      </div>
      <div className="qty-control">
        <button
          onClick={() => decreaseQty(item.id, item.itemType)}
          className="qty-btn"
          disabled={item.quantity <= 1}
        >
          -
        </button>
        <span className="qty-value">{item.quantity}</span>
        <button
          onClick={() => increaseQty(item.id, item.itemType)}
          className="qty-btn"
          disabled={item.quantity >= item.stock}
        >
          +
        </button>
      </div>
      <p className="item-subtotal">₹{item.fee * item.quantity}</p>
      <button onClick={() => removeFromCart(item.id, item.itemType)} className="btn-remove">Remove</button>
    </div>
  );

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <Link to="/pets" className="btn-primary">Browse Pets</Link>
        </div>
      ) : (
        <>
          {petItems.length > 0 && (
            <>
              <h2 className="dashboard-h2">🐾 Pets for Adoption</h2>
              <div className="cart-list">{petItems.map(renderItem)}</div>
              <div className="cart-summary">
                <h3>Pets Total: ₹{petTotal}</h3>
              </div>
            </>
          )}

          {productItems.length > 0 && (
            <>
              <h2 className="dashboard-h2" style={{ marginTop: "30px" }}>🛒 Pet Products</h2>
              <div className="cart-list">{productItems.map(renderItem)}</div>
              <div className="cart-summary">
                <h3>Products Total: ₹{productTotal}</h3>
              </div>
            </>
          )}

          <div className="cart-summary" style={{ marginTop: "25px" }}>
            <h3>Grand Total: ₹{grandTotal}</h3>
            <button className="btn-primary" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>

          {petItems.length > 0 && productItems.length > 0 && (
            <p className="hint-text" style={{ textAlign: "center", marginTop: "10px" }}>
              Note: Pet adoption will be processed first. You can order products separately after.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;
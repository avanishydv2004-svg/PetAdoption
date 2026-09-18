import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import products from "../data/products";

const ProductPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCartByType } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [upiId, setUpiId] = useState("");
  const [error, setError] = useState("");

  const formData = location.state?.formData || {};
  const items = location.state?.items || [];

  const totalFee = items.reduce((sum, p) => sum + p.fee * p.quantity, 0);

  const updateRequestsWithPayment = (finalStatus) => {
    const requests = JSON.parse(localStorage.getItem("productRequests") || "[]");
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const userEmail = currentUser?.email || currentUser?.username || "guest";
    const productIds = items.map((p) => p.id);

    const updated = requests.map((req) => {
      if (
        req.userEmail === userEmail &&
        productIds.includes(req.productId) &&
        req.status === "Pending"
      ) {
        return {
          ...req,
          paymentMode: paymentMethod,
          upiId: paymentMethod === "online" ? upiId : "",
          paymentStatus: finalStatus,
        };
      }
      return req;
    });

    localStorage.setItem("productRequests", JSON.stringify(updated));
  };

  const reduceStockAfterPurchase = () => {
    const savedAdminProducts = JSON.parse(localStorage.getItem("adminProducts"));
    const baseProducts = savedAdminProducts && savedAdminProducts.length ? savedAdminProducts : products;

    const updated = baseProducts.map((p) => {
      const purchasedItem = items.find((item) => item.id === p.id);
      if (purchasedItem) {
        const newStock = Math.max(0, (p.stock || 0) - purchasedItem.quantity);
        return { ...p, stock: newStock, status: newStock === 0 ? "Out of Stock" : p.status };
      }
      return p;
    });

    localStorage.setItem("adminProducts", JSON.stringify(updated));
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setError("");

    let finalStatus = "";

    if (paymentMethod === "online") {
      const upiPattern = /^[\w.-]+@[\w.-]+$/;
      if (!upiPattern.test(upiId)) {
        setError("Enter a valid UPI ID (e.g. name@upi)");
        return;
      }
      finalStatus = "Paid";
    } else {
      finalStatus = "Cash on Delivery";
    }

    updateRequestsWithPayment(finalStatus);
    reduceStockAfterPurchase();
    clearCartByType("product");

    navigate("/product-confirmation", {
      state: { formData, items, paymentMode: paymentMethod, upiId, status: finalStatus },
    });
  };

  if (items.length === 0) return <p className="not-found">No order data found.</p>;

  return (
    <div className="form-container">
      <div className="payment-page">
        <h2>Select Payment Option</h2>

        <div className="order-summary-box">
          <h3>Order Summary:</h3>
          {items.map((item) => (
            <div className="order-item" key={item.id}>
              <span>{item.name} - Qty: {item.quantity}</span>
              <span>₹{item.fee * item.quantity}</span>
            </div>
          ))}
          <div className="order-total">
            <span>Total Payable Amount:</span>
            <span>₹{totalFee}</span>
          </div>
        </div>

        <h3 className="payment-heading">Choose Payment Method:</h3>

        {error && <p className="error-text">{error}</p>}

        <label className={`payment-option ${paymentMethod === "online" ? "payment-option-active" : ""}`}>
          <div className="payment-option-header">
            <input
              type="radio"
              name="paymentMethod"
              value="online"
              checked={paymentMethod === "online"}
              onChange={() => setPaymentMethod("online")}
            />
            <span>💳 <strong>Online Payment (Pay Now via UPI)</strong></span>
          </div>
          <p className="payment-option-desc">
            Complete payment now using Google Pay, PhonePe, Paytm or BHIM UPI ID.
          </p>
          {paymentMethod === "online" && (
            <div className="upi-input-group">
              <label className="field-label">Enter UPI ID</label>
              <input
                type="text"
                placeholder="e.g. mobileNumber@ybl / username@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
            </div>
          )}
        </label>

        <label className={`payment-option ${paymentMethod === "cod" ? "payment-option-active" : ""}`}>
          <div className="payment-option-header">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
            />
            <span>💵 <strong>Cash on Delivery</strong></span>
          </div>
          <p className="payment-option-desc">
            Pay in cash when your order is delivered to your address.
          </p>
        </label>

        <div className="payment-btn-group">
          <button onClick={handlePayment} className="btn-pay">
            Pay & Place Order
          </button>
          <button onClick={() => navigate(-1)} className="btn-back-form">
            Back to Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPayment;
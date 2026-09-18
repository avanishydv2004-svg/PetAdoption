import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import pets from "../data/pets";

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, clearCart, removeFromCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [upiId, setUpiId] = useState("");
  const [error, setError] = useState("");

  const isCartMode = !id;
  const pet = !isCartMode ? pets.find((p) => p.id === parseInt(id)) : null;

  const passedItems = location.state?.items;
  const formData = location.state?.formData || {};

  const items =
    passedItems && passedItems.length
      ? passedItems
      : isCartMode
      ? cart
      : pet
      ? [{ ...pet, quantity: 1 }]
      : [];

  const totalFee = items.reduce((sum, p) => sum + p.fee * p.quantity, 0);

  const updateRequestsWithPayment = (finalStatus) => {
    const requests = JSON.parse(localStorage.getItem("adoptionRequests") || "[]");
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const userEmail = currentUser?.email || currentUser?.username || "guest";
    const petIds = items.map((p) => p.id);

    const updatedRequests = requests.map((req) => {
      if (
        req.userEmail === userEmail &&
        petIds.includes(req.petId) &&
        req.status === "Pending"
      ) {
        return {
          ...req,
          paymentMode: paymentMethod,
          upiId: paymentMethod === "online" ? upiId : "",
          paymentStatus: finalStatus,
          status: finalStatus === "Paid" ? "Approved" : "Pending",
        };
      }
      return req;
    });

    localStorage.setItem("adoptionRequests", JSON.stringify(updatedRequests));
  };

  const reduceStockAfterPurchase = () => {
    const savedAdminPets = JSON.parse(localStorage.getItem("adminPets"));
    const basePets = savedAdminPets && savedAdminPets.length ? savedAdminPets : pets;

    const updatedPets = basePets.map((p) => {
      const purchasedItem = items.find((item) => item.id === p.id);
      if (purchasedItem) {
        const newStock = Math.max(0, (p.stock || 0) - purchasedItem.quantity);
        return {
          ...p,
          stock: newStock,
          status: newStock === 0 ? "Adopted" : p.status,
        };
      }
      return p;
    });

    localStorage.setItem("adminPets", JSON.stringify(updatedPets));
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
      finalStatus = "Reserved";
    }

    updateRequestsWithPayment(finalStatus);
    reduceStockAfterPurchase();

    if (isCartMode) {
      clearCart();
    } else {
      removeFromCart(parseInt(id));
    }

    navigate("/confirmation", {
      state: {
        formData,
        items,
        paymentMode: paymentMethod,
        upiId,
        status: finalStatus,
      },
    });
  };

  const handleBackToForm = () => {
    navigate(-1);
  };

  if (!isCartMode && !pet) return <p className="not-found">Pet not found.</p>;

  return (
    <div className="form-container">
      <div className="payment-page">
        <h2>Select Payment Option</h2>

        <div className="order-summary-box">
          <h3>Order Summary:</h3>
          {items.map((item) => (
            <div className="order-item" key={item.id}>
              <span>{item.name} ({item.breed}) - Qty: {item.quantity}</span>
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

        <label className={`payment-option ${paymentMethod === "reserve" ? "payment-option-active" : ""}`}>
          <div className="payment-option-header">
            <input
              type="radio"
              name="paymentMethod"
              value="reserve"
              checked={paymentMethod === "reserve"}
              onChange={() => setPaymentMethod("reserve")}
            />
            <span>🏠 <strong>Pay at Adoption Center (Reserve Pet)</strong></span>
          </div>
          <p className="payment-option-desc">
            Pet will be reserved in your name ("Booked"). Visit our center, meet the pet, and pay directly on location.
          </p>
        </label>

        <div className="payment-btn-group">
          <button onClick={handlePayment} className="btn-pay">
            Pay & Complete Adoption
          </button>
          <button onClick={handleBackToForm} className="btn-back-form">
            Back to Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
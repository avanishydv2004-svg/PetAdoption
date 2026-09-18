import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart();
  const data = location.state;

  const productItems = cart.filter((item) => item.itemType === "product");

  if (!data) {
    return (
      <div className="not-found">
        <p>No confirmation data found.</p>
        <button className="btn-primary" onClick={() => navigate("/")}>Back to Home</button>
      </div>
    );
  }

  const { formData, items, paymentMode, upiId, status } = data;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPass = () => {
    const content = `
PETADOPT - ADOPTION PASS
--------------------------------
Applicant: ${formData.fullName}
Email: ${formData.email}
Mobile: ${formData.mobile}
Address: ${formData.address}

Pets: ${items.map((i) => `${i.name} (ID: ${i.id}) x${i.quantity}`).join(", ")}

Payment Mode: ${paymentMode === "online" ? "Online Payment (UPI)" : "Pay at Adoption Center"}
${paymentMode === "online" ? `UPI ID: ${upiId}` : ""}
Status: ${status}

Pickup Location: PetAdopt Main Center, Plot No. 42, Green Park Road, Near City Mall, Mumbai - 400001
Shelter Contact: +91 98765 43210
Visiting Hours: 10:00 AM to 06:00 PM (Mon - Sat)
    `;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "adoption-pass.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCancel = () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this order and request a refund?");
    if (confirmCancel) {
      navigate("/dashboard");
    }
  };

  const totalFee = items.reduce((sum, p) => sum + p.fee * p.quantity, 0);

  return (
    <div className="confirmation-page">
      <h2 className="confirmation-title">✅ Adoption Confirmed</h2>

      <div className="confirmation-section">
        <h3 className="section-title">👤 Applicant Information</h3>
        <p><strong>Full Name:</strong> {formData.fullName}</p>
        <p><strong>Email:</strong> {formData.email}</p>
        <p><strong>Mobile Number:</strong> {formData.mobile}</p>
        <p><strong>Housing Type:</strong> {formData.housingType}</p>
        <p><strong>Has Other Pets:</strong> {formData.hasOtherPets}</p>
        <p><strong>Residential Address:</strong> {formData.address}</p>
      </div>

      <div className="confirmation-section">
        <h3 className="section-title">🐾 Pet Information</h3>
        {items.map((item) => (
          <div className="pet-info-item" key={item.id}>
            <img src={item.image} alt={item.name} />
            <div className="pet-info-details">
              <strong>{item.name} ({item.breed})</strong>
              <p>Pet ID: {item.id}</p>
              <p>Age: {item.age} | Quantity: {item.quantity}</p>
              <p>
                Vaccination:{" "}
                <span className={item.vaccinated ? "vaccinated-yes" : "vaccinated-no"}>
                  {item.vaccinated ? "Vaccinated" : "Not Vaccinated"}
                </span>
              </p>
            </div>
            <span className="pet-info-fee">₹{item.fee * item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="payment-status-box">
        <h3 className="section-title">💳 Payment Status Details</h3>
        <p><strong>Payment Mode:</strong> {paymentMode === "online" ? "Online Payment (UPI)" : "Pay at Adoption Center"}</p>
        {paymentMode === "online" && <p><strong>UPI ID:</strong> {upiId}</p>}
        <p><strong>Total Amount:</strong> ₹{totalFee}</p>
        <p>
          <strong>Status:</strong>{" "}
          <span className={`status-badge ${status === "Paid" ? "status-paid" : "status-reserved"}`}>
            {status.toUpperCase()}
          </span>
        </p>
      </div>

      <div className="pickup-box">
        <h3 className="section-title">📍 Pick-Up Location & Center Address</h3>
        <p><strong>Shelter Address:</strong> PetAdopt Main Center, Plot No. 42, Green Park Road, Near City Mall, Mumbai - 400001</p>
        <p><strong>Shelter Mobile No:</strong> +91 98765 43210</p>
        <p><strong>Visiting Hours:</strong> 10:00 AM to 06:00 PM (Mon - Sat)</p>
        <hr />
        <p><strong>Instructions:</strong> Show this digital pass along with your Govt Photo ID at the counter to receive your pet.</p>
      </div>

      {productItems.length > 0 && (
        <div className="pickup-box">
          <h3 className="section-title">🛒 You Still Have Products in Cart</h3>
          <p>You have {productItems.length} product(s) waiting in your cart. Complete your product order now.</p>
          <button className="btn-primary" onClick={() => navigate("/order-cart")}>
            Order Your Products Now
          </button>
        </div>
      )}

      <div className="confirmation-btn-group">
        <button className="btn-print" onClick={handlePrint}>🖨️ Print / Save PDF</button>
        <button className="btn-download" onClick={handleDownloadPass}>⬇️ Download Pass Proof</button>
        <button className="btn-cancel" onClick={handleCancel}>❌ Cancel Order & Refund</button>
      </div>

      <button className="btn-home-full" onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
};

export default Confirmation;
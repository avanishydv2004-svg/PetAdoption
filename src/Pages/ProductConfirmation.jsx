import { useLocation, useNavigate } from "react-router-dom";

const ProductConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  if (!data) {
    return (
      <div className="not-found">
        <p>No confirmation data found.</p>
        <button className="btn-primary" onClick={() => navigate("/")}>Back to Home</button>
      </div>
    );
  }

  const { formData, items, paymentMode, upiId, status } = data;
  const totalFee = items.reduce((sum, p) => sum + p.fee * p.quantity, 0);

  const handlePrint = () => window.print();

  const handleDownload = () => {
    const content = `
PETADOPT - PRODUCT ORDER RECEIPT
--------------------------------
Customer: ${formData.fullName}
Email: ${formData.email}
Mobile: ${formData.mobile}
Delivery Address: ${formData.address}

Items: ${items.map((i) => `${i.name} x${i.quantity} (Product ID: ${i.id})`).join(", ")}
Total Amount: ₹${totalFee}

Payment Mode: ${paymentMode === "online" ? "Online Payment (UPI)" : "Cash on Delivery"}
${paymentMode === "online" ? `UPI ID: ${upiId}` : ""}
Status: ${status}
    `;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "order-receipt.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="confirmation-page">
      <h2 className="confirmation-title">✅ Order Confirmed</h2>

      <div className="confirmation-section">
        <h3 className="section-title">👤 Customer Information</h3>
        <p><strong>Full Name:</strong> {formData.fullName}</p>
        <p><strong>Email:</strong> {formData.email}</p>
        <p><strong>Mobile Number:</strong> {formData.mobile}</p>
        <p><strong>Delivery Address:</strong> {formData.address}</p>
      </div>

      <div className="confirmation-section">
        <h3 className="section-title">🛒 Ordered Items</h3>
        {items.map((item) => (
          <div className="pet-info-item" key={item.id}>
            <img src={item.image} alt={item.name} />
            <div className="pet-info-details">
              <strong>{item.name}</strong>
              <p>Product ID: {item.id}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
            <span className="pet-info-fee">₹{item.fee * item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="payment-status-box">
        <h3 className="section-title">💳 Payment Status</h3>
        <p><strong>Payment Mode:</strong> {paymentMode === "online" ? "Online Payment (UPI)" : "Cash on Delivery"}</p>
        {paymentMode === "online" && <p><strong>UPI ID:</strong> {upiId}</p>}
        <p><strong>Total Amount:</strong> ₹{totalFee}</p>
        <p>
          <strong>Status:</strong>{" "}
          <span className={`status-badge ${status === "Paid" ? "status-paid" : "status-reserved"}`}>
            {status.toUpperCase()}
          </span>
        </p>
      </div>

      <div className="confirmation-btn-group">
        <button className="btn-print" onClick={handlePrint}>🖨️ Print / Save PDF</button>
        <button className="btn-download" onClick={handleDownload}>⬇️ Download Receipt</button>
      </div>

      <button className="btn-home-full" onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
};

export default ProductConfirmation;
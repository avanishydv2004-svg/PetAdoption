import { useState, useEffect } from "react";

const ProductRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("productRequests") || "[]");
    setRequests(saved);
  }, []);

  const toggleDelivered = (id) => {
    const updated = requests.map((r) =>
      r.id === id
        ? { ...r, status: r.status === "Delivered" ? "Pending" : "Delivered" }
        : r
    );
    setRequests(updated);
    localStorage.setItem("productRequests", JSON.stringify(updated));
  };

  return (
    <div className="manage-page">
      <h1>Manage Product Requests</h1>

      {requests.length === 0 ? (
        <p>No product requests yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th><th>Customer</th><th>Phone</th><th>Address</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => {
              const isDelivered = req.status === "Delivered";
              return (
                <tr key={req.id}>
                  <td>
                    <img src={req.productImage} alt={req.productName} className="table-img" /> {req.productName}
                  </td>
                  <td>{req.fullName}</td>
                  <td>{req.mobile}</td>
                  <td>{req.address}</td>
                  <td className={isDelivered ? "status-approved" : "status-pending"}>{req.status}</td>
                  <td className="action-cell">
                    <button
                      onClick={() => toggleDelivered(req.id)}
                      className={`toggle-status-btn ${isDelivered ? "toggle-on" : "toggle-off"}`}
                    >
                      {isDelivered ? "Delivered" : "Pending"}
                    </button>
                    <button onClick={() => setSelectedRequest(req)} className="btn-view-details">
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {selectedRequest && (
        <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedRequest(null)}>✕</button>

            <h2 className="confirmation-title">🛒 Product Order Details</h2>

            <div className="confirmation-section">
              <h3 className="section-title">👤 Customer Information</h3>
              <p><strong>Request ID:</strong> {selectedRequest.id}</p>
              <p><strong>Full Name:</strong> {selectedRequest.fullName || "N/A"}</p>
              <p><strong>Email:</strong> {selectedRequest.email || "N/A"}</p>
              <p><strong>Mobile Number:</strong> {selectedRequest.mobile || "N/A"}</p>
              <p><strong>Delivery Address:</strong> {selectedRequest.address || "N/A"}</p>
            </div>

            <div className="confirmation-section">
              <h3 className="section-title">🛒 Product Information</h3>
              <div className="pet-info-item">
                <img src={selectedRequest.productImage} alt={selectedRequest.productName} />
                <div className="pet-info-details">
                  <strong>{selectedRequest.productName}</strong>
                  <p>Product ID: {selectedRequest.productId}</p>
                  <p>Quantity: {selectedRequest.quantity || 1}</p>
                </div>
              </div>
            </div>

            <div className="payment-status-box">
              <h3 className="section-title">💳 Payment Status Details</h3>
              {selectedRequest.paymentMode ? (
                <>
                  <p>
                    <strong>Payment Mode:</strong>{" "}
                    {selectedRequest.paymentMode === "online" ? "Online Payment (UPI)" : "Cash on Delivery"}
                  </p>
                  {selectedRequest.paymentMode === "online" && (
                    <p><strong>UPI ID:</strong> {selectedRequest.upiId}</p>
                  )}
                  <p>
                    <strong>Payment Status:</strong>{" "}
                    <span className={`status-badge ${selectedRequest.paymentStatus === "Paid" ? "status-paid" : "status-reserved"}`}>
                      {selectedRequest.paymentStatus?.toUpperCase()}
                    </span>
                  </p>
                </>
              ) : (
                <p>Payment not completed yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductRequests;
import { useState, useEffect } from "react";

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("adoptionRequests") || "[]");
    setRequests(saved);
  }, []);

  const toggleAdoptStatus = (id) => {
    const updated = requests.map((r) =>
      r.id === id
        ? { ...r, status: r.status === "Adopted" ? "Not Adopted" : "Adopted" }
        : r
    );
    setRequests(updated);
    localStorage.setItem("adoptionRequests", JSON.stringify(updated));
  };

  return (
    <div className="manage-page">
      <h1>Manage Adoption Requests</h1>

      {requests.length === 0 ? (
        <p>No adoption requests yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Pet</th><th>Applicant</th><th>Phone</th><th>Address</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => {
              const isAdopted = req.status === "Adopted";
              return (
                <tr key={req.id}>
                  <td>
                    <img src={req.petImage} alt={req.petName} className="table-img" /> {req.petName}
                  </td>
                  <td>{req.fullName}</td>
                  <td>{req.mobile}</td>
                  <td>{req.address}</td>
                  <td className={isAdopted ? "status-approved" : "status-pending"}>
                    {req.status}
                  </td>
                  <td className="action-cell">
                    <button
                      onClick={() => toggleAdoptStatus(req.id)}
                      className={`toggle-status-btn ${isAdopted ? "toggle-on" : "toggle-off"}`}
                    >
                      {isAdopted ? "Adopted" : "Not Adopted"}
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

            <h2 className="confirmation-title">✅ Adoption Details</h2>

            <div className="confirmation-section">
              <h3 className="section-title">👤 Applicant Information</h3>
              <p><strong>Request ID:</strong> {selectedRequest.id}</p>
              <p><strong>Full Name:</strong> {selectedRequest.fullName || "N/A"}</p>
              <p><strong>Email:</strong> {selectedRequest.email || "N/A"}</p>
              <p><strong>Mobile Number:</strong> {selectedRequest.mobile || "N/A"}</p>
              <p><strong>Housing Type:</strong> {selectedRequest.housingType || "N/A"}</p>
              <p><strong>Has Other Pets:</strong> {selectedRequest.hasOtherPets || "N/A"}</p>
              <p><strong>Residential Address:</strong> {selectedRequest.address || "N/A"}</p>
              <p><strong>Reason:</strong> {selectedRequest.reason || "N/A"}</p>
            </div>

            <div className="confirmation-section">
              <h3 className="section-title">🐾 Pet Information</h3>
              <div className="pet-info-item">
                <img src={selectedRequest.petImage} alt={selectedRequest.petName} />
                <div className="pet-info-details">
                  <strong>{selectedRequest.petName}</strong>
                  <p>Pet ID: {selectedRequest.petId}</p>
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
                    {selectedRequest.paymentMode === "online" ? "Online Payment (UPI)" : "Pay at Adoption Center"}
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

export default ManageRequests;
import { useState, useEffect } from "react";

const SurrenderRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("surrenderRequests") || "[]");
    setRequests(saved);
  }, []);

  const toggleReviewed = (id) => {
    const updated = requests.map((r) =>
      r.id === id
        ? { ...r, status: r.status === "Reviewed" ? "Pending" : "Reviewed" }
        : r
    );
    setRequests(updated);
    localStorage.setItem("surrenderRequests", JSON.stringify(updated));
  };

  return (
    <div className="manage-page">
      <h1>Surrendered / Stray Animal Requests</h1>

      {requests.length === 0 ? (
        <p>No requests submitted yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Animal</th><th>Submitted By</th><th>Contact</th><th>Location</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => {
              const isReviewed = req.status === "Reviewed";
              return (
                <tr key={req.id}>
                  <td>{req.petType} {req.petName ? `(${req.petName})` : ""}</td>
                  <td>{req.submittedBy}</td>
                  <td>{req.contactNumber}</td>
                  <td>{req.foundLocation}</td>
                  <td className={isReviewed ? "status-approved" : "status-pending"}>{req.status}</td>
                  <td className="action-cell">
                    <button
                      onClick={() => toggleReviewed(req.id)}
                      className={`toggle-status-btn ${isReviewed ? "toggle-on" : "toggle-off"}`}
                    >
                      {isReviewed ? "Reviewed" : "Pending"}
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

            <h2 className="confirmation-title">🐾 Surrender Request Details</h2>

            <div className="confirmation-section">
              <h3 className="section-title">📋 Submission Info</h3>
              <p><strong>Request ID:</strong> {selectedRequest.id}</p>
              <p><strong>Submitted By:</strong> {selectedRequest.submittedBy}</p>
              <p><strong>Contact Number:</strong> {selectedRequest.contactNumber}</p>
            </div>

            <div className="confirmation-section">
              <h3 className="section-title">🐕 Animal Details</h3>
              <p><strong>Type:</strong> {selectedRequest.petType}</p>
              <p><strong>Name:</strong> {selectedRequest.petName || "Unknown"}</p>
              <p><strong>Approx Age:</strong> {selectedRequest.approxAge}</p>
              <p><strong>Location:</strong> {selectedRequest.foundLocation}</p>
              <p><strong>Reason:</strong> {selectedRequest.reason}</p>
              <p><strong>Additional Notes:</strong> {selectedRequest.notes || "None"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurrenderRequests;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(user);

    const allRequests = JSON.parse(localStorage.getItem("adoptionRequests") || "[]");
    const myRequests = allRequests.filter((r) => r.userEmail === user?.email);
    setRequests(myRequests);
  }, []);

  return (
    <div className="dashboard">
      <div className="manage-header">
        <h2>Your Adoption Requests</h2>
        <Link to="/surrender-pet" className="btn-primary">
          🐾 Send a Pet to Shelter
        </Link>
      </div>

      {requests.length === 0 ? (
        <p>You haven't applied for any pet adoption yet.</p>
      ) : (
        <div className="requests-list">
          {requests.map((req) => (
            <div className="request-card" key={req.id}>
              <img src={req.petImage} alt={req.petName} />
              <div className="request-info">
                <h3>{req.petName}</h3>
                <p>Applicant: {req.fullName}</p>
                <p>Phone: {req.mobile}</p>
                <p className={`status-${req.status.toLowerCase()}`}>
                  Status: {req.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
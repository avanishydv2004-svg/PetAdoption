import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SurrenderPet = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    petType: "Dog",
    petName: "",
    approxAge: "",
    foundLocation: "",
    contactNumber: "",
    reason: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (formData.contactNumber.length !== 10 || !/^\d+$/.test(formData.contactNumber)) {
      setError("Enter a valid 10-digit contact number");
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const requests = JSON.parse(localStorage.getItem("surrenderRequests") || "[]");

    const newRequest = {
      id: Date.now(),
      submittedBy: currentUser?.username || currentUser?.name || "Unknown",
      userEmail: currentUser?.email || currentUser?.username || "guest",
      ...formData,
      status: "Pending",
    };

    requests.push(newRequest);
    localStorage.setItem("surrenderRequests", JSON.stringify(requests));

    setSubmittedRequest(newRequest);
    setSuccess(true);
  };

  const handleDownload = () => {
    const content = `
PETADOPT - SURRENDER / STRAY ANIMAL REQUEST
--------------------------------
Request ID: ${submittedRequest.id}
Submitted By: ${submittedRequest.submittedBy}
Contact Number: ${submittedRequest.contactNumber}

Animal Type: ${submittedRequest.petType}
Pet Name: ${submittedRequest.petName || "Unknown"}
Approximate Age: ${submittedRequest.approxAge}
Location: ${submittedRequest.foundLocation}
Reason: ${submittedRequest.reason}
Additional Notes: ${submittedRequest.notes || "None"}

Status: ${submittedRequest.status}
    `;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `surrender-request-${submittedRequest.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (success) {
    return (
      <div className="payment-success">
        <h2>✅ Request Submitted!</h2>
        <p>Thank you for reaching out. Our shelter team will review your request and contact you soon.</p>
        <div className="btn-group" style={{ justifyContent: "center" }}>
          <button onClick={handleDownload} className="btn-secondary">
            ⬇️ Download Confirmation
          </button>
          <button onClick={() => navigate("/dashboard")} className="btn-primary">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Send a Pet to Adoption Shelter</h2>
        <p className="hint-text">
          If you have a pet you can no longer care for, or found a stray animal, fill this form and our shelter team will get in touch.
        </p>

        {error && <p className="error-text">{error}</p>}

        <label className="field-label">Animal Type</label>
        <select name="petType" value={formData.petType} onChange={handleChange}>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
          <option value="Rabbit">Rabbit</option>
          <option value="Other">Other</option>
        </select>

        <label className="field-label">Pet Name (if known)</label>
        <input
          type="text"
          name="petName"
          placeholder="e.g. Unknown / Tommy"
          value={formData.petName}
          onChange={handleChange}
        />

        <label className="field-label">Approximate Age</label>
        <input
          type="text"
          name="approxAge"
          placeholder="e.g. 1 year, 6 months"
          value={formData.approxAge}
          onChange={handleChange}
          required
        />

        <label className="field-label">Location / Address</label>
        <textarea
          name="foundLocation"
          placeholder="Where the animal is currently / found"
          value={formData.foundLocation}
          onChange={handleChange}
          rows="3"
          required
        />

        <label className="field-label">Your Contact Number</label>
        <input
          type="tel"
          name="contactNumber"
          placeholder="10-digit mobile number"
          value={formData.contactNumber}
          onChange={handleChange}
          maxLength="10"
          required
        />

        <label className="field-label">Reason</label>
        <textarea
          name="reason"
          placeholder="Why are you surrendering this pet / reporting this stray?"
          value={formData.reason}
          onChange={handleChange}
          rows="3"
          required
        />

        <label className="field-label">Additional Notes (optional)</label>
        <textarea
          name="notes"
          placeholder="Health condition, behavior, anything else useful"
          value={formData.notes}
          onChange={handleChange}
          rows="2"
        />

        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default SurrenderPet;
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import pets from "../data/pets";
import { useCart } from "../context/CartContext";

const AdoptForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart } = useCart();

  const [pet, setPet] = useState(null);
  const [petsToAdopt, setPetsToAdopt] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    address: "",
    housingType: "My Own House",
    hasOtherPets: "No",
    reason: "",
  });
  const [errors, setErrors] = useState({});

  const isCartMode = !id;

  useEffect(() => {
    if (isCartMode) {
      setPetsToAdopt(cart);
    } else {
      const adminPets = JSON.parse(localStorage.getItem("adminPets"));
      const source = adminPets && adminPets.length ? adminPets : pets;
      const foundPet = source.find((p) => p.id === parseInt(id));
      setPet(foundPet);
      setPetsToAdopt(foundPet ? [{ ...foundPet, quantity: 1 }] : []);
    }
  }, [id, isCartMode, cart]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (formData.mobile.length !== 10 || !/^\d+$/.test(formData.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Residential address is required";
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "Please tell us why you want to adopt";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const requests = JSON.parse(localStorage.getItem("adoptionRequests") || "[]");

    petsToAdopt.forEach((p) => {
      requests.push({
        id: Date.now() + p.id,
        petId: p.id,
        petName: p.name,
        petImage: p.image,
        quantity: p.quantity,
        userEmail: currentUser?.email || currentUser?.username || "guest",
        ...formData,
        status: "Pending",
      });
    });

    localStorage.setItem("adoptionRequests", JSON.stringify(requests));

    if (isCartMode) {
      navigate("/payment-cart", { state: { formData, items: petsToAdopt } });
    } else {
      navigate(`/payment/${pet.id}`, { state: { formData, items: petsToAdopt } });
    }
  };

  if (petsToAdopt.length === 0) {
    return <p className="not-found">No pet found to adopt.</p>;
  }

  const totalFee = petsToAdopt.reduce((sum, p) => sum + p.fee * p.quantity, 0);

  return (
    <div className="form-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{isCartMode ? "Adopt Selected Pets" : `Adopt ${pet.name}`}</h2>

        <div className="adopt-pet-list">
          {petsToAdopt.map((p) => (
            <div className="adopt-pet-mini" key={p.id}>
              <img src={p.image} alt={p.name} />
              <span>{p.name} x{p.quantity} (₹{p.fee * p.quantity})</span>
            </div>
          ))}
        </div>

        <p className="hint-text">Total Adoption Fee: ₹{totalFee}</p>

        <label className="field-label">Full Name</label>
        <input
          type="text"
          name="fullName"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={handleChange}
        />
        {errors.fullName && <p className="error-text">{errors.fullName}</p>}

        <label className="field-label">Email Address</label>
        <input
          type="email"
          name="email"
          placeholder="Enter email address"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}

        <label className="field-label">Mobile Number</label>
        <input
          type="tel"
          name="mobile"
          placeholder="Enter 10-digit mobile number"
          value={formData.mobile}
          onChange={handleChange}
          maxLength="10"
        />
        {errors.mobile && <p className="error-text">{errors.mobile}</p>}

        <label className="field-label">Residential Address</label>
        <textarea
          name="address"
          placeholder="Enter complete address"
          value={formData.address}
          onChange={handleChange}
          rows="3"
        />
        {errors.address && <p className="error-text">{errors.address}</p>}

        <label className="field-label">Housing Type</label>
        <select name="housingType" value={formData.housingType} onChange={handleChange}>
          <option value="My Own House">My Own House</option>
          <option value="Rented House">Rented House</option>
          <option value="Apartment">Apartment</option>
          <option value="Farm House">Farm House</option>
        </select>

        <label className="field-label">Do you have other pets?</label>
        <select name="hasOtherPets" value={formData.hasOtherPets} onChange={handleChange}>
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>

        <label className="field-label">Why do you want to adopt?</label>
        <textarea
          name="reason"
          placeholder="Briefly state your reason for adoption"
          value={formData.reason}
          onChange={handleChange}
          rows="3"
        />
        {errors.reason && <p className="error-text">{errors.reason}</p>}

        <button type="submit">Submit & Proceed to Payment</button>
      </form>
    </div>
  );
};

export default AdoptForm;
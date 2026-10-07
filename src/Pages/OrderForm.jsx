import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";

const OrderForm = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const productItems = cart.filter((item) => item.itemType === "product");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    address: "",
  });
  const [errors, setErrors] = useState({});

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
      newErrors.address = "Delivery address is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const requests = JSON.parse(localStorage.getItem("productRequests") || "[]");

    productItems.forEach((p) => {
      requests.push({
        id: Date.now() + p.id,
        productId: p.id,
        productName: p.name,
        productImage: p.image,
        quantity: p.quantity,
        userEmail: currentUser?.email || currentUser?.username || "guest",
        ...formData,
        status: "Pending",
      });
    });

    localStorage.setItem("productRequests", JSON.stringify(requests));

    navigate("/product-payment", { state: { formData, items: productItems } });
  };

  if (productItems.length === 0) {
    return <p className="not-found">No products in cart to order.</p>;
  }

  const totalFee = productItems.reduce((sum, p) => sum + p.fee * p.quantity, 0);

  return (
    <div className="form-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Order Products</h2>

        <div className="adopt-pet-list">
          {productItems.map((p) => (
            <div className="adopt-pet-mini" key={p.id}>
              <img src={p.image} alt={p.name} />
              <span>{p.name} x{p.quantity} (₹{p.fee * p.quantity})</span>
            </div>
          ))}
        </div>

        <p className="hint-text">Total Amount: ₹{totalFee}</p>

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

        <label className="field-label">Delivery Address</label>
        <textarea
          name="address"
          placeholder="Enter complete delivery address"
          value={formData.address}
          onChange={handleChange}
          rows="3"
        />
        {errors.address && <p className="error-text">{errors.address}</p>}

        <button type="submit">Submit & Proceed to Payment</button>
      </form>
    </div>
  );
};

export default OrderForm;
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import pets from "../data/pets";
import { useCart } from "../context/CartContext";

const PetDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [pet, setPet] = useState(null);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    const adminPets = JSON.parse(localStorage.getItem("adminPets"));
    const source = adminPets && adminPets.length ? adminPets : pets;
    const foundPet = source.find((p) => p.id === parseInt(id));
    setPet(foundPet);
  }, [id]);

  if (!pet) {
    return <p className="not-found">Pet not found.</p>;
  }

  const handleAddToCart = () => {
    addToCart(pet);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2000);
  };

  return (
    <div className="pet-details">
      <div className="pet-details-image">
        <img src={pet.image} alt={pet.name} />
      </div>
      <div className="pet-details-info">
        <h1>{pet.name}</h1>
        <p><strong>Type:</strong> {pet.type}</p>
        <p><strong>Breed:</strong> {pet.breed}</p>
        <p><strong>Age:</strong> {pet.age}</p>
        <p><strong>Gender:</strong> {pet.gender}</p>
        <p><strong>Location:</strong> {pet.location}</p>
        <p><strong>Adoption Fee:</strong> ₹{pet.fee}</p>
        <p><strong>Status:</strong> {pet.status}</p>
        <p>
          <strong>Vaccination:</strong>{" "}
          <span className={pet.vaccinated ? "vaccinated-yes" : "vaccinated-no"}>
            {pet.vaccinated ? "✅ Vaccinated" : "❌ Not Vaccinated"}
          </span>
        </p>
        <p className="pet-description">{pet.description}</p>

        {addedMessage && <p className="success-text">Added to cart!</p>}

        {pet.status === "Available" ? (
          <div className="btn-group">
            <button onClick={handleAddToCart} className="btn-secondary">Add to Cart</button>
          </div>
        ) : (
          <p className="status-adopted">This pet has already been adopted.</p>
        )}

        <Link to="/pets" className="back-link">← Back to Pets</Link>
      </div>
    </div>
  );
};

export default PetDetails;
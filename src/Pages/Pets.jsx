import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import pets from "../data/pets";
import petTypes from "../data/petTypes";
import { useSearch } from "../context/SearchContext";
import { useWishlist } from "../context/WishlistContext";

const Pets = () => {
  const {
    searchTerm,
    setSearchTerm,
    typeFilters,
    toggleTypeFilter,
    vaccinationFilter,
    setVaccinationFilter,
  } = useSearch();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [allPets, setAllPets] = useState([]);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  useEffect(() => {
    const adminPets = JSON.parse(localStorage.getItem("adminPets"));
    setAllPets(adminPets && adminPets.length ? adminPets : pets);
  }, []);

  const filteredPets = allPets.filter((pet) => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilters.length === 0 || typeFilters.includes(pet.type);
    const matchesVaccination =
      vaccinationFilter === "All" ||
      (vaccinationFilter === "Vaccinated" && pet.vaccinated) ||
      (vaccinationFilter === "Not Vaccinated" && !pet.vaccinated);
    return matchesSearch && matchesType && matchesVaccination;
  });

  const typeDropdownLabel =
    typeFilters.length === 0 ? "All Types" : typeFilters.join(", ");

  return (
    <div className="pets-page">
      <h1>Available Pets</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search pet by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="type-dropdown-wrapper">
          <button
            type="button"
            className="type-dropdown-btn"
            onClick={() => setShowTypeDropdown((prev) => !prev)}
          >
            {typeDropdownLabel} ▾
          </button>

          {showTypeDropdown && (
            <div className="type-dropdown-menu">
              {petTypes.map((type) => (
                <label key={type} className="type-checkbox">
                  <input
                    type="checkbox"
                    checked={typeFilters.includes(type)}
                    onChange={() => toggleTypeFilter(type)}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <select value={vaccinationFilter} onChange={(e) => setVaccinationFilter(e.target.value)}>
          <option value="All">All Vaccination Status</option>
          <option value="Vaccinated">Vaccinated</option>
          <option value="Not Vaccinated">Not Vaccinated</option>
        </select>
      </div>

      <div className="pets-grid">
        {filteredPets.length === 0 && <p>No pets found.</p>}
        {filteredPets.map((pet) => (
          <div className="pet-card" key={pet.id}>
            <div className="wishlist-img-wrapper">
              <img src={pet.image} alt={pet.name} />
              <button
                className={`wishlist-heart-btn ${isWishlisted(pet.id, "pet") ? "active" : ""}`}
                onClick={() => toggleWishlist(pet, "pet")}
                title="Save to wishlist"
              >
                {isWishlisted(pet.id, "pet") ? "❤️" : "🤍"}
              </button>
            </div>
            <h3>{pet.name}</h3>
            <p>{pet.breed} • {pet.age} • {pet.gender}</p>
            <p className={pet.status === "Available" ? "status-available" : "status-adopted"}>
              {pet.status}
            </p>
            <p>
              <span className={pet.vaccinated ? "vaccinated-yes" : "vaccinated-no"}>
                {pet.vaccinated ? "✅ Vaccinated" : "❌ Not Vaccinated"}
              </span>
            </p>
            <Link to={`/pets/${pet.id}`} className="btn-secondary">View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pets;
import { Link } from "react-router-dom";
import pets from "../data/pets";

const Home = () => {
  const featuredPets = pets.slice(0, 3);

  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-text">
          <h1>Find Your Perfect Companion</h1>
          <p>Adopt a pet today and give them a loving forever home.</p>
          <Link to="/pets" className="btn-primary">Browse Pets</Link>
        </div>
      </section>

      <section className="featured-section">
        <h2>Featured Pets</h2>
        <div className="pets-grid">
          {featuredPets.map((pet) => (
            <div className="pet-card" key={pet.id}>
              <img src={pet.image} alt={pet.name} />
              <h3>{pet.name}</h3>
              <p>{pet.breed} • {pet.age}</p>
              <Link to={`/pets/${pet.id}`} className="btn-secondary">View Details</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <h3>1. Browse</h3>
            <p>Explore pets available for adoption near you.</p>
          </div>
          <div className="step">
            <h3>2. Apply</h3>
            <p>Fill out an adoption form for the pet you love.</p>
          </div>
          <div className="step">
            <h3>3. Adopt</h3>
            <p>Complete the process and bring your new friend home.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  if (isLoginPage) {
    return (
      <nav className="navbar">
        <span className="nav-logo">
          <span className="logo-icon">🐾</span>
          <span className="logo-text">PetAdopt</span>
        </span>
        <div className="nav-links">
          <button onClick={toggleTheme} className="theme-toggle-btn">
            {isDark ? "☀️" : "🌙"}
          </button>
          <Link to="/register" className="nav-btn nav-register-btn">Register</Link>
        </div>
      </nav>
    );
  }

  if (isRegisterPage) {
    return (
      <nav className="navbar">
        <span className="nav-logo">
          <span className="logo-icon">🐾</span>
          <span className="logo-text">PetAdopt</span>
        </span>
        <div className="nav-links">
          <button onClick={toggleTheme} className="theme-toggle-btn">
            {isDark ? "☀️" : "🌙"}
          </button>
          <Link to="/login" className="nav-btn nav-register-btn">Login</Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <span className="logo-icon">🐾</span>
        <span className="logo-text">PetAdopt</span>
      </Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/pets">Pets</Link>
        <Link to="/products">Products</Link>
        <Link to="/cart">Cart ({cart.length})</Link>
        <button onClick={toggleTheme} className="theme-toggle-btn">
          {isDark ? "☀️" : "🌙"}
        </button>
        {user ? (
          <>
            <Link to="/dashboard" className="nav-welcome">
              Welcome, {user.username || user.name}
            </Link>
            <button onClick={handleLogout} className="nav-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="nav-btn nav-register-btn">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
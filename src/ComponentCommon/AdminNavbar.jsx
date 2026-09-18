import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <nav className="navbar admin-navbar">
      <Link to="/admin" className="nav-logo">🐾 Admin Panel</Link>
      <div className="nav-links">
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/manage-pets">Manage Pets</Link>
        <Link to="/admin/manage-requests">Manage Requests</Link>
        <Link to="/admin/manage-products">Manage Products</Link>
        <Link to="/admin/product-requests">Product Requests</Link>
        <Link to="/admin/surrender-requests">Surrender Requests</Link>
        <button onClick={toggleTheme} className="theme-toggle-btn">
          {isDark ? "☀️" : "🌙"}
        </button>
        <button onClick={handleLogout} className="nav-btn">Logout</button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
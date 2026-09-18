import { useEffect, useState } from "react";
import pets from "../../data/pets";
import products from "../../data/products";

const AdminDashboard = () => {
  const [petList, setPetList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [requests, setRequests] = useState([]);
  const [productRequests, setProductRequests] = useState([]);
  const [activeView, setActiveView] = useState(null);

  useEffect(() => {
    const adminPets = JSON.parse(localStorage.getItem("adminPets"));
    setPetList(adminPets && adminPets.length ? adminPets : pets);

    const adminProducts = JSON.parse(localStorage.getItem("adminProducts"));
    setProductList(adminProducts && adminProducts.length ? adminProducts : products);

    const savedRequests = JSON.parse(localStorage.getItem("adoptionRequests") || "[]");
    setRequests(savedRequests);

    const savedProductRequests = JSON.parse(localStorage.getItem("productRequests") || "[]");
    setProductRequests(savedProductRequests);
  }, []);

  const pendingRequests = requests.filter((r) => r.status !== "Adopted");
  const pendingProductRequests = productRequests.filter((r) => r.status !== "Delivered");

  const closeModal = () => setActiveView(null);

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card stat-clickable" onClick={() => setActiveView("pets")}>
          <h3>Total Pets</h3>
          <p>{petList.length}</p>
        </div>
        <div className="stat-card stat-clickable" onClick={() => setActiveView("requests")}>
          <h3>Total Adoption Requests</h3>
          <p>{requests.length}</p>
        </div>
        <div className="stat-card stat-clickable" onClick={() => setActiveView("pending")}>
          <h3>Pending Adoption Requests</h3>
          <p>{pendingRequests.length}</p>
        </div>
        <div className="stat-card stat-clickable" onClick={() => setActiveView("products")}>
          <h3>Total Products</h3>
          <p>{productList.length}</p>
        </div>
        <div className="stat-card stat-clickable" onClick={() => setActiveView("productRequests")}>
          <h3>Total Product Requests</h3>
          <p>{productRequests.length}</p>
        </div>
        <div className="stat-card stat-clickable" onClick={() => setActiveView("pendingProductRequests")}>
          <h3>Pending Product Requests</h3>
          <p>{pendingProductRequests.length}</p>
        </div>
      </div>

      {activeView && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>✕</button>

            {activeView === "pets" && (
              <>
                <h2 className="confirmation-title">🐾 All Pets</h2>
                <table className="admin-table">
                  <thead>
                    <tr><th>ID</th><th>Image</th><th>Name</th><th>Type</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {petList.map((pet) => (
                      <tr key={pet.id}>
                        <td>{pet.id}</td>
                        <td><img src={pet.image} alt={pet.name} className="table-img" /></td>
                        <td>{pet.name}</td>
                        <td>{pet.type}</td>
                        <td>{pet.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {activeView === "requests" && (
              <>
                <h2 className="confirmation-title">📋 All Adoption Requests</h2>
                <table className="admin-table">
                  <thead>
                    <tr><th>ID</th><th>Pet ID</th><th>Pet</th><th>Applicant</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={req.id}>
                        <td>{req.id}</td>
                        <td>{req.petId}</td>
                        <td>{req.petName}</td>
                        <td>{req.fullName}</td>
                        <td>{req.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {activeView === "pending" && (
              <>
                <h2 className="confirmation-title">⏳ Pending Adoption Requests</h2>
                {pendingRequests.length === 0 ? (
                  <p>No pending requests.</p>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr><th>ID</th><th>Pet ID</th><th>Pet</th><th>Applicant</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {pendingRequests.map((req) => (
                        <tr key={req.id}>
                          <td>{req.id}</td>
                          <td>{req.petId}</td>
                          <td>{req.petName}</td>
                          <td>{req.fullName}</td>
                          <td>{req.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}

            {activeView === "products" && (
              <>
                <h2 className="confirmation-title">🛒 All Products</h2>
                <table className="admin-table">
                  <thead>
                    <tr><th>ID</th><th>Image</th><th>Name</th><th>Category</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {productList.map((product) => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td><img src={product.image} alt={product.name} className="table-img" /></td>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>{product.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {activeView === "productRequests" && (
              <>
                <h2 className="confirmation-title">📋 All Product Requests</h2>
                <table className="admin-table">
                  <thead>
                    <tr><th>ID</th><th>Product ID</th><th>Product</th><th>Customer</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {productRequests.map((req) => (
                      <tr key={req.id}>
                        <td>{req.id}</td>
                        <td>{req.productId}</td>
                        <td>{req.productName}</td>
                        <td>{req.fullName}</td>
                        <td>{req.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {activeView === "pendingProductRequests" && (
              <>
                <h2 className="confirmation-title">⏳ Pending Product Requests</h2>
                {pendingProductRequests.length === 0 ? (
                  <p>No pending requests.</p>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr><th>ID</th><th>Product ID</th><th>Product</th><th>Customer</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {pendingProductRequests.map((req) => (
                        <tr key={req.id}>
                          <td>{req.id}</td>
                          <td>{req.productId}</td>
                          <td>{req.productName}</td>
                          <td>{req.fullName}</td>
                          <td>{req.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
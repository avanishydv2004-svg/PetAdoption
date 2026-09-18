import { useState, useEffect } from "react";
import products from "../../data/products";

const ManageProducts = () => {
  const [productList, setProductList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: "", category: "Food", brand: "", fee: "", image: "",
    description: "", stock: "", status: "Available",
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("adminProducts"));
    setProductList(saved && saved.length ? saved : products);
  }, []);

  const saveProducts = (updatedList) => {
    setProductList(updatedList);
    localStorage.setItem("adminProducts", JSON.stringify(updatedList));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      name: "", category: "Food", brand: "", fee: "", image: "",
      description: "", stock: "", status: "Available",
    });
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      const updated = productList.map((p) =>
        p.id === editId
          ? { ...formData, id: editId, fee: Number(formData.fee), stock: Number(formData.stock) }
          : p
      );
      saveProducts(updated);
    } else {
      const newProduct = {
        ...formData,
        id: 200000 + productList.length + 1,
        fee: Number(formData.fee),
        stock: Number(formData.stock),
      };
      saveProducts([...productList, newProduct]);
    }
    resetForm();
  };

  const handleEdit = (product) => {
    setFormData({ ...product, stock: product.stock ?? "" });
    setEditId(product.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const updated = productList.filter((p) => p.id !== id);
    saveProducts(updated);
  };

  return (
    <div className="manage-page">
      <div className="manage-header">
        <h1>Manage Products</h1>
        <button className="btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
          {showForm ? "Cancel" : "+ Add New Product"}
        </button>
      </div>

      {showForm && (
        <form className="auth-form" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required />
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="Food">Food</option>
            <option value="Toy">Toy</option>
            <option value="Accessory">Accessory</option>
            <option value="Grooming">Grooming</option>
            <option value="Housing">Housing</option>
          </select>
          <input type="text" name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} required />
          <input type="text" name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} required />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
          <input type="number" name="fee" placeholder="Price" value={formData.fee} onChange={handleChange} required />

          <label className="field-label">Stock Quantity</label>
          <input
            type="number"
            name="stock"
            placeholder="e.g. 10"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            required
          />

          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Available">Available</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

          <button type="submit">{editId ? "Update Product" : "Add Product"}</button>
        </form>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Image</th><th>Name</th><th>Category</th><th>Brand</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {productList.map((product) => (
            <tr key={product.id}>
              <td><img src={product.image} alt={product.name} className="table-img" /></td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.brand}</td>
              <td>₹{product.fee}</td>
              <td>{product.stock ?? "-"}</td>
              <td>{product.status}</td>
              <td>
                <button onClick={() => handleEdit(product)} className="btn-secondary">Edit</button>
                <button onClick={() => handleDelete(product.id)} className="btn-remove">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageProducts;
import { useState, useEffect } from "react";
import pets from "../../data/pets";
import petTypes from "../../data/petTypes";

const ManagePets = () => {
  const [petList, setPetList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: "", type: "Dog", breed: "", age: "", gender: "Male",
    image: "", description: "", location: "", fee: "", status: "Available",
    stock: "", vaccinated: true,
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("adminPets"));
    setPetList(saved && saved.length ? saved : pets);
  }, []);

  const savePets = (updatedList) => {
    setPetList(updatedList);
    localStorage.setItem("adminPets", JSON.stringify(updatedList));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const resetForm = () => {
    setFormData({
      name: "", type: "Dog", breed: "", age: "", gender: "Male",
      image: "", description: "", location: "", fee: "", status: "Available",
      stock: "", vaccinated: true,
    });
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      const updated = petList.map((p) =>
        p.id === editId
          ? { ...formData, id: editId, fee: Number(formData.fee), stock: Number(formData.stock) }
          : p
      );
      savePets(updated);
    } else {
      const newPet = {
        ...formData,
        id: 100000 + petList.length + 1,
        fee: Number(formData.fee),
        stock: Number(formData.stock),
      };
      savePets([...petList, newPet]);
    }
    resetForm();
  };

  const handleEdit = (pet) => {
    setFormData({ ...pet, stock: pet.stock ?? "" });
    setEditId(pet.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const updated = petList.filter((p) => p.id !== id);
    savePets(updated);
  };

  return (
    <div className="manage-page">
      <div className="manage-header">
        <h1>Manage Pets</h1>
        <button className="btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
          {showForm ? "Cancel" : "+ Add New Pet"}
        </button>
      </div>

      {showForm && (
        <form className="auth-form" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Pet Name" value={formData.name} onChange={handleChange} required />
          <select name="type" value={formData.type} onChange={handleChange}>
            {petTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <input type="text" name="breed" placeholder="Breed" value={formData.breed} onChange={handleChange} required />
          <input type="text" name="age" placeholder="Age (e.g. 2 years)" value={formData.age} onChange={handleChange} required />
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input type="text" name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} required />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
          <input type="text" name="location" placeholder="Shelter Location" value={formData.location} onChange={handleChange} required />
          <input type="number" name="fee" placeholder="Adoption Fee" value={formData.fee} onChange={handleChange} required />

          <label className="field-label">Pet Quantity (Available Stock)</label>
          <input
            type="number"
            name="stock"
            placeholder="e.g. 5"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            max="10"
            required
          />

          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Available">Available</option>
            <option value="Adopted">Adopted</option>
          </select>

          <label className="terms-check">
            <input
              type="checkbox"
              name="vaccinated"
              checked={formData.vaccinated}
              onChange={handleChange}
            />
            <span>Vaccinated</span>
          </label>

          <button type="submit">{editId ? "Update Pet" : "Add Pet"}</button>
        </form>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Image</th><th>Name</th><th>Type</th><th>Breed</th><th>Fee</th><th>Stock</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {petList.map((pet) => (
            <tr key={pet.id}>
              <td><img src={pet.image} alt={pet.name} className="table-img" /></td>
              <td>{pet.name}</td>
              <td>{pet.type}</td>
              <td>{pet.breed}</td>
              <td>₹{pet.fee}</td>
              <td>{pet.stock ?? "-"}</td>
              <td>{pet.status}</td>
              <td>
                <button onClick={() => handleEdit(pet)} className="btn-secondary">Edit</button>
                <button onClick={() => handleDelete(pet.id)} className="btn-remove">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagePets;
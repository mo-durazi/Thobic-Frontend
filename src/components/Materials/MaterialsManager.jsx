import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MaterialsManager.css";

export default function MaterialsManager() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal / Form state for Add/Edit
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    colour: "",
    price: "",
    description: "",
    texture: "smooth",
    pattern: "plain",
    season: "Summer",
    stand: "Stand",
    lead_time_days: 0,
    is_available: true,
    image_url: "",
  });

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchMyMaterials();
  }, []);

  const fetchMyMaterials = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      // Uses your backend route: GET /api/materials/mine
      const response = await axios.get(
        "http://localhost:8000/api/materials/mine",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setMaterials(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch your materials.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: "",
      colour: "",
      price: "",
      description: "",
      texture: "smooth",
      pattern: "plain",
      season: "Summer",
      stand: "Stand",
      lead_time_days: 0,
      is_available: true,
      image_url: "",
    });
    setShowForm(true);
  };

  const handleOpenEdit = (mat) => {
    setIsEditing(true);
    setCurrentId(mat.id);
    setFormData({
      name: mat.name,
      colour: mat.colour,
      price: mat.price,
      description: mat.description || "",
      texture: mat.texture,
      pattern: mat.pattern,
      season: mat.season,
      stand: mat.stand,
      lead_time_days: mat.lead_time_days || 0,
      is_available: mat.is_available,
      image_url: mat.image_url || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      if (isEditing) {
        await axios.put(
          `http://localhost:8000/api/materials/${currentId}`,
          formData,
          { headers },
        );
        alert("Material updated successfully!");
      } else {
        await axios.post("http://localhost:8000/api/materials", formData, {
          headers,
        });
        alert("Material added successfully!");
      }

      setShowForm(false);
      fetchMyMaterials();
    } catch (err) {
      alert(err.response?.data?.detail || "Operation failed.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this material?"))
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/api/materials/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Material deleted.");
      fetchMyMaterials();
    } catch (err) {
      alert("Failed to delete material.");
    }
  };

  const toggleAvailability = async (mat) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8000/api/materials/${mat.id}`,
        {
          ...mat,
          is_available: !mat.is_available,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      fetchMyMaterials();
    } catch (err) {
      alert("Failed to update availability.");
    }
  };

  if (loading)
    return <p className="text-center mt-10">Loading your stock...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage My Materials Stock</h1>
        <button
          onClick={handleOpenAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          + Add New Material
        </button>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="bg-gray-50 border p-6 rounded-lg mb-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? "Edit Material" : "Add New Material"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Material Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border p-2 rounded text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Colour *
              </label>
              <input
                type="text"
                value={formData.colour}
                onChange={(e) =>
                  setFormData({ ...formData, colour: e.target.value })
                }
                className="w-full border p-2 rounded text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Price per Metre ($) *
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value),
                  })
                }
                className="w-full border p-2 rounded text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Lead Time (Days)
              </label>
              <input
                type="number"
                value={formData.lead_time_days}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    lead_time_days: parseInt(e.target.value),
                  })
                }
                className="w-full border p-2 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Texture
              </label>
              <select
                value={formData.texture}
                onChange={(e) =>
                  setFormData({ ...formData, texture: e.target.value })
                }
                className="w-full border p-2 rounded text-sm"
              >
                <option value="smooth">Smooth</option>
                <option value="rough">Rough</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Pattern
              </label>
              <select
                value={formData.pattern}
                onChange={(e) =>
                  setFormData({ ...formData, pattern: e.target.value })
                }
                className="w-full border p-2 rounded text-sm"
              >
                <option value="plain">Plain</option>
                <option value="pattern">Pattern</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Season
              </label>
              <select
                value={formData.season}
                onChange={(e) =>
                  setFormData({ ...formData, season: e.target.value })
                }
                className="w-full border p-2 rounded text-sm"
              >
                <option value="Summer">Summer</option>
                <option value="Winter">Winter</option>
                <option value="Spring">Spring</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Stand Quality
              </label>
              <select
                value={formData.stand}
                onChange={(e) =>
                  setFormData({ ...formData, stand: e.target.value })
                }
                className="w-full border p-2 rounded text-sm"
              >
                <option value="Stand">Stand</option>
                <option value="half-Stand">Half-Stand</option>
                <option value="loose">Loose</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="text"
                value={formData.image_url}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
                className="w-full border p-2 rounded text-sm"
                placeholder="https://..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border p-2 rounded text-sm"
                rows="2"
              />
            </div>
            <div className="flex items-center gap-2 md:col-span-2">
              <input
                type="checkbox"
                checked={formData.is_available}
                onChange={(e) =>
                  setFormData({ ...formData, is_available: e.target.checked })
                }
                id="is_avail"
              />
              <label htmlFor="is_avail" className="text-sm font-medium">
                Available for clients to order
              </label>
            </div>

            <div className="flex gap-4 md:col-span-2 pt-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
              >
                {isEditing ? "Save Changes" : "Create Material"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Materials Table */}
      {materials.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          You have no materials listed in your inventory.
        </p>
      ) : (
        <div className="overflow-x-auto border rounded-lg shadow-sm bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b text-xs text-gray-600 uppercase">
                <th className="p-3">Name</th>
                <th className="p-3">Colour</th>
                <th className="p-3">Price/m</th>
                <th className="p-3">Season</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {materials.map((mat) => (
                <tr key={mat.id} className="hover:bg-gray-50">
                  <td className="p-3 font-medium">{mat.name}</td>
                  <td className="p-3 text-gray-600">{mat.colour}</td>
                  <td className="p-3 text-gray-600">${mat.price}</td>
                  <td className="p-3 text-gray-600">{mat.season}</td>
                  <td className="p-3">
                    <button
                      onClick={() => toggleAvailability(mat)}
                      className={`px-2 py-0.5 text-xs font-semibold rounded ${
                        mat.is_available
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {mat.is_available ? "Available" : "Unavailable"}
                    </button>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(mat)}
                      className="bg-blue-50 text-blue-600 px-2.5 py-1 text-xs rounded hover:bg-blue-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(mat.id)}
                      className="bg-red-50 text-red-600 px-2.5 py-1 text-xs rounded hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

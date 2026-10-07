import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, editOrder } from "../../services/orderService";
import { getShopProfile } from "../../services/shopService";

export default function OrderEdit() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    material_id: "",
    material_amount: 1.0,
    style: {},
    requested_deadline: "",
    note: "",
  });

  useEffect(() => {
    loadOrderAndShop();
  }, [orderId]);

  const loadOrderAndShop = async () => {
    try {
      setLoading(true);
      const order = await getOrderById(orderId);

      // Enforce backend rule: Only pending orders can be edited
      if (order.status !== "pending") {
        setError("Only pending orders can be edited.");
        setLoading(false);
        return;
      }

      setFormData({
        material_id: order.material_id,
        material_amount: order.material_amount,
        style: order.style || {},
        requested_deadline: order.requested_deadline || "",
        note: order.note || "",
      });

      // Fetch shop materials using the tailor_id from the order
      const shopData = await getShopProfile(order.tailor_id);
      setMaterials(shopData.materials || []);
      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to load order for editing.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await editOrder(orderId, formData);
      navigate(`/my-orders`); // Back to orders view
    } catch (err) {
      // Show backend 409 or validation message as text on the page
      setError(err.response?.data?.detail || "Failed to save order changes.");
    }
  };

  if (loading) return <p className="loading-state">Loading order details...</p>;
  if (error)
    return <p className="error-state text-red-600 font-semibold">{error}</p>;

  return (
    <div className="order-edit-container p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Pending Order #{orderId}</h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block mb-1 font-medium">Material</label>
          <select
            value={formData.material_id}
            onChange={(e) =>
              setFormData({
                ...formData,
                material_id: parseInt(e.target.value),
              })
            }
            className="border p-2 rounded w-full"
            required
          >
            <option value="">Select Material</option>
            {materials.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} (${m.price}/m)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Material Amount (Meters)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.material_amount}
            onChange={(e) =>
              setFormData({
                ...formData,
                material_amount: parseFloat(e.target.value),
              })
            }
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Requested Deadline</label>
          <input
            type="date"
            value={formData.requested_deadline}
            onChange={(e) =>
              setFormData({ ...formData, requested_deadline: e.target.value })
            }
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Note</label>
          <textarea
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

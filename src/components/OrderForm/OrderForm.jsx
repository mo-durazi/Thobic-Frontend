import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getShopProfile } from "../../services/shopService";
import { createOrder } from "../../services/orderService";
import API from "../../services/api"; // For checking measurements
import "./OrderForm.css";

export default function OrderForm() {
  const { shopId } = useParams();
  const navigate = useNavigate();

  const [measurements, setMeasurements] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form payload matching ThoubOrderCreateSchema
  const [formData, setFormData] = useState({
    tailor_id: parseInt(shopId),
    material_id: "",
    material_amount: 3.0, // Default typical meters for a thawb
    style: { collar: "Standard", cuff: "Normal", pocket: "Yes" },
    requested_deadline: "",
    note: "",
  });

  useEffect(() => {
    loadData();
  }, [shopId]);

  const loadData = async () => {
    try {
      setLoading(true);
      // 1. Check if client has saved measurements
      try {
        const measRes = await API.get("/measurements/me");
        setMeasurements(measRes.data);
      } catch (err) {
        setMeasurements(null); // Not found or error
      }

      // 2. Fetch shop details and its available in-stock materials
      const shopData = await getShopProfile(shopId);
      setMaterials(shopData.materials || []);
      setError(null);
    } catch (err) {
      setError("Failed to load shop details or materials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!measurements) {
      alert(
        "You must add your measurements in your profile before placing an order!",
      );
      navigate("/measurements");
      return;
    }

    try {
      setSubmitting(true);
      // Calls the updated createOrder service matching backend /api/orders
      await createOrder(formData);
      alert("Order placed successfully! Status is pending.");
      navigate("/my-orders"); // Route to client's orders dashboard
    } catch (err) {
      alert(err || "Failed to place order. Please check inputs.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <p className="text-center mt-10">Loading order form...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="order-form-container max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Place Thoub Order</h2>

      {/* Measurement Status Alert Box */}
      <div
        className={`p-4 mb-6 rounded ${measurements ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
      >
        {measurements ? (
          <p className="text-sm font-medium">
            ✓ Your saved measurements are ready and will be snapshotted to this
            order.
          </p>
        ) : (
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">
              ⚠ No measurements profile found.
            </p>
            <button
              type="button"
              onClick={() => navigate("/measurements")}
              className="bg-red-600 text-white px-3 py-1 text-xs rounded hover:bg-red-700"
            >
              Add Measurements
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Material Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Material *
          </label>
          <select
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
            value={formData.material_id}
            onChange={(e) =>
              setFormData({
                ...formData,
                material_id: parseInt(e.target.value),
              })
            }
            required
          >
            <option value="">-- Choose an available material --</option>
            {materials.map((mat) => (
              <option key={mat.id} value={mat.id}>
                {mat.name} ({mat.colour}) — ${mat.price}/meter
              </option>
            ))}
          </select>
          {materials.length === 0 && (
            <p className="text-xs text-amber-600 mt-1">
              Note: This shop currently has no active materials listed.
            </p>
          )}
        </div>

        {/* Material Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Material Amount (Meters) *
          </label>
          <input
            type="number"
            step="0.1"
            min="0.5"
            className="w-full border p-2 rounded"
            value={formData.material_amount}
            onChange={(e) =>
              setFormData({
                ...formData,
                material_amount: parseFloat(e.target.value),
              })
            }
            required
          />
        </div>

        {/* Requested Deadline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Requested Deadline *
          </label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={formData.requested_deadline}
            onChange={(e) =>
              setFormData({ ...formData, requested_deadline: e.target.value })
            }
            required
          />
        </div>

        {/* Style customizations (Optional/Basic dictionary) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Collar Style
            </label>
            <select
              className="w-full border p-2 rounded text-sm"
              value={formData.style.collar}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  style: { ...formData.style, collar: e.target.value },
                })
              }
            >
              <option value="Standard">Standard</option>
              <option value="Collar">Collar / Closed</option>
              <option value="Round">Round</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Cuff Style
            </label>
            <select
              className="w-full border p-2 rounded text-sm"
              value={formData.style.cuff}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  style: { ...formData.style, cuff: e.target.value },
                })
              }
            >
              <option value="Normal">Normal</option>
              <option value="Button">Button Cuff</option>
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes for Tailor
          </label>
          <textarea
            className="w-full border p-2 rounded"
            rows="3"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            placeholder="Add any specific tailor preferences here..."
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-1/2 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !measurements}
            className={`w-1/2 py-2 rounded text-white transition ${
              submitting || !measurements
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {submitting ? "Submitting..." : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
}

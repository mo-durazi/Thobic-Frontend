import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { createOrder } from "../../services/orderService";
import API from "../../services/api"; // For checking measurements
import MaterialPicker from "../MaterialPicker/MaterialPicker";
import "./OrderForm.css";

export default function OrderForm() {
  const { shopId } = useParams();
  const navigate = useNavigate();

  const [measurements, setMeasurements] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    tailor_id: parseInt(shopId),
    material_id: "",
    material_amount: 3.0, // Default typical meters for a thawb
    style: { collar: "Standard", cuff: "Normal", pocket: "Yes" },
    requested_deadline: "",
    note: "",
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const measRes = await API.get("/measurements/me");
        setMeasurements(measRes.data);
      } catch {
        setMeasurements(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSelectMaterial = (material) => {
    setSelectedMaterial(material);
    setFormData({ ...formData, material_id: material.id });
  };

  const estimatedCost =
    selectedMaterial &&
    (Number(selectedMaterial.price) * (formData.material_amount || 0)).toFixed(3);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMaterial) return;

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
    return <p className="order-form-status">Loading order form...</p>;

  return (
    <div className="order-form container">
      <h2 className="order-form-title">Place Thoub Order</h2>

      {/* Measurement Status Alert Box */}
      <div
        className={`order-form-notice ${measurements ? "order-form-notice-success" : "order-form-notice-missing"}`}
      >
        {measurements ? (
          <p className="order-form-notice-text">
            ✓ Your saved measurements are ready and will be snapshotted to this
            order.
          </p>
        ) : (
          <div className="order-form-notice-row">
            <p className="order-form-notice-text">
              ⚠ No measurements profile found.
            </p>
            <button
              type="button"
              onClick={() => navigate("/measurements")}
              className="secondary-button order-form-notice-button"
            >
              Add Measurements
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="order-form-body">
        {/* Material Selection */}
        <div className="order-form-section">
          <label className="order-form-section-label">
            Select Material *
          </label>
          {selectedMaterial && (
            <div className="order-form-summary">
              <p className="order-form-summary-material">
                <strong>{selectedMaterial.name}</strong> —{" "}
                {selectedMaterial.price} BHD / metre
              </p>
              <p className="order-form-summary-cost">Estimated material cost: {estimatedCost} BHD</p>
            </div>
          )}
          <MaterialPicker
            shopId={shopId}
            selectedMaterialId={selectedMaterial?.id}
            onSelect={handleSelectMaterial}
          />
        </div>

        {/* Material Amount */}
        <div className="order-form-section order-form-field">
          <label className="order-form-label">
            Material Amount (Meters) *
          </label>
          <input
            type="number"
            step="0.1"
            min="0.5"
            className="order-form-input"
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
        <div className="order-form-section order-form-field">
          <label className="order-form-label">
            Requested Deadline *
          </label>
          <input
            type="date"
            className="order-form-input"
            value={formData.requested_deadline}
            onChange={(e) =>
              setFormData({ ...formData, requested_deadline: e.target.value })
            }
            required
          />
        </div>

        {/* Style customizations (Optional/Basic dictionary) */}
        <div className="order-form-section order-form-style-grid">
          <div className="order-form-field">
            <label className="order-form-label">
              Collar Style
            </label>
            <select
              className="order-form-input"
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
          <div className="order-form-field">
            <label className="order-form-label">
              Cuff Style
            </label>
            <select
              className="order-form-input"
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
        <div className="order-form-section order-form-field">
          <label className="order-form-label">
            Notes for Tailor
          </label>
          <textarea
            className="order-form-input"
            rows="3"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            placeholder="Add any specific tailor preferences here..."
          />
        </div>

        {/* Buttons */}
        <div className="order-form-actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="secondary-button"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !measurements || !selectedMaterial}
            className="primary-button order-form-submit"
          >
            {submitting ? "Submitting..." : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
}

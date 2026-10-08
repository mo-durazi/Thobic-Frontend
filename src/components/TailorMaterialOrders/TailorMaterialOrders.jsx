import React, { useState, useEffect } from "react";
import API from "../../services/api";

export default function TailorMaterialOrders() {
  const [materialOrders, setMaterialOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchTailorMaterialOrders();
  }, []);

  const fetchTailorMaterialOrders = async () => {
    try {
      setLoading(true);
      // Fetch material orders related to this tailor's shop items
      const response = await API.get("/material-orders");
      setMaterialOrders(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load material orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDelivered = async (materialOrderId) => {
    setFeedback(null);
    try {
      // Calls your backend route: PUT /api/material-orders/{id}/delivered
      await API.put(`/material-orders/${materialOrderId}/delivered`, {});

      setFeedback({ type: 'success', message: 'Material marked as delivered. You can now start work on the Thoub order.' });
      fetchTailorMaterialOrders(); // Refresh list
    } catch (err) {
      setFeedback({ type: 'error', message: err.response?.data?.detail || 'Failed to mark material as delivered.' });
    }
  };

  if (loading)
    return <p className="text-center mt-10">Loading material orders...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2 text-center">
        Arriving Material Orders
      </h1>
      <p className="text-gray-600 text-center mb-6">
        Track materials ordered from external providers for your accepted thawb
        orders.
      </p>
      {feedback && <p className={`orders-feedback ${feedback.type}`} role={feedback.type === 'error' ? 'alert' : 'status'}>{feedback.message}</p>}

      {materialOrders.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No material orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {materialOrders.map((matOrder) => (
            <div
              key={matOrder.id}
              className="border rounded-lg p-5 bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-semibold text-lg">
                    Material Order #{matOrder.id}
                  </span>
                  <span className={`status-badge status-badge-${matOrder.status}`}>
                    {matOrder.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Thoub Order Reference ID: #{matOrder.thoub_order_id}
                </p>
                <p className="text-sm text-gray-600">Provider: {matOrder.provider_name || '—'}</p>
                <p className="text-sm text-gray-600">Material: {matOrder.material_name || '—'}</p>
                <p className="text-sm text-gray-600">
                  Amount Ordered: {matOrder.amount} meters | Price:
                  {' '}{matOrder.price} BHD
                </p>
                <p className="text-sm text-gray-600">
                  Expected Delivery Date:{" "}
                  {matOrder.expected_delivery_date || "Not specified yet"}
                </p>
                {matOrder.notes && (
                  <p className="text-xs text-gray-500 mt-1">
                    Notes: {matOrder.notes}
                  </p>
                )}
                {matOrder.rejection_reason && (
                  <p className="text-xs text-red-500 mt-1">
                    Rejection Reason: {matOrder.rejection_reason}
                  </p>
                )}
              </div>

              <div>
                {matOrder.status === "on_the_way" ? (
                  <button
                    onClick={() => handleMarkDelivered(matOrder.id)}
                    className="bg-green-600 text-white px-4 py-2 text-sm font-medium rounded hover:bg-green-700 shadow"
                  >
                    Mark as Delivered
                  </button>
                ) : (
                  <span className="text-xs text-gray-500 italic">
                    {matOrder.status === "delivered"
                      ? "✓ Delivered to Shop"
                      : "Waiting for provider dispatch..."}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

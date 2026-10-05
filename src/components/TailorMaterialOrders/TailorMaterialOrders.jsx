import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TailorMaterialOrders.css";

export default function TailorMaterialOrders() {
  const [materialOrders, setMaterialOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTailorMaterialOrders();
  }, []);

  const fetchTailorMaterialOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      // Fetch material orders related to this tailor's shop items
      const response = await axios.get(
        "http://localhost:8000/api/material-orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setMaterialOrders(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load material orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDelivered = async (materialOrderId) => {
    try {
      const token = localStorage.getItem("token");
      // Calls your backend route: PUT /api/material-orders/{id}/delivered
      await axios.put(
        `http://localhost:8000/api/material-orders/${materialOrderId}/delivered`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      alert(
        "Material marked as delivered! You can now start work on the Thoub order.",
      );
      fetchTailorMaterialOrders(); // Refresh list
    } catch (err) {
      alert(
        err.response?.data?.detail || "Failed to mark material as delivered.",
      );
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
                  <span
                    className={`px-2.5 py-0.5 text-xs font-bold rounded uppercase ${
                      matOrder.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : matOrder.status === "accepted"
                          ? "bg-blue-100 text-blue-800"
                          : matOrder.status === "on_the_way"
                            ? "bg-orange-100 text-orange-800"
                            : matOrder.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                    }`}
                  >
                    {matOrder.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Thoub Order Reference ID: #{matOrder.thoub_order_id}
                </p>
                <p className="text-sm text-gray-600">
                  Amount Ordered: {matOrder.amount} meters | Price: $
                  {matOrder.price}
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

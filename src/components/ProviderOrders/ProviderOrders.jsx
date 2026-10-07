import React, { useState, useEffect } from "react";
import API from "../../services/api";

export default function ProviderOrders() {
  const [materialOrders, setMaterialOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  // States for interactive modals/forms
  const [acceptingId, setAcceptingId] = useState(null);
  const [expectedDate, setExpectedDate] = useState("");

  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchProviderOrders();
  }, []);

  const fetchProviderOrders = async () => {
    try {
      setLoading(true);
      const response = await API.get("/material-orders");
      setMaterialOrders(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load provider orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (e, orderId) => {
    e.preventDefault();
    try {
      await API.put(`/material-orders/${orderId}/accept`, {
        expected_delivery_date: expectedDate,
      });

      alert("Material order accepted successfully!");
      setAcceptingId(null);
      setExpectedDate("");
      fetchProviderOrders();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to accept order.");
    }
  };

  const handleReject = async (e, orderId) => {
    e.preventDefault();
    try {
      await API.put(`/material-orders/${orderId}/reject`, {
        rejection_reason: rejectionReason,
      });

      alert(
        "Material order rejected. The corresponding Thoub order has been cancelled.",
      );
      setRejectingId(null);
      setRejectionReason("");
      fetchProviderOrders();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to reject order.");
    }
  };

  const handleMarkOnTheWay = async (orderId) => {
    try {
      await API.put(`/material-orders/${orderId}/on-the-way`, {});

      alert('Material order marked as "On the Way"!');
      fetchProviderOrders();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to update status.");
    }
  };

  if (loading)
    return <p className="text-center mt-10">Loading provider orders...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2 text-center">
        Provider Material Orders
      </h1>
      <p className="text-gray-600 text-center mb-6">
        Manage requests from tailoring shops for your in-stock materials.
      </p>
      <label className="order-filter">Filter by status <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="all">All statuses</option>{[...new Set(materialOrders.map((o) => o.status))].map((status) => <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>)}</select></label>

      {materialOrders.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No material orders received yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {materialOrders.filter((order) => statusFilter === 'all' || order.status === statusFilter).map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-5 bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-semibold text-lg">
                    Material Order #{order.id}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 text-xs font-bold rounded uppercase ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "accepted"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "on_the_way"
                            ? "bg-orange-100 text-orange-800"
                            : order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Thoub Order Reference ID: #{order.thoub_order_id}
                </p>
                <p className="text-sm text-gray-600">Tailor: {order.tailor_name || order.tailor_display_name || (order.tailor_id ? `#${order.tailor_id}` : 'Details unavailable')}</p>
                <p className="text-sm text-gray-600">Material: {order.material_name || order.material?.name || 'Details unavailable'}</p>
                <p className="text-sm text-gray-600">
                  Amount Requested: {order.amount} meters | Total Price: $
                  {order.price}
                </p>
                <p className="text-sm text-gray-600">
                  Expected Delivery: {order.expected_delivery_date || "Not set"}
                </p>
                {order.rejection_reason && (
                  <p className="text-xs text-red-500 mt-1">
                    Reason for Rejection: {order.rejection_reason}
                  </p>
                )}
              </div>

              {/* Action Column */}
              <div className="flex flex-col gap-2 min-w-[160px]">
                {/* 1. PENDING: Accept or Reject options */}
                {order.status === "pending" && (
                  <>
                    <button
                      onClick={() => {
                        setAcceptingId(
                          acceptingId === order.id ? null : order.id,
                        );
                        setRejectingId(null);
                      }}
                      className="bg-blue-600 text-white px-3 py-1.5 text-xs rounded hover:bg-blue-700"
                    >
                      {acceptingId === order.id ? "Cancel" : "Accept Order"}
                    </button>
                    <button
                      onClick={() => {
                        setRejectingId(
                          rejectingId === order.id ? null : order.id,
                        );
                        setAcceptingId(null);
                      }}
                      className="bg-red-50 text-red-600 px-3 py-1.5 text-xs rounded hover:bg-red-100"
                    >
                      {rejectingId === order.id ? "Cancel" : "Reject Order"}
                    </button>
                  </>
                )}

                {/* Inline Accept Form (Expected Delivery Date) */}
                {acceptingId === order.id && (
                  <form
                    onSubmit={(e) => handleAccept(e, order.id)}
                    className="bg-blue-50 p-2 rounded border border-blue-200 space-y-1"
                  >
                    <label className="text-[10px] text-gray-600 block">
                      Expected Delivery Date:
                    </label>
                    <input
                      type="date"
                      value={expectedDate}
                      onChange={(e) => setExpectedDate(e.target.value)}
                      className="w-full border p-1 text-xs rounded"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full bg-green-600 text-white py-1 text-xs rounded hover:bg-green-700"
                    >
                      Confirm Accept
                    </button>
                  </form>
                )}

                {/* Inline Reject Form (Reason) */}
                {rejectingId === order.id && (
                  <form
                    onSubmit={(e) => handleReject(e, order.id)}
                    className="bg-red-50 p-2 rounded border border-red-200 space-y-1"
                  >
                    <input
                      type="text"
                      placeholder="Reason for rejection..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full border p-1 text-xs rounded"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full bg-red-600 text-white py-1 text-xs rounded hover:bg-red-700"
                    >
                      Confirm Reject
                    </button>
                  </form>
                )}

                {/* 2. ACCEPTED: Mark On The Way */}
                {order.status === "accepted" && (
                  <button
                    onClick={() => handleMarkOnTheWay(order.id)}
                    className="bg-orange-600 text-white px-3 py-1.5 text-xs rounded hover:bg-orange-700"
                  >
                    Mark On The Way
                  </button>
                )}

                {order.status === "delivered" && (
                  <span className="text-xs text-green-600 font-bold text-center">
                    Completed
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

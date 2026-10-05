import React, { useState, useEffect } from "react";
import {
  getMyOrders,
  tailorAcceptOrder,
  tailorRejectOrder,
  markOrderInProgress,
  markOrderReady,
  markOrderOnTheWay,
} from "../../services/orderService";
import "./TailorOrders.css";

export default function TailorOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the Accept Modal/Form (price & final deadline inputs)
  const [acceptingOrderId, setAcceptingOrderId] = useState(null);
  const [acceptForm, setAcceptForm] = useState({
    price: "",
    final_deadline: "",
  });

  useEffect(() => {
    fetchTailorOrders();
  }, []);

  const fetchTailorOrders = async () => {
    try {
      setLoading(true);
      const data = await getMyOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError("Failed to load assigned orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (orderId) => {
    if (!window.confirm("Are you sure you want to reject this order?")) return;
    try {
      const updated = await tailorRejectOrder(orderId);
      setOrders(orders.map((o) => (o.id === orderId ? updated : o)));
      alert("Order rejected.");
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to reject order.");
    }
  };

  const handleAcceptSubmit = async (e, orderId) => {
    e.preventDefault();
    try {
      const updated = await tailorAcceptOrder(orderId, {
        price: parseFloat(acceptForm.price),
        final_deadline: acceptForm.final_deadline,
      });
      setOrders(orders.map((o) => (o.id === orderId ? updated : o)));
      setAcceptingOrderId(null);
      setAcceptForm({ price: "", final_deadline: "" });
      alert("Order accepted and sent to client for review!");
    } catch (err) {
      alert(
        err.response?.data?.detail ||
          "Failed to accept order. Check minimum price rules.",
      );
    }
  };

  const handleProgressStep = async (orderId, step) => {
    try {
      let updated;
      if (step === "in-progress") updated = await markOrderInProgress(orderId);
      if (step === "ready") updated = await markOrderReady(orderId);
      if (step === "on-the-way") updated = await markOrderOnTheWay(orderId);

      setOrders(orders.map((o) => (o.id === orderId ? updated : o)));
      alert(`Order status updated to ${step}!`);
    } catch (err) {
      alert(
        err.response?.data?.detail ||
          "Action failed. Check constraint rules (e.g., material delivery status).",
      );
    }
  };

  if (loading)
    return <p className="text-center mt-10">Loading tailor orders...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Tailor Orders Management
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          No orders assigned to your shop yet.
        </p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-5 bg-white shadow-sm flex flex-col md:flex-row justify-between gap-4"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg">Order #{order.id}</span>
                  <span
                    className={`px-2 py-0.5 text-xs font-bold rounded uppercase ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "accepted"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "confirmed"
                            ? "bg-indigo-100 text-indigo-800"
                            : order.status === "in_progress"
                              ? "bg-purple-100 text-purple-800"
                              : order.status === "ready"
                                ? "bg-teal-100 text-teal-800"
                                : order.status === "on_the_way"
                                  ? "bg-orange-100 text-orange-800"
                                  : order.status === "delivered"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status.replace(/_/g, " ")}
                  </span>
                </div>

                <p className="text-sm text-gray-700">
                  <strong>Material Amount:</strong> {order.material_amount}{" "}
                  meters
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Requested Deadline:</strong>{" "}
                  {order.requested_deadline || "None"}
                </p>
                {order.price && (
                  <p className="text-sm text-green-700 font-semibold">
                    Agreed Price: ${order.price} | Final Deadline:{" "}
                    {order.final_deadline}
                  </p>
                )}

                {/* Style & Measurements Snapshot Preview */}
                <div className="bg-gray-50 p-3 rounded mt-2 text-xs text-gray-600 grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-semibold">Style:</span>{" "}
                    {JSON.stringify(order.style)}
                  </div>
                  <div>
                    <span className="font-semibold">
                      Measurements (Neck/Chest/Arm):
                    </span>{" "}
                    {order.measurements_snapshot?.neck} /{" "}
                    {order.measurements_snapshot?.chest} /{" "}
                    {order.measurements_snapshot?.arm} cm
                  </div>
                </div>
                {order.note && (
                  <p className="text-xs italic text-gray-500 mt-1">
                    Client Note: "{order.note}"
                  </p>
                )}
              </div>

              {/* Action Column */}
              <div className="flex flex-col justify-center gap-2 min-w-[180px]">
                {/* 1. PENDING: Accept or Reject */}
                {order.status === "pending" && (
                  <>
                    <button
                      onClick={() =>
                        setAcceptingOrderId(
                          acceptingOrderId === order.id ? null : order.id,
                        )
                      }
                      className="bg-blue-600 text-white px-4 py-2 text-sm rounded hover:bg-blue-700"
                    >
                      {acceptingOrderId === order.id
                        ? "Cancel Accept"
                        : "Accept Order"}
                    </button>
                    <button
                      onClick={() => handleReject(order.id)}
                      className="bg-red-50 text-red-600 px-4 py-2 text-sm rounded hover:bg-red-100"
                    >
                      Reject Order
                    </button>
                  </>
                )}

                {/* Inline Accept Form Modal */}
                {acceptingOrderId === order.id && (
                  <form
                    onSubmit={(e) => handleAcceptSubmit(e, order.id)}
                    className="bg-blue-50 p-3 rounded border border-blue-200 mt-2 space-y-2"
                  >
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Total Price ($)"
                      value={acceptForm.price}
                      onChange={(e) =>
                        setAcceptForm({ ...acceptForm, price: e.target.value })
                      }
                      className="w-full border p-1 text-xs rounded"
                      required
                    />
                    <input
                      type="date"
                      value={acceptForm.final_deadline}
                      onChange={(e) =>
                        setAcceptForm({
                          ...acceptForm,
                          final_deadline: e.target.value,
                        })
                      }
                      className="w-full border p-1 text-xs rounded"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full bg-green-600 text-white py-1 text-xs rounded hover:bg-green-700"
                    >
                      Send to Client
                    </button>
                  </form>
                )}

                {/* 2. CONFIRMED: Tailor can start work (In Progress) */}
                {order.status === "confirmed" && (
                  <button
                    onClick={() => handleProgressStep(order.id, "in-progress")}
                    className="bg-purple-600 text-white px-4 py-2 text-sm rounded hover:bg-purple-700"
                  >
                    Start Work (In Progress)
                  </button>
                )}

                {/* 3. IN_PROGRESS: Mark Ready */}
                {order.status === "in_progress" && (
                  <button
                    onClick={() => handleProgressStep(order.id, "ready")}
                    className="bg-teal-600 text-white px-4 py-2 text-sm rounded hover:bg-teal-700"
                  >
                    Mark as Ready
                  </button>
                )}

                {/* 4. READY: Send On The Way */}
                {order.status === "ready" && (
                  <button
                    onClick={() => handleProgressStep(order.id, "on-the-way")}
                    className="bg-orange-600 text-white px-4 py-2 text-sm rounded hover:bg-orange-700"
                  >
                    Send On The Way
                  </button>
                )}

                {order.status === "delivered" && (
                  <span className="text-xs text-center font-bold text-green-600 bg-green-50 py-2 rounded">
                    Completed & Delivered
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

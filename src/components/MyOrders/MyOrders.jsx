import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  getMyOrders,
  deleteOrder,
  clientRespondOrder,
  markOrderDelivered,
} from "../../services/orderService";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getMyOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch your orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this pending order?"))
      return;
    try {
      await deleteOrder(orderId);
      setOrders(orders.filter((o) => o.id !== orderId));
      alert("Order deleted successfully.");
    } catch (err) {
      alert(
        err.response?.data?.detail ||
          "Cannot delete order unless it is pending.",
      );
    }
  };

  const handleRespond = async (orderId, approve) => {
    try {
      const updatedOrder = await clientRespondOrder(orderId, approve);
      setOrders(orders.map((o) => (o.id === orderId ? updatedOrder : o)));
      alert(
        approve
          ? "Order offer accepted and confirmed!"
          : "Order offer declined.",
      );
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to update order response.");
    }
  };

  const handleConfirmDelivery = async (orderId) => {
    try {
      const updatedOrder = await markOrderDelivered(orderId);
      setOrders(orders.map((o) => (o.id === orderId ? updatedOrder : o)));
      alert("Order marked as delivered! Thank you.");
    } catch (err) {
      alert(err.response?.data?.detail || "Could not confirm delivery.");
    }
  };

  if (loading)
    return <p className="text-center mt-10">Loading your orders...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Thoub Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">
            You haven't placed any orders yet.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Browse Tailoring Shops
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-5 bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold text-lg">
                    Order #{order.id}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 text-xs font-bold rounded-full uppercase ${
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

                <p className="text-sm text-gray-600">
                  Shop: {order.tailor_name || `Shop #${order.tailor_id}`}
                </p>
                <p className="text-sm text-gray-600">
                  Material:{" "}
                  {order.material_name || `Material #${order.material_id}`}
                </p>
                <p className="text-sm text-gray-600">
                  Material Amount: {order.material_amount} meters
                </p>
                <p className="text-sm text-gray-600">
                  Requested Deadline: {order.requested_deadline || "None"}
                </p>

                {order.price && (
                  <p className="text-sm font-semibold text-green-700 mt-1">
                    Tailor Price: ${order.price} | Final Deadline:{" "}
                    {order.final_deadline}
                  </p>
                )}
                {order.note && (
                  <p className="text-xs text-gray-500 mt-1">
                    Note: {order.note}
                  </p>
                )}
              </div>

              {/* Action Buttons based on order status */}
              <div className="flex flex-wrap gap-2 items-center">
                <Link
                  to={`/my-orders/${order.id}`}
                  className="bg-gray-100 text-gray-700 px-3 py-1.5 text-sm rounded hover:bg-gray-200"
                >
                  View
                </Link>

                {/* 1. PENDING: Can Delete */}
                {order.status === "pending" && (
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="bg-red-50 text-red-600 px-3 py-1.5 text-sm rounded hover:bg-red-100"
                  >
                    Delete
                  </button>
                )}

                {/*ACCEPTED: Client needs to Approve or Decline Tailor's offer */}
                {order.status === "accepted" && (
                  <div className="flex gap-2 bg-blue-50 p-2 rounded border border-blue-200">
                    <button
                      onClick={() => handleRespond(order.id, true)}
                      className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700"
                    >
                      Accept Offer
                    </button>
                    <button
                      onClick={() => handleRespond(order.id, false)}
                      className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700"
                    >
                      Decline Offer
                    </button>
                  </div>
                )}

                {/* 3. ON_THE_WAY: Client can confirm delivery */}
                {order.status === "on_the_way" && (
                  <button
                    onClick={() => handleConfirmDelivery(order.id)}
                    className="bg-green-600 text-white px-3 py-1.5 text-sm font-medium rounded hover:bg-green-700 animate-pulse"
                  >
                    Confirm Delivery
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

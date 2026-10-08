import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  getMyOrders,
  deleteOrder,
  clientRespondOrder,
  markOrderDelivered,
} from "../../services/orderService";
import './MyOrders.css';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [feedback, setFeedback] = useState(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null);
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
    try {
      await deleteOrder(orderId);
      setOrders((current) => current.filter((o) => o.id !== orderId));
      setConfirmingDeleteId(null);
      setFeedback({ type: 'success', message: 'Order deleted successfully.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.response?.data?.detail || 'Cannot delete order unless it is pending.' });
    }
  };

  const handleRespond = async (orderId, approve) => {
    try {
      const updatedOrder = await clientRespondOrder(orderId, approve);
      setOrders((current) => current.map((o) => (o.id === orderId ? updatedOrder : o)));
      setFeedback({ type: 'success', message: approve ? 'Order offer accepted and confirmed.' : 'Order offer declined.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.response?.data?.detail || 'Failed to update order response.' });
    }
  };

  const handleConfirmDelivery = async (orderId) => {
    try {
      const updatedOrder = await markOrderDelivered(orderId);
      setOrders((current) => current.map((o) => (o.id === orderId ? updatedOrder : o)));
      setFeedback({ type: 'success', message: 'Order marked as delivered. Thank you.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.response?.data?.detail || 'Could not confirm delivery.' });
    }
  };

  if (loading)
    return <p className="text-center mt-10">Loading your orders...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 my-orders-page">
      <h1 className="text-3xl font-bold mb-6 text-center">My Thoub Orders</h1>

      {feedback && <p className={`my-orders-feedback ${feedback.type}`} role={feedback.type === 'error' ? 'alert' : 'status'}>{feedback.message}</p>}

      <label className="order-filter">Filter by status <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="all">All statuses</option>{[...new Set(orders.map((o) => o.status))].map((status) => <option key={status} value={status}>{status.replace(/_/g, " ")}</option>)}</select></label>
      {orders.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">
            You haven't placed any orders yet.
          </p>
          <button
            onClick={() => navigate("/")}
            className="button-primary"
          >
            Browse Tailoring Shops
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.filter((order) => statusFilter === "all" || order.status === statusFilter).map((order) => (
            <div
              key={order.id}
              className="my-order-card border rounded-lg p-5 bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold text-lg">
                    Order #{order.id}
                  </span>
                  <span className={`status-badge status-badge-${order.status}`}>
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
                    Tailor Price: {order.price} BHD | Final Deadline:{" "}
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
                  className="button-neutral"
                >
                  View
                </Link>

                {/* 1. PENDING: Can Delete */}
                {order.status === "pending" && (
                  <Link to={`/orders/${order.id}/edit`} className="secondary-button">Edit</Link>
                )}
                {order.status === "pending" && (confirmingDeleteId === order.id ? (
                  <div className="inline-action-confirm" role="group" aria-label={`Confirm deletion of order ${order.id}`}>
                    <span>Delete this order?</span>
                    <button type="button" onClick={() => handleDelete(order.id)} className="button-danger">Confirm</button>
                    <button type="button" onClick={() => setConfirmingDeleteId(null)} className="button-secondary">Cancel</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => { setFeedback(null); setConfirmingDeleteId(order.id); }} className="button-danger">Delete</button>
                ))}

                {/*ACCEPTED: Client needs to Approve or Decline Tailor's offer */}
                {order.status === "accepted" && (
                  <div className="flex gap-2 bg-blue-50 p-2 rounded border border-blue-200">
                    <button
                      onClick={() => handleRespond(order.id, true)}
                      className="button-success"
                    >
                      Accept Offer
                    </button>
                    <button
                      onClick={() => handleRespond(order.id, false)}
                      className="button-danger"
                    >
                      Decline Offer
                    </button>
                  </div>
                )}

                {/* 3. ON_THE_WAY: Client can confirm delivery */}
                {order.status === "on_the_way" && (
                  <button
                    onClick={() => handleConfirmDelivery(order.id)}
                    className="button-success animate-pulse"
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

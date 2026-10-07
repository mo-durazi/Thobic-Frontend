import { useState, useEffect } from "react";
import { Link } from "react-router";

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
  const [statusFilter, setStatusFilter] = useState("all");

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

      setOrders(
        orders.map((o) => (o.id === orderId ? updated : o))
      );

      alert("Order rejected.");
    } catch (err) {
      alert(
        err.response?.data?.detail || "Failed to reject order."
      );
    }
  };

  const handleAcceptSubmit = async (e, orderId) => {
    e.preventDefault();

    try {
      const updated = await tailorAcceptOrder(orderId, {
        price: parseFloat(acceptForm.price),
        final_deadline: acceptForm.final_deadline,
      });

      setOrders(
        orders.map((o) => (o.id === orderId ? updated : o))
      );

      setAcceptingOrderId(null);
      setAcceptForm({
        price: "",
        final_deadline: "",
      });

      alert("Order accepted and sent to client for review!");
    } catch (err) {
      alert(
        err.response?.data?.detail ||
          "Failed to accept order. Check minimum price rules."
      );
    }
  };

  const handleProgressStep = async (orderId, step) => {
    try {
      let updated;

      if (step === "in-progress") {
        updated = await markOrderInProgress(orderId);
      }

      if (step === "ready") {
        updated = await markOrderReady(orderId);
      }

      if (step === "on-the-way") {
        updated = await markOrderOnTheWay(orderId);
      }

      setOrders(
        orders.map((o) => (o.id === orderId ? updated : o))
      );

      alert(`Order status updated to ${step}!`);
    } catch (err) {
      alert(
        err.response?.data?.detail ||
          "Action failed. Check constraint rules (e.g., material delivery status)."
      );
    }
  };

  if (loading) {
    return (
      <main className="tailor-orders-page">
        <p className="tailor-orders-message">
          Loading tailor orders...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="tailor-orders-page">
        <p className="tailor-orders-message tailor-orders-error">
          {error}
        </p>
      </main>
    );
  }

  const filteredOrders = orders.filter(
    (order) =>
      statusFilter === "all" || order.status === statusFilter
  );

  return (
    <main className="tailor-orders-page">
      <h1 className="tailor-orders-title">
        Tailor Orders Management
      </h1>

      <label className="tailor-orders-filter">
        <span>Filter by status</span>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All statuses</option>

          {[...new Set(orders.map((o) => o.status))].map(
            (status) => (
              <option key={status} value={status}>
                {status.replace(/\_/g, " ")}
              </option>
            )
          )}
        </select>
      </label>

      {orders.length === 0 ? (
        <div className="tailor-orders-empty">
          <p>No orders assigned to your shop yet.</p>
        </div>
      ) : (
        <div className="tailor-orders-list">
          {filteredOrders.map((order) => (
            <article
              key={order.id}
              className="tailor-order-card"
            >
              <div className="tailor-order-main">
                <div className="tailor-order-heading">
                  <span className="tailor-order-id">
                    Order #{order.id}
                  </span>

                  <span className="tailor-order-status">
                    {order.status.replace(/\_/g, " ")}
                  </span>
                </div>

                <p className="tailor-order-info">
                  <strong>Material Amount:</strong>{" "}
                  {order.material_amount} meters
                </p>

                <p className="tailor-order-info">
                  <strong>Requested Deadline:</strong>{" "}
                  {order.requested_deadline || "None"}
                </p>

                {order.price && (
                  <p className="tailor-order-price">
                    Agreed Price: {order.price} BHD | Final Deadline:{" "}
                    {order.final_deadline}
                  </p>
                )}

                <div className="tailor-order-preview">
                  <div>
                    <strong>Style:</strong>{" "}
                    {JSON.stringify(order.style)}
                  </div>

                  <div>
                    <strong>
                      Measurements (Neck / Chest / Arm):
                    </strong>{" "}
                    {order.measurements_snapshot?.neck} /{" "}
                    {order.measurements_snapshot?.chest} /{" "}
                    {order.measurements_snapshot?.arm} cm
                  </div>
                </div>

                {order.note && (
                  <p className="tailor-order-note">
                    Client Note: "{order.note}"
                  </p>
                )}
              </div>

              <div className="tailor-order-actions">
                <Link
                  to={`/tailor/orders/${order.id}`}
                  className="secondary-button"
                >
                  Review order
                </Link>

                {order.status === "pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setAcceptingOrderId(
                          acceptingOrderId === order.id
                            ? null
                            : order.id
                        )
                      }
                      className="tailor-order-action-button tailor-order-action-primary"
                    >
                      {acceptingOrderId === order.id
                        ? "Cancel Accept"
                        : "Accept Order"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReject(order.id)}
                      className="tailor-order-action-button tailor-order-action-danger"
                    >
                      Reject Order
                    </button>
                  </>
                )}

                {acceptingOrderId === order.id && (
                  <form
                    onSubmit={(e) =>
                      handleAcceptSubmit(e, order.id)
                    }
                    className="tailor-order-accept-form"
                  >
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Total Price (BHD)"
                      value={acceptForm.price}
                      onChange={(e) =>
                        setAcceptForm({
                          ...acceptForm,
                          price: e.target.value,
                        })
                      }
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
                      required
                    />

                    <button type="submit">
                      Send to Client
                    </button>
                  </form>
                )}

                {order.status === "confirmed" && (
                  <button
                    type="button"
                    onClick={() =>
                      handleProgressStep(
                        order.id,
                        "in-progress"
                      )
                    }
                    className="tailor-order-action-button tailor-order-action-primary"
                  >
                    Start Work
                  </button>
                )}

                {order.status === "in_progress" && (
                  <button
                    type="button"
                    onClick={() =>
                      handleProgressStep(order.id, "ready")
                    }
                    className="tailor-order-action-button tailor-order-action-primary"
                  >
                    Mark as Ready
                  </button>
                )}

                {order.status === "ready" && (
                  <button
                    type="button"
                    onClick={() =>
                      handleProgressStep(
                        order.id,
                        "on-the-way"
                      )
                    }
                    className="tailor-order-action-button tailor-order-action-primary"
                  >
                    Send On The Way
                  </button>
                )}

                {order.status === "delivered" && (
                  <span className="tailor-order-completed">
                    Completed & Delivered
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
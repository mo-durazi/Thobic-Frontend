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
import { MEASUREMENT_FIELDS } from '../../lib/measurementFields';
import { getStyleFieldLabel, getStyleOptionLabel } from '../../lib/styleOptions';

import "./TailorOrders.css";

export default function TailorOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [feedback, setFeedback] = useState(null);
  const [confirmingRejectId, setConfirmingRejectId] = useState(null);

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
    setFeedback(null);
    try {
      const updated = await tailorRejectOrder(orderId);

      setOrders(
        orders.map((o) => (o.id === orderId ? updated : o))
      );

      setConfirmingRejectId(null);
      setFeedback({ type: 'success', message: 'Order rejected.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.response?.data?.detail || 'Failed to reject order.' });
    }
  };

  const handleAcceptSubmit = async (e, orderId) => {
    e.preventDefault();
    setFeedback(null);

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

      setFeedback({ type: 'success', message: 'Order accepted and sent to the client for review.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.response?.data?.detail || 'Failed to accept order. Check minimum price rules.' });
    }
  };

  const handleProgressStep = async (orderId, step) => {
    setFeedback(null);
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

      setFeedback({ type: 'success', message: `Order status updated to ${step}.` });
    } catch (err) {
      setFeedback({ type: 'error', message: err.response?.data?.detail || 'Action failed. Check order requirements, including material delivery.' });
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
      {feedback && <p className={`orders-feedback ${feedback.type}`} role={feedback.type === 'error' ? 'alert' : 'status'}>{feedback.message}</p>}

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

                  <span className={`tailor-order-status status-badge status-badge-${order.status}`}>
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

                <div className="tailor-order-details-summary">
                  <section>
                    <h3>Style</h3>
                    {order.style && typeof order.style === 'object' && Object.entries(order.style).some(([, value]) => value !== null && value !== undefined && value !== '') ? (
                      <ul>
                        {Object.entries(order.style)
                          .filter(([, value]) => value !== null && value !== undefined && value !== '')
                          .map(([field, value]) => (
                            <li key={field}><strong>{getStyleFieldLabel(field)}:</strong> {getStyleOptionLabel(field, String(value))}</li>
                          ))}
                      </ul>
                    ) : <p>No style details recorded.</p>}
                  </section>

                  <section>
                    <h3>Measurements</h3>
                    {MEASUREMENT_FIELDS.some(({ name }) => order.measurements_snapshot?.[name] !== null && order.measurements_snapshot?.[name] !== undefined && order.measurements_snapshot?.[name] !== '') ? (
                      <ul>
                        {MEASUREMENT_FIELDS
                          .filter(({ name }) => order.measurements_snapshot?.[name] !== null && order.measurements_snapshot?.[name] !== undefined && order.measurements_snapshot?.[name] !== '')
                          .map(({ name, label }) => (
                            <li key={name}><strong>{label}:</strong> {order.measurements_snapshot[name]} cm</li>
                          ))}
                      </ul>
                    ) : <p>No measurements recorded.</p>}
                  </section>
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

                    {confirmingRejectId === order.id ? (
                      <div className="inline-action-confirm" role="group" aria-label={`Confirm rejection of order ${order.id}`}>
                        <span>Reject this order?</span>
                        <button type="button" onClick={() => handleReject(order.id)} className="tailor-order-action-button tailor-order-action-danger">Confirm</button>
                        <button type="button" onClick={() => setConfirmingRejectId(null)} className="tailor-order-action-button">Cancel</button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmingRejectId(order.id)}
                        className="tailor-order-action-button tailor-order-action-danger"
                      >
                        Reject Order
                      </button>
                    )}
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

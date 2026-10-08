import { useContext, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import { MEASUREMENT_FIELDS } from "../../lib/measurementFields";
import { getStyleFieldLabel, getStyleOptionLabel } from "../../lib/styleOptions";
import {
  getOrderById,
  tailorAcceptOrder,
  tailorRejectOrder,
  markOrderInProgress,
  markOrderReady,
  markOrderOnTheWay,
} from "../../services/orderService";

import "./TailorOrderDetails.css";

const getErrorMessage = (err, fallback) => {
  const detail = err?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((d) => d.msg).join(", ");
  return err?.message || fallback;
};

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString() : "—";

const MATERIAL_ORDER_STATUS_LABELS = {
  pending: "Waiting for the provider",
  accepted: "Accepted by the provider",
  on_the_way: "On the way to the tailor",
  delivered: "Delivered to the tailor",
  rejected: "Rejected by the provider",
};

const TailorOrderDetails = () => {
  const { user } = useContext(UserContext);
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Accept form states
  const [price, setPrice] = useState("");
  const [finalDeadline, setFinalDeadline] = useState("");

  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [confirmingReject, setConfirmingReject] = useState(false);

  const isTailor = user?.role === "tailor";

  useEffect(() => {
    if (!isTailor) return;

    const loadOrder = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        setError(getErrorMessage(err, "Failed to load order details."));
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId, isTailor]);

  const runAction = async (action) => {
    setActionError("");
    setConfirmingReject(false);
    setActionLoading(true);
    try {
      const updated = await action();
      setOrder(updated);
    } catch (err) {
      // Backend rules return 409 if provider material isn't delivered yet → shown as text here
      setActionError(getErrorMessage(err, "Action failed due to constraints."));
    } finally {
      setActionLoading(false);
    }
  };

  const handleAccept = (e) => {
    e.preventDefault();
    runAction(() =>
      tailorAcceptOrder(order.id, {
        price: parseFloat(price),
        final_deadline: finalDeadline,
      }),
    );
  };

  const handleReject = () => runAction(() => tailorRejectOrder(order.id));

  if (!user) return <Navigate to="/sign-in" />;

  if (!isTailor) {
    return (
      <main>
        <p>Only tailors can view this page.</p>
      </main>
    );
  }

  if (loading)
    return (
      <main>
        <p>Loading order...</p>
      </main>
    );
  if (error)
    return (
      <main>
        <p className="text-red-600">{error}</p>
      </main>
    );
  if (!order)
    return (
      <main>
        <p>Order not found.</p>
      </main>
    );

  const styleEntries = order.style && typeof order.style === 'object'
    ? Object.entries(order.style).filter(([, value]) => value !== null && value !== undefined && value !== '')
    : [];
  const measurements = order.measurements_snapshot ?? {};
  const recordedMeasurements = MEASUREMENT_FIELDS.filter(({ name }) =>
    measurements[name] !== null && measurements[name] !== undefined && measurements[name] !== ''
  );

  return (
    <main className="tailor-order-details p-6">
      <Link to="/tailor/orders">&larr; Back to Tailor Orders</Link>
      <h1 className="text-2xl font-bold mt-2">
        Tailor View: Order #{order.id}
      </h1>

      <p className="mt-2">
        <strong>Status:</strong>{" "}
        <span className="uppercase font-semibold">{order.status}</span>
      </p>
      <p>
        <strong>Material Amount:</strong> {order.material_amount} m
      </p>
      <p>
        <strong>Requested Deadline:</strong>{" "}
        {formatDate(order.requested_deadline)}
      </p>
      {order.note && (
        <p>
          <strong>Client Note:</strong> {order.note}
        </p>
      )}

      {order.material_order_status && (
        <section className="tailor-order-material-delivery">
          <h2>Provider material delivery</h2>
          <p>
            <strong>Status:</strong>{" "}
            {MATERIAL_ORDER_STATUS_LABELS[order.material_order_status] ?? order.material_order_status}
          </p>
          {order.expected_material_delivery_date && (
            <p>
              <strong>Expected delivery:</strong>{" "}
              {formatDate(order.expected_material_delivery_date)}
            </p>
          )}
          {order.material_order_status !== "delivered" && (
            <p>You can start work once the material is delivered.</p>
          )}
        </section>
      )}

      {actionError && (
        <div className="bg-red-100 text-red-700 p-3 rounded my-3">
          {actionError}
        </div>
      )}

      <section className="mt-4 bg-white p-4 border rounded shadow-sm">
        <h2 className="font-semibold mb-2">Client Measurements Snapshot</h2>
        {recordedMeasurements.length > 0 ? (
          <ul className="tailor-order-bullet-list text-sm">
            {recordedMeasurements.map(({ name, label }) => (
              <li key={name}>
                <strong>{label}:</strong> {measurements[name]} cm
              </li>
            ))}
          </ul>
        ) : <p>No measurements recorded.</p>}
      </section>

      <section className="mt-4 bg-white p-4 border rounded shadow-sm">
        <h2 className="font-semibold mb-2">Style</h2>
        {styleEntries.length > 0 ? (
          <ul className="tailor-order-bullet-list">
            {styleEntries.map(([field, value]) => (
              <li key={field}><strong>{getStyleFieldLabel(field)}:</strong> {getStyleOptionLabel(field, String(value))}</li>
            ))}
          </ul>
        ) : <p>No style options recorded.</p>}
      </section>

      {/* Workflow Action Buttons for Tailor */}
      <footer className="mt-6 space-y-4">
        {order.status === "pending" && (
          <div className="space-y-4">
            {confirmingReject ? (
              <div className="inline-action-confirm" role="group" aria-label="Confirm order rejection">
                <span>Reject this order?</span>
                <button type="button" onClick={handleReject} disabled={actionLoading} className="button-danger">Confirm</button>
                <button type="button" onClick={() => setConfirmingReject(false)} className="button-secondary">Cancel</button>
              </div>
            ) : (
              <button type="button" onClick={() => setConfirmingReject(true)} disabled={actionLoading} className="button-danger">Reject Order</button>
            )}

            <form
              onSubmit={handleAccept}
              className="bg-blue-50 p-4 rounded max-w-md space-y-3"
            >
              <h3 className="font-semibold">Accept Order & Set Terms</h3>
              <div>
                <label className="block text-xs">Price (BHD):</label>
                <input
                  type="number"
                  step="0.1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-xs">Final Deadline:</label>
                <input
                  type="date"
                  value={finalDeadline}
                  onChange={(e) => setFinalDeadline(e.target.value)}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={actionLoading}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Accept & Send to Client
              </button>
            </form>
          </div>
        )}

        {order.status === "confirmed" && (
          <button
            onClick={() => runAction(() => markOrderInProgress(order.id))}
            disabled={actionLoading}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Start Work (In Progress)
          </button>
        )}

        {order.status === "in_progress" && (
          <button
            onClick={() => runAction(() => markOrderReady(order.id))}
            disabled={actionLoading}
            className="bg-teal-600 text-white px-4 py-2 rounded"
          >
            Mark as Ready
          </button>
        )}

        {order.status === "ready" && (
          <button
            onClick={() => runAction(() => markOrderOnTheWay(order.id))}
            disabled={actionLoading}
            className="bg-orange-600 text-white px-4 py-2 rounded"
          >
            Send On The Way
          </button>
        )}
      </footer>
    </main>
  );
};

export default TailorOrderDetails;

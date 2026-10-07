import { useContext, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import { MEASUREMENT_FIELDS } from "../../lib/measurementFields";
import {
  getOrderById,
  tailorAcceptOrder,
  tailorRejectOrder,
  markOrderInProgress,
  markOrderReady,
  markOrderOnTheWay,
} from "../../services/orderService";

const getErrorMessage = (err, fallback) => {
  const detail = err?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((d) => d.msg).join(", ");
  return err?.message || fallback;
};

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString() : "—";

const formatStyleKey = (key) =>
  key.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

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

  const handleReject = () => {
    if (!window.confirm("Reject this order?")) return;
    runAction(() => tailorRejectOrder(order.id));
  };

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

  const styleEntries = Object.entries(order.style ?? {});
  const measurements = order.measurements_snapshot ?? {};

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

      {actionError && (
        <div className="bg-red-100 text-red-700 p-3 rounded my-3">
          {actionError}
        </div>
      )}

      <section className="mt-4 bg-white p-4 border rounded shadow-sm">
        <h2 className="font-semibold mb-2">Client Measurements Snapshot</h2>
        <ul className="text-sm grid grid-cols-2 gap-2">
          {MEASUREMENT_FIELDS.map(({ name, label }) => (
            <li key={name}>
              <strong>{label}:</strong> {measurements[name] ?? "—"} cm
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4 bg-white p-4 border rounded shadow-sm">
        <h2 className="font-semibold mb-2">Style Choices</h2>
        {styleEntries.length > 0 ? (
          <ul>
            {styleEntries.map(([k, v]) => (
              <li key={k}>
                {formatStyleKey(k)}: {String(v)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No style options.</p>
        )}
      </section>

      {/* Workflow Action Buttons for Tailor */}
      <footer className="mt-6 space-y-4">
        {order.status === "pending" && (
          <div className="space-y-4">
            <button
              onClick={handleReject}
              disabled={actionLoading}
              className="bg-red-600 text-white px-4 py-2 rounded mr-2"
            >
              Reject Order
            </button>

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

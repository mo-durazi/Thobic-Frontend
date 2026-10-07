import { useContext, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router';

import { UserContext } from '../../contexts/UserContext';
import { MEASUREMENT_FIELDS } from '../../lib/measurementFields';
import {
  clientRespondOrder,
  deleteOrder,
  getOrderById,
  markOrderDelivered,
} from '../../services/orderService';

const STATUS_LABELS = {
  pending: 'Pending',
  accepted: 'Waiting for your approval',
  tailor_rejected: 'Rejected by the tailor',
  client_rejected: 'Declined by you',
  confirmed: 'Confirmed',
  in_progress: 'In progress',
  ready: 'Ready',
  on_the_way: 'On the way',
  delivered: 'Delivered',
  canceled: 'Cancelled',
  cancelled: 'Cancelled',
};

const MATERIAL_ORDER_STATUS_LABELS = {
  pending: 'Waiting for the provider',
  accepted: 'Accepted by the provider',
  on_the_way: 'On the way to the tailor',
  delivered: 'Delivered to the tailor',
  rejected: 'Rejected by the provider',
};

const TIMELINE_STEPS = [
  'pending',
  'accepted',
  'confirmed',
  'in_progress',
  'ready',
  'on_the_way',
  'delivered',
];

const CLOSED_STATUSES = ['tailor_rejected', 'client_rejected', 'canceled', 'cancelled'];

const getErrorMessage = (err, fallback) => {
  const detail = err?.response?.data?.detail;

  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) return detail.map((d) => d.msg).join(', ');

  return err?.message || fallback;
};

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString() : '—';

const formatStyleKey = (key) =>
  key.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

const OrderDetails = () => {
  const { user } = useContext(UserContext);
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  const isClient = user?.role === 'client';

  useEffect(() => {
    if (!isClient) return;

    const loadOrder = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        setOrder(null);
        if (err?.response?.status !== 404) {
          setError(getErrorMessage(err, 'Something went wrong loading this order.'));
        }
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId, isClient]);

  const runAction = async (action) => {
    setActionError('');
    setActionLoading(true);

    try {
      const updated = await action();
      setOrder(updated);
    } catch (err) {
      setActionError(getErrorMessage(err, 'Something went wrong.'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this order?')) return;

    setActionError('');
    setActionLoading(true);

    try {
      await deleteOrder(order.id);
      navigate('/my-orders');
    } catch (err) {
      setActionError(getErrorMessage(err, 'Something went wrong deleting this order.'));
      setActionLoading(false);
    }
  };

  const handleApprove = () => runAction(() => clientRespondOrder(order.id, true));

  const handleDecline = () => {
    if (!window.confirm('Decline this offer?')) return;
    runAction(() => clientRespondOrder(order.id, false));
  };

  const handleConfirmDelivery = () =>
    runAction(() => markOrderDelivered(order.id));

  if (!user) return <Navigate to="/sign-in" />;

  if (!isClient) {
    return (
      <main>
        <p>Only clients can view this page.</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main>
        <p>Loading order...</p>
        <Link to="/my-orders">Back to my orders</Link>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <p>{error}</p>
        <Link to="/my-orders">Back to my orders</Link>
      </main>
    );
  }

  if (!order) {
    return (
      <main>
        <p>Order not found.</p>
        <Link to="/my-orders">Back to my orders</Link>
      </main>
    );
  }

  const showTimeline = !CLOSED_STATUSES.includes(order.status);
  const currentStep = TIMELINE_STEPS.indexOf(order.status);
  const styleEntries = Object.entries(order.style ?? {});
  const measurements = order.measurements_snapshot ?? {};

  return (
    <main className="order-details">
      <header className="order-details-header">
        <h1>Order #{order.id}</h1>

        <span className={`order-status order-status-${order.status}`}>
          {STATUS_LABELS[order.status] ?? order.status}
        </span>
      </header>

      {showTimeline && (
        <ol className="order-timeline">
          {TIMELINE_STEPS.map((step, index) => {
            let stepState = '';
            if (index < currentStep) stepState = 'done';
            if (index === currentStep) stepState = 'current';

            return (
              <li key={step} className={`order-timeline-step ${stepState}`}>
                {STATUS_LABELS[step]}
              </li>
            );
          })}
        </ol>
      )}

      {order.price !== null && order.price !== undefined && (
        <section className="order-offer">
          <h2>Tailor Offer</h2>
          <p>
            <strong>Price:</strong> {order.price} BHD
          </p>
          <p>
            <strong>Final deadline:</strong> {formatDate(order.final_deadline)}
          </p>
        </section>
      )}

      <section className="order-info">
        <h2>Details</h2>
        <p>
          <strong>Shop:</strong> {order.tailor_name || `Shop #${order.tailor_id}`}
        </p>
        <p>
          <strong>Material:</strong>{' '}
          {order.material_name || `Material #${order.material_id}`}
        </p>
        <p>
          <strong>Material amount:</strong> {order.material_amount} m
        </p>
        <p>
          <strong>Requested deadline:</strong>{' '}
          {formatDate(order.requested_deadline)}
        </p>
        <p>
          <strong>Placed on:</strong> {formatDate(order.created_at)}
        </p>
        {order.note && (
          <p>
            <strong>Note:</strong> {order.note}
          </p>
        )}
      </section>

      {order.material_order_status && (
        <section className="order-info">
          <h2>Provider material delivery</h2>
          <p>
            <strong>Status:</strong>{' '}
            {MATERIAL_ORDER_STATUS_LABELS[order.material_order_status] ?? order.material_order_status}
          </p>
          {order.expected_material_delivery_date && (
            <p>
              <strong>Expected delivery:</strong>{' '}
              {formatDate(order.expected_material_delivery_date)}
            </p>
          )}
        </section>
      )}

      <section className="order-style">
        <h2>Style</h2>
        {styleEntries.length > 0 ? (
          <ul>
            {styleEntries.map(([key, value]) => (
              <li key={key}>
                {formatStyleKey(key)}: {String(value)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No style options.</p>
        )}
      </section>

      <section className="order-measurements">
        <h2>Measurements Used</h2>
        <ul>
          {MEASUREMENT_FIELDS.map(({ name, label }) => (
            <li key={name}>
              {label}: {measurements[name] ?? '—'} cm
            </li>
          ))}
        </ul>
      </section>

      <footer className="order-details-actions">
        {actionError && <p className="order-action-error">{actionError}</p>}

        {order.status === 'pending' && (
          <Link className="secondary-button" to={`/orders/${order.id}/edit`}>Edit order</Link>
        )}

        {order.status === 'pending' && (
          <button type="button" onClick={handleDelete} disabled={actionLoading}>
            Delete Order
          </button>
        )}

        {order.status === 'accepted' && (
          <>
            <button type="button" onClick={handleApprove} disabled={actionLoading}>
              Approve Offer
            </button>
            <button type="button" onClick={handleDecline} disabled={actionLoading}>
              Decline Offer
            </button>
          </>
        )}

        {order.status === 'on_the_way' && (
          <button
            type="button"
            onClick={handleConfirmDelivery}
            disabled={actionLoading}
          >
            Confirm Delivery
          </button>
        )}

        <Link to="/my-orders">Back to my orders</Link>
      </footer>
    </main>
  );
};

export default OrderDetails;

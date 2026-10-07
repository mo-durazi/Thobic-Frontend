import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { getMyOrders } from '../../services/orderService';

const TailorDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyOrders().then((data) => setOrders(data ?? []))
      .catch((err) => setError(err.message || 'Could not load your order summary.'))
      .finally(() => setLoading(false));
  }, []);

  const summary = useMemo(() => orders.reduce((counts, order) => {
    counts[order.status] = (counts[order.status] || 0) + 1;
    return counts;
  }, {}), [orders]);
  const confirmedValue = orders.reduce((total, order) => total + (['confirmed', 'in_progress', 'ready', 'on_the_way', 'delivered'].includes(order.status) ? Number(order.price || 0) : 0), 0);

  return <main className="tailor-dashboard">
    <p className="section-label">TAILOR WORKSPACE</p>
    <h1>Shop Dashboard</h1>
    <p className="text-gray-600">A quick view of your assigned orders and workload.</p>
    {loading ? <p>Loading your summary...</p> : error ? <p className="text-red-600" role="alert">{error}</p> : <>
      <div className="tailor-summary-grid">
        <article><span>Total orders</span><strong>{orders.length}</strong></article>
        <article><span>Needs review</span><strong>{summary.pending || 0}</strong></article>
        <article><span>In progress</span><strong>{summary.in_progress || 0}</strong></article>
        <article><span>Confirmed order value</span><strong>{confirmedValue.toFixed(3)} BHD</strong></article>
      </div>
      <div className="tailor-dashboard-actions"><Link className="primary-button" to="/tailor/orders">Manage orders</Link><Link className="secondary-button" to="/tailor/material-orders">Material deliveries</Link><Link className="secondary-button" to="/materials/mine">Manage materials</Link></div>
    </>}
  </main>;
};

export default TailorDashboard;

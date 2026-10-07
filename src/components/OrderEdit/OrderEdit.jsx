import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';

import MaterialPicker from '../MaterialPicker/MaterialPicker';
import { editOrder, getOrderById } from '../../services/orderService';
import { getMaterial } from '../../services/materialService';

const INITIAL_FORM = {
  material_amount: '1',
  style: { collar: 'Standard', cuff: 'Normal', pocket: 'Yes' },
  requested_deadline: '',
  note: '',
};

const getErrorMessage = (err, fallback) => {
  const detail = err?.response?.data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) return detail.map((item) => item.msg).join(', ');
  return err?.message || fallback;
};

const getLocalDate = () => {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
};

export default function OrderEdit() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [initialMaterialId, setInitialMaterialId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notEditable, setNotEditable] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadOrder = async () => {
      setLoading(true);
      setError('');
      setNotEditable(false);

      try {
        const currentOrder = await getOrderById(orderId);
        if (cancelled) return;

        if (currentOrder.status !== 'pending') {
          setOrder(currentOrder);
          setNotEditable(true);
          return;
        }

        const material = await getMaterial(currentOrder.material_id);
        if (cancelled) return;

        setOrder(currentOrder);
        setSelectedMaterial(material);
        setInitialMaterialId(currentOrder.material_id);
        setFormData({
          material_amount: String(currentOrder.material_amount ?? 1),
          style: {
            collar: currentOrder.style?.collar ?? 'Standard',
            cuff: currentOrder.style?.cuff ?? 'Normal',
            pocket: currentOrder.style?.pocket ?? 'Yes',
          },
          requested_deadline: currentOrder.requested_deadline || '',
          note: currentOrder.note || '',
        });
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, 'Failed to load order for editing.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadOrder();
    return () => { cancelled = true; };
  }, [orderId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSaving(true);

    const payload = {
      material_amount: Number(formData.material_amount),
      style: formData.style,
      note: formData.note,
      requested_deadline: formData.requested_deadline || null,
    };
    if (selectedMaterial && String(selectedMaterial.id) !== String(initialMaterialId)) {
      payload.material_id = selectedMaterial.id;
    }

    try {
      await editOrder(orderId, payload);
      navigate(`/my-orders/${orderId}`);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to save order changes.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <main className="order-edit-page"><p className="order-edit-status">Loading order details...</p></main>;
  if (notEditable) {
    return (
      <main className="order-edit-page">
        <p className="order-edit-error">Only pending orders can be edited.</p>
        <Link className="order-edit-link" to={`/my-orders/${orderId}`}>Back to order</Link>
      </main>
    );
  }
  if (error && !order) return <main className="order-edit-page"><p className="order-edit-error" role="alert">{error}</p><Link className="order-edit-link" to={`/my-orders/${orderId}`}>Back to order</Link></main>;

  const estimatedCost = selectedMaterial
    ? (Number(selectedMaterial.price) * Number(formData.material_amount || 0)).toFixed(3)
    : '0.000';

  return (
    <main className="order-edit-page">
      <h1 className="order-edit-title">Edit order #{orderId}</h1>
      {error && <p className="order-edit-error" role="alert">{error}</p>}
      <form className="order-edit-form" onSubmit={handleSubmit}>
        <section className="order-edit-section">
          <h2 className="order-edit-heading">Selected material</h2>
          {selectedMaterial ? (
            <div className="order-edit-material-summary">
              <p><strong>{selectedMaterial.name}</strong></p>
              <p>{selectedMaterial.price} BHD / metre</p>
              <p>Estimated cost: {estimatedCost} BHD</p>
            </div>
          ) : <p className="order-edit-error">Could not load the order's material.</p>}
        </section>

        <section className="order-edit-section">
          <h2 className="order-edit-heading">Change material</h2>
          <MaterialPicker
            shopId={order.tailor_id}
            selectedMaterialId={selectedMaterial?.id}
            onSelect={setSelectedMaterial}
          />
        </section>

        <div className="order-edit-field">
          <label htmlFor="order-edit-material-amount">Material amount (metres)</label>
          <input id="order-edit-material-amount" className="order-edit-input" type="number" min="0.1" step="0.1" value={formData.material_amount} onChange={(event) => setFormData((current) => ({ ...current, material_amount: event.target.value }))} required />
        </div>

        <div className="order-edit-field">
          <label htmlFor="order-edit-deadline">Requested deadline</label>
          <input id="order-edit-deadline" className="order-edit-input" type="date" min={getLocalDate()} value={formData.requested_deadline} onChange={(event) => setFormData((current) => ({ ...current, requested_deadline: event.target.value }))} />
        </div>

        <div className="order-edit-style-grid">
          <div className="order-edit-field">
            <label htmlFor="order-edit-collar">Collar style</label>
            <select id="order-edit-collar" className="order-edit-input" value={formData.style.collar} onChange={(event) => setFormData((current) => ({ ...current, style: { ...current.style, collar: event.target.value } }))}>
              <option value="Standard">Standard</option>
              <option value="Round">Round</option>
              <option value="Collar">Closed</option>
            </select>
          </div>
          <div className="order-edit-field">
            <label htmlFor="order-edit-cuff">Cuff style</label>
            <select id="order-edit-cuff" className="order-edit-input" value={formData.style.cuff} onChange={(event) => setFormData((current) => ({ ...current, style: { ...current.style, cuff: event.target.value } }))}>
              <option value="Normal">Normal</option>
              <option value="Button">Button</option>
            </select>
          </div>
          <div className="order-edit-field">
            <label htmlFor="order-edit-pocket">Pocket</label>
            <select id="order-edit-pocket" className="order-edit-input" value={formData.style.pocket} onChange={(event) => setFormData((current) => ({ ...current, style: { ...current.style, pocket: event.target.value } }))}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>

        <div className="order-edit-field">
          <label htmlFor="order-edit-note">Note</label>
          <textarea id="order-edit-note" className="order-edit-input" rows="4" value={formData.note} onChange={(event) => setFormData((current) => ({ ...current, note: event.target.value }))} />
        </div>

        <div className="order-edit-actions">
          <button className="order-edit-button" type="submit" disabled={saving || !selectedMaterial}>{saving ? 'Saving...' : 'Save changes'}</button>
          <button className="order-edit-button order-edit-button-secondary" type="button" onClick={() => navigate(`/my-orders/${orderId}`)}>Cancel</button>
        </div>
      </form>
    </main>
  );
}

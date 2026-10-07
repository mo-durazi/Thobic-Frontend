import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { createShop } from '../../services/shopService';

const INITIAL_FORM = {
  display_name: '',
  branch: '',
  phone_number: '',
  building_no: '',
  road_no: '',
  block_no: '',
};

const ShopCreate = () => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = ({ target: { name, value } }) => {
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    const shopData = {
      display_name: formData.display_name.trim(),
      branch: formData.branch.trim() || null,
      phone_number: formData.phone_number.trim(),
      building_no: Number(formData.building_no),
      road_no: Number(formData.road_no),
      block_no: Number(formData.block_no),
    };

    try {
      const shop = await createShop(shopData);
      if (shop?.id) {
        navigate(`/shops/${shop.id}`, { replace: true });
      } else {
        navigate('/tailor', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Could not create your shop.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="shop-create-page">
      <p className="section-label">TAILOR WORKSPACE</p>
      <h1>Create your shop</h1>
      <p className="shop-create-intro">Add your shop details so clients can find you and place orders.</p>

      {error && <p className="shop-create-error" role="alert">{error}</p>}

      <form className="shop-create-form" onSubmit={handleSubmit}>
        <div className="shop-create-grid">
          <div className="shop-create-field shop-create-field-wide">
            <label htmlFor="display_name">Shop name</label>
            <input id="display_name" name="display_name" value={formData.display_name} onChange={handleChange} required maxLength={100} />
          </div>

          <div className="shop-create-field">
            <label htmlFor="branch">Branch <span>(optional)</span></label>
            <input id="branch" name="branch" value={formData.branch} onChange={handleChange} maxLength={100} />
          </div>

          <div className="shop-create-field">
            <label htmlFor="phone_number">Phone number</label>
            <input id="phone_number" name="phone_number" type="tel" value={formData.phone_number} onChange={handleChange} required />
          </div>

          <div className="shop-create-field">
            <label htmlFor="building_no">Building number</label>
            <input id="building_no" name="building_no" type="number" min="0" value={formData.building_no} onChange={handleChange} required />
          </div>

          <div className="shop-create-field">
            <label htmlFor="road_no">Road number</label>
            <input id="road_no" name="road_no" type="number" min="0" value={formData.road_no} onChange={handleChange} required />
          </div>

          <div className="shop-create-field">
            <label htmlFor="block_no">Block number</label>
            <input id="block_no" name="block_no" type="number" min="0" value={formData.block_no} onChange={handleChange} required />
          </div>
        </div>

        <div className="shop-create-actions">
          <Link className="secondary-button" to="/tailor">Cancel</Link>
          <button className="primary-button" type="submit" disabled={saving}>
            {saving ? 'Creating shop…' : 'Create shop'}
          </button>
        </div>
      </form>
    </main>
  );
};

export default ShopCreate;

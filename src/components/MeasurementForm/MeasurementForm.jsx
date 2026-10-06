import { useContext, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';

import { UserContext } from '../../contexts/UserContext';
import { MEASUREMENT_FIELDS } from '../../lib/measurementFields';
import { createMeasurements } from '../../services/measurementService';

const initialState = Object.fromEntries(
  MEASUREMENT_FIELDS.map((field) => [field.name, ''])
);

const MeasurementForm = ({ isEdit = false }) => {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (!user) return <Navigate to="/sign-in" />;

  if (user.role !== 'client') {
    return (
      <main>
        <p>Only clients can manage measurements.</p>
      </main>
    );
  }

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setError('');

    const values = Object.fromEntries(
      Object.entries(formData).map(([name, value]) => [name, parseFloat(value)])
    );

    if (isEdit) {
      console.log(values);
      return;
    }

    try {
      await createMeasurements(values);
      navigate('/measurements');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main>
      <h1>{isEdit ? 'Edit My Measurements' : 'Add Measurements'}</h1>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        {MEASUREMENT_FIELDS.map(({ name, label }) => (
          <div key={name}>
            <label htmlFor={name}>{label}</label>
            <input
              type="number"
              id={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              min="0"
              step="0.1"
              required
            />
          </div>
        ))}

        <button type="submit">
          {isEdit ? 'Save Changes' : 'Save Measurements'}
        </button>
        <Link to="/measurements">Cancel</Link>
      </form>
    </main>
  );
};

export default MeasurementForm;

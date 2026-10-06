import { useContext, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';

import { UserContext } from '../../contexts/UserContext';
import { MEASUREMENT_FIELDS } from '../../lib/measurementFields';
import {
  createMeasurements,
  getMyMeasurements,
  updateMeasurements,
} from '../../services/measurementService';

const initialState = Object.fromEntries(
  MEASUREMENT_FIELDS.map((field) => [field.name, ''])
);

const MeasurementForm = ({ isEdit = false }) => {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const navigate = useNavigate();

  const isClient = user?.role === 'client';

  useEffect(() => {
    if (!isEdit || !isClient) return;

    const loadMeasurements = async () => {
      try {
        const data = await getMyMeasurements();

        // Nothing to edit yet
        if (!data) {
          navigate('/measurements');
          return;
        }

        setFormData(
          Object.fromEntries(
            MEASUREMENT_FIELDS.map(({ name }) => [name, String(data[name] ?? '')])
          )
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMeasurements();
  }, [isEdit, isClient, navigate]);

  if (!user) return <Navigate to="/sign-in" />;

  if (!isClient) {
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

    try {
      if (isEdit) {
        await updateMeasurements(values);
      } else {
        await createMeasurements(values);
      }
      navigate('/measurements');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <main>
        <p>Loading...</p>
      </main>
    );
  }

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

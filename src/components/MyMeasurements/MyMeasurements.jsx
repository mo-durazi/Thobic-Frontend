import { useContext, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router';

import { UserContext } from '../../contexts/UserContext';
import { MEASUREMENT_FIELDS } from '../../lib/measurementFields';
import { getMyMeasurements } from '../../services/measurementService';

const MyMeasurements = () => {
  const { user } = useContext(UserContext);
  const [measurements, setMeasurements] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isClient = user?.role === 'client';

  useEffect(() => {
    if (!isClient) return;

    const loadMeasurements = async () => {
      try {
        const data = await getMyMeasurements();
        setMeasurements(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMeasurements();
  }, [isClient]);

  if (!user) return <Navigate to="/sign-in" />;

  if (!isClient) {
    return (
      <main>
        <p>Only clients can manage measurements.</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main>
        <p>Loading measurements...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main>
      <h1>My Measurements</h1>

      {measurements ? (
        <>
          <ul>
            {MEASUREMENT_FIELDS.map(({ name, label }) => (
              <li key={name}>
                {label}: {measurements[name]} cm
              </li>
            ))}
          </ul>
          <Link to="/measurements/edit">Edit My Measurements</Link>
        </>
      ) : (
        <>
          <p>You haven't added your measurements yet.</p>
          <Link to="/measurements/new">Add Measurements</Link>
        </>
      )}
    </main>
  );
};

export default MyMeasurements;

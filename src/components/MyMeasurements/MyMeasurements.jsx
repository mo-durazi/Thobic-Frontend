import { useContext } from 'react';
import { Navigate } from 'react-router';

import { UserContext } from '../../contexts/UserContext';

const MyMeasurements = () => {
  const { user } = useContext(UserContext);

  if (!user) return <Navigate to="/sign-in" />;

  if (user.role !== 'client') {
    return (
      <main>
        <p>Only clients can manage measurements.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>My Measurements</h1>
      <p>Your measurements will appear here.</p>
    </main>
  );
};

export default MyMeasurements;

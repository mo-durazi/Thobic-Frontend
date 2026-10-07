import { useContext } from 'react';
import { Navigate } from 'react-router';

import { UserContext } from '../../contexts/UserContext';
import { getRoleHome } from '../../lib/roleHome';

const Dashboard = () => {
  const { user } = useContext(UserContext);

  return <Navigate to={getRoleHome(user.role)} replace />;
};

export default Dashboard;

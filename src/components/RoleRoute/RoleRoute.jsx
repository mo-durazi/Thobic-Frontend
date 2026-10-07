import { useContext } from 'react';
import { Navigate } from 'react-router';

import { UserContext } from '../../contexts/UserContext';

const RoleRoute = ({ roles, children }) => {
  const { user } = useContext(UserContext);

  if (!user) return <Navigate to="/sign-in" replace />;

  if (!roles.includes(user.role)) return <Navigate to="/forbidden" replace />;

  return children;
};

export default RoleRoute;
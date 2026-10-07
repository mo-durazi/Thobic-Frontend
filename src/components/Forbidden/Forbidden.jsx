import { useContext } from 'react';
import { Link } from 'react-router';

import { UserContext } from '../../contexts/UserContext';

import './Forbidden.css';

const Forbidden = () => {
  const { user } = useContext(UserContext);

  return (
    <main className="error-page section container">
      <div className="error-page-content">
        <p className="error-page-code">403</p>
        <h1 className="error-page-title">Access denied</h1>
        <p className="error-page-text">
          You don't have permission to view this page.
        </p>

        <div className="error-page-actions">
          <Link to="/" className="primary-button">
            Back to home
          </Link>

          {!user && (
            <Link to="/sign-in" className="secondary-button">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </main>
  );
};

export default Forbidden;

import { Link } from 'react-router';

import './NotFound.css';

const NotFound = () => {
  return (
    <main className="error-page section container">
      <div className="error-page-content">
        <p className="error-page-code">404</p>
        <h1 className="error-page-title">Page not found</h1>
        <p className="error-page-text">
          The page you're looking for doesn't exist or was moved.
        </p>

        <div className="error-page-actions">
          <Link to="/" className="primary-button">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;

import { useContext } from 'react';
import { Link } from 'react-router';

import { UserContext } from '../../contexts/UserContext';
import { removeToken } from '../../lib/helpers/jwt-helpers';

import './NavBar.css';

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);

  const handleSignOut = () => {
    removeToken();
    setUser(null);
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img
            src="./public/logo.png"
            alt="Thobic"
          />
        </Link>

        {/* Navigation */}
        <nav className="navbar-links">
          <Link to="/" className="navbar-link">
            Home
          </Link>

          <a href="/shops" className="navbar-link">
            Tailors
          </a>

          <a href="#materials" className="navbar-link">
            Materials
          </a>

          <a href="#how-it-works" className="navbar-link">
            How It Works
          </a>
        </nav>

        {/* User Actions */}
        <div className="navbar-actions">
          {user ? (
            <>
              <span className="navbar-user">
                Hello {user.username}
              </span>

              <Link to="/" className="navbar-sign-in">
                Dashboard
              </Link>

              <Link
                to="/"
                className="navbar-sign-up"
                onClick={handleSignOut}
              >
                Sign Out
              </Link>
            </>
          ) : (
            <>
              <Link to="/sign-in" className="navbar-sign-in">
                Sign In
              </Link>

              <Link to="/sign-up" className="navbar-sign-up">
                Sign Up
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
};

export default NavBar;
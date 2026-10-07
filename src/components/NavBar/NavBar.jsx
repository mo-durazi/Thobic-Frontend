import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { UserContext } from '../../contexts/UserContext';
import { removeToken } from '../../lib/helpers/jwt-helpers';
import { getNavLinks } from '../../lib/navLinks';
import { currentUser } from '../../services/userService';

import './NavBar.css';

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    const loadUsername = async () => {
      try {
        const data = await currentUser();
        if (!cancelled) setUsername(data?.username ?? '');
      } catch (err) {
        console.log(err);
      }
    };

    loadUsername();

    return () => {
      cancelled = true;
      setUsername('');
    };
  }, [user]);

  const handleSignOut = () => {
    removeToken();
    setUser(null);
    navigate('/', { replace: true });
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img
            src="/logo.png"
            alt="Thobic home"
          />
        </Link>

        {/* Navigation */}
        <nav className="navbar-links">
          {getNavLinks(user).map(({ to, label }) => (
            <Link key={to} to={to} className="navbar-link">
              {label}
            </Link>
          ))}
        </nav>

        {/* User Actions */}
        <div className="navbar-actions">
          {user ? (
            <>
              {username && (
                <span className="navbar-user">
                  Hello {username}
                </span>
              )}

              <Link to="/" className="navbar-sign-in">
                Dashboard
              </Link>

              <button
                type="button"
                className="navbar-sign-up"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
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
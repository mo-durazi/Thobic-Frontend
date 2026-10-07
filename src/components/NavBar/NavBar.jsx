import { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';

import { UserContext } from '../../contexts/UserContext';
import { removeToken } from '../../lib/helpers/jwt-helpers';
import { getNavLinks } from '../../lib/navLinks';
import { currentUser } from '../../services/userService';

import './NavBar.css';

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

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
        <button type="button" className="navbar-menu-toggle" aria-expanded={menuOpen} aria-label="Toggle navigation" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? 'Close' : 'Menu'}</button>

        <nav className={`navbar-links${menuOpen ? ' is-open' : ''}`}>
          {getNavLinks(user).map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`} onClick={() => setMenuOpen(false)}>
              {label}
            </NavLink>
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

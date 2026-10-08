import { useState, useContext } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';

import { signIn } from '../../services/authService';
import { getMyProfile } from '../../services/profileService';

import { UserContext } from '../../contexts/UserContext';
import { getRoleHome } from '../../lib/roleHome';
import '../SignUpForm/SignUpForm.css';

const SignInForm = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [signingIn, setSigningIn] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // Skip while a sign-in is in progress, so handleSubmit picks the destination
  if (user && !signingIn) return <Navigate to={getRoleHome(user.role)} replace />;

  const handleChange = (evt) => {
    setMessage('');
    setFormData((current) => ({ ...current, [evt.target.name]: evt.target.value }));
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setSigningIn(true);

    try {
      const signedInUser = await signIn(formData);
      const { role } = signedInUser;
      let destination = getRoleHome(role);

      if (role === 'tailor' || role === 'provider') {
        try {
          const profile = await getMyProfile();
          if (!profile) destination = '/profile';
        } catch (err) {
          console.log(err);
        }
      }

      setUser(signedInUser);
      navigate(destination, { replace: true });
    } catch (err) {
      setMessage(err.message);
      setSigningIn(false);
    }
  };

  return (
    <main className="signup-page">
      <section className="signup-card" aria-labelledby="signin-title">
        <div className="signup-heading">
          <p className="signup-eyebrow">Welcome back</p>
          <h1 id="signin-title">Sign in to Thobic</h1>
          <p>Enter your account details to continue.</p>
        </div>

        {message && <p className="signup-message" role="alert">{message}</p>}

        <form className="signup-form" autoComplete="on" onSubmit={handleSubmit}>
          <div className="signup-field">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              autoComplete="username"
              id="username"
              value={formData.username}
              name="username"
              onChange={handleChange}
              required
            />
          </div>
          <div className="signup-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              autoComplete="current-password"
              id="password"
              value={formData.password}
              name="password"
              onChange={handleChange}
              required
            />
          </div>
          <div className="signup-actions">
            <button className="button-primary" type="submit" disabled={signingIn || !formData.username || !formData.password}>
              {signingIn ? 'Signing in...' : 'Sign in'}
            </button>
            <button className="button-secondary" type="button" onClick={() => navigate('/')}>Cancel</button>
          </div>
        </form>

        <p className="signup-login">New to Thobic? <Link to="/sign-up">Create an account</Link></p>
      </section>
    </main>
  );
};

export default SignInForm;

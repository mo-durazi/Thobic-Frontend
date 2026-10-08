import { useContext, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';

import * as authService from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';
import { getRoleHome } from '../../lib/roleHome';
import './SignUpForm.css';

const SignUpForm = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConf: '',
  });
  const { user: currentUser, setUser } = useContext(UserContext);

  if (currentUser) return <Navigate to={getRoleHome(currentUser.role)} replace />;

  const { username, email, password, passwordConf } = formData;

  const handleChange = (evt) => {
    setMessage('');
    setFormData((current) => ({ ...current, [evt.target.name]: evt.target.value }));
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (password !== passwordConf) {
      setMessage('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setMessage('Password must be at least 8 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Only account fields are persisted by the registration endpoint.
      const user = await authService.signUp({ username, email, password });
      setUser(user);
      navigate(getRoleHome(user.role), { replace: true });
    } catch (err) {
      setMessage(err.message || 'Unable to create your account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="signup-page">
      <section className="signup-card" aria-labelledby="signup-title">
        <div className="signup-heading">
          <p className="signup-eyebrow">Welcome to Thobic</p>
          <h1 id="signup-title">Create your account</h1>
          <p>Sign up with your account details to get started.</p>
        </div>

        {message && <p className="signup-message" role="alert">{message}</p>}

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="signup-field">
            <label htmlFor="username">Username</label>
            <input autoComplete="username" type="text" id="username" name="username" value={username} onChange={handleChange} required />
          </div>

          <div className="signup-field">
            <label htmlFor="email">Email address</label>
            <input autoComplete="email" type="email" id="email" name="email" value={email} onChange={handleChange} required />
          </div>

          <div className="signup-fields-row">
            <div className="signup-field">
              <label htmlFor="password">Password</label>
              <input autoComplete="new-password" type="password" id="password" name="password" value={password} onChange={handleChange} minLength={8} required />
              <span className="signup-hint">At least 8 characters</span>
            </div>

            <div className="signup-field">
              <label htmlFor="passwordConf">Confirm password</label>
              <input autoComplete="new-password" type="password" id="passwordConf" name="passwordConf" value={passwordConf} onChange={handleChange} minLength={8} required />
            </div>
          </div>

          <div className="signup-actions">
            <button className="button-primary signup-submit" type="submit" disabled={isSubmitting || !username || !email || !password || !passwordConf}>
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </button>
            <button className="button-secondary signup-cancel" type="button" onClick={() => navigate('/')}>Cancel</button>
          </div>
        </form>

        <p className="signup-login">Already have an account? <Link to="/sign-in">Log in</Link></p>
      </section>
    </main>
  );
};

export default SignUpForm;

import { useState } from 'react';
import { createUserByAdmin } from '../../services/userService';

import './AdminCreateUser.css';

const initialFormData = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'tailor',
};

const AdminCreateUser = () => {
  const [formData, setFormData] = useState(initialFormData);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setError('');
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage('');
    setError('');

    const { username, email, password, confirmPassword, role } = formData;

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createUserByAdmin({ username, email, password, role });

      setMessage('Account created successfully.');

      setFormData(initialFormData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="admin-create-user">
      <div className="container">
        <div className="admin-create-user-header">
          <p className="admin-create-user-label">ADMIN</p>
          <h1>Create Account</h1>
          <p>
            Create a tailor shop or material provider account.
          </p>
        </div>

        <form
          className="admin-create-user-form"
          onSubmit={handleSubmit}
        >
          <div className="form-field">
            <label htmlFor="username">Username</label>

            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              minLength={8}
              required
            />

            <p className="form-hint">At least 8 characters.</p>
          </div>

          <div className="form-field">
            <label htmlFor="confirmPassword">Confirm password</label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="role">Role</label>

            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="tailor">Tailor shop</option>
              <option value="provider">Material provider</option>
            </select>
          </div>

          {message && (
            <p className="form-message form-message-success">
              {message}
            </p>
          )}

          {error && (
            <p className="form-message form-message-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="primary-button admin-create-user-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Account'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default AdminCreateUser;
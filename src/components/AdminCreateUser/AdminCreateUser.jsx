import { useState } from 'react';
import { createUserByAdmin } from '../../services/userService';

import './AdminCreateUser.css';

const AdminCreateUser = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'client',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage('');
    setError('');
    setIsSubmitting(true);

    try {
      await createUserByAdmin(formData);

      setMessage('Account created successfully.');

      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'client',
      });
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
            Create a new client, tailor, or provider account.
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
              <option value="client">Client</option>
              <option value="tailor">Tailor</option>
              <option value="provider">Provider</option>
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
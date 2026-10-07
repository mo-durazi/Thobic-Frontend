import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { UserContext } from '../../contexts/UserContext';
import { getRoleHome } from '../../lib/roleHome';
import {
  createProfile,
  getMyProfile,
  updateMyProfile,
} from '../../services/profileService';

const initialFormData = {
  display_name: '',
  phone_number: '',
  building_no: '',
  road_no: '',
  block_no: '',
  branch: '',
  status: 'open',
};

const ProfileForm = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const isTailor = user.role === 'tailor';

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getMyProfile();

        if (profile) {
          setHasProfile(true);
          setFormData({
            display_name: profile.display_name ?? '',
            phone_number: profile.phone_number ?? '',
            building_no: String(profile.building_no ?? ''),
            road_no: String(profile.road_no ?? ''),
            block_no: String(profile.block_no ?? ''),
            branch: profile.branch ?? '',
            status: profile.status ?? 'open',
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setError('');
    setMessage('');
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setMessage('');
    setSaving(true);

    const payload = {
      display_name: formData.display_name,
      phone_number: formData.phone_number,
      building_no: Number(formData.building_no),
      road_no: Number(formData.road_no),
      block_no: Number(formData.block_no),
    };

    // Branch and status only apply to tailor shops
    if (isTailor) {
      payload.branch = formData.branch || null;
      payload.status = formData.status;
    }

    try {
      if (hasProfile) {
        await updateMyProfile(payload);
        setMessage('Profile saved.');
      } else {
        await createProfile(payload);
        navigate(getRoleHome(user.role), { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="profile-form">
        <p className="profile-form-loading">Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="profile-form">
      <div className="container">
        <div className="profile-form-header">
          <h1>{hasProfile ? 'Edit profile' : 'Complete your profile'}</h1>

          {!hasProfile && (
            <p className="profile-form-intro">
              {isTailor
                ? "Clients can't see your shop until you complete this."
                : 'Complete your profile so tailors know who you are.'}
            </p>
          )}
        </div>

        <form className="profile-form-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="display_name">Shop / business name</label>

            <input
              id="display_name"
              name="display_name"
              type="text"
              value={formData.display_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="phone_number">Phone number</label>

            <input
              id="phone_number"
              name="phone_number"
              type="tel"
              value={formData.phone_number}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="building_no">Building no.</label>

            <input
              id="building_no"
              name="building_no"
              type="number"
              min="1"
              value={formData.building_no}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="road_no">Road no.</label>

            <input
              id="road_no"
              name="road_no"
              type="number"
              min="1"
              value={formData.road_no}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="block_no">Block no.</label>

            <input
              id="block_no"
              name="block_no"
              type="number"
              min="1"
              value={formData.block_no}
              onChange={handleChange}
              required
            />
          </div>

          {isTailor && (
            <>
              <div className="form-field">
                <label htmlFor="branch">Branch (optional)</label>

                <input
                  id="branch"
                  name="branch"
                  type="text"
                  value={formData.branch}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label htmlFor="status">Shop status</label>

                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="open">Open</option>
                  <option value="busy">Busy</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </>
          )}

          {message && (
            <p className="form-message form-message-success">{message}</p>
          )}

          {error && (
            <p className="form-message form-message-error">{error}</p>
          )}

          <button
            type="submit"
            className="primary-button profile-form-button"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default ProfileForm;

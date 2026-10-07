import { useState, useContext } from 'react';
import { Navigate, useNavigate } from 'react-router';

import { signIn } from '../../services/authService';
import { getMyProfile } from '../../services/profileService';

import { UserContext } from '../../contexts/UserContext';
import { getRoleHome } from '../../lib/roleHome';

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
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
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
    <main>
      <h1>Sign In</h1>
      <p>{message}</p>
      <form autoComplete='off' onSubmit={handleSubmit}>
        <div>
          <label htmlFor='email'>Username:</label>
          <input
            type='text'
            autoComplete='off'
            id='username'
            value={formData.username}
            name='username'
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor='password'>Password:</label>
          <input
            type='password'
            autoComplete='off'
            id='password'
            value={formData.password}
            name='password'
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button>Sign In</button>
          <button onClick={() => navigate('/')}>Cancel</button>
        </div>
      </form>
    </main>
  );
};

export default SignInForm;

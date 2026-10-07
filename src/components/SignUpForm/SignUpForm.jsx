import { useContext, useState } from 'react';
import { Navigate, useNavigate } from 'react-router';

// Services
import * as authService from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';
import { getRoleHome } from '../../lib/roleHome';


const SignUpForm = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConf: '',
    display_name: '',
    road_no: '',
    block_no: '',
    building_no: '',
    phone_number: '',
  });
  const { user: currentUser, setUser } = useContext(UserContext);

  if (currentUser) return <Navigate to={getRoleHome(currentUser.role)} replace />;

  const { username, email, password, passwordConf } = formData;

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    if (password !== passwordConf) { setMessage('Passwords do not match.'); return; }
    try {
      const payload = { ...formData };
      delete payload.passwordConf;
      const user = await authService.signUp({ ...payload, road_no: Number(payload.road_no), block_no: Number(payload.block_no), building_no: Number(payload.building_no) });
      setUser(user);
      navigate(getRoleHome(user.role), { replace: true });
    } catch (err) { setMessage(err.message || 'Unable to create your account.'); }
  };

  const isFormInvalid = () => {
    return !(username && email && password && password === passwordConf && formData.display_name && formData.road_no && formData.block_no && formData.building_no && formData.phone_number);
  };

  return (
    <main>
      <h1>Sign Up</h1>
      <p>{message}</p>
      <form onSubmit={handleSubmit}>
        {['display_name', 'road_no', 'block_no', 'building_no', 'phone_number'].map((field) => <div key={field}><label htmlFor={field}>{({ display_name: 'Display name', road_no: 'Road number', block_no: 'Block number', building_no: 'Building number', phone_number: 'Phone number' })[field]}:</label><input id={field} name={field} type={field.includes('_no') ? 'number' : 'text'} value={formData[field]} onChange={handleChange} required /></div>)}
        {/* Username Field */}
        <div>
          <label htmlFor='username'>Username:</label>
          <input
            type='text'
            id='username'
            value={username}
            name='username'
            onChange={handleChange}
            required
          />
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor='email'>Email:</label>
          <input
            type='email'
            id='email'
            value={email}
            name='email'
            onChange={handleChange}
            required
          />
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor='password'>Password:</label>
          <input
            type='password'
            id='password'
            value={password}
            name='password'
            onChange={handleChange}
            required
          />
        </div>

        {/* Coinfirm Password */}
        <div>
          <label htmlFor='confirm'>Confirm Password:</label>
          <input
            type='password'
            id='confirm'
            value={passwordConf}
            name='passwordConf'
            onChange={handleChange}
            required
          />
        </div>

        {/* Form Actions */}
        <div>
          <button disabled={isFormInvalid()}>Sign Up</button>
          <button onClick={() => navigate('/')}>Cancel</button>
        </div>
      </form>
    </main>
  );
};

export default SignUpForm;

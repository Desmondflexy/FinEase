import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Api from '../../api.config';
import { toast } from 'react-toastify';
import { FormNav } from './Login';

function Signup() {
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    first: '',
    last: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
    adminKey: ''
  });

  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInputs(values => ({ ...values, [name]: value }))
  }

  const location = useLocation();
  const adminSignup = location.pathname === '/admin-signup';

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const delay = 2000;
    Api.post(adminSignup ? '/auth/admin-signup' : '/auth/signup', inputs)
      .then(res => {
        toast.success(res.data.message);
        setTimeout(() => {
          navigate('/login');
        }, delay);
      })
      .catch(err => {
        if (err.response) {
          toast.error(err.response.data.message);
        } else {
          toast.error(err.message);
        }
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, delay);
      })
  }

  return (
    <div className='form-container'>
      <FormNav />
      <form className='form' onSubmit={handleSubmit}>

        <input autoComplete="on" type="text" id="first" name="first" placeholder="First Name" value={inputs.first} onChange={handleChange} required />

        <input autoComplete='on' type="text" id="last" name="last" placeholder="Last Name" value={inputs.last} onChange={handleChange} required />

        <input autoComplete='on' type="email" id="email" name="email" placeholder="Email" value={inputs.email} onChange={handleChange} required />

        <input autoComplete='on' type="tel" id="phone" name="phone" placeholder="Phone Number" value={inputs.phone} onChange={handleChange} required />

        <input autoComplete='off' type="password" id="password" name="password" placeholder="Password" value={inputs.password} onChange={handleChange} required />

        <input autoComplete='off' type="password" id="confirm" name="confirm" placeholder="Confirm Password" value={inputs.confirm} onChange={handleChange} required />

        {adminSignup && <input autoComplete='off' type='text' id='admin-key' name='adminKey' placeholder='Admin Key' required value={inputs.adminKey} onChange={handleChange} />}

        {adminSignup && <p style={{ color: 'red' }}>Admin Key is required to create an admin account</p>}

        <p>Already have an account? <Link to="/login">Log In</Link></p>

        <button type="submit" disabled={loading}>{loading ? 'Please wait...' : 'Signup'}</button>
      </form>
    </div>
  )
}

export default Signup;
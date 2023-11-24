import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from 'react';
import Api from "../../api.config";
import { toast } from 'react-toastify';

export default function Login() {
  const [inputs, setInputs] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInputs(values => ({ ...values, [name]: value }))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const delay = 1500;
    Api.post('/auth/login', inputs)
      .then(res => {
        localStorage.setItem('token', res.data.token);
        toast.success(res.data.message);
        setTimeout(() => {
          navigate('/dashboard');
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
    <div className="form-container">
      <FormNav />
      <form className="form" onSubmit={handleSubmit}>

        <input autoComplete='on' type="email" id="email" name="email" placeholder="Email" value={inputs.email} onChange={handleChange} required />

        <input autoComplete='off' type="password" id="password" name="password" placeholder="Password" value={inputs.password} onChange={handleChange} required />

        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>

        <button type="submit" disabled={loading} >{loading ? 'Please wait...' : 'Login'}</button>
      </form>
    </div>
  )
}

export function FormNav() {

  let active = '';
  const location = useLocation();

  if (location.pathname === '/signup' || location.pathname === '/admin-signup') {
    active = 'signup';
  } else if (location.pathname === '/login') {
    active = 'login';
  }

  return (
    <div className="form-nav">
      <div className={active === 'signup' ? 'active' : ''}><Link to={'/signup'}>Signup</Link></div>
      <div className={active === 'login' ? 'active' : ''}><Link to={'/login'}>Login</Link></div>
    </div>
  )
}
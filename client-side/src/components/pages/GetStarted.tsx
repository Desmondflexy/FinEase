import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from 'react';
import Api from "../../api.config";
import { toast } from 'react-toastify';

export function AdminSignup() {
  const [loading, setLoading] = useState(false);

  // form inputs
  const [username, setUsername] = useState('');
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [adminKey, setAdminKey] = useState('');

  const [emailErrorFeedback, setEmailErrorFeedback] = useState('');
  const [usernameErrorFeedback, setUsernameErrorFeedback] = useState('');

  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const inputs = { username, first, last, email, phone, password, confirm, adminKey };
    Api.post('/auth/admin-signup', inputs)
      .then(res => {
        toast.success(res.data.message);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
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
        }, 2000);
      })
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    switch (name) {
      case 'username':
        setUsername(value);
        if (e.target.validity.valid) {
          Api.get(`/auth/check/username/${value}`)
            .then(() => {setUsernameErrorFeedback('')})
            .catch(err => setUsernameErrorFeedback(err.response.data.message));
        }
        break;
      case 'first':
        setFirst(value);
        break;
      case 'last':
        setLast(value);
        break;
      case 'email':
        setEmail(value);
        if (e.target.validity.valid) {
          Api.get(`/auth/check/email/${value}`)
            .then(() => {setEmailErrorFeedback('')})
            .catch(err => setEmailErrorFeedback(err.response.data.message));
        }
        break;
      case 'phone':
        setPhone(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirm':
        setConfirm(value);
        break;
      case 'adminKey':
        setAdminKey(value);
        break;
      default:
        break;
    }
  }

  return (
    <div className='form-container'>
      <FormNav />
      <form className='form' onSubmit={handleSubmit}>

        <input autoComplete="on" type="text" id="first" name="first" placeholder="First Name" value={first} onChange={handleChange} required />

        <input autoComplete='on' type="text" id="last" name="last" placeholder="Last Name" value={last} onChange={handleChange} required />

        <input autoComplete='on' type="email" id="email" name="email" placeholder="Email" value={email} onChange={handleChange} required />

        <input autoComplete='on' type="tel" id="phone" name="phone" placeholder="Phone Number" value={phone} onChange={handleChange} required />

        <input autoComplete='on' type="text" id="username" name="username" placeholder="Username" value={username} onChange={handleChange} required />

        <input autoComplete='off' type="password" id="password" name="password" placeholder="Password" value={password} onChange={handleChange} required />

        <input autoComplete='off' type="password" id="confirm" name="confirm" placeholder="Confirm Password" value={confirm} onChange={handleChange} required />

        <input autoComplete='off' type='password' id='admin-key' name='adminKey' placeholder='Admin Key' required value={adminKey} onChange={handleChange} />

        <em className="feedback">{emailErrorFeedback}</em>
        <em className="feedback">{usernameErrorFeedback}</em>

        <p style={{ color: 'red' }}>Admin Key is required to create an admin account</p>

        <p>Already have an account? <Link to="/login">Log In</Link></p>

        <button type="submit" disabled={loading}>{loading ? 'Please wait...' : 'Signup'}</button>
      </form>
    </div>
  )
}

export function Signup() {
  const [loading, setLoading] = useState(false);

  // form inputs
  const [username, setUsername] = useState('');
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const [emailErrorFeedback, setEmailErrorFeedback] = useState('');
  const [usernameErrorFeedback, setUsernameErrorFeedback] = useState('');


  const navigate = useNavigate();

  const location = useLocation();
  const adminSignup = location.pathname === '/admin-signup';

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const inputs = { username, first, last, email, phone, password, confirm };
    Api.post(adminSignup ? '/auth/admin-signup' : '/auth/signup', inputs)
      .then(res => {
        toast.success(res.data.message);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
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
        }, 2000);
      })
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    switch (name) {
      case 'username':
        setUsername(value);
        if (e.target.validity.valid) {
          Api.get(`/auth/check/username/${value}`)
            .then(() => {setUsernameErrorFeedback('')})
            .catch(err => setUsernameErrorFeedback(err.response.data.message));
        }
        break;
      case 'first':
        setFirst(value);
        break;
      case 'last':
        setLast(value);
        break;
      case 'email':
        setEmail(value);
        if (e.target.validity.valid) {
          Api.get(`/auth/check/email/${value}`)
            .then(() => {setEmailErrorFeedback('')})
            .catch(err => setEmailErrorFeedback(err.response.data.message));
        }
        break;
      case 'phone':
        setPhone(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirm':
        setConfirm(value);
        break;
      default:
        break;
    }
  }

  return (
    <div className='form-container'>
      <FormNav />
      <form className='form' onSubmit={handleSubmit}>

        <input autoComplete="on" type="text" id="first" name="first" placeholder="First Name" value={first} onChange={handleChange} required />

        <input autoComplete='on' type="text" id="last" name="last" placeholder="Last Name" value={last} onChange={handleChange} required />

        <input autoComplete='on' type="email" id="email" name="email" placeholder="Email" value={email} onChange={handleChange} required />

        <input autoComplete='on' type="tel" id="phone" name="phone" placeholder="Phone Number" value={phone} onChange={handleChange} required />

        <input autoComplete='on' type="text" id="username" name="username" placeholder="Username" value={username} onChange={handleChange} required />

        <input autoComplete='off' type="password" id="password" name="password" placeholder="Password" value={password} onChange={handleChange} required />

        <input autoComplete='off' type="password" id="confirm" name="confirm" placeholder="Confirm Password" value={confirm} onChange={handleChange} required />

        <em className="feedback">{emailErrorFeedback}</em>
        <em className="feedback">{usernameErrorFeedback}</em>

        <p>Already have an account? <Link to="/login">Log In</Link></p>

        <button type="submit" disabled={loading}>{loading ? 'Please wait...' : 'Signup'}</button>
      </form>
    </div>
  )
}

export function Login() {

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    Api.post('/auth/login', { emailOrUsername, password })
      .then(res => {
        localStorage.setItem('token', res.data.token);
        navigate('/dashboard');
        setLoading(false);
      })
      .catch(err => {
        if (err.response) {
          toast.error(err.response.data.message);
        } else {
          toast.error(err.message);
        }
        setLoading(false)
      });
  }

  return (
    <div className="form-container">
      <FormNav />
      <form className="form" onSubmit={handleSubmit}>

        <input placeholder="Email or Username" value={emailOrUsername} onChange={e => setEmailOrUsername(e.target.value)} required />

        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />

        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>

        <button type="submit" disabled={loading} >{loading ? 'Please wait...' : 'Login'}</button>
      </form>
    </div>
  )
}

function FormNav() {

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
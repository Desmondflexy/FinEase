import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from 'react';
import Api from "../../api.config";
import { toast } from 'react-toastify';
import { FcGoogle } from "react-icons/fc";

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
    const inputs = { username, first, last, email, phone, password, confirm, adminKey };
    const signup = () => {
      Api.post('/auth/admin-signup', inputs)
        .then(res => {
          toast.success(res.data.message);
          navigate('/login');
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

    setLoading(true);
    signup();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    switch (name) {
      case 'username':
        setUsername(value);
        if (e.target.validity.valid) {
          Api.get(`/auth/check/username/${value}`)
            .then(() => { setUsernameErrorFeedback('') })
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
            .then(() => { setEmailErrorFeedback('') })
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
    <>
      <Header />
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

          <button type="submit" disabled={loading}>{loading ? 'Please wait...' : 'Signup'}</button>

          <em className="feedback">{emailErrorFeedback}</em>
          <em className="feedback">{usernameErrorFeedback}</em>

          <p style={{ color: 'red' }}>Admin Key is required to create an admin account</p>

          <p>Already have an account? <Link to="/login">Log In</Link></p>

        </form>
      </div>
    </>
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
    const inputs = { username, first, last, email, phone, password, confirm };
    const signup = () => {
      Api.post(adminSignup ? '/auth/admin-signup' : '/auth/signup', inputs)
        .then(res => {
          toast.success(res.data.message);
          navigate('/login');
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

    setLoading(true);
    signup();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    switch (name) {
      case 'username':
        setUsername(value);
        if (e.target.validity.valid) {
          checkUsername();
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
          checkEmail();
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

    function checkUsername() {
      Api.get(`/auth/check/username/${value}`)
        .then(() => { setUsernameErrorFeedback('') })
        .catch(err => setUsernameErrorFeedback(err.response.data.message));
    }

    function checkEmail() {
      Api.get(`/auth/check/email/${value}`)
        .then(() => { setEmailErrorFeedback('') })
        .catch(err => setEmailErrorFeedback(err.response.data.message));
    }
  }

  return (
    <>
      <Header />
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

          <button type="submit" disabled={loading}>{loading ? 'Please wait...' : 'Signup'}</button>

          <GoogleBtn />

          <em className="feedback">{emailErrorFeedback}</em>
          <em className="feedback">{usernameErrorFeedback}</em>

          <p>Already have an account? <Link to="/login">Log In</Link></p>

        </form>
      </div>
    </>

  )
}

export function Login() {

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const login = () => {
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

    setLoading(true);
    login();
  }

  return (
    <>
      <Header />
      <div className="form-container">
        <FormNav />
        <form className="form" onSubmit={handleSubmit}>

          <input placeholder="Email or Username" value={emailOrUsername} onChange={e => setEmailOrUsername(e.target.value)} required />

          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />

          <button type="submit" disabled={loading} >{loading ? 'Please wait...' : 'Login'}</button>

          <GoogleBtn />

          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>

        </form>
      </div>
    </>
  )
}

function FormNav() {
  const location = useLocation();
  let active = '';
  if (location.pathname === '/login') {
    active = 'login';
  } else {
    active = 'signup';
  }

  return (
    <div className="form-nav">
      <div className={active === 'signup' ? 'active' : ''}><Link to={'/signup'}>Signup</Link></div>
      <div className={active === 'login' ? 'active' : ''}><Link to={'/login'}>Login</Link></div>
    </div>
  );
}

function GoogleBtn() {
  function handleGoogleSSO() {
    alert('Google SSO not yet implemented');
  }
  return (
    <span onClick={handleGoogleSSO} className="google-btn"><FcGoogle className="logo" /><span>Continue with Google</span></span>
  )
}

function Header() {
  return (
    <div id="header">
      <h3><Link to='/'>FinEase</Link></h3>
    </div>
  )
}
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import Api from "../../api.config";
import { toast } from 'react-toastify';

const authRoute = {
  login: '/auth/login',
  signup: '/auth/signup',
  adminSignup: '/auth/admin-signup'
};

export default function Auth() {
  return (
    <div className="get-started">
      <Header />
      <div className="form-container">
        <FormNav />
        <Outlet />
      </div>
    </div>
  )
}

export function Signup({ admin }: { admin: boolean }) {
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
    const endpoint = admin
      ? { url: '/auth/admin-signup', inputs: { username, first, last, email, phone, password, confirm, adminKey } }
      : { url: '/auth/signup', inputs: { username, first, last, email, phone, password, confirm } };
    const { url, inputs } = endpoint;

    const signup = () => {
      Api.post(url, inputs)
        .then(res => {
          toast.success(res.data.message);
          navigate(authRoute.login);
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
    };

    setLoading(true);
    signup();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    switch (name) {
      case 'username':
        setUsername(value);
        break;
      case 'first':
        setFirst(value);
        break;
      case 'last':
        setLast(value);
        break;
      case 'email':
        setEmail(value);
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

  function checkUsernameAvailability() {
    Api.get(`/auth/check/username/${username}`)
      .then(() => {
        setUsernameErrorFeedback('');
      })
      .catch(err => {
        setUsernameErrorFeedback(err.response.data.message);
      });
  }

  function checkEmailAvailability() {
    Api.get(`/auth/check/email/${email}`)
      .then(() => {
        setEmailErrorFeedback('');
      })
      .catch(err => {
        setEmailErrorFeedback(err.response.data.message);
      });
  }

  return (
    <form className='form' onSubmit={handleSubmit}>
      <div>
        <input autoComplete="on" type="text" id="first" name="first" placeholder="First Name" value={first} onChange={handleChange} required />
      </div>
      <div>
        <input autoComplete='on' type="text" id="last" name="last" placeholder="Last Name" value={last} onChange={handleChange} required />
      </div>
      <div>
        {emailErrorFeedback && <em className="feedback">{emailErrorFeedback}</em>}
        <input onBlur={checkEmailAvailability} autoComplete='on' type="email" id="email" name="email" placeholder="Email" value={email} onChange={handleChange} required />
      </div>
      <div>
        <input autoComplete='on' type="tel" id="phone" name="phone" placeholder="Phone Number" value={phone} onChange={handleChange} required />
      </div>
      <div>
        {usernameErrorFeedback && <em className="feedback">{usernameErrorFeedback}</em>}
        <input onBlur={checkUsernameAvailability} autoComplete='on' type="text" id="username" name="username" placeholder="Username" value={username} onChange={handleChange} required />
      </div>
      <div>
        <input autoComplete='off' type="password" id="password" name="password" placeholder="Password" value={password} onChange={handleChange} required />
      </div>
      <div>
        <input autoComplete='off' type="password" id="confirm" name="confirm" placeholder="Confirm Password" value={confirm} onChange={handleChange} required />
      </div>
      {admin &&
        <div>
          <input autoComplete='off' type='password' id='admin-key' name='adminKey' placeholder='Admin Key' required value={adminKey} onChange={handleChange} />
        </div>}
      <div>
        <button type="submit" disabled={loading}>{loading ? 'Please wait...' : 'Signup'}</button>
      </div>

      {admin && <p style={{ color: 'darkred' }}>Admin Key is required to create an admin account</p>}
      <p>Already have an account? <Link to={authRoute.login}>Log In</Link></p>

    </form>
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
          navigate('/account/dashboard');
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
    <form onSubmit={handleSubmit}>
      <div>
        <input name="username_email" placeholder="Email or Username" value={emailOrUsername} onChange={e => setEmailOrUsername(e.target.value)} required />
      </div>
      <div>
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <div>
        <button type="submit" disabled={loading} >{loading ? 'Please wait...' : 'Login'}</button>
      </div>

      <p>Don't have an account? <Link to={authRoute.signup}>Sign Up</Link></p>

    </form>
  )
}

function FormNav() {
  const [active, setActive] = useState('');
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === authRoute.login) {
      setActive(authRoute.login);
    } else {
      setActive(authRoute.signup);
    }
  }, [location.pathname]);


  return (
    <div className="form-nav">
      <div className={active === authRoute.signup ? 'active' : ''}><Link to={authRoute.signup}>Signup</Link></div>
      <div className={active === authRoute.login ? 'active' : ''}><Link to={authRoute.login}>Login</Link></div>
    </div>
  );
}

function Header() {
  return (
    <header id="auth-header">
      <h3><Link to='/'>FinEase</Link></h3>
    </header>
  )
}
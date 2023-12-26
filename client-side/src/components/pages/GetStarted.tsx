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
  interface IState {
    form:{
      username: string;
      first: string;
      last: string;
      email: string;
      phone: string;
      password: string;
      confirm: string;
      adminKey: string;
    };
    emailErrorFeedback: string;
    usernameErrorFeedback: string;
    loading: boolean;
  }

  const [state, setState] = useState<IState>({
    form: {
      username: '',
      first: '',
      last: '',
      email: '',
      phone: '',
      password: '',
      confirm: '',
      adminKey: ''
    },
    emailErrorFeedback: '',
    usernameErrorFeedback: '',
    loading: false
  });

  const {emailErrorFeedback, usernameErrorFeedback, loading, form} = state;
  const {username, first, last, email, phone, password, confirm, adminKey} = form;

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
          setState(s => ({...s, loading: false}));
        })
        .catch(err => {
          if (err.response) {
            toast.error(err.response.data.message);
          } else {
            toast.error(err.message);
          }
          setState(s => ({...s, loading: false}));
        });
    };

    setState(s => ({...s, loading: true}));
    signup();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    switch (name) {
      case 'username':
        setState(s => ({...s, form: {...s.form, username: value}}));
        break;
      case 'first':
        setState(s => ({...s, form: {...s.form, first: value}}));
        break;
      case 'last':
        setState(s => ({...s, form: {...s.form, last: value}}));
        break;
      case 'email':
        setState(s => ({...s, form: {...s.form, email: value}}));
        break;
      case 'phone':
        setState(s => ({...s, form: {...s.form, phone: value}}));
        break;
      case 'password':
        setState(s => ({...s, form: {...s.form, password: value}}));
        break;
      case 'confirm':
        setState(s => ({...s, form: {...s.form, confirm: value}}));
        break;
      case 'adminKey':
        setState(s => ({...s, form: {...s.form, adminKey: value}}));
        break;
      default:
        break;
    }
  }

  function checkUsernameAvailability() {
    Api.get(`/auth/check/username/${username}`)
      .then(() => {
        setState(s => ({...s, usernameErrorFeedback: ''}));
      })
      .catch(err => {
        setState(s => ({...s, usernameErrorFeedback: err.response.data.message}));
      });
  }

  function checkEmailAvailability() {
    Api.get(`/auth/check/email/${email}`)
      .then(() => {
        setState(s => ({...s, emailErrorFeedback: ''}));
      })
      .catch(err => {
        setState(s => ({...s, emailErrorFeedback: err.response.data.message}));
      });
  }

  return (
    <form className='form' onSubmit={handleSubmit}>
      <div>
        <input type="text" id="first" name="first" placeholder="First Name" value={first} onChange={handleChange} required />
      </div>
      <div>
        <input type="text" id="last" name="last" placeholder="Last Name" value={last} onChange={handleChange} required />
      </div>
      <div>
        {emailErrorFeedback && <em className="feedback">{emailErrorFeedback}</em>}
        <input onBlur={checkEmailAvailability} type="email" id="email" name="email" placeholder="Email" value={email} onChange={handleChange} required />
      </div>
      <div>
        <input maxLength={11} type="tel" id="phone" name="phone" placeholder="Phone Number" value={phone} onChange={handleChange} required />
      </div>
      <div>
        {usernameErrorFeedback && <em className="feedback">{usernameErrorFeedback}</em>}
        <input onBlur={checkUsernameAvailability} type="text" id="username" name="username" placeholder="Username" value={username} onChange={handleChange} required />
      </div>
      <div>
        <input type="password" id="password" name="password" placeholder="Password" value={password} onChange={handleChange} required />
      </div>
      <div>
        <input type="password" id="confirm" name="confirm" placeholder="Confirm Password" value={confirm} onChange={handleChange} required />
      </div>
      {admin &&
        <div>
          <input type='password' id='admin-key' name='adminKey' placeholder='Admin Key' required value={adminKey} onChange={handleChange} />
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
  const [state, setState] = useState({
    emailOrUsername: '',
    password: '',
    loading: false
  });

  const {emailOrUsername, password, loading} = state;
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const login = () => {
      Api.post('/auth/login', { emailOrUsername, password })
        .then(res => {
          localStorage.setItem('token', res.data.token);
          navigate('/account/dashboard');
          setState(s => ({...s, loading: false}));
        })
        .catch(err => {
          if (err.response) {
            toast.error(err.response.data.message);
          } else {
            toast.error(err.message);
          }
          setState(s => ({...s, loading: false}));
        });
    }

    setState(s => ({...s, loading: true}));
    login();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    switch (name) {
      case 'username_email':
        setState(s => ({...s, emailOrUsername: value}));
        break;
      case 'password':
        setState(s => ({...s, password: value}));
        break;
      default:
        break;
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input name="username_email" placeholder="Email or Username" value={emailOrUsername} onChange={handleChange} required />
      </div>
      <div>
        <input name="password" type="password" placeholder="Password" value={password} onChange={handleChange} required />
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

export function Header() {
  return (
    <header className="header-logo">
      <h3><Link to='/'>FinEase</Link></h3>
    </header>
  )
}
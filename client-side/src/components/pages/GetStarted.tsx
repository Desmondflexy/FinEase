import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Api from "../../api.config";
import { toast } from "react-toastify";
import { useForm } from 'react-hook-form';

interface SignupInputs {
  username: string;
  first: string;
  last: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
  adminKey?: string;
}

interface LoginInputs {
  username_email: string;
  password: string;
}

export default function Auth() {
  return (
    <div className="get-started">
      <Header />
      <div className="form-container">
        <FormNav />
        <Outlet />
      </div>
    </div>
  );
}

export function Signup({ admin }: { admin: boolean }) {
  interface IState {
    // emailErrorFeedback: string;
    // usernameErrorFeedback: string;
    loading: boolean;
  }

  const [state, setState] = useState<IState>({
    // emailErrorFeedback: "",
    // usernameErrorFeedback: "",
    loading: false,
  });

  const { register, handleSubmit } = useForm<SignupInputs>();
  const { loading } = state;
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'FinEase - Signup'
  });

  function onSubmit(data: SignupInputs) {
    const { username, first, last, email, phone, password, confirm, adminKey } = data;
    const endpoint = admin
      ? { url: "/auth/admin-signup", inputs: { username, first, last, email, phone, password, confirm, adminKey } }
      : { url: "/auth/signup", inputs: { username, first, last, email, phone, password, confirm } };

    const { url, inputs } = endpoint;

    setState((s) => ({ ...s, loading: true }));
    signup(url, inputs);

    function signup(url: string, inputs: SignupInputs) {
      Api.post(url, inputs)
        .then((res) => {
          toast.success(res.data.message);
          navigate('/auth/login');
          setState((s) => ({ ...s, loading: false }));
        })
        .catch((err) => {
          if (err.response) {
            toast.error(err.response.data.message);
          } else {
            toast.error(err.message);
          }
          setState((s) => ({ ...s, loading: false }));
        });
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <div className="input-group mb-3">
        <div className={`form-floating`}>
          <input {...register('first')} className="form-control" type="text" id="first" placeholder="First Name" required />
          <label htmlFor="first">First Name</label>
        </div>
      </div>

      <div className="input-group mb-3">
        <div className={`form-floating`}>
          <input {...register('last')} className="form-control" type="text" id="last" placeholder="Last Name" required />
          <label htmlFor="last">Last Name</label>
        </div>
      </div>

      <div className="input-group mb-3">
        <div className='form-floating'>
          {/* {emailErrorFeedback && (
          <em className="feedback">{emailErrorFeedback}</em>
        )} */}
          <input {...register('email')} className="form-control" type="email" id="email" placeholder="Email" required />
          <label htmlFor="email">Email</label>
        </div>
        <p className="invalid-feedback">error feedback</p>
      </div>

      <div className="input-group mb-3">
        <div className='form-floating'>
          <input {...register('phone')} className="form-control" minLength={11} maxLength={11} type="tel" id="phone" placeholder="Phone Number" required />
          <label htmlFor="phone">Phone Number</label>
        </div>
      </div>

      <div className="input-group mb-3">
        <div className='form-floating'>
          {/* {usernameErrorFeedback && (
          <em className="feedback">{usernameErrorFeedback}</em>
        )} */}
          <input {...register('username')} className="form-control" id="username" placeholder="Username" required />
          <label htmlFor="username">Username</label>
        </div>
        <p className="invalid-feedback">error message</p>
      </div>

      <div className="input-group mb-3">
        <div className='form-floating'>
          <input {...register('password')} className="form-control" type="password" id="password" placeholder="Password" required />
          <label htmlFor="password">Password</label>
        </div>
      </div>

      <div className="input-group mb-3">
        <div className='form-floating'>
          <input {...register('confirm')} type="password" id="confirm" placeholder="Confirm Password" className="form-control" required />
          <label htmlFor="confirm">Confirm Password</label>
        </div>
      </div>

      {admin && (
        <div className="input-group mb-3">
          <div className='form-floating'>
            <input {...register('adminKey')} className="form-control" type="password" id="admin-key" placeholder="Admin Key" required />
            <label htmlFor="admin-key">Admin Key</label>
          </div>
        </div>
      )}
      <div>
        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
          {loading ? "Please wait..." : "Signup"}
        </button>
      </div>

      <p className="my-2 text-center">
        Already have an account? <Link to={'/auth/login'}>Log In</Link>
      </p>
    </form>
  );
}

export function Login() {
  const [state, setState] = useState({
    loading: false,
  });

  const { register, handleSubmit } = useForm<LoginInputs>();

  const { loading } = state;
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'FinEase - Login';
  });

  function onSubmit(data: LoginInputs) {
    const { username_email, password } = data;
    function login() {
      Api.post("/auth/login", { emailOrUsername: username_email, password })
        .then((res) => {
          localStorage.setItem("token", res.data.token);
          navigate("/account/dashboard");
          setState((s) => ({ ...s, loading: false }));
        })
        .catch((err) => {
          if (err.response) {
            toast.error(err.response.data.message);
          } else {
            toast.error(err.message);
          }
          setState((s) => ({ ...s, loading: false }));
        });
    }

    setState((s) => ({ ...s, loading: true }));
    login();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-floating">
        <input {...register('username_email')} className="form-control mb-3" id="username_email" placeholder="Email or Username" required />
        <label htmlFor="username_email">Email or Username</label>
      </div>
      <div className="form-floating mb-3">
        <input {...register('password')} className="form-control" id="password" type="password" placeholder="Password" required />
        <label htmlFor="password">Password</label>
      </div>
      <div>
        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
          {loading ? "Please wait..." : "Login"}
        </button>
      </div>

      <p>
        Don't have an account? <Link to='/auth/signup'>Sign Up</Link>
      </p>
    </form>
  );
}

function FormNav() {
  const [active, setActive] = useState("");
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === '/auth/login') {
      setActive('/auth/login');
    } else {
      setActive('/auth/signup');
    }
  }, [location.pathname]);

  return (
    <ul className="nav nav-tabs">
      <li className='nav-item'>
        <Link to='/auth/signup' className={`nav-link ${active === '/auth/signup' ? "active" : ""}`}>Signup</Link>
      </li>
      <li className="nav-item">
        <Link to='/auth/login' className={`nav-link ${active === '/auth/login' ? "active" : ""}`}>Login</Link>
      </li>
    </ul>
  );
}

export function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3">
      <div className="container">
        <Link to='/' className="navbar-brand" >FinEase</Link>
      </div>
    </nav>
  );
}

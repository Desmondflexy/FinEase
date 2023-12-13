import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Api from "../api.config";
import Loading from "./pages/Loading";
import { CgProfile } from "react-icons/cg";
import Error from "./pages/Error";
import { IUser } from "../types";

// routes
const base = '/account';
const routeObj = {
  dashboard: `${base}/dashboard`,
  profile: `${base}/profile`,
  allUsers: `${base}/all-users`,
  transactions: `${base}/transactions`,
  recharge: `${base}/recharge`,
  settings: `${base}/settings`
}

export default function Account() {
  const [user, setUser] = useState<IUser | null>(null);
  const [status, setStatus] = useState('loading'); // loading, error, success
  const [error, setError] = useState({ status: 0, statusText: '', goto: '/' });
  const location = useLocation().pathname.split('/')[2];
  const token = localStorage.getItem('token');

  const fetchAcctInfo = () => {
    Api.get('account')
      .then(res => {
        setStatus('success');
        setUser(res.data.user);
      })
      .catch(err => {
        setStatus('error');
        if (err.response) {
          const { status, statusText } = err.response;
          setError(e => ({
            ...e,
            status,
            statusText,
            goto: status >= 400 && status <= 499 ? '/auth/login' : e.goto
          }));
        } else {
          setError(e => ({ ...e, status: 500, statusText: err.message }));
        }
      });
  };

  // only fetch account info if token changes
  useEffect(fetchAcctInfo, [token, location]);

  if (user && status === 'success') {
    return (
      <div id="app-layout">
        <div id="header">
          <h3><Link to='/'>FinEase</Link></h3>
          <p><CgProfile />{user.username}</p>
        </div>
        <ul id="side-menu">
          <li className={location === 'dashboard' ? 'active' : ''}><Link to={routeObj.dashboard}>Dashboard </Link></li>
          <li className={location === 'profile' ? 'active' : ''}><Link to={routeObj.profile}>Profile</Link></li>
          <li className={location === 'transactions' ? 'active' : ''}><Link to={routeObj.transactions}>Transactions</Link></li>
          <li className={location === 'recharge' ? 'active' : ''}><Link to={routeObj.recharge}>Recharge</Link></li>
          <li className={location === 'settings' ? 'active' : ''}><Link to={routeObj.settings}>Settings</Link></li>
          {user.isAdmin &&
            <li className={location === 'all-users' ? 'active' : ''}><Link to={routeObj.allUsers}>Admin Area</Link></li>}
          <li><LogoutButton /></li>
        </ul>
        <div id="main">
          <Outlet context={[user, setUser]} />
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <Error code={error.status} message={error.statusText} goto={error.goto} />
    )
  }

  return <Loading />
}

function LogoutButton() {
  const navigate = useNavigate();

  function handleLogout() {
    Api.post('/auth/logout')
      .then(() => {
        localStorage.removeItem('token');
        navigate('/auth/login');
      })
      .catch(() => {
        console.log('warning: did not logout successfully');
        navigate('/auth/login');
      });
  }

  return <button onClick={handleLogout}>Logout</button>
}
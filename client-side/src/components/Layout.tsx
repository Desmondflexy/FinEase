import { Link, useNavigate, useLocation } from "react-router-dom";
import Api from "../api.config";
import { useState, useEffect } from "react";
import Error from "./pages/Error";
import Loading from "./pages/Loading";
import { CgProfile } from "react-icons/cg";

function LogoutButton() {
  const navigate = useNavigate();

  function handleLogout() {
    Api.post('/auth/logout')
      .then(() => {
        localStorage.removeItem('token');
        navigate('/login');
      })
      .catch(() => {
        console.log('warning: did not logout successfully');
        navigate('/login');
      });
  }

  return <button onClick={handleLogout}>Logout</button>
}

export default function Layout({ children }: ILayout) {
  const location = useLocation();
  const activeMenu = location.pathname.split('/')[1];

  const [status, setStatus] = useState('loading'); // loading, error, success
  const [error, setError] = useState({ status: 0, statusText: '', goto: '/' })
  const [user, setUser] = useState({ username: '', isAdmin: false });

  const fetchUser = () => {
    Api.get('/account/me')
      .then(res => {
        setStatus('success');
        const { username, isAdmin } = res.data.me;
        setUser(u => ({ ...u, username, isAdmin }));
      })
      .catch(err => {
        setStatus('error');
        if (err.response) {
          const { status, statusText } = err.response;
          setError(e => ({ ...e, status, statusText }));

          if (status >= 400 && status <= 499) {
            setError(e => ({ ...e, status, statusText, goto: '/login' }));
          }
        } else {
          setError(e => ({ ...e, status: 500, statusText: err.message, goto: '/' }));
        }
      });
  }

  useEffect(fetchUser, []);

  if (status === 'success') {
    if (location.pathname === '/all-users' && !user.isAdmin) {
      return <Error code={403} message="Forbidden" goto='/login' />
    }

    return (
      <div id="app-layout">
        <div id="header">
          <h3><Link to='/'>FinEase</Link></h3>
          <p><CgProfile />{user.username}</p>
        </div>
        <ul id="side-menu">
          <li className={activeMenu === 'dashboard' ? 'active' : ''}><Link to='/dashboard'>Dashboard</Link></li>
          <li className={activeMenu === 'profile' ? 'active' : ''}><Link to='/profile'>Profile</Link></li>
          <li className={activeMenu === 'transactions' ? 'active' : ''}><Link to='/transactions'>Transactions</Link></li>
          <li className={activeMenu === 'recharge' ? 'active' : ''}><Link to='/recharge'>Recharge</Link></li>
          <li className={activeMenu === 'settings' ? 'active' : ''}><Link to='/settings'>Settings</Link></li>
          {user.isAdmin &&
            <li className={activeMenu === 'all-users' ? 'active' : ''}><Link to='/all-users'>Admin Area</Link></li>}
          <li><LogoutButton /></li>
        </ul>
        <div id="main">{children}</div>
      </div>
    )

  } else if (status === 'error') {
    return <Error code={error.status} message={error.statusText} goto={error.goto} />

  } else {
    return <Loading />
  }
}

interface ILayout {
  children: React.ReactNode;
}
import { Link, useNavigate } from "react-router-dom";
import Api from "../api.config";

function LogoutButton() {
  const navigate = useNavigate();

  function handleLogout() {
    Api.post('/auth/logout')
      .then(() => {
        localStorage.removeItem('token');
      })
      .catch(() => {
        console.log('warning: did not logout successfully');
      })
      .finally(() => navigate('/login'))
  }

  return <button onClick={handleLogout}>Logout</button>
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div id="app-layout">
      <div id="header">
        <h3><Link to='/'>FinEase</Link></h3>
      </div>
      <ul id="side-menu">
        <li><Link to='/dashboard'>Dashboard</Link></li>
        <li><Link to='/profile'>Profile</Link></li>
        <li><LogoutButton /></li>
      </ul>
      <div id="user-area">{children}</div>
    </div>
  )
}

interface LayoutProps {
  children: React.ReactNode;
}
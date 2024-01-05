import { useNavigate } from "react-router-dom";
import Api from "../api.config";

export function LogoutButton() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('token');

    Api.post('/auth/logout')
      .then(() => {
        navigate('/auth/login');
      })
      .catch(() => {
        console.warn('warning: did not logout successfully');
        navigate('/auth/login');
      });
  }

  return <button onClick={handleLogout}>Logout</button>
}
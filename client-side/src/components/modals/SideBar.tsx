import { Link } from "react-router-dom";
import { IUser } from "../../types";
import { useState } from "react";
// import { LogoutButton } from "../LogoutButton";

interface Props {
  user: IUser;
}

export default function SideBar({ user }: Props) {
  const [state, setState] = useState({
    isVisible: false,
  });

  const {isVisible} = state;

  function handleMenuButton() {
    setState(s => ({ ...s, isVisible: !s.isVisible }));
  }

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">FinEase</a>
        <button onClick={handleMenuButton} className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`${isVisible ? '' : 'collapse'} navbar-collapse`}>
          <div className="navbar-nav">
            <Link to='/account/dashboard' className="nav-link active" >Dashboard</Link>
            <Link to='/account/recharge' className="nav-link" >Recharge</Link>
            <Link to='/account/transactions' className="nav-link">Transactions</Link>
            <Link to='/account/profile' className="nav-link">Profile</Link>
            <Link to='/account/settings' className="nav-link" >Settings</Link>
            {user.isAdmin && <Link to='/account/all-users' className="nav-link">Admin Area</Link>}
          </div>
        </div>
      </div>
    </nav>
  )
}
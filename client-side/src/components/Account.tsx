import { Outlet, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Api from "../api.config";
import Loading from "./pages/Loading";
import { CgProfile } from "react-icons/cg";
import Error from "./pages/Error";
import { IUser } from "../types";
import { IoMenu } from "react-icons/io5";
import SideBar from "./SideBar";
// import SideBar from "./modals/SideBar";

interface IState {
  status: 'loading' | 'error' | 'success';
  error: {
    status: number;
    statusText: string;
    goto: string;
  };
  isVisible: {
    sideBar: boolean;
  }
}

export default function Account() {
  const [user, setUser] = useState<IUser | null>(null);
  const location = useLocation().pathname.split('/')[2];
  const token = localStorage.getItem('token');
  const [state, setState] = useState<IState>({
    status: 'loading',
    error: { status: 0, statusText: '', goto: '/' },
    isVisible: { sideBar: false },
  });

  const { status, error } = state;

  useEffect(() => {
    document.title = 'FinEase | Account';
  })

  useEffect(() => {
    fetchAcctInfo();

    function fetchAcctInfo() {
      Api.get('account')
        .then(res => {
          setUser(res.data.user);
          setState(s => ({ ...s, status: 'success' }));
        })
        .catch(err => {
          setState(s => ({ ...s, status: 'error' }));
          if (err.response) {
            const { status, statusText } = err.response;
            setState(s => ({
              ...s,
              error: { status, statusText, goto: status >= 400 && status <= 499 ? '/auth/login' : s.error.goto }
            }));
          } else {
            setState(s => ({ ...s, error: { ...s.error, status: 500, statusText: err.message } }));
          }
        });
    }

  }, [token, location]);


  if (status === 'loading') {
    return <Loading />
  }

  if (status === 'success' && user) {
    return (
      <div id="app-layout">

        <div className="app-header">
          <ul>
            <li><IoMenu size={25} data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions"/></li>
            <li><Link to='/'>FinEase</Link></li>
            <li><span><CgProfile /></span><span>{user.username}</span></li>
          </ul>
        </div>

        <div className="app-body">
          {/* <SideBar user={user} /> */}
          <SideBar user={user}/>

          <main className="main p-3">
            <Outlet context={[user, setUser]} />
          </main>
          <footer className="app-footer p-3">
            <p>© 2024 FinEase. All Rights Reserved.</p>
          </footer>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <Error code={error.status} message={error.statusText} goto={error.goto} />
    );
  }
}
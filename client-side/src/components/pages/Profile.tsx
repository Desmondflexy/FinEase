import { useEffect, useState } from "react";
import Api from "../../api.config";
import Layout from "../Layout";
import Error from "./Error";
import Loading from "./Loading";

function Profile() {
  const [status, setStatus] = useState('loading'); // loading, error, success
  const [error, setError] = useState({ status: 0, statusText: '', goto: '/' })
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    phone: '',
    createdAt: '',
    acctNo: '',
    isAdmin: false
  });

  useEffect(() => {
    Api.get('/account')
      .then(res => {
        setStatus('success');
        const { fullName, email, phone, createdAt, acctNo, isAdmin } = res.data.data;
        setUser({ ...user, fullName, email, phone, createdAt, acctNo, isAdmin });
      })
      .catch(err => {
        setStatus('error');
        if (err.response) {
          const { status, statusText } = err.response;
          setError({ ...error, status, statusText });

          if (status >= 400 && status <= 499) {
            setError({ ...error, status, statusText, goto: '/login' })
          }

        } else {
          setError({ ...error, status: 500, statusText: err.message, goto: '/' });
        }
      });
  }, [])

  if (status === 'loading') {
    return <Loading />
  }

  if (status === 'success') {
    return (
      <Layout>
        <div id="profile-screen">
          <h1>Account Info</h1>
          <p><b>Name: </b><i>{user.fullName} <b style={{ color: 'darkblue' }}>{user.isAdmin && '(Admin)'}</b></i></p>
          <p><b>Email: </b><i>{user.email}</i></p>
          <p><b>Phone: </b><i>{user.phone}</i></p>
          <p><b>Wallet Account Number: </b><i>{user.acctNo}</i></p>
          <p><b>Date Registered: </b><i>{user.createdAt.split('T')[0]}</i></p>
        </div>
      </Layout>
    )
  }

  // otherwise, render the error screen
  return <Error code={error.status} message={error.statusText} goto={error.goto} />
}

export default Profile;
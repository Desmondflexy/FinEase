import { useEffect, useState } from "react";
import Api from "../../api.config";
import { ProfileStyle } from './styles/Profile.css';
import Layout from "../Layout";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [status, setStatus] = useState('loading'); // loading, error, success
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    phone: '',
    createdAt: '',
    acctNo: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    Api.get('/account')

      .then(res => {
        console.log(res.data);
        const { fullName, email, phone, createdAt, acctNo } = res.data.data;
        setUser({ ...user, fullName, email, phone, createdAt, acctNo });
        setStatus('success');
      })

      .catch(err => {
        console.log(err.response);
        setStatus(err.response.statusText);
        if (err.response.status === 401) {
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      });

  }, [])


  if (status === 'loading') {
    return <h2>Loading...</h2>
  }

  if (status === 'success') {
    return (
      <Layout>
        <ProfileStyle>
          <h1>Account Info</h1>
          <p><b>Name: </b><i>{user.fullName}</i></p>
          <p><b>Email: </b><i>{user.email}</i></p>
          <p><b>Phone: </b><i>{user.phone}</i></p>
          <p><b>Wallet Account Number: </b><i>{user.acctNo}</i></p>
          <p><b>Date Registered: </b><i>{user.createdAt.split('T')[0]}</i></p>
        </ProfileStyle>
      </Layout>
    )
  }

  return <h2>{status}</h2>
}

export default Profile;
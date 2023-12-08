import { useEffect, useState } from "react";
import Api from "../../api.config";
import Layout from "../Layout";

function Profile() {
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    phone: '',
    createdAt: '',
    acctNo: '',
    isAdmin: false
  });

  const fetchAcctInfo = () => {
    Api.get('/account')
      .then(res => {
        const { fullName, email, phone, createdAt, acctNo, isAdmin } = res.data.user;
        setUser(u => ({ ...u, fullName, email, phone, createdAt, acctNo, isAdmin }));
      })
      .catch(err => {
        console.log(err.message);
      });
  }

  useEffect(fetchAcctInfo, [])

  return (
    <Layout>
      <section id="profile-screen">
        <h1>Account Info</h1>
        <p><b>Name: </b><i>{user.fullName} <b style={{ color: 'darkblue' }}>{user.isAdmin && '(Admin)'}</b></i></p>
        <p><b>Email: </b><i>{user.email}</i></p>
        <p><b>Phone: </b><i>{user.phone}</i></p>
        <p><b>Wallet Account Number: </b><i>{user.acctNo}</i></p>
        <p><b>Date Registered: </b><i>{user.createdAt.split('T')[0]}</i></p>
      </section>
    </Layout>
  )
}

export default Profile;
import Api from "../../api.config";
import Layout from "../Layout";
import { useState, useEffect } from "react";

export default function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    Api.get('/account/all-users')
      .then(res => {
        setUsers(res.data.users);
      })
      .catch(err => {
        console.log(err);
      })
  }, []);

  return (
    <Layout>
      <div id="all-users">
        <h2>List of all active users of FinEase</h2>
        <hr />
        <table>
          <thead>
            <tr>
              <th>S/N</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Date Registered</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: IUser, index: number) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.createdAt.split('T')[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

interface IUser {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
  acctNo: string;
  isAdmin: boolean;
}
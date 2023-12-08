import Api from "../../api.config";
import { useState, useEffect } from "react";
import Error from "./Error";
import Layout from "../Layout";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState({ status: 0, statusText: "", goto: "/" });
  const [status, setStatus] = useState('loading');
  const [searchTerm, setSearchTerm] = useState('');
  // const [searchResults, setSearchResults] = useState([]);

  const fetchUsers = () => {
    Api.get('/account/all-users')
      .then(res => {
        setStatus('success');
        setUsers(res.data.users);
      })
      .catch(err => {
        setStatus('error');
        const { status, statusText } = err.response;
        setError(e => ({ ...e, status, statusText, goto: '/' }));
      });
  }

  useEffect(() => {
    console.log(searchTerm);
  }, [searchTerm]);

  useEffect(fetchUsers, []);


  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }

  if (status === 'success')
    return (
      <Layout>
        <section id="admin">
          <h2>List of all active users of FinEase</h2>
          <form className="searchbox">
            <input type="search" placeholder="Search for user..." value={searchTerm} onChange={handleSearch} />
          </form>
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
        </section>

      </Layout>
    )

  if (status === 'error') {
    return (
      <Layout>
        <Error code={error.status} message={error.statusText} goto={error.goto} />
      </Layout>
    )
  }
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
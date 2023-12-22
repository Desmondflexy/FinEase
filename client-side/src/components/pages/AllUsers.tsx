import Api from "../../api.config";
import { useState, useEffect } from "react";
// import { FaSort } from "react-icons/fa";
import { IUser } from "../../types";
import Error from "./Error";

export default function UsersList() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [status, setStatus] = useState('loading');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(users);
  const [error, setError] = useState({ status: 0, statusText: '', goto: '/' });

  const fetchUsers = () => {
    Api.get('/account/all-users')
      .then(res => {
        setStatus('success');
        setUsers(res.data.users);
      })
      .catch(err => {
        console.error(err.message);
        setStatus('error');
        if (err.response) {
          const { status, statusText } = err.response;
          setError(e => ({
            ...e,
            status,
            statusText,
            goto: status >= 400 && status <= 499 ? '/auth/login' : e.goto
          }));
        } else {
          setError(e => ({ ...e, status: 500, statusText: err.message }));
        }
      });
  };

  useEffect(fetchUsers, []);
  useEffect(() => {
    setSearchResults(users);
  }, [users]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setSearchTerm(text);
    setSearchResults(users.filter(user => {
      const searchPool = [
        user.fullName.toLowerCase(),
        user.email.toLowerCase(),
        user.phone.toLowerCase(),
        user.acctNo.toLowerCase()
      ];
      return searchPool.some(item => item.includes(text.trim()));
    }));
  }


  if (status === 'success') {
    return (
      <section id="admin">
        <h1>List of all active users of FinEase</h1>
        <form className="searchbox">
          <input type="search" placeholder="Search for user..." onChange={handleSearch} value={searchTerm} />
        </form>
        <hr />
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>S/N</th>
                <th><span>Name</span></th>
                <th><span>Username</span></th>
                <th><span>Email</span></th>
                <th><span>Phone</span></th>
                <th><span>Date Registered</span></th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((user: IUser, index: number) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.fullName}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.createdAt.split('T')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    )
  }


  if (status === 'error') {
    return (
      <Error code={error.status} message={error.statusText} goto={error.goto} />
    )
  }
}
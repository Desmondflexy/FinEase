import Layout from "../Layout";
import { Link, Outlet } from 'react-router-dom';

export default function AdminArea(){

  return (
    <Layout>
      <div id="admin-area">
        <h1>Admin Area</h1>
        <ul>
          <li><Link to='/admin-area/users'>All Users</Link></li>
        </ul>
        <Outlet />
      </div>
    </Layout>
  )
}
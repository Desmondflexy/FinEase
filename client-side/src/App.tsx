import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './components/pages/Home'
import Profile from './components/pages/Profile'
import Dashboard from './components/pages/Dashboard';
import Error from './components/pages/Error';
import UsersList from './components/pages/AllUsers';
import AdminArea from './components/pages/AdminArea';
import {AdminSignup, Signup, Login } from './components/pages/GetStarted';
import Transactions from './components/pages/Transactions';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/admin-signup' element={<AdminSignup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/admin-area' element={<AdminArea />} >
          <Route path='users' element={<UsersList />} />
        </Route>
        <Route path='transactions' element={<Transactions/>} />

        <Route path='*' element={<Error message={'Page Not Found'} code={404} goto={'/'} />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}
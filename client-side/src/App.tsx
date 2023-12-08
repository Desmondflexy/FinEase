import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './components/pages/Home'
import Profile from './components/pages/Profile'
import Dashboard from './components/pages/Dashboard';
import Error from './components/pages/Error';
import AllUsers from './components/pages/AllUsers';
import {AdminSignup, Signup, Login } from './components/pages/GetStarted';
import Transactions from './components/pages/Transactions';
import Recharge, { Airtime, Data, Electricity, Tv } from './components/pages/Recharge';
import Settings from './components/pages/Settings';
import DropdownModal from './components/DropdownModal';

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
        <Route path='/all-users' element={<AllUsers />} />
        <Route path='transactions' element={<Transactions/>} />
        <Route path='recharge' element={<Recharge />}/>
        <Route path='recharge/airtime' element={<Airtime />} />
        <Route path='recharge/data' element={<Data />} />
        <Route path='recharge/electricity' element={<Electricity />} />
        <Route path='recharge/tv' element={<Tv />} />
        <Route path='settings' element={<Settings/>} />
        <Route path='modal-test' element={<DropdownModal/>}/>

        <Route path='*' element={<Error message={'Page Not Found'} code={404} goto={'/'} />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}
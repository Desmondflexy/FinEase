import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './components/pages/Home'
import Signup from './components/pages/Signup'
import Login from './components/pages/Login'
import Profile from './components/pages/Profile'
import Dashboard from './components/pages/Dashboard';
import Error from './components/pages/Error';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/profile' element={<Profile/>} />
        <Route path='*' element={<Error message={'Page Not Found'} code={404} goto={'/'} />} />
      </Routes>
      <ToastContainer/>
    </BrowserRouter>)
}

export default App

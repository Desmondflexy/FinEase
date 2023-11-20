import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './components/pages/Home'
import Signup from './components/pages/Signup'
import Login from './components/pages/Login'
import Profile from './components/pages/Profile'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/profile' element={<Profile/>} />
      </Routes>
      <ToastContainer/>
    </BrowserRouter>)
}

export default App

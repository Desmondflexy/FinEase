import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import Api from "../../api.config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [inputs, setInputs] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInputs(values => ({ ...values, [name]: value }))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(inputs);
    Api.post('/auth/login', inputs)
      .then(res => {
        console.log(res.data);
        toast.success(res.data.message);
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      })
      .catch(err => {
        console.log(err.response.data);
        toast.error(err.response.data.message);
      })
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>

        <input type="email" id="email" name="email" placeholder="Email" value={inputs.email} onChange={handleChange} />

        <input type="password" id="password" name="password" placeholder="Password" value={inputs.password} onChange={handleChange} />

        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>

        <button type="submit">Login</button>
      </form>
      <ToastContainer />
    </>
  )
}

export default Login;
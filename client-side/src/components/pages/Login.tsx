import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import Api from "../../api.config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form } from './styles/Signup.css';

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
        localStorage.setItem('token', res.data.data);
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
      <Form className="Signup" onSubmit={handleSubmit}>
        <h1>Login</h1>

        <input type="email" id="email" name="email" placeholder="Email" value={inputs.email} onChange={handleChange} required />

        <input type="password" id="password" name="password" placeholder="Password" value={inputs.password} onChange={handleChange} required />

        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>

        <button type="submit">Login</button>
      </Form>

      <ToastContainer />
    </>
  )
}

export default Login;
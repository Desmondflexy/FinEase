import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import Api from "../../api.config";
import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { Form } from './styles/Signup.css';

function Login() {
  const [inputs, setInputs] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInputs(values => ({ ...values, [name]: value }))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const delay = 2000;
    Api.post('/auth/login', inputs)
      .then(res => {
        localStorage.setItem('token', res.data.data);
        toast.success(res.data.message);
        setTimeout(() => {
          navigate('/profile');
        }, delay);
      })
      .catch(err => {
        if (err.response) {
          toast.error(err.response.data.message);
        } else {
          toast.error(err.message);
        }
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, delay);
      })
  }
  return (
    <>
      <Form className="Signup" onSubmit={handleSubmit}>
        <h1>Login</h1>

        <input type="email" id="email" name="email" placeholder="Email" value={inputs.email} onChange={handleChange} required />

        <input type="password" id="password" name="password" placeholder="Password" value={inputs.password} onChange={handleChange} required />

        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>

        <button type="submit" disabled={loading} >{loading ? 'Please wait...' : 'Login'}</button>
      </Form>
    </>
  )
}

export default Login;
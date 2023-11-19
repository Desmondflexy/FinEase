import { useState } from 'react';
// import './styles/Signup.css';
import { Link, useNavigate } from 'react-router-dom'
import Api from '../../api.config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form } from './styles/Signup.css';

function Signup() {
  const [inputs, setInputs] = useState({
    first: '',
    last: '',
    email: '',
    phone: '',
    password: '',
    confirm: ''
  });

  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInputs(values => ({ ...values, [name]: value }))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(inputs);
    Api
      .post('/auth/signup', inputs)
      .then(res => {
        console.log(res.data);
        toast.success(res.data.message);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      })
      .catch(err => {
        console.log(err.response.data);
        toast.error(err.response.data.message);
      })
  }
  return (
    <>
      <Form onSubmit={handleSubmit}>
        <h1>Signup</h1>

        <input type="text" id="first" name="first" placeholder="First Name" value={inputs.first} onChange={handleChange} required />

        <input type="text" id="last" name="last" placeholder="Last Name" value={inputs.last} onChange={handleChange} required />

        <input type="email" id="email" name="email" placeholder="Email" value={inputs.email} onChange={handleChange} required />

        <input type="tel" id="phone" name="phone" placeholder="Phone Number" value={inputs.phone} onChange={handleChange} required />

        <input type="password" id="password" name="password" placeholder="Password" value={inputs.password} onChange={handleChange} required />

        <input type="password" id="confirm" name="confirm" placeholder="Confirm Password" value={inputs.confirm} onChange={handleChange} required />

        <p>Already have an account? <Link to="/login">Log In</Link></p>

        <button type="submit">Signup</button>
      </Form>
      
      <ToastContainer />
    </>
  )
}

export default Signup;
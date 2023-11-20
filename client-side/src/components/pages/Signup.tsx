import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import Api from '../../api.config';
import { toast } from 'react-toastify';
import { Form } from './styles/Signup.css';

function Signup() {
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    const delay = 3000;
    Api
      .post('/auth/signup', inputs)
      .then(res => {
        toast.success(res.data.message);
        setTimeout(() => {
          navigate('/login');
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
      <Form onSubmit={handleSubmit}>
        <h1>Signup</h1>

        <input type="text" id="first" name="first" placeholder="First Name" value={inputs.first} onChange={handleChange} required />

        <input type="text" id="last" name="last" placeholder="Last Name" value={inputs.last} onChange={handleChange} required />

        <input type="email" id="email" name="email" placeholder="Email" value={inputs.email} onChange={handleChange} required />

        <input type="tel" id="phone" name="phone" placeholder="Phone Number" value={inputs.phone} onChange={handleChange} required />

        <input type="password" id="password" name="password" placeholder="Password" value={inputs.password} onChange={handleChange} required />

        <input type="password" id="confirm" name="confirm" placeholder="Confirm Password" value={inputs.confirm} onChange={handleChange} required />

        <p>Already have an account? <Link to="/login">Log In</Link></p>

        <button type="submit" disabled={loading}>{loading ? 'Please wait...' : 'Signup'}</button>
      </Form>
    </>
  )
}

export default Signup;
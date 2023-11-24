import { Link } from "react-router-dom";

export default function Error({code, message, goto}: IError){
  return (
    <div id="error-screen">
      <h1>Error {code}</h1>
      <p>{message}</p>
      <Link to={goto}>{goto==='/login'? 'Login': 'Home' }</Link>
    </div>
  )
}

interface IError{
  code: number;
  message: string;
  goto: string
}
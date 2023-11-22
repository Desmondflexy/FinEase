import { Link } from "react-router-dom";

export default function Error({code, message, goto}: ErrorProps){
  return (
    <div id="error-screen">
      <h1>Error {code}</h1>
      <p>{message}</p>
      <Link to={goto}>{goto==='/login'? 'Login': 'Home' }</Link>
    </div>
  )
}

interface ErrorProps{
  code: number;
  message: string;
  goto: string
}
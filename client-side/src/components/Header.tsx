import styled from "styled-components";
import Api from "../api.config";
import { useNavigate } from "react-router-dom";

const HeaderStyle = styled.header `
  display: flex;
  gap: 20px;
  align-items: center;
  border-bottom: 2px solid;
  position: sticky;
  top: 0;
  background-color: white;
  color: blue;

  h3{
    font-size: 1.5em;
    font-weight: bold;
  }

  button{
    border: none;
    background: none;
    cursor: pointer;
    text-decoration: underline;
    font-style: italic;
    font-weight: bold;
    color: inherit;

    &:hover{
      color: darkred;
      text-decoration: none;
    }
  }
`

function Header(){
  return (
    <HeaderStyle>
      <h3>FinEase</h3>
      <Logout />
    </HeaderStyle>
  )
}

export default Header;

function Logout(){
  const navigate = useNavigate();

  function handleLogout(){
    console.log("Logout");
    Api.post('/auth/logout')
      .then(res => {
        console.log(res.data);
        localStorage.removeItem('token');
        navigate('/login');
      })
      .catch(err => {
        console.log(err.response.data);
      })
  }
  
  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  )
}
import styled from 'styled-components';

export const Form = styled.form `
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  max-width: 500px;
  padding: 20px;
  box-shadow: 2px 2px 5px inset grey;
  margin: 0 auto;

  input {
    width: 100%;
    border: none;
    border-bottom: 2px solid grey;
    padding: 10px 5px ;
    outline: none;
  }

  input:focus{
    border-bottom: 2px solid darkred;
  }

  button{
    padding: 10px;
    border-radius: 4px;
    min-width: 200px;
  }
`
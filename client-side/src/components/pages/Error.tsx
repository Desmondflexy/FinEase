import styled from "styled-components";

const ErrorLayout = styled.div `
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  text-align: center;
  font-size: 2.5em
`

export default function Error({code, message}: ErrorProps){
  return (
    <ErrorLayout>
      <h1>Error {code}</h1>
      <p>{message}</p>
    </ErrorLayout>
  )
}

interface ErrorProps{
  code: number;
  message: string;
}
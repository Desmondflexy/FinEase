import styled from "styled-components";

const LoadingStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 100%;

  img{
    height: 5em;
    margin-top: 60px;
  }

`

export default function Loading() {
  return (
    <LoadingStyle>
      <img src="loading.gif" alt="loading" />
    </LoadingStyle>
  )
}
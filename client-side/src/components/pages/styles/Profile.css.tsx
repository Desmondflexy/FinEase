import styled from "styled-components";

export const ProfileStyle = styled.div `
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 20px;
  font-size: 1.2em;
  max-width: 500px;

  & > p {
    display: flex;
    justify-content: space-between;
    border-bottom: 2px solid grey;
    padding: 10px;
  }

`
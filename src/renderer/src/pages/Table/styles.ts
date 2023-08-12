import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
`

export const CommandCard = styled.div`
  width: 100%;
  padding: 15px 10px;
  border-radius: 0px 5px 5px 0px;
  background-color: #EDF2F7;
  border-left: 5px solid #2FAA54;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;

  &:hover {
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.2);
    transition: ease-in-out 0.3s;
  }
`
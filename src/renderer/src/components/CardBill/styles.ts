import styled from "styled-components";

export const Container = styled.div`
  width: 280px;
  height: auto;
  cursor: pointer;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    border-radius: 10px;
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.2);
    transition: all 0.3s ease-in-out;
  }
`
export const InfoBill = styled.div`
  display: flex;
  height: 230px;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`
export const FinanceBill = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100px;
  justify-content: space-between;
`

export const BoxFinance = styled.div`
  display: flex;
  width: 50%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px;
`
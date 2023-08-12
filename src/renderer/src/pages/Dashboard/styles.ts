import styled from "styled-components";

export const DashboardContainer = styled.div`
  width: 100%;
  height: 100vh;
  padding: 1.25rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 40px;
`

export const Card = styled.div`
  width: 25%;
  max-width: 300px;
  height: 150px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
  padding: 10px 30px;

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  
`

export const SliderContainer = styled.div`
  width: 100%;
  height: 300px;
  background-color: #fff;
  box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
  border-radius: 10px;
  padding: 10px;
`

export const CardProduct = styled.div`
  max-width: 180px;
  height: 220px;
  border-radius: 10px;
  background-color: #F2F2F2;
  padding: 10px;
`
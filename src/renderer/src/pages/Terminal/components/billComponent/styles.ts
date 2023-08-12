import styled from "styled-components";

export const container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
`

export const BillsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 1rem;
    margin-top: 1rem;
    max-height: calc(100vh - 250px);
    overflow-y: auto;
`
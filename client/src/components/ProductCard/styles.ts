import { styled } from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: row;
  border-radius: 8px;
  width: 444px;
  padding: 16px;
  gap: 4px;
  background-color: #1e2044;
  color: #fff;
  margin: 8px;
  h1 {
    width: 100%;
    font-size: 16px;
  }
`;

export const ErrorContainer = styled.div`
  color: #c00;
  width: 100%;
`;

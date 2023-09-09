import { styled } from "styled-components";

export const Container = styled.div`
  display: flex;
  button {
    width: 100%;
    height: 40px;
    margin-bottom: 16px;
    border: 2px solid;
    border-radius: 8px;
    font-size: 20px;
    font-weight: 700;
    background-color: #1e2044;
    color: #0dac88;
    cursor: pointer;

    :active {
      opacity: 0.8 !important;
    }
  }
`;

export const Spinner = styled.div`
  @keyframes spin {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  width: 20px;
  height: 20px;
  border-top: 2px solid #0dac88;
  border-radius: 50%;
  animation: spin 1s alternate infinite;
`;

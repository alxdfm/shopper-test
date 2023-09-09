import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Lato", sans-serif;
`;

export const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 60%;
  margin-top: 116px;
  input {
    font-size: 20px;
    border: 1px solid #0dab77;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
  }
`;

export const ProductsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 80%;
  background-color: #0dab77;
  margin: 8px;
  border: 2px solid #1e2044;
  border-radius: 2px;
  font-size: 20px;
  font-weight: 700;
`;

export const Header = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  width: 100%;
  background-color: #1e2044;
`;

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  width: 60%;
  height: 100px;
  color: #0dab77;
  font-weight: 700;
  font-size: 20px;
  p {
    margin: 0 16px 0 auto;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  height: 100px;
  width: fit-content;
  a img {
    width: 140px;
  }
`;

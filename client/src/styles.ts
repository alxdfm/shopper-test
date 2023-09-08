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
  width: 80%;
  margin-top: 100px;
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
  width: 80%;
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

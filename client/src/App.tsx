import { useState } from "react";
import { Container, Content, Header, HeaderContainer, Logo } from "./styles";

function App() {
  const [text, setText] = useState<string>();
  const read = new FileReader();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files![0];
    read.readAsText(files);
    read.onload = () => {
      setText(read.result?.toString());
    };
    read.onerror = () => {
      console.log(read.error);
    };
  };
  return (
    <Container>
      <Header>
        <HeaderContainer>
          <Logo>
            <a href="https://landing.shopper.com.br/">
              <img src="logo.webp" />
            </a>
          </Logo>
          <p>Teste técnico</p>
          <a href="https://github.com/alxdfm">Alexandre Machado</a>
        </HeaderContainer>
      </Header>
      <Content>
        <input type={"file"} accept={".csv"} onChange={handleFileChange} />
        <p>{text}</p>
      </Content>
    </Container>
  );
}

export default App;

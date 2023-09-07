import { useState } from "react";
import { Container, Content } from "./styles";

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
      <Content>
        <input type={"file"} accept={".csv"} onChange={handleFileChange} />
        <p>{text}</p>
      </Content>
    </Container>
  );
}

export default App;

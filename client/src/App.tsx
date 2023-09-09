import { useState } from "react";
import {
  Container,
  Content,
  Header,
  HeaderContainer,
  Logo,
  ProductsContainer,
} from "./styles";
import { formatToObject } from "./utils/readFile";
import { updateInput, validateInput } from "./api/server";
import { Button } from "./components/Button";
import { ProductCard } from "./components/ProductCard";
import { checkErrors } from "./utils/handleData";

export type ResponseValidate = {
  code: number;
  currentPrice: number;
  name: string;
  newPrice: number;
  error: string[];
};

function App() {
  const [csv, setCsv] = useState<string>();
  const [validateButtonDisable, setValidateButtonDisable] = useState(false);
  const [updateButtonDisable, setUpdateButtonDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseValidate, setResponseValidate] =
    useState<ResponseValidate[]>();

  const read = new FileReader();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files![0];
    read.readAsText(files);
    read.onload = () => {
      setCsv(read.result?.toString());
    };
    read.onerror = () => {
      console.log(read.error);
    };
  };

  const csvToArrayObject = formatToObject(csv);

  const onClickValidate = async () => {
    setLoading(true);
    setValidateButtonDisable(true);
    if (!csvToArrayObject) {
      setValidateButtonDisable(false);
      setLoading(false);
      return;
    }
    const validateResponse = await validateInput(csvToArrayObject);
    setResponseValidate(validateResponse);
    setValidateButtonDisable(false);
    setLoading(false);
  };

  const onClickUpdate = async () => {
    setLoading(true);
    setUpdateButtonDisable(true);
    if (!responseValidate) {
      setLoading(false);
      setUpdateButtonDisable(false);
      return;
    }

    if (!csvToArrayObject) {
      setLoading(false);
      setUpdateButtonDisable(false);
      return;
    }

    if (checkErrors(responseValidate)) {
      setLoading(false);
      setUpdateButtonDisable(false);
      return;
    }

    await updateInput(csvToArrayObject);

    setResponseValidate(undefined);
    setLoading(false);
    setUpdateButtonDisable(false);
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
        <ProductsContainer>
          {!responseValidate ? (
            <p>
              Escolha um arquivo no formato .csv com os dados dos produtos e
              clique em validar.
            </p>
          ) : (
            responseValidate.map((data) => (
              <ProductCard
                key={data.code}
                code={data.code}
                name={data.name}
                currentPrice={data.currentPrice}
                newPrice={data.newPrice}
                errors={data.error}
              />
            ))
          )}
        </ProductsContainer>
        <Button
          buttonText="Validar"
          disable={validateButtonDisable}
          onClick={() => onClickValidate()}
          loading={loading}
        />
        {checkErrors(responseValidate) || !responseValidate ? null : (
          <Button
            buttonText="Atualizar"
            disable={updateButtonDisable}
            onClick={() => onClickUpdate()}
            loading={loading}
          />
        )}
      </Content>
    </Container>
  );
}

export default App;

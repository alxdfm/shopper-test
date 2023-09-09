import { Container, ErrorContainer } from "./styles";
import { Info } from "../Info";

type CardProps = {
  code: number;
  name: string;
  currentPrice: number;
  newPrice: number;
  errors: string[];
};

export function ProductCard(props: CardProps) {
  return (
    <Container>
      <h1>{props.name}</h1>
      <Info description={"Código"} value={props.code} />
      <Info
        description={"Preço atual"}
        value={`R$${Number(props.currentPrice).toFixed(2)}`}
      />
      <Info
        description={"Novo preço"}
        value={`R$${Number(props.newPrice).toFixed(2)}`}
      />
      <ErrorContainer>
        {props.errors.map((message) => (
          <p>{message}</p>
        ))}
      </ErrorContainer>
    </Container>
  );
}

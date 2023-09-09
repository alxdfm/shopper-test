import { Container, Description, Value } from "./styles";

type InfoProps = {
  description: string;
  value: number | string;
};
export function Info(props: InfoProps) {
  return (
    <Container>
      <Description>{props.description}</Description>
      <Value>{props.value}</Value>
    </Container>
  );
}

import { Container, Spinner } from "./styles";

type ButtonProps = {
  buttonText: string;
  disable: boolean;
  onClick: () => void;
  loading: boolean;
};

export function Button(props: ButtonProps) {
  return (
    <Container>
      {props.loading ? (
        <Spinner />
      ) : (
        <button disabled={props.disable} onClick={() => props.onClick()}>
          {props.buttonText}
        </button>
      )}
    </Container>
  );
}

export default (errorMessage: string) => {
  throw new Error(errorMessage);
};

export interface ErrorType {
  errorMessage: string;
}

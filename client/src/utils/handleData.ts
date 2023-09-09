import { ResponseValidate } from "../App";

export const checkErrors = (array: ResponseValidate[] | undefined) => {
  if (!array) {
    return;
  }
  for (const item of array) {
    if (item.error.length !== 0) {
      return true;
    }
  }
};

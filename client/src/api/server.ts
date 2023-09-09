import axios from "axios";

export type InputData = {
  productCode: number;
  newPrice: number;
};

export const validateInput = async (data: InputData[]) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${import.meta.env.VITE_SERVER_URL}products/validate`,
      data: { dataToValidate: data },
    });
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log(e.message);
  }
};

export const updateInput = async (data: InputData[]) => {
  try {
    await axios({
      method: "POST",
      url: `${import.meta.env.VITE_SERVER_URL}products/update`,
      data: { dataToUpdate: data },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log(e.message);
  }
};

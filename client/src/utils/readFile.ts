import { InputData } from "../api/server";

export const formatToObject = (csvFile: string | undefined) => {
  if (!csvFile) {
    return;
  }
  const returnArrayObjects: InputData[] = [];
  const splitLines = csvFile.split("\r\n");
  const keys = splitLines[0].split(",");

  splitLines.map((line) => {
    const splitLine = line.split(",");
    if (splitLine[0] === keys[0]) {
      return;
    }
    returnArrayObjects.push({
      productCode: Number(splitLine[0]),
      newPrice: Number(splitLine[1]),
    });
  });

  return returnArrayObjects;
};

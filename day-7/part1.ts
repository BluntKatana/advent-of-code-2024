// read from file
const fs = require("fs");
const data = fs.readFileSync(`${__dirname}/input.txt`, "utf-8") as string;

const totalCalibrationResult = data.split("\n").reduce((acc, line) => {
  const [unparsedValue, unparsedNumbers] = line.split(":");
  const value = Number(unparsedValue);
  const numbers = unparsedNumbers.trim().split(" ").map(Number);

  const totals = computeAllTotals(numbers, -1, []);
  const computable = totals.some((total) => total === value);

  return acc + (computable ? value : 0);
}, 0);

function computeAllTotals(
  numbers: number[],
  total: number,
  totals: number[]
): number[] {
  if (numbers.length === 0) {
    return [...totals, total];
  }
  const number = numbers[0];

  return [
    ...computeAllTotals(
      numbers.toSpliced(0, 1),
      total === -1 ? number : total * number,
      totals
    ),
    ...computeAllTotals(
      numbers.toSpliced(0, 1),
      total === -1 ? number : total + number,
      totals
    ),
  ];
}

console.log(totalCalibrationResult);

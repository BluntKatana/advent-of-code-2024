import { read } from "../utils";

const data = read(24, "example");
const [p1, p2] = data.split("\n\n");

const initialValues = p1.split("\n").map((line) => line.split(": "));

const gates = p2
  .split("\n")
  .map((line) => line.split(" "))
  .map(([gate1, logicGate, gate2, _, to]) => ({
    gate1,
    gate2,
    logicGate,
    to,
  }));

console.log(gates);

const and = (a: number, b: number) => a && b;
const or = (a: number, b: number) => a || b;
const xor = (a: number, b: number) => a ^ b;

const finalValues = []; // < values which cannot be mapped to any 'in' gate

while (initialValues.length > 0) {}

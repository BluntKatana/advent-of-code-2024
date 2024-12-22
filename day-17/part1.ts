import { read } from "../utils";
import { mod, multiply } from "../utils/math";

const data = read(17, "input");
const lines = data.split("\n");

let A = Number(lines[0].split(" ")[2]);
let B = Number(lines[1].split(" ")[2]);
let C = Number(lines[2].split(" ")[2]);

let pointer = 0;

const program = lines[4].split(" ")[1].split(",").map(Number);
console.log("initial:");
console.log(program);
console.log("A:", A, "B:", B, "C:", C);
console.log("");

const out = [];
while (pointer < program.length - 1) {
  const intr = program[pointer];
  const combo = operand("combo");
  const literal = operand("literal");

  if (intr === 0) {
    // adv
    A = adv(combo);
    pointer += 2;
  } else if (intr === 1) {
    // bxl
    B = B ^ literal;
    pointer += 2;
  } else if (intr === 2) {
    // bst
    B = mod(combo, 8);
    pointer += 2;
  } else if (intr === 3) {
    // jnz
    console.log(A !== 0);
    if (A !== 0) {
      pointer = literal;
    } else {
      pointer += 2;
    }
  } else if (intr === 4) {
    // bxc
    B = B ^ C;
    pointer += 2;
  } else if (intr === 5) {
    // out
    out.push(mod(combo, 8));
    pointer += 2;
  } else if (intr === 6) {
    // bdx
    B = adv(combo);
    pointer += 2;
  } else if (intr === 7) {
    // cdv
    C = adv(combo);
    pointer += 2;
  }

  console.log(pointer, program.length - 1);
}

function adv(combo: number) {
  return Math.trunc(A / 2 ** combo);
}

console.log(out.join(""));

console.log("");
console.log("after:");
console.log("A:", A, "B:", B, "C:", C);
console.log("out:", out.join(","));

function operand(type: "combo" | "literal") {
  const literal = program[pointer + 1];

  if (type === "literal") return literal;
  if (literal <= 3) return literal;
  if (literal === 4) return A;
  if (literal === 5) return B;
  if (literal === 6) return C;

  return -1;
}

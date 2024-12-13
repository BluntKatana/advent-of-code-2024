import { solve } from "yalps";
import { read } from "../utils";

const data = read(13, "input");
const lines = data.split("\n");

let tokens = 0;

while (true) {
  const unparsedMachine = lines.splice(0, 4);
  if (unparsedMachine.length < 3) {
    break;
  }
  const buttonA = parseButton(unparsedMachine[0]);
  const buttonB = parseButton(unparsedMachine[1]);
  const prize = parsePrize(unparsedMachine[2]);

  // 1. Start with 2 linear equations
  // px = a * ax + b * bx
  // py = a * ay + b * by

  // 2. Rewrite (px =) to (a =)
  // px - b * bx = a * ax
  // (px - b * bx) / ax = a

  // 3. Place a into (py =)
  // py = ((px - b * bx) / ax) + b * by

  // 4. Solve for b
  // 5. Place b into (a =)
  // 6. Solve for a

  const solution = solve(
    {
      objective: "cost",
      direction: "minimize",
      constraints: {
        px: { equal: prize.x },
        py: { equal: prize.y },
      },
      variables: {
        a: { px: buttonA.x, py: buttonA.y, cost: 3 },
        b: { px: buttonB.x, py: buttonB.y, cost: 1 },
      },
      integers: true,
    },
    {
      precision: 0.01,
    }
  );

  if (solution.status === "optimal") {
    const a = solution.variables[0][1];
    const b = solution.variables[1][1];

    tokens += a * 3 + b;
  }
}

console.log(tokens);

function parseButton(str: string) {
  const button = str
    .split(":")[1]
    .split(",")
    .map((val) => Number(val.trim().split("+")[1]));

  return {
    x: button[0],
    y: button[1],
  };
}

function parsePrize(str: string) {
  const prize = str
    .split(":")[1]
    .split(",")
    .map((val) => Number(val.trim().split("=")[1]));

  return { x: prize[0] + 10_000_000_000_000, y: prize[1] + 10_000_000_000_000 };
}

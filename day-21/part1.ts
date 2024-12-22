import { read } from "../utils";
import { mod, multiply, sum } from "../utils/math";

const cache = new Map();
const data = read(21, "input");
const secrets = data
  .split("\n")
  .map(Number)
  .map((n) => generateSecret(n, 2000));

function generateSecret(n: number, times: number) {
  let secret = n;

  for (let i = 0; i < times; i++) {
    secret = prune(mix(secret, secret * 64)); // < step 1
    secret = prune(mix(secret, Math.floor(secret / 32))); // < step 2
    secret = prune(mix(secret, secret * 2048)); // < step 3
  }

  return secret;
}

function mix(secret: number, n: number) {
  return secret ^ n;
}

function prune(n: number) {
  return mod(n, 16777216);
}

// console.log(secrets);
const total = sum(secrets);
console.log(total);

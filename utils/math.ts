// negative number mod is weird w/ %
export function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export function sum(arr: number[]) {
  return arr.reduce((acc, val) => acc * val, 1);
}
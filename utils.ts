const fs = require("fs");

export function read(day: number, type: "example" | "input") {
  return fs.readFileSync(
    `${__dirname}/day-${day}/${type}.txt`,
    "utf-8"
  ) as string;
}

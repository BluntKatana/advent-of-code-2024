// read from file
const fs = require("fs");
const data = fs.readFileSync(`${__dirname}/input.txt`, "utf-8") as string;

const city: string[][] = data.split("\n").map((line: string) => line.split(""));

const maxY = city.length;
const maxX = city[0].length;

const antennas = new Map<string, [number, number][]>();

for (let x = 0; x < maxX; x++) {
  for (let y = 0; y < maxY; y++) {
    const pos = city[y][x];
    if (pos === ".") continue;

    antennas.set(pos, [...(antennas.get(pos) ?? []), [x, y]]);
  }
}

const antinodes = new Set<string>();

// create the antinodes
antennas.forEach((positions) => {
  for (let i = 0; i < positions.length; i++) {
    for (let j = i; j < positions.length; j++) {
      if (i === j) continue;

      const positionA = positions[i];
      const positionB = positions[j];

      const diff = [positionA[0] - positionB[0], positionA[1] - positionB[1]];

      let antinodeA = [positionA[0] + diff[0], positionA[1] + diff[1]];
      while (isInBounds(antinodeA)) {
        antinodes.add(antinodeA.toString());
        antinodeA = [antinodeA[0] + diff[0], antinodeA[1] + diff[1]];
      }

      let antinodeB = [positionB[0] - diff[0], positionB[1] - diff[1]];
      while (isInBounds(antinodeB)) {
        antinodes.add(antinodeB.toString());
        antinodeB = [antinodeB[0] - diff[0], antinodeB[1] - diff[1]];
      }
    }
  }
});

// find antennas without antinodes on 'em
let looseAntennas = 0;
antennas.forEach((positions) => {
  looseAntennas += positions.reduce(
    (acc, pos) => (antinodes.has(pos.toString()) ? acc : acc + 1),
    0
  );
});

printCity();
console.log(antinodes.size + looseAntennas);

function isInBounds(position: number[]) {
  return (
    0 <= position[0] &&
    position[0] < maxX &&
    0 <= position[1] &&
    position[1] < maxY
  );
}

function printCity() {
  city.forEach((line, y) => {
    console.log(
      line
        .map((char, x) => {
          if (antinodes.has([x, y].toString())) return "#";
          return char;
        })
        .join("")
    );
  });
}

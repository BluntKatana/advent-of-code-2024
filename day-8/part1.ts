import { read } from "../utils";
import { Grid } from "../utils/Grid";

// read from file
const data = read(8, "input");

const city = new Grid(data, (val) => val);

const antennas = new Map<string, [number, number][]>();

city.forEach((c, x, y) => {
  if (c !== ".") antennas.set(c, [...(antennas.get(c) ?? []), [x, y]]);
});

const antinodes = new Set<string>();

// create the antinodes
antennas.forEach((positions, char) => {
  for (let i = 0; i < positions.length; i++) {
    for (let j = i; j < positions.length; j++) {
      if (i === j) continue;

      const [iX, iY] = positions[i];
      const [jX, jY] = positions[j];

      const diffX = iX - jX;
      const diffY = iY - jY;

      const aX = iX + diffX;
      const aY = iY + diffY;
      if (city.withinBounds(aX, aY)) antinodes.add([aX, aY].toString());

      const bX = jX - diffX;
      const bY = jY - diffY;
      if (city.withinBounds(bX, bY)) antinodes.add([bX, bY].toString());
    }
  }
});

console.log(antinodes.size);

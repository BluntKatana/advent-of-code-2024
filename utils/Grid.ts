import { Direction, type DirectionPattern } from "./Direction";

export const identity = <Val>(val: Val): Val => val;

export class Grid<Cell> {
  original: string;
  grid: Cell[][];
  maxX;
  maxY;

  constructor(str: string, transformCell: (cell: string) => Cell) {
    this.original = str;
    this.grid = str
      .split("\n")
      .map((line) => line.split("").map((val) => transformCell(val)));

    this.maxX = this.grid[0].length;
    this.maxY = this.grid.length;
  }

  forEach(forCell: (c: Cell, x: number, y: number) => void) {
    for (let x = 0; x < this.maxX; x++) {
      for (let y = 0; y < this.maxY; y++) {
        forCell(this.grid[y][x], x, y);
      }
    }
  }

  withinBounds(x: number, y: number) {
    return 0 <= x && x < this.maxX && 0 <= y && y < this.maxY;
  }

  at(
    x: number,
    y: number,
    settings: Partial<{ throwOnError: boolean }> = { throwOnError: true }
  ): Cell | "not-found" {
    if (!settings.throwOnError) {
      try {
        return this.grid[y][x];
      } catch {
        return "not-found";
      }
    }

    return this.grid[y][x];
  }

  set(
    x: number,
    y: number,
    cell: Cell,
    settings: Partial<{ throwOnError: boolean }> = { throwOnError: true }
  ) {
    if (!settings.throwOnError) {
      try {
        this.grid[y][x] = cell;
      } catch {}
    } else {
      this.grid[y][x] = cell;
    }
  }

  loop(
    dir: DirectionPattern,
    x: number,
    y: number,
    callback: (newX: number, newY: number) => void,
    settings: Partial<{ inBounds: boolean }> = { inBounds: true }
  ) {
    Direction.loop(dir, (offsetX, offsetY) => {
      const newX = x + offsetX;
      const newY = y + offsetY;

      if (settings.inBounds && !this.withinBounds(newX, newY)) {
        return;
      }

      callback(offsetX + x, offsetY + y);
    });
  }

  toString(transformCell?: (cell: Cell) => string) {
    return this.grid
      .map((row) =>
        row.map((cell) => (transformCell ? transformCell(cell) : cell)).join("")
      )
      .join("\n");
  }

  print() {
    console.log(this.toString());
  }

  copy<NewCell>(transformCell: (cell: string) => NewCell) {
    return new Grid(this.toString(), transformCell);
  }
}

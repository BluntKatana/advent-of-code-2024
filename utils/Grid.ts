export class Grid<Cell extends string | number> {
  grid: Cell[][];
  maxX;
  maxY;

  constructor(str: string, transformCell: (cell: string) => Cell) {
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

  isValid(x: number, y: number) {
    return 0 <= x && x < this.maxX && 0 <= y && y < this.maxY;
  }

  at(x: number, y: number) {
    return this.grid[y][x];
  }

  forEachDirectionFrom(
    x: number,
    y: number,
    { dirType }: { dirType: "orthogonal" | "diagonal" },
    forCell: (x: number, y: number) => void
  ) {
    for (let dirX = -1; dirX <= 1; dirX++) {
      for (let dirY = -1; dirY <= 1; dirY++) {
        // ensure adjacent direction when ortogonal
        if (dirType === "orthogonal" && dirX !== 0 && dirY !== 0) {
          return;
        }

        const newX = x + dirX;
        const newY = y + dirY;

        // ensure in bounds
        if (!this.isValid(x + dirX, y + dirY)) return;

        forCell(newX, newY);
      }
    }
  }
}

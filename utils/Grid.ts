export class Grid<Cell> {
  grid: Cell[][];
  maxX;
  maxY;

  constructor(str: string, transformCell?: (cell: string) => Cell) {
    this.grid = str
      .split("\n")
      .map((line) =>
        line
          .split("")
          .map((val) => (transformCell ? transformCell?.(val) : (val as Cell)))
      );

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

  at(x: number, y: number) {
    return this.grid[y][x];
  }

  set(x: number, y: number, cell: Cell) {
    this.grid[y][x] = cell;
  }

  forEachDirectionFrom(
    x: number,
    y: number,
    {
      dirType,
      checkForBounds = true,
    }: { dirType: "orthogonal" | "diagonal"; checkForBounds?: boolean },
    forCell: (x: number, y: number) => void
  ) {
    for (let dirX = -1; dirX <= 1; dirX++) {
      for (let dirY = -1; dirY <= 1; dirY++) {
        // ensure adjacent direction when ortogonal
        if (dirType === "orthogonal" && dirX !== 0 && dirY !== 0) {
          continue;
        }

        const newX = x + dirX;
        const newY = y + dirY;

        // ensure in bounds
        if (checkForBounds && !this.withinBounds(x + dirX, y + dirY)) return;
        forCell(newX, newY);
      }
    }
  }

  print(transformCell?: (cell: Cell) => string) {
    console.log(
      this.grid
        .map((row) =>
          row
            .map((cell) => (transformCell ? transformCell(cell) : cell))
            .join("")
        )
        .join("\n")
    );
  }
}

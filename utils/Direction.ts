export type DirectionPattern = "orthogonal" | "diagonal" | "all";

export class Direction {
  /**
   * For-loop through all directions
   *
   * orthogonal: Includes the cells directly above, below, to the left, and to the right of a given cell.
   * diagonal: Includes the cells at the four diagonal positions relative to a given cell.
   * all: Combines orthogonal and diagonal neighbors, considering all cells immediately surrounding a given cell.
   *
   * @param dir
   */
  static loop(
    dir: DirectionPattern,
    callback: (offsetX: number, offset: number) => void
  ) {
    const offsets: Record<typeof dir, [number, number][]> = {
      orthogonal: [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ],
      diagonal: [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
      ],
      all: [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
      ],
    };

    for (const [x, y] of offsets[dir]) {
      callback(x, y);
    }
  }
}

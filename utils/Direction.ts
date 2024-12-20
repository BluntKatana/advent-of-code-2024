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
    callback: (offsetX: number, offsetY: number) => void
  ) {
    const offsets: Record<typeof dir, { x: number; y: number }[]> = {
      orthogonal: [
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: -1 },
        { x: 0, y: 1 },
      ],
      diagonal: [
        { x: -1, y: -1 },
        { x: -1, y: 1 },
        { x: 1, y: -1 },
        { x: 1, y: 1 },
      ],
      all: [
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: -1, y: -1 },
        { x: -1, y: 1 },
        { x: 1, y: -1 },
        { x: 1, y: 1 },
      ],
    };

    for (const { x, y } of offsets[dir]) {
      callback(x, y);
    }
  }
}

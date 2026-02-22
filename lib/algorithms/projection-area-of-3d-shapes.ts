import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const projectionAreaOf3dShapes: AlgorithmDefinition = {
  id: 'projection-area-of-3d-shapes',
  title: 'Projection Area of 3D Shapes',
  leetcodeNumber: 883,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'Given an n x n grid of cube stack heights, compute the sum of three projection areas: top (xy-plane: count nonzero cells), front (xz-plane: max of each column), and side (yz-plane: max of each row). Sum all three projections for the answer.',
  tags: ['array', 'matrix', 'geometry', 'projection'],

  code: {
    pseudocode: `function projectionArea(grid):
  n = len(grid)
  top = count of nonzero grid[r][c]
  front = sum of max(column c) for c in 0..n-1
  side = sum of max(row r) for r in 0..n-1
  return top + front + side`,
    python: `def projectionArea(grid):
    n = len(grid)
    top = sum(1 for r in range(n) for c in range(n) if grid[r][c] > 0)
    front = sum(max(grid[r][c] for r in range(n)) for c in range(n))
    side = sum(max(row) for row in grid)
    return top + front + side`,
    javascript: `function projectionArea(grid) {
  const n = grid.length;
  let top = 0, front = 0, side = 0;
  for (let r = 0; r < n; r++) {
    let rowMax = 0;
    for (let c = 0; c < n; c++) {
      if (grid[r][c] > 0) top++;
      rowMax = Math.max(rowMax, grid[r][c]);
    }
    side += rowMax;
  }
  for (let c = 0; c < n; c++) {
    let colMax = 0;
    for (let r = 0; r < n; r++) colMax = Math.max(colMax, grid[r][c]);
    front += colMax;
  }
  return top + front + side;
}`,
    java: `public int projectionArea(int[][] grid) {
    int n = grid.length, top = 0, front = 0, side = 0;
    for (int r = 0; r < n; r++) {
        int rowMax = 0;
        for (int c = 0; c < n; c++) {
            if (grid[r][c] > 0) top++;
            rowMax = Math.max(rowMax, grid[r][c]);
        }
        side += rowMax;
    }
    for (int c = 0; c < n; c++) {
        int colMax = 0;
        for (int r = 0; r < n; r++) colMax = Math.max(colMax, grid[r][c]);
        front += colMax;
    }
    return top + front + side;
}`,
  },

  defaultInput: {
    grid: [[1, 2], [3, 4]],
  },

  inputFields: [
    {
      name: 'grid',
      label: 'Grid (flattened)',
      type: 'array',
      defaultValue: [1, 2, 3, 4],
      placeholder: '1,2,3,4',
      helperText: 'Row-major flattened 2x2 grid of cube heights',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const grid = [[1, 2], [3, 4]];
    const steps: AlgorithmStep[] = [];
    const n = grid.length;
    const flat = grid.flat();

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Compute three projection areas for ${n}x${n} 3D grid. Top = nonzero cells, Front = column maxes, Side = row maxes.`,
      variables: { n },
      visualization: makeViz(flat, {}, {}),
    });

    let top = 0;
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (grid[r][c] > 0) top++;
        steps.push({
          line: 2,
          explanation: `Top projection: cell (${r},${c}) = ${grid[r][c]}. ${grid[r][c] > 0 ? 'Nonzero, counts.' : 'Zero, skip.'} Top area so far: ${top}.`,
          variables: { r, c, value: grid[r][c], topArea: top },
          visualization: makeViz(flat, { [r * n + c]: grid[r][c] > 0 ? 'found' : 'comparing' }, {}),
        });
      }
    }

    steps.push({
      line: 3,
      explanation: `Top (xy) projection area = ${top}. Now compute front (xz) projection = sum of column maxes.`,
      variables: { topArea: top },
      visualization: makeViz(flat, Object.fromEntries(flat.map((v, i) => [i, v > 0 ? 'sorted' : 'default'])), {}),
    });

    let front = 0;
    const colMaxes: number[] = [];
    for (let c = 0; c < n; c++) {
      let colMax = 0;
      for (let r = 0; r < n; r++) colMax = Math.max(colMax, grid[r][c]);
      colMaxes.push(colMax);
      front += colMax;
      steps.push({
        line: 3,
        explanation: `Column ${c} max = ${colMax}. Front area so far: ${front}.`,
        variables: { col: c, colMax, frontArea: front },
        visualization: makeViz(colMaxes, { [c]: 'active' }, { [c]: `col${c}max` }),
      });
    }

    let side = 0;
    const rowMaxes: number[] = [];
    for (let r = 0; r < n; r++) {
      const rowMax = Math.max(...grid[r]);
      rowMaxes.push(rowMax);
      side += rowMax;
      steps.push({
        line: 4,
        explanation: `Row ${r} max = ${rowMax}. Side area so far: ${side}.`,
        variables: { row: r, rowMax, sideArea: side },
        visualization: makeViz(rowMaxes, { [r]: 'active' }, { [r]: `row${r}max` }),
      });
    }

    const total = top + front + side;
    steps.push({
      line: 5,
      explanation: `Total = top(${top}) + front(${front}) + side(${side}) = ${total}.`,
      variables: { top, front, side, total },
      visualization: makeViz([top, front, side], { 0: 'found', 1: 'found', 2: 'found' }, { 0: 'top', 1: 'front', 2: 'side' }),
    });

    return steps;
  },
};

export default projectionAreaOf3dShapes;

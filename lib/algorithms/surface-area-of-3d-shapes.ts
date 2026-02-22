import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const surfaceAreaOf3dShapes: AlgorithmDefinition = {
  id: 'surface-area-of-3d-shapes',
  title: 'Surface Area of 3D Shapes',
  leetcodeNumber: 892,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'Given an n x n grid where grid[i][j] is the number of cubes stacked at position (i,j), compute the total surface area. Each stack of h cubes contributes 4h + 2 area (sides and top/bottom), but faces shared between adjacent stacks are hidden. Subtract 2 * min(h1, h2) for each shared border.',
  tags: ['array', 'matrix', 'geometry'],

  code: {
    pseudocode: `function surfaceArea(grid):
  n = len(grid)
  area = 0
  for r in range(n):
    for c in range(n):
      h = grid[r][c]
      if h > 0: area += 4*h + 2
      if r > 0: area -= 2 * min(h, grid[r-1][c])
      if c > 0: area -= 2 * min(h, grid[r][c-1])
  return area`,
    python: `def surfaceArea(grid):
    n = len(grid)
    area = 0
    for r in range(n):
        for c in range(n):
            h = grid[r][c]
            if h > 0:
                area += 4 * h + 2
            if r > 0:
                area -= 2 * min(h, grid[r-1][c])
            if c > 0:
                area -= 2 * min(h, grid[r][c-1])
    return area`,
    javascript: `function surfaceArea(grid) {
  const n = grid.length;
  let area = 0;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const h = grid[r][c];
      if (h > 0) area += 4 * h + 2;
      if (r > 0) area -= 2 * Math.min(h, grid[r-1][c]);
      if (c > 0) area -= 2 * Math.min(h, grid[r][c-1]);
    }
  }
  return area;
}`,
    java: `public int surfaceArea(int[][] grid) {
    int n = grid.length, area = 0;
    for (int r = 0; r < n; r++) {
        for (int c = 0; c < n; c++) {
            int h = grid[r][c];
            if (h > 0) area += 4 * h + 2;
            if (r > 0) area -= 2 * Math.min(h, grid[r-1][c]);
            if (c > 0) area -= 2 * Math.min(h, grid[r][c-1]);
        }
    }
    return area;
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

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...flat],
      highlights,
      labels,
    });

    let area = 0;

    steps.push({
      line: 1,
      explanation: `Compute surface area of ${n}x${n} 3D shape. Each cell with h cubes contributes 4h+2, minus shared faces with neighbors.`,
      variables: { n, area: 0 },
      visualization: makeViz({}, {}),
    });

    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const h = grid[r][c];
        const idx = r * n + c;
        let cellContrib = 0;
        if (h > 0) cellContrib += 4 * h + 2;
        let hidden = 0;
        if (r > 0) hidden += 2 * Math.min(h, grid[r - 1][c]);
        if (c > 0) hidden += 2 * Math.min(h, grid[r][c - 1]);
        cellContrib -= hidden;
        area += cellContrib;

        steps.push({
          line: 6,
          explanation: `Cell (${r},${c}) h=${h}: base area=${h > 0 ? 4 * h + 2 : 0}, hidden=${hidden}, net=${cellContrib}. Running area=${area}.`,
          variables: { r, c, h, baseArea: h > 0 ? 4 * h + 2 : 0, hiddenFaces: hidden, netContrib: cellContrib, totalArea: area },
          visualization: makeViz({ [idx]: 'active' }, { [idx]: String(h) }),
        });
      }
    }

    steps.push({
      line: 9,
      explanation: `Total surface area = ${area}.`,
      variables: { result: area },
      visualization: makeViz(Object.fromEntries(flat.map((_, i) => [i, 'found'])), {}),
    });

    return steps;
  },
};

export default surfaceAreaOf3dShapes;

import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const spiralMatrixIII: AlgorithmDefinition = {
  id: 'spiral-matrix-iii',
  title: 'Spiral Matrix III',
  leetcodeNumber: 885,
  difficulty: 'Medium',
  category: 'Arrays',
  description:
    'Starting at (rStart, cStart) in an R x C grid, walk in a clockwise spiral and return the coordinates of all cells in the order visited. The spiral grows: right 1, down 1, left 2, up 2, right 3, down 3, ...',
  tags: ['Matrix', 'Simulation', 'Spiral'],
  code: {
    pseudocode: `function spiralMatrixIII(R, C, r, c):
  result = []
  dirs = [(0,1),(1,0),(0,-1),(-1,0)]  # E,S,W,N
  d = 0, steps = 1
  while len(result) < R*C:
    for _ in range(2):
      for _ in range(steps):
        if 0<=r<R and 0<=c<C: result.append([r,c])
        r += dirs[d][0], c += dirs[d][1]
      d = (d+1)%4
    steps += 1
  return result`,
    python: `def spiralMatrixIII(R, C, rStart, cStart):
    res = []
    dirs = [(0,1),(1,0),(0,-1),(-1,0)]
    r, c, d, steps = rStart, cStart, 0, 1
    while len(res) < R * C:
        for _ in range(2):
            for _ in range(steps):
                if 0 <= r < R and 0 <= c < C:
                    res.append([r, c])
                r += dirs[d][0]
                c += dirs[d][1]
            d = (d + 1) % 4
        steps += 1
    return res`,
    javascript: `function spiralMatrixIII(R, C, rStart, cStart) {
  const res = [];
  const dirs = [[0,1],[1,0],[0,-1],[-1,0]];
  let r = rStart, c = cStart, d = 0, steps = 1;
  while (res.length < R * C) {
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < steps; j++) {
        if (r >= 0 && r < R && c >= 0 && c < C)
          res.push([r, c]);
        r += dirs[d][0];
        c += dirs[d][1];
      }
      d = (d + 1) % 4;
    }
    steps++;
  }
  return res;
}`,
    java: `public int[][] spiralMatrixIII(int R, int C, int r0, int c0) {
    int[][] res = new int[R*C][2];
    int[][] dirs = {{0,1},{1,0},{0,-1},{-1,0}};
    int r = r0, c = c0, d = 0, steps = 1, idx = 0;
    while (idx < R*C) {
        for (int i = 0; i < 2; i++) {
            for (int j = 0; j < steps; j++) {
                if (r >= 0 && r < R && c >= 0 && c < C)
                    res[idx++] = new int[]{r, c};
                r += dirs[d][0]; c += dirs[d][1];
            }
            d = (d + 1) % 4;
        }
        steps++;
    }
    return res;
}`,
  },
  defaultInput: { R: 3, C: 3, rStart: 1, cStart: 1 },
  inputFields: [
    { name: 'R', label: 'Rows (R)', type: 'number', defaultValue: 3, placeholder: '3' },
    { name: 'C', label: 'Cols (C)', type: 'number', defaultValue: 3, placeholder: '3' },
    { name: 'rStart', label: 'Start Row', type: 'number', defaultValue: 1, placeholder: '1' },
    { name: 'cStart', label: 'Start Col', type: 'number', defaultValue: 1, placeholder: '1' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const R = input.R as number;
    const C = input.C as number;
    const rStart = input.rStart as number;
    const cStart = input.cStart as number;
    const steps: AlgorithmStep[] = [];

    const grid: number[] = new Array(R * C).fill(0);
    const order: number[] = [];
    const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    const dirNames = ['East', 'South', 'West', 'North'];
    let r = rStart, c = cStart, d = 0, stepCount = 1;

    function makeViz(curr: number, note: string): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < R * C; i++) {
        const ri = Math.floor(i / C), ci = i % C;
        labels[i] = `(${ri},${ci})`;
        highlights[i] = 'default';
      }
      for (const visited of order) highlights[visited] = 'visited';
      if (curr >= 0 && curr < R * C) highlights[curr] = 'active';
      return {
        type: 'array',
        array: grid,
        highlights,
        labels,
        auxData: { label: 'Spiral III', entries: [{ key: 'Phase', value: note }, { key: 'Visited', value: `${order.length}/${R * C}` }] },
      };
    }

    const startIdx = rStart * C + cStart;
    steps.push({
      line: 1,
      explanation: `Spiral from (${rStart},${cStart}) in ${R}x${C} grid. Walk E→S→W→N, growing step count each pair.`,
      variables: { R, C, rStart, cStart },
      visualization: makeViz(startIdx, 'Start'),
    });

    while (order.length < R * C) {
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < stepCount; j++) {
          if (r >= 0 && r < R && c >= 0 && c < C) {
            const idx = r * C + c;
            order.push(idx);
            steps.push({
              line: 7,
              explanation: `Visit (${r},${c}) going ${dirNames[d]}. Position ${order.length} of ${R * C}.`,
              variables: { r, c, direction: dirNames[d], visited: order.length },
              visualization: makeViz(idx, `${dirNames[d]} step ${j + 1}/${stepCount}`),
            });
          }
          r += dirs[d][0];
          c += dirs[d][1];
        }
        d = (d + 1) % 4;
      }
      stepCount++;
    }

    steps.push({
      line: 12,
      explanation: `All ${R * C} cells visited in spiral order from (${rStart},${cStart}).`,
      variables: { total: R * C },
      visualization: {
        type: 'array',
        array: grid,
        highlights: Object.fromEntries(order.map((_, i) => [order[i], 'found'])),
        labels: Object.fromEntries(Array.from({ length: R * C }, (_, i) => [i, `(${Math.floor(i / C)},${i % C})`])),
      },
    });

    return steps;
  },
};

export default spiralMatrixIII;

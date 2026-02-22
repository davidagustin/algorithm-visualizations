import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minCostPathGrid: AlgorithmDefinition = {
  id: 'min-cost-path-grid',
  title: 'Minimum Cost Path in Grid (Right/Down/Diagonal)',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Find the minimum cost path from top-left to bottom-right of a grid, where at each step you can move right, down, or diagonally. This extends the basic min-path problem to include diagonal moves. dp[r][c] = grid[r][c] + min(dp[r-1][c], dp[r][c-1], dp[r-1][c-1]).',
  tags: ['dynamic programming', 'grid', 'path', 'classic', 'diagonal'],

  code: {
    pseudocode: `function minCostPath(cost):
  rows, cols = dimensions
  dp = copy of cost
  for r from 1 to rows-1: dp[r][0] += dp[r-1][0]
  for c from 1 to cols-1: dp[0][c] += dp[0][c-1]
  for r from 1 to rows-1:
    for c from 1 to cols-1:
      dp[r][c] += min(dp[r-1][c], dp[r][c-1], dp[r-1][c-1])
  return dp[rows-1][cols-1]`,
    python: `def minCostPath(cost):
    rows,cols=len(cost),len(cost[0])
    dp=[row[:] for row in cost]
    for r in range(1,rows): dp[r][0]+=dp[r-1][0]
    for c in range(1,cols): dp[0][c]+=dp[0][c-1]
    for r in range(1,rows):
        for c in range(1,cols):
            dp[r][c]+=min(dp[r-1][c],dp[r][c-1],dp[r-1][c-1])
    return dp[-1][-1]`,
    javascript: `function minCostPath(cost) {
  const rows=cost.length,cols=cost[0].length;
  const dp=cost.map(r=>[...r]);
  for(let r=1;r<rows;r++) dp[r][0]+=dp[r-1][0];
  for(let c=1;c<cols;c++) dp[0][c]+=dp[0][c-1];
  for(let r=1;r<rows;r++)
    for(let c=1;c<cols;c++)
      dp[r][c]+=Math.min(dp[r-1][c],dp[r][c-1],dp[r-1][c-1]);
  return dp[rows-1][cols-1];
}`,
    java: `public int minCostPath(int[][] cost) {
    int rows=cost.length,cols=cost[0].length;
    int[][] dp=new int[rows][cols];
    dp[0][0]=cost[0][0];
    for(int r=1;r<rows;r++) dp[r][0]=cost[r][0]+dp[r-1][0];
    for(int c=1;c<cols;c++) dp[0][c]=cost[0][c]+dp[0][c-1];
    for(int r=1;r<rows;r++)
        for(int c=1;c<cols;c++)
            dp[r][c]=cost[r][c]+Math.min(dp[r-1][c],Math.min(dp[r][c-1],dp[r-1][c-1]));
    return dp[rows-1][cols-1];
}`,
  },

  defaultInput: {
    cost: [[1, 2, 3], [4, 8, 2], [1, 5, 3]],
  },

  inputFields: [
    {
      name: 'cost',
      label: 'Cost Grid',
      type: 'array',
      defaultValue: [[1, 2, 3], [4, 8, 2], [1, 5, 3]],
      placeholder: '[[1,2,3],[4,8,2],[1,5,3]]',
      helperText: '2D grid of non-negative costs',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const cost = input.cost as number[][];
    const rows = cost.length;
    const cols = cost[0].length;
    const steps: AlgorithmStep[] = [];

    const dp: number[][] = cost.map(r => [...r]);

    const makeViz = (arr: number[], hi: Record<number, string>, lb: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights: hi,
      labels: lb,
    });

    steps.push({
      line: 1,
      explanation: `Cost grid ${rows}x${cols}. Find min-cost path moving right, down, OR diagonally to bottom-right.`,
      variables: { rows, cols },
      visualization: makeViz(cost.flat(), { 0: 'active' }, { 0: 'start' }),
    });

    for (let r = 1; r < rows; r++) dp[r][0] += dp[r - 1][0];
    for (let c = 1; c < cols; c++) dp[0][c] += dp[0][c - 1];

    steps.push({
      line: 3,
      explanation: `Fill edges: first col [${Array.from({ length: rows }, (_, r) => dp[r][0]).join(',')}], first row [${dp[0].join(',')}]`,
      variables: { firstCol: Array.from({ length: rows }, (_, r) => dp[r][0]), firstRow: [...dp[0]] },
      visualization: makeViz(dp.flat(), {}, {}),
    });

    for (let r = 1; r < rows; r++) {
      for (let c = 1; c < cols; c++) {
        const fromAbove = dp[r - 1][c];
        const fromLeft = dp[r][c - 1];
        const fromDiag = dp[r - 1][c - 1];
        dp[r][c] += Math.min(fromAbove, fromLeft, fromDiag);

        const hi: Record<number, string> = {};
        const lb: Record<number, string> = {};
        hi[r * cols + c] = 'active';
        hi[(r - 1) * cols + c] = 'comparing';
        hi[r * cols + (c - 1)] = 'comparing';
        hi[(r - 1) * cols + (c - 1)] = 'comparing';
        lb[r * cols + c] = `${dp[r][c]}`;

        steps.push({
          line: 7,
          explanation: `dp[${r}][${c}] = cost(${cost[r][c]}) + min(up=${fromAbove}, left=${fromLeft}, diag=${fromDiag}) = ${dp[r][c]}`,
          variables: { r, c, costVal: cost[r][c], fromAbove, fromLeft, fromDiag, result: dp[r][c] },
          visualization: makeViz(dp.flat(), hi, lb),
        });
      }
    }

    steps.push({
      line: 8,
      explanation: `Minimum cost path (right/down/diagonal) = ${dp[rows - 1][cols - 1]}`,
      variables: { answer: dp[rows - 1][cols - 1] },
      visualization: makeViz(dp.flat(), { [(rows - 1) * cols + (cols - 1)]: 'found' }, { [(rows - 1) * cols + (cols - 1)]: `ans:${dp[rows - 1][cols - 1]}` }),
    });

    return steps;
  },
};

export default minCostPathGrid;

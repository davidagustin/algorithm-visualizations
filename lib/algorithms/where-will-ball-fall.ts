import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const whereWillBallFall: AlgorithmDefinition = {
  id: 'where-will-ball-fall',
  title: 'Where Will the Ball Fall',
  leetcodeNumber: 1706,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'A 2D grid has deflectors: 1 means deflect right-down and -1 means deflect left-down. Drop a ball from each column and determine where it exits at the bottom, or -1 if it gets stuck. Simulate each ball: if deflectors form a V-shape or hit a wall, the ball is stuck. Track column position row by row.',
  tags: ['dynamic programming', 'simulation', 'array', 'matrix'],

  code: {
    pseudocode: `function findBall(grid):
  m, n = rows, cols
  result = [-1] * n
  for col in 0..n-1:
    c = col
    for row in 0..m-1:
      if grid[row][c] == 1:
        if c+1 >= n or grid[row][c+1] == -1:
          c = -1; break  // stuck
        c = c + 1
      else:
        if c-1 < 0 or grid[row][c-1] == 1:
          c = -1; break  // stuck
        c = c - 1
    result[col] = c
  return result`,

    python: `def findBall(grid):
    m, n = len(grid), len(grid[0])
    result = []
    for col in range(n):
        c = col
        for row in range(m):
            if grid[row][c] == 1:
                if c+1 >= n or grid[row][c+1] == -1:
                    c = -1; break
                c += 1
            else:
                if c-1 < 0 or grid[row][c-1] == 1:
                    c = -1; break
                c -= 1
        result.append(c)
    return result`,

    javascript: `function findBall(grid) {
  const m = grid.length, n = grid[0].length;
  const result = [];
  for (let col = 0; col < n; col++) {
    let c = col;
    for (let row = 0; row < m; row++) {
      if (grid[row][c] === 1) {
        if (c+1 >= n || grid[row][c+1] === -1) { c=-1; break; }
        c++;
      } else {
        if (c-1 < 0 || grid[row][c-1] === 1) { c=-1; break; }
        c--;
      }
    }
    result.push(c);
  }
  return result;
}`,

    java: `public int[] findBall(int[][] grid) {
    int m=grid.length, n=grid[0].length;
    int[] res = new int[n];
    for (int col=0; col<n; col++) {
        int c=col;
        for (int row=0; row<m; row++) {
            if (grid[row][c]==1) {
                if (c+1>=n||grid[row][c+1]==-1){c=-1;break;} c++;
            } else {
                if (c-1<0||grid[row][c-1]==1){c=-1;break;} c--;
            }
        }
        res[col]=c;
    }
    return res;
}`,
  },

  defaultInput: {
    grid: [[1,1,1,-1,-1],[1,1,1,-1,-1],[-1,-1,-1,1,1],[1,1,1,1,-1],[-1,-1,-1,-1,-1]],
  },

  inputFields: [
    {
      name: 'grid',
      label: 'Grid (1=right-deflect, -1=left-deflect)',
      type: 'array',
      defaultValue: [[1,1,1,-1,-1],[1,1,1,-1,-1],[-1,-1,-1,1,1],[1,1,1,1,-1],[-1,-1,-1,-1,-1]],
      placeholder: '[[1,1,-1],[-1,1,1]]',
      helperText: 'Grid where 1 = deflect right-down, -1 = deflect left-down',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const grid = input.grid as number[][];
    const steps: AlgorithmStep[] = [];
    const m = grid.length;
    const n = grid[0].length;

    steps.push({
      line: 1,
      explanation: `Ball drop simulation on ${m}x${n} grid. Drop a ball from each of ${n} columns and trace it row by row.`,
      variables: { rows: m, cols: n },
      visualization: {
        type: 'array',
        array: grid[0],
        highlights: {},
        labels: Object.fromEntries(grid[0].map((v, i) => [i, v === 1 ? '\\' : '/'])),
      },
    });

    const result: number[] = [];
    for (let col = 0; col < n; col++) {
      let c = col;
      for (let row = 0; row < m; row++) {
        const prev = c;
        if (grid[row][c] === 1) {
          if (c + 1 >= n || grid[row][c + 1] === -1) { c = -1; break; }
          c++;
        } else {
          if (c - 1 < 0 || grid[row][c - 1] === 1) { c = -1; break; }
          c--;
        }

        if (row < 3) {
          const highlights: Record<number, string> = {};
          if (prev >= 0) highlights[prev] = 'active';
          if (c >= 0) highlights[c] = 'found';
          steps.push({
            line: 5,
            explanation: `Ball from col ${col}, row ${row}: moved from col ${prev} to col ${c >= 0 ? c : 'stuck'}.`,
            variables: { ball: col, row, fromCol: prev, toCol: c },
            visualization: {
              type: 'array',
              array: grid[row],
              highlights,
              labels: Object.fromEntries(grid[row].map((v, i) => [i, v === 1 ? '\\' : '/'])),
            },
          });
        }
      }
      result.push(c);
    }

    steps.push({
      line: 13,
      explanation: `All balls traced. Exit columns: [${result.join(', ')}]. -1 means the ball got stuck.`,
      variables: { result },
      visualization: {
        type: 'array',
        array: result,
        highlights: Object.fromEntries(result.map((v, i) => [i, v === -1 ? 'mismatch' : 'found'])),
        labels: Object.fromEntries(result.map((v, i) => [i, v === -1 ? 'stuck' : `col${v}`])),
      },
    });

    return steps;
  },
};

export default whereWillBallFall;

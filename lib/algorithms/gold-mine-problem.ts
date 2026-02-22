import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const goldMineProblem: AlgorithmDefinition = {
  id: 'gold-mine-problem',
  title: 'Gold Mine Problem',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'A miner starts at any cell in the first column and can move right, right-up, or right-down at each step. Find the maximum gold that can be collected. Use DP processed column by column: dp[r][c] = max gold collectible when standing at (r,c). The answer is the maximum in the last column.',
  tags: ['dynamic programming', 'grid', 'classic', 'path'],

  code: {
    pseudocode: `function getMaxGold(mine):
  rows, cols = dimensions
  dp = copy of mine
  for c from 1 to cols-1:
    for r from 0 to rows-1:
      right = dp[r][c-1]
      right_up = dp[r-1][c-1] if r > 0 else 0
      right_down = dp[r+1][c-1] if r < rows-1 else 0
      dp[r][c] = mine[r][c] + max(right, right_up, right_down)
  return max(dp[r][cols-1] for all r)`,
    python: `def getMaxGold(mine):
    rows,cols=len(mine),len(mine[0])
    dp=[row[:] for row in mine]
    for c in range(1,cols):
        for r in range(rows):
            right=dp[r][c-1]
            right_up=dp[r-1][c-1] if r>0 else 0
            right_down=dp[r+1][c-1] if r<rows-1 else 0
            dp[r][c]=mine[r][c]+max(right,right_up,right_down)
    return max(dp[r][cols-1] for r in range(rows))`,
    javascript: `function getMaxGold(mine) {
  const rows=mine.length,cols=mine[0].length;
  const dp=mine.map(r=>[...r]);
  for(let c=1;c<cols;c++)
    for(let r=0;r<rows;r++) {
      const right=dp[r][c-1];
      const up=r>0?dp[r-1][c-1]:0;
      const down=r<rows-1?dp[r+1][c-1]:0;
      dp[r][c]=mine[r][c]+Math.max(right,up,down);
    }
  return Math.max(...Array.from({length:rows},(_,r)=>dp[r][cols-1]));
}`,
    java: `public int getMaxGold(int[][] mine) {
    int rows=mine.length,cols=mine[0].length;
    int[][] dp=new int[rows][cols];
    for(int r=0;r<rows;r++) dp[r][0]=mine[r][0];
    for(int c=1;c<cols;c++)
        for(int r=0;r<rows;r++) {
            int right=dp[r][c-1];
            int up=r>0?dp[r-1][c-1]:0;
            int down=r<rows-1?dp[r+1][c-1]:0;
            dp[r][c]=mine[r][c]+Math.max(right,Math.max(up,down));
        }
    int ans=0;
    for(int r=0;r<rows;r++) ans=Math.max(ans,dp[r][cols-1]);
    return ans;
}`,
  },

  defaultInput: {
    mine: [[1, 3, 1, 5], [2, 2, 4, 1], [5, 0, 2, 3], [0, 6, 1, 2]],
  },

  inputFields: [
    {
      name: 'mine',
      label: 'Gold Mine Grid',
      type: 'array',
      defaultValue: [[1, 3, 1, 5], [2, 2, 4, 1], [5, 0, 2, 3], [0, 6, 1, 2]],
      placeholder: '[[1,3,1,5],[2,2,4,1],[5,0,2,3],[0,6,1,2]]',
      helperText: '2D grid with gold amounts in each cell',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const mine = input.mine as number[][];
    const rows = mine.length;
    const cols = mine[0].length;
    const steps: AlgorithmStep[] = [];

    const dp: number[][] = mine.map(r => [...r]);

    const makeViz = (arr: number[], hi: Record<number, string>, lb: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights: hi,
      labels: lb,
    });

    steps.push({
      line: 1,
      explanation: `Gold mine ${rows}x${cols}. Start at any cell in column 0, move right/right-up/right-down. Maximize gold collected.`,
      variables: { rows, cols },
      visualization: makeViz(mine.flat(), {}, {}),
    });

    // Initialize first column highlight
    const initHi: Record<number, string> = {};
    const initLb: Record<number, string> = {};
    for (let r = 0; r < rows; r++) { initHi[r * cols] = 'active'; initLb[r * cols] = `${dp[r][0]}`; }
    steps.push({
      line: 2,
      explanation: `First column is the starting point. Values: [${Array.from({ length: rows }, (_, r) => dp[r][0]).join(', ')}]`,
      variables: { firstCol: Array.from({ length: rows }, (_, r) => dp[r][0]) },
      visualization: makeViz(dp.flat(), initHi, initLb),
    });

    for (let c = 1; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const right = dp[r][c - 1];
        const up = r > 0 ? dp[r - 1][c - 1] : 0;
        const down = r < rows - 1 ? dp[r + 1][c - 1] : 0;
        dp[r][c] = mine[r][c] + Math.max(right, up, down);

        const hi: Record<number, string> = {};
        const lb: Record<number, string> = {};
        hi[r * cols + c] = 'active';
        lb[r * cols + c] = `${dp[r][c]}`;
        hi[r * cols + (c - 1)] = 'comparing';
        if (r > 0) hi[(r - 1) * cols + (c - 1)] = 'comparing';
        if (r < rows - 1) hi[(r + 1) * cols + (c - 1)] = 'comparing';

        steps.push({
          line: 7,
          explanation: `dp[${r}][${c}] = mine[${r}][${c}](${mine[r][c]}) + max(right=${right}, up=${up}, down=${down}) = ${dp[r][c]}`,
          variables: { r, c, mineVal: mine[r][c], right, up, down, result: dp[r][c] },
          visualization: makeViz(dp.flat(), hi, lb),
        });
      }
    }

    let maxGold = 0;
    let bestRow = 0;
    for (let r = 0; r < rows; r++) {
      if (dp[r][cols - 1] > maxGold) { maxGold = dp[r][cols - 1]; bestRow = r; }
    }

    const finalHi: Record<number, string> = { [bestRow * cols + (cols - 1)]: 'found' };
    const finalLb: Record<number, string> = { [bestRow * cols + (cols - 1)]: `max:${maxGold}` };

    steps.push({
      line: 8,
      explanation: `Maximum gold collectible = ${maxGold} (ending at row ${bestRow}, col ${cols - 1})`,
      variables: { answer: maxGold, bestRow },
      visualization: makeViz(dp.flat(), finalHi, finalLb),
    });

    return steps;
  },
};

export default goldMineProblem;

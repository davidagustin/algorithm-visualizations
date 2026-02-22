import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const matrixChainMultiplication: AlgorithmDefinition = {
  id: 'matrix-chain-multiplication',
  title: 'Matrix Chain Multiplication',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given a chain of matrices, find the most efficient way to multiply them together. The DP table dp[i][j] represents the minimum number of scalar multiplications needed to compute the product of matrices from i to j. For each chain length, we try every possible split point k and pick the one minimizing total cost. The cost of multiplying A[i..k] by A[k+1..j] is dp[i][k] + dp[k+1][j] + dims[i]*dims[k+1]*dims[j+1].',
  tags: ['dp', 'matrix', 'interval dp', 'optimization'],

  code: {
    pseudocode: `function matrixChainOrder(dims):
  // dims[i] x dims[i+1] is size of matrix i
  n = len(dims) - 1  // number of matrices
  dp = 2D array n x n, all 0
  for length from 2 to n:
    for i from 0 to n-length:
      j = i + length - 1
      dp[i][j] = INFINITY
      for k from i to j-1:
        cost = dp[i][k] + dp[k+1][j] + dims[i]*dims[k+1]*dims[j+1]
        if cost < dp[i][j]:
          dp[i][j] = cost
  return dp[0][n-1]`,
    python: `def matrixChainOrder(dims):
    n = len(dims) - 1
    dp = [[0]*n for _ in range(n)]
    for length in range(2, n+1):
        for i in range(n-length+1):
            j = i + length - 1
            dp[i][j] = float('inf')
            for k in range(i, j):
                cost = dp[i][k] + dp[k+1][j] + dims[i]*dims[k+1]*dims[j+1]
                dp[i][j] = min(dp[i][j], cost)
    return dp[0][n-1]`,
    javascript: `function matrixChainOrder(dims) {
  const n = dims.length - 1;
  const dp = Array.from({length: n}, () => new Array(n).fill(0));
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n-len; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;
      for (let k = i; k < j; k++) {
        const cost = dp[i][k] + dp[k+1][j] + dims[i]*dims[k+1]*dims[j+1];
        dp[i][j] = Math.min(dp[i][j], cost);
      }
    }
  }
  return dp[0][n-1];
}`,
    java: `public int matrixChainOrder(int[] dims) {
    int n = dims.length - 1;
    int[][] dp = new int[n][n];
    for (int len = 2; len <= n; len++) {
        for (int i = 0; i <= n-len; i++) {
            int j = i + len - 1;
            dp[i][j] = Integer.MAX_VALUE;
            for (int k = i; k < j; k++) {
                int cost = dp[i][k] + dp[k+1][j] + dims[i]*dims[k+1]*dims[j+1];
                dp[i][j] = Math.min(dp[i][j], cost);
            }
        }
    }
    return dp[0][n-1];
}`,
  },

  defaultInput: {
    dims: [10, 30, 5, 60],
  },

  inputFields: [
    {
      name: 'dims',
      label: 'Matrix Dimensions',
      type: 'array',
      defaultValue: [10, 30, 5, 60],
      placeholder: '10,30,5,60',
      helperText: 'Dimension array: matrix i has size dims[i] x dims[i+1]',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const dims = input.dims as number[];
    const steps: AlgorithmStep[] = [];
    const n = dims.length - 1;
    const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

    const flatDP = (): number[] =>
      dp.flat().map(v => (v === Infinity ? -1 : v));
    const makeViz = (highlights: Record<number, string>): DPVisualization => ({
      type: 'dp-table',
      values: flatDP(),
      highlights,
      labels: Array.from({ length: n * n }, (_, k) => {
        const r = Math.floor(k / n);
        const c = k % n;
        return `M${r}..M${c}`;
      }),
    });

    steps.push({
      line: 1,
      explanation: `Matrix chain: ${n} matrices. dims = [${dims.join(', ')}]. Matrix i is ${dims[0]}...${dims[n]} shaped.`,
      variables: { n, dims: dims.join(',') },
      visualization: makeViz({}),
    });

    for (let length = 2; length <= n; length++) {
      for (let i = 0; i <= n - length; i++) {
        const j = i + length - 1;
        const idx = i * n + j;
        dp[i][j] = Infinity;
        let bestK = i;
        let bestCost = Infinity;

        for (let k = i; k < j; k++) {
          const cost = dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];
          steps.push({
            line: 9,
            explanation: `Split at k=${k}: cost = dp[${i}][${k}] + dp[${k + 1}][${j}] + ${dims[i]}*${dims[k + 1]}*${dims[j + 1]} = ${dp[i][k]} + ${dp[k + 1][j]} + ${dims[i] * dims[k + 1] * dims[j + 1]} = ${cost}.`,
            variables: { length, i, j, k, cost, currentMin: dp[i][j] === Infinity ? 'Inf' : dp[i][j] },
            visualization: makeViz({
              [idx]: 'active',
              [i * n + k]: 'comparing',
              [(k + 1) * n + j]: 'comparing',
            }),
          });
          if (cost < bestCost) {
            bestCost = cost;
            bestK = k;
          }
          dp[i][j] = Math.min(dp[i][j], cost);
        }

        steps.push({
          line: 10,
          explanation: `Best split for M[${i}..${j}] is at k=${bestK} with cost ${dp[i][j]}.`,
          variables: { i, j, bestK, 'dp[i][j]': dp[i][j] },
          visualization: makeViz({ [idx]: 'found' }),
        });
      }
    }

    steps.push({
      line: 11,
      explanation: `Minimum multiplications to chain all ${n} matrices = ${dp[0][n - 1]}.`,
      variables: { result: dp[0][n - 1] },
      visualization: makeViz({ [n - 1]: 'found' }),
    });

    return steps;
  },
};

export default matrixChainMultiplication;

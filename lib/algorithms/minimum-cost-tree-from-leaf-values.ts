import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const minimumCostTreeFromLeafValues: AlgorithmDefinition = {
  id: 'minimum-cost-tree-from-leaf-values',
  title: 'Minimum Cost Tree From Leaf Values',
  leetcodeNumber: 1130,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given an array of leaf values, build a binary tree where all leaf nodes in order are the input array. Each non-leaf node\'s value equals the product of the max leaves in its left and right subtrees. Minimize the sum of all non-leaf node values. Use interval DP: dp[i][j] = min cost to build a tree with leaves arr[i..j], trying every split point k.',
  tags: ['Tree', 'Dynamic Programming', 'Stack', 'Greedy'],
  code: {
    pseudocode: `function mctFromLeafValues(arr):
  n = len(arr)
  dp[i][j] = min cost for leaves arr[i..j]
  maxVal[i][j] = max of arr[i..j]
  for len 2 to n:
    for i from 0 to n-len:
      j = i + len - 1
      dp[i][j] = INF
      for k from i to j-1:
        cost = maxVal[i][k] * maxVal[k+1][j] + dp[i][k] + dp[k+1][j]
        dp[i][j] = min(dp[i][j], cost)
  return dp[0][n-1]`,
    python: `def mctFromLeafValues(arr):
    n = len(arr)
    dp = [[0]*n for _ in range(n)]
    maxVal = [[0]*n for _ in range(n)]
    for i in range(n):
        maxVal[i][i] = arr[i]
        for j in range(i+1, n):
            maxVal[i][j] = max(maxVal[i][j-1], arr[j])
    for length in range(2, n+1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = float('inf')
            for k in range(i, j):
                dp[i][j] = min(dp[i][j],
                    maxVal[i][k]*maxVal[k+1][j] + dp[i][k] + dp[k+1][j])
    return dp[0][n-1]`,
    javascript: `function mctFromLeafValues(arr) {
  const n = arr.length;
  const dp = Array.from({length:n}, () => new Array(n).fill(0));
  const maxVal = Array.from({length:n}, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    maxVal[i][i] = arr[i];
    for (let j = i+1; j < n; j++)
      maxVal[i][j] = Math.max(maxVal[i][j-1], arr[j]);
  }
  for (let len = 2; len <= n; len++)
    for (let i = 0; i <= n-len; i++) {
      const j = i+len-1; dp[i][j] = Infinity;
      for (let k = i; k < j; k++)
        dp[i][j] = Math.min(dp[i][j],
          maxVal[i][k]*maxVal[k+1][j]+dp[i][k]+dp[k+1][j]);
    }
  return dp[0][n-1];
}`,
    java: `public int mctFromLeafValues(int[] arr) {
    int n = arr.length;
    int[][] dp = new int[n][n], maxVal = new int[n][n];
    for (int i = 0; i < n; i++) {
        maxVal[i][i] = arr[i];
        for (int j = i+1; j < n; j++)
            maxVal[i][j] = Math.max(maxVal[i][j-1], arr[j]);
    }
    for (int len = 2; len <= n; len++)
        for (int i = 0; i <= n-len; i++) {
            int j = i+len-1; dp[i][j] = Integer.MAX_VALUE;
            for (int k = i; k < j; k++)
                dp[i][j] = Math.min(dp[i][j],
                    maxVal[i][k]*maxVal[k+1][j]+dp[i][k]+dp[k+1][j]);
        }
    return dp[0][n-1];
}`,
  },
  defaultInput: { tree: [6, 2, 4] },
  inputFields: [
    {
      name: 'tree',
      label: 'Leaf values array (shown as tree)',
      type: 'tree',
      defaultValue: [6, 2, 4],
      placeholder: 'e.g. 6,2,4',
      helperText: 'Array of leaf values. The tree shows the interval DP progression.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = (input.tree as (number | null)[]).filter(v => v != null) as number[];
    const steps: AlgorithmStep[] = [];
    const n = arr.length;

    const treeNodes: (number | null)[] = [...arr, ...new Array(Math.max(0, 7 - arr.length)).fill(null)];

    function makeViz(highlights: Record<number, string> = {}): TreeVisualization {
      return { type: 'tree', nodes: treeNodes.slice(), highlights };
    }

    steps.push({
      line: 1,
      explanation: `Minimum Cost Tree from Leaf Values: arr=[${arr.join(',')}]. Use interval DP. dp[i][j] = min cost for leaves arr[i..j].`,
      variables: { arr: arr.join(','), n },
      visualization: makeViz(),
    });

    const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    const maxVal: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      maxVal[i][i] = arr[i];
      for (let j = i + 1; j < n; j++) {
        maxVal[i][j] = Math.max(maxVal[i][j - 1], arr[j]);
      }
    }

    steps.push({
      line: 3,
      explanation: `Precomputed maxVal[i][j] = max of arr[i..j]. Now fill dp for increasing lengths.`,
      variables: { maxVal: maxVal.map(r => r.join(',')).join(' | ') },
      visualization: makeViz({ 0: 'visited' }),
    });

    for (let len = 2; len <= n; len++) {
      for (let i = 0; i <= n - len; i++) {
        const j = i + len - 1;
        dp[i][j] = Infinity;
        for (let k = i; k < j; k++) {
          const cost = maxVal[i][k] * maxVal[k + 1][j] + dp[i][k] + dp[k + 1][j];
          if (cost < dp[i][j]) {
            dp[i][j] = cost;
          }
          steps.push({
            line: 9,
            explanation: `dp[${i}][${j}]: split k=${k}. maxVal[${i}][${k}]=${maxVal[i][k]} * maxVal[${k+1}][${j}]=${maxVal[k+1][j]} + dp[${i}][${k}]=${dp[i][k]=== Infinity ? 'INF' : dp[i][k]} + dp[${k+1}][${j}]=${dp[k+1][j] === Infinity ? 'INF' : dp[k+1][j]} = ${cost}. Best=${dp[i][j]}.`,
            variables: { i, j, k, cost, best: dp[i][j] },
            visualization: makeViz({
              [Math.min(i, treeNodes.length - 1)]: 'active',
              [Math.min(j, treeNodes.length - 1)]: 'comparing',
              [Math.min(k, treeNodes.length - 1)]: 'found',
            }),
          });
        }
      }
    }

    steps.push({
      line: 11,
      explanation: `Minimum cost = dp[0][${n - 1}] = ${dp[0][n - 1]}.`,
      variables: { answer: dp[0][n - 1] },
      visualization: makeViz({ 0: 'found', [Math.min(n - 1, treeNodes.length - 1)]: 'found' }),
    });

    return steps;
  },
};

export default minimumCostTreeFromLeafValues;

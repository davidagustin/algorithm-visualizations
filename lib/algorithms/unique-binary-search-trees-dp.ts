import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const uniqueBinarySearchTrees: AlgorithmDefinition = {
  id: 'unique-binary-search-trees-dp',
  title: 'Unique Binary Search Trees',
  leetcodeNumber: 96,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given n, return the number of structurally unique BSTs that store values 1..n. This is the nth Catalan number. Use DP: dp[i] = number of unique BSTs with i nodes. For each root k (1..i), dp[i] += dp[k-1] * dp[i-k] because there are dp[k-1] left subtrees and dp[i-k] right subtrees.',
  tags: ['Tree', 'Dynamic Programming', 'Math', 'BST'],
  code: {
    pseudocode: `function numTrees(n):
  dp[0] = 1, dp[1] = 1
  for i from 2 to n:
    dp[i] = 0
    for k from 1 to i:
      dp[i] += dp[k-1] * dp[i-k]
  return dp[n]`,
    python: `def numTrees(n):
    dp = [0] * (n + 1)
    dp[0] = dp[1] = 1
    for i in range(2, n + 1):
        for k in range(1, i + 1):
            dp[i] += dp[k-1] * dp[i-k]
    return dp[n]`,
    javascript: `function numTrees(n) {
  const dp = new Array(n + 1).fill(0);
  dp[0] = dp[1] = 1;
  for (let i = 2; i <= n; i++)
    for (let k = 1; k <= i; k++)
      dp[i] += dp[k-1] * dp[i-k];
  return dp[n];
}`,
    java: `public int numTrees(int n) {
    int[] dp = new int[n + 1];
    dp[0] = dp[1] = 1;
    for (int i = 2; i <= n; i++)
        for (int k = 1; k <= i; k++)
            dp[i] += dp[k-1] * dp[i-k];
    return dp[n];
}`,
  },
  defaultInput: { tree: [2, 1, 3] },
  inputFields: [
    {
      name: 'tree',
      label: 'Example BST (level-order)',
      type: 'tree',
      defaultValue: [2, 1, 3],
      placeholder: 'e.g. 2,1,3',
      helperText: 'Shows one BST example. n is the number of nodes.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const treeArr = (input.tree as (number | null)[]).slice();
    const n = treeArr.filter(v => v != null).length;
    const steps: AlgorithmStep[] = [];

    function makeViz(activeIdx: number | null, highlights: Record<number, string> = {}): TreeVisualization {
      const h: Record<number, string> = { ...highlights };
      if (activeIdx !== null && activeIdx < treeArr.length && treeArr[activeIdx] != null) {
        h[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: treeArr.slice(), highlights: h };
    }

    const dp = new Array(n + 1).fill(0);
    dp[0] = 1;
    if (n >= 1) dp[1] = 1;

    steps.push({
      line: 1,
      explanation: `Unique BSTs for n=${n}: dp[0]=1 (empty tree), dp[1]=1 (single node). For each i, try every root k.`,
      variables: { n, dp0: 1, dp1: n >= 1 ? 1 : 0 },
      visualization: makeViz(0),
    });

    for (let i = 2; i <= n; i++) {
      for (let k = 1; k <= i; k++) {
        dp[i] += dp[k - 1] * dp[i - k];
        steps.push({
          line: 5,
          explanation: `dp[${i}] += dp[${k-1}] * dp[${i-k}] = ${dp[k-1]} * ${dp[i-k]} = ${dp[k-1]*dp[i-k]}. When root=k, left subtree has k-1 nodes (${dp[k-1]} ways), right has ${i-k} nodes (${dp[i-k]} ways). dp[${i}]=${dp[i]}.`,
          variables: { i, k, dpKm1: dp[k-1], dpImk: dp[i-k], contribution: dp[k-1]*dp[i-k], dpi: dp[i] },
          visualization: makeViz(k - 1, {
            [Math.min(k - 1, treeArr.length - 1)]: 'comparing',
            [Math.min(i - k, treeArr.length - 1)]: 'pointer',
          }),
        });
      }
    }

    steps.push({
      line: 6,
      explanation: `Total unique BSTs with n=${n} nodes: dp[${n}] = ${dp[n]}. This is the ${n}th Catalan number.`,
      variables: { answer: dp[n], dpTable: dp.join(', ') },
      visualization: makeViz(0, Object.fromEntries(
        treeArr.map((v, i) => [i, v != null ? 'found' : 'default']).filter(([, c]) => c !== 'default')
      )),
    });

    return steps;
  },
};

export default uniqueBinarySearchTrees;

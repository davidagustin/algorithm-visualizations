import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const uniqueBinarySearchTreesIII: AlgorithmDefinition = {
  id: 'unique-binary-search-trees-iii',
  title: 'Unique Binary Search Trees III (Count)',
  leetcodeNumber: 96,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given an integer n, return the number of structurally unique BSTs storing values 1 to n (Catalan number). Use dynamic programming: dp[i] = sum of dp[j-1] * dp[i-j] for j from 1 to i, where j is the root.',
  tags: ['Tree', 'BST', 'Dynamic Programming', 'Math', 'Catalan Number'],
  code: {
    pseudocode: `function numTrees(n):
  dp = [0] * (n + 1)
  dp[0] = 1; dp[1] = 1
  for i in 2 to n:
    for j in 1 to i:
      dp[i] += dp[j-1] * dp[i-j]
  return dp[n]`,
    python: `def numTrees(n):
    dp = [0] * (n + 1)
    dp[0] = dp[1] = 1
    for i in range(2, n + 1):
        for j in range(1, i + 1):
            dp[i] += dp[j - 1] * dp[i - j]
    return dp[n]`,
    javascript: `function numTrees(n) {
  const dp = new Array(n + 1).fill(0);
  dp[0] = dp[1] = 1;
  for (let i = 2; i <= n; i++)
    for (let j = 1; j <= i; j++)
      dp[i] += dp[j - 1] * dp[i - j];
  return dp[n];
}`,
    java: `public int numTrees(int n) {
    int[] dp = new int[n + 1];
    dp[0] = dp[1] = 1;
    for (int i = 2; i <= n; i++)
        for (int j = 1; j <= i; j++)
            dp[i] += dp[j - 1] * dp[i - j];
    return dp[n];
}`,
  },
  defaultInput: { n: 5 },
  inputFields: [
    {
      name: 'n',
      label: 'n',
      type: 'number',
      defaultValue: 5,
      placeholder: 'e.g. 5',
      helperText: 'Count structurally unique BSTs with n nodes.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const dp = new Array(n + 1).fill(0);
    dp[0] = 1;
    if (n >= 1) dp[1] = 1;

    function makeViz(activeIdx: number | null): TreeVisualization {
      return {
        type: 'tree',
        nodes: dp.slice(0, n + 1),
        highlights: activeIdx !== null ? { [activeIdx]: 'active' } : {},
      };
    }

    steps.push({
      line: 1,
      explanation: `Count unique BSTs for n=${n}. dp[i] = number of unique BSTs with i nodes. dp[0]=1, dp[1]=1.`,
      variables: { n, dp: dp.slice() },
      visualization: makeViz(null),
    });

    for (let i = 2; i <= n; i++) {
      for (let j = 1; j <= i; j++) {
        const contribution = dp[j - 1] * dp[i - j];
        dp[i] += contribution;
        steps.push({
          line: 5,
          explanation: `i=${i}, root=j=${j}: dp[${j - 1}] * dp[${i - j}] = ${dp[j - 1]} * ${dp[i - j]} = ${contribution}. dp[${i}] now = ${dp[i]}.`,
          variables: { i, j, leftTrees: dp[j - 1], rightTrees: dp[i - j], contribution, dpI: dp[i] },
          visualization: makeViz(i),
        });
      }
    }

    steps.push({
      line: 7,
      explanation: `dp[${n}] = ${dp[n]}. There are ${dp[n]} structurally unique BSTs for n=${n} (Catalan number C_${n}).`,
      variables: { n, result: dp[n], dp: dp.slice() },
      visualization: {
        type: 'tree',
        nodes: dp.slice(0, n + 1),
        highlights: { [n]: 'found' },
      },
    });

    return steps;
  },
};

export default uniqueBinarySearchTreesIII;

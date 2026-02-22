import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const predictTheWinner: AlgorithmDefinition = {
  id: 'predict-the-winner',
  title: 'Predict the Winner',
  leetcodeNumber: 486,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given an array of scores, two players take turns picking from either end. The player with the higher total score wins. Determine if the first player can guarantee a win or tie. dp[i][j] = score advantage the current player can achieve over the array slice from i to j.',
  tags: ['dynamic programming', 'game theory', 'minimax', 'interval dp'],

  code: {
    pseudocode: `function predictTheWinner(nums):
  n = len(nums)
  dp[i][j] = max score advantage from nums[i..j]
  for i from 0 to n-1: dp[i][i] = nums[i]
  for len from 2 to n:
    for i from 0 to n-len:
      j = i + len - 1
      dp[i][j] = max(nums[i] - dp[i+1][j], nums[j] - dp[i][j-1])
  return dp[0][n-1] >= 0`,
    python: `def predictTheWinner(nums):
    n = len(nums)
    dp = [[0] * n for _ in range(n)]
    for i in range(n):
        dp[i][i] = nums[i]
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = max(nums[i] - dp[i+1][j], nums[j] - dp[i][j-1])
    return dp[0][n-1] >= 0`,
    javascript: `function predictTheWinner(nums) {
  const n = nums.length;
  const dp = Array.from({length: n}, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) dp[i][i] = nums[i];
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      dp[i][j] = Math.max(nums[i] - dp[i+1][j], nums[j] - dp[i][j-1]);
    }
  }
  return dp[0][n-1] >= 0;
}`,
    java: `public boolean predictTheWinner(int[] nums) {
    int n = nums.length;
    int[][] dp = new int[n][n];
    for (int i = 0; i < n; i++) dp[i][i] = nums[i];
    for (int len = 2; len <= n; len++) {
        for (int i = 0; i <= n - len; i++) {
            int j = i + len - 1;
            dp[i][j] = Math.max(nums[i] - dp[i+1][j], nums[j] - dp[i][j-1]);
        }
    }
    return dp[0][n-1] >= 0;
}`,
  },

  defaultInput: {
    nums: [1, 5, 2, 4, 6],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Numbers',
      type: 'array',
      defaultValue: [1, 5, 2, 4, 6],
      placeholder: '1,5,2,4,6',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Predict the Winner with nums=[${nums.join(', ')}]. dp[i][j] = score advantage current player has over slice i..j.`,
      variables: { n },
      visualization: makeViz({}, {}),
    });

    const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

    // Base case
    for (let i = 0; i < n; i++) {
      dp[i][i] = nums[i];
    }

    steps.push({
      line: 4,
      explanation: `Base case: dp[i][i]=nums[i] for each i. Single element means current player takes it all.`,
      variables: { 'dp[0][0]': dp[0][0], 'dp[n-1][n-1]': dp[n - 1][n - 1] },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'active'])),
        Object.fromEntries(nums.map((v, i) => [i, `${v}`]))
      ),
    });

    for (let len = 2; len <= n; len++) {
      for (let i = 0; i <= n - len; i++) {
        const j = i + len - 1;
        const pickLeft = nums[i] - dp[i + 1][j];
        const pickRight = nums[j] - dp[i][j - 1];
        dp[i][j] = Math.max(pickLeft, pickRight);

        if (len <= 3 || (i === 0 && j === n - 1)) {
          const highlights: Record<number, string> = {};
          const labels: Record<number, string> = {};
          for (let k = i; k <= j; k++) highlights[k] = 'comparing';
          highlights[i] = 'active';
          highlights[j] = 'active';
          labels[i] = 'L';
          labels[j] = 'R';

          steps.push({
            line: 7,
            explanation: `dp[${i}][${j}]=${dp[i][j]}. Pick left (${nums[i]}): advantage=${pickLeft}. Pick right (${nums[j]}): advantage=${pickRight}. Best=${dp[i][j]}.`,
            variables: { i, j, 'pick left': pickLeft, 'pick right': pickRight, 'dp[i][j]': dp[i][j] },
            visualization: makeViz(highlights, labels),
          });
        }
      }
    }

    const result = dp[0][n - 1] >= 0;
    steps.push({
      line: 8,
      explanation: `dp[0][${n - 1}]=${dp[0][n - 1]}. ${result ? 'Player 1 wins or ties' : 'Player 2 wins'}. Answer: ${result}.`,
      variables: { 'dp[0][n-1]': dp[0][n - 1], result },
      visualization: makeViz(
        { 0: result ? 'found' : 'mismatch', [n - 1]: result ? 'found' : 'mismatch' },
        { 0: 'P1', [n - 1]: result ? 'Win' : 'Lose' }
      ),
    });

    return steps;
  },
};

export default predictTheWinner;

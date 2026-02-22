import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const burstBalloons: AlgorithmDefinition = {
  id: 'burst-balloons',
  title: 'Burst Balloons',
  leetcodeNumber: 312,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given n balloons with numbers, burst them to maximize coins. Bursting balloon i yields nums[i-1]*nums[i]*nums[i+1] coins. Use interval DP: dp[i][j] = max coins from bursting balloons in (i,j) exclusive, where k is the last balloon burst.',
  tags: ['Dynamic Programming', 'Divide and Conquer', 'Array'],
  code: {
    pseudocode: `function maxCoins(nums):
  nums = [1] + nums + [1]  // pad with 1s
  n = length(nums)
  dp = n x n matrix of 0s
  for length from 1 to n-2:
    for left from 0 to n-2-length:
      right = left + length + 1
      for k from left+1 to right-1:
        coins = nums[left]*nums[k]*nums[right] + dp[left][k] + dp[k][right]
        dp[left][right] = max(dp[left][right], coins)
  return dp[0][n-1]`,
    python: `def maxCoins(nums):
    nums = [1] + nums + [1]
    n = len(nums)
    dp = [[0]*n for _ in range(n)]
    for length in range(1, n-1):
        for left in range(0, n-1-length):
            right = left + length + 1
            for k in range(left+1, right):
                coins = nums[left]*nums[k]*nums[right] + dp[left][k] + dp[k][right]
                dp[left][right] = max(dp[left][right], coins)
    return dp[0][n-1]`,
    javascript: `function maxCoins(nums) {
  nums = [1, ...nums, 1];
  const n = nums.length;
  const dp = Array.from({length: n}, () => new Array(n).fill(0));
  for (let len = 1; len < n-1; len++) {
    for (let left = 0; left < n-1-len; left++) {
      const right = left + len + 1;
      for (let k = left+1; k < right; k++) {
        const coins = nums[left]*nums[k]*nums[right] + dp[left][k] + dp[k][right];
        dp[left][right] = Math.max(dp[left][right], coins);
      }
    }
  }
  return dp[0][n-1];
}`,
    java: `public int maxCoins(int[] nums) {
    int n = nums.length + 2;
    int[] arr = new int[n];
    arr[0] = arr[n-1] = 1;
    for (int i = 1; i < n-1; i++) arr[i] = nums[i-1];
    int[][] dp = new int[n][n];
    for (int len = 1; len < n-1; len++) {
        for (int left = 0; left < n-1-len; left++) {
            int right = left + len + 1;
            for (int k = left+1; k < right; k++) {
                int coins = arr[left]*arr[k]*arr[right] + dp[left][k] + dp[k][right];
                dp[left][right] = Math.max(dp[left][right], coins);
            }
        }
    }
    return dp[0][n-1];
}`,
  },
  defaultInput: { nums: [3, 1, 5, 8] },
  inputFields: [
    {
      name: 'nums',
      label: 'Balloon Values',
      type: 'array',
      defaultValue: [3, 1, 5, 8],
      placeholder: '3,1,5,8',
      helperText: 'Balloon values. Small arrays (3-6) work best.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const numsOrig = input.nums as number[];
    const nums = [1, ...numsOrig, 1];
    const n = nums.length;
    const steps: AlgorithmStep[] = [];

    const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    const flatIdx = (i: number, j: number) => i * n + j;
    const totalCells = n * n;

    function flatVals(): (number | null)[] {
      const arr: (number | null)[] = [];
      for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++)
          arr.push(dp[i][j] > 0 || (j > i + 1) ? dp[i][j] : null);
      return arr;
    }

    function makeLabels(): string[] {
      const labels: string[] = [];
      for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++)
          labels.push(`(${i},${j})`);
      return labels;
    }

    function makeViz(activeIdx: number | null, comparingIndices: number[]): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let k = 0; k < totalCells; k++) {
        const i = Math.floor(k / n);
        const j = k % n;
        if (dp[i][j] > 0) highlights[k] = 'found';
      }
      for (const ci of comparingIndices) highlights[ci] = 'comparing';
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'dp-table', values: flatVals(), highlights, labels: makeLabels() };
    }

    steps.push({
      line: 1,
      explanation: `Burst Balloons: nums=[${numsOrig.join(', ')}]. Pad with 1s → [${nums.join(', ')}]. dp[i][j] = max coins bursting all balloons in open interval (i,j).`,
      variables: { nums: [...nums], n },
      visualization: makeViz(null, []),
    });

    for (let len = 1; len < n - 1; len++) {
      for (let left = 0; left < n - 1 - len; left++) {
        const right = left + len + 1;

        for (let k = left + 1; k < right; k++) {
          const coins = nums[left] * nums[k] * nums[right] + dp[left][k] + dp[k][right];

          steps.push({
            line: 8,
            explanation: `Interval (${left},${right}), last burst k=${k} (val=${nums[k]}): nums[${left}]*nums[${k}]*nums[${right}] + dp[${left}][${k}] + dp[${k}][${right}] = ${nums[left]}*${nums[k]}*${nums[right]} + ${dp[left][k]} + ${dp[k][right]} = ${coins}. Current dp[${left}][${right}]=${dp[left][right]}.`,
            variables: { left, right, k, coins, 'dp[left][right]': dp[left][right] },
            visualization: makeViz(flatIdx(left, right), [flatIdx(left, k), flatIdx(k, right)]),
          });

          if (coins > dp[left][right]) {
            dp[left][right] = coins;
          }
        }

        steps.push({
          line: 9,
          explanation: `dp[${left}][${right}] finalized = ${dp[left][right]}. Max coins bursting all balloons in interval (${left},${right}).`,
          variables: { left, right, 'dp[left][right]': dp[left][right] },
          visualization: makeViz(flatIdx(left, right), []),
        });
      }
    }

    steps.push({
      line: 10,
      explanation: `dp[0][${n - 1}] = ${dp[0][n - 1]}. Maximum coins from bursting all balloons in optimal order: ${dp[0][n - 1]}.`,
      variables: { result: dp[0][n - 1] },
      visualization: {
        type: 'dp-table',
        values: flatVals(),
        highlights: Object.fromEntries(
          Array.from({ length: totalCells }, (_, k) => [
            k,
            k === flatIdx(0, n - 1) ? 'active' : dp[Math.floor(k / n)][k % n] > 0 ? 'found' : 'default',
          ])
        ),
        labels: makeLabels(),
      },
    });

    return steps;
  },
};

export default burstBalloons;

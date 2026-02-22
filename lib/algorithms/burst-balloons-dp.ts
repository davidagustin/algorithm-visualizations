import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const burstBalloonsDp: AlgorithmDefinition = {
  id: 'burst-balloons-dp',
  title: 'Burst Balloons (DP)',
  leetcodeNumber: 312,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given n balloons each with a number, burst all balloons to maximize coins. Bursting balloon i gives nums[i-1]*nums[i]*nums[i+1] coins. Uses interval DP: dp[i][j] = max coins from bursting all balloons between i and j (exclusive). Think of k as the LAST balloon to burst in the range.',
  tags: ['dynamic programming', 'interval dp', 'divide and conquer'],

  code: {
    pseudocode: `function maxCoins(nums):
  nums = [1] + nums + [1]
  n = len(nums)
  dp[i][j] = max coins bursting all between i and j (exclusive)
  for len from 1 to n-2:
    for left from 1 to n-1-len:
      right = left + len
      for k from left to right-1:
        coins = nums[left-1]*nums[k]*nums[right] + dp[left][k] + dp[k+1][right]
        dp[left][right] = max(dp[left][right], coins - wait... k is last)
        dp[left][right] = max(dp[left][right], dp[left][k] + nums[left-1]*nums[k]*nums[right] + dp[k][right])
  return dp[1][n-1]`,
    python: `def maxCoins(nums):
    nums = [1] + nums + [1]
    n = len(nums)
    dp = [[0]*n for _ in range(n)]
    for length in range(2, n):
        for left in range(0, n-length):
            right = left+length
            for k in range(left+1, right):
                coins = nums[left]*nums[k]*nums[right] + dp[left][k] + dp[k][right]
                dp[left][right] = max(dp[left][right], coins)
    return dp[0][n-1]`,
    javascript: `function maxCoins(nums) {
  nums = [1, ...nums, 1];
  const n = nums.length;
  const dp = Array.from({length:n},()=>new Array(n).fill(0));
  for (let len = 2; len < n; len++) {
    for (let left = 0; left < n-len; left++) {
      const right = left+len;
      for (let k = left+1; k < right; k++) {
        const coins = nums[left]*nums[k]*nums[right]+dp[left][k]+dp[k][right];
        dp[left][right] = Math.max(dp[left][right], coins);
      }
    }
  }
  return dp[0][n-1];
}`,
    java: `public int maxCoins(int[] nums) {
    int n = nums.length+2;
    int[] arr = new int[n];
    arr[0] = arr[n-1] = 1;
    for (int i = 0; i < nums.length; i++) arr[i+1] = nums[i];
    int[][] dp = new int[n][n];
    for (int len = 2; len < n; len++)
        for (int left = 0; left < n-len; left++) {
            int right = left+len;
            for (int k = left+1; k < right; k++) {
                int coins = arr[left]*arr[k]*arr[right]+dp[left][k]+dp[k][right];
                dp[left][right] = Math.max(dp[left][right], coins);
            }
        }
    return dp[0][n-1];
}`,
  },

  defaultInput: {
    nums: [3, 1, 5, 8],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Balloon Values',
      type: 'array',
      defaultValue: [3, 1, 5, 8],
      placeholder: '3,1,5,8',
      helperText: 'Comma-separated balloon values',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const numsOrig = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const nums = [1, ...numsOrig, 1];
    const n = nums.length;

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...numsOrig],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Burst Balloons DP: nums=[${numsOrig.join(', ')}]. Pad with [1,...,1]. dp[i][j] = max coins bursting balloons strictly between i and j.`,
      variables: { padded: nums.join(',') },
      visualization: makeViz({}, {}),
    });

    const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

    for (let len = 2; len < n; len++) {
      for (let left = 0; left < n - len; left++) {
        const right = left + len;
        for (let k = left + 1; k < right; k++) {
          const coins = nums[left] * nums[k] * nums[right] + dp[left][k] + dp[k][right];
          if (coins > dp[left][right]) dp[left][right] = coins;
        }

        if (len <= 3 || (left === 0 && right === n - 1)) {
          const highlights: Record<number, string> = {};
          const labels: Record<number, string> = {};
          const origLeft = Math.max(0, left - 1);
          const origRight = Math.min(numsOrig.length - 1, right - 1);
          for (let idx = origLeft; idx <= origRight; idx++) {
            highlights[idx] = 'comparing';
          }
          if (origLeft >= 0 && origLeft < numsOrig.length) {
            highlights[origLeft] = 'active';
            labels[origLeft] = 'L';
          }
          if (origRight >= 0 && origRight < numsOrig.length) {
            highlights[origRight] = 'active';
            labels[origRight] = 'R';
          }

          steps.push({
            line: 7,
            explanation: `dp[${left}][${right}]=${dp[left][right]}. Max coins for bursting all balloons in (${left},${right}).`,
            variables: { left, right, len, 'dp[left][right]': dp[left][right] },
            visualization: makeViz(highlights, labels),
          });
        }
      }
    }

    steps.push({
      line: 10,
      explanation: `dp[0][${n - 1}]=${dp[0][n - 1]}. Maximum coins from bursting all balloons optimally.`,
      variables: { result: dp[0][n - 1] },
      visualization: makeViz(
        Object.fromEntries(numsOrig.map((_, i) => [i, 'found'])),
        { 0: `max:${dp[0][n - 1]}` }
      ),
    });

    return steps;
  },
};

export default burstBalloonsDp;

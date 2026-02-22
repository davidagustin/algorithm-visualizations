import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const jumpGameDP: AlgorithmDefinition = {
  id: 'jump-game-dp',
  title: 'Jump Game (DP Approach)',
  leetcodeNumber: 55,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Determine if you can reach the last index from the first index. Each element gives maximum jump length. DP approach: dp[i] = true if index i is reachable. dp[i] = true if exists j < i where dp[j] && j + nums[j] >= i. Space-optimized: track furthest reachable index.',
  tags: ['Dynamic Programming', 'Greedy', 'Array'],
  code: {
    pseudocode: `function canJump(nums):
  n = length(nums)
  dp = array of false, dp[0] = true
  for i from 1 to n-1:
    for j from 0 to i-1:
      if dp[j] and j + nums[j] >= i:
        dp[i] = true
        break
  return dp[n-1]`,
    python: `def canJump(nums):
    n = len(nums)
    dp = [False] * n
    dp[0] = True
    for i in range(1, n):
        for j in range(i):
            if dp[j] and j + nums[j] >= i:
                dp[i] = True
                break
    return dp[-1]`,
    javascript: `function canJump(nums) {
  const n = nums.length;
  const dp = new Array(n).fill(false);
  dp[0] = true;
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && j + nums[j] >= i) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[n-1];
}`,
    java: `public boolean canJump(int[] nums) {
    int n = nums.length;
    boolean[] dp = new boolean[n];
    dp[0] = true;
    for (int i = 1; i < n; i++)
        for (int j = 0; j < i; j++)
            if (dp[j] && j + nums[j] >= i) {
                dp[i] = true;
                break;
            }
    return dp[n-1];
}`,
  },
  defaultInput: { nums: [2, 3, 1, 1, 4] },
  inputFields: [
    {
      name: 'nums',
      label: 'Jump Lengths',
      type: 'array',
      defaultValue: [2, 3, 1, 1, 4],
      placeholder: '2,3,1,1,4',
      helperText: 'Each value is the maximum jump length from that position',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const n = nums.length;
    const steps: AlgorithmStep[] = [];
    const dp: (number | null)[] = new Array(n).fill(null);
    dp[0] = 1; // 1 = reachable, 0 = not, use number for DPVisualization
    const labels: string[] = nums.map((v, i) => `[${i}]=${v}`);

    function makeViz(activeIdx: number): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let i = 0; i < n; i++) {
        if (i === activeIdx) highlights[i] = 'active';
        else if (dp[i] === 1) highlights[i] = 'found';
        else if (dp[i] === 0) highlights[i] = 'mismatch';
        else highlights[i] = 'default';
      }
      return { type: 'dp-table', values: dp.slice(), highlights, labels };
    }

    steps.push({
      line: 2,
      explanation: `nums=[${nums.join(',')}]. dp[i]=1 if reachable, 0 otherwise. dp[0]=1 (start is always reachable).`,
      variables: { n, nums },
      visualization: makeViz(0),
    });

    for (let i = 1; i < n; i++) {
      let reachable = false;
      for (let j = 0; j < i; j++) {
        if (dp[j] === 1 && j + nums[j] >= i) {
          reachable = true;
          break;
        }
      }
      dp[i] = reachable ? 1 : 0;

      steps.push({
        line: 5,
        explanation: `dp[${i}]=${dp[i] === 1 ? 'REACHABLE' : 'NOT REACHABLE'}. Index ${i} can${reachable ? '' : 'not'} be reached from a previous reachable position.`,
        variables: { i, reachable, 'dp[i]': dp[i] },
        visualization: makeViz(i),
      });
    }

    const result = dp[n - 1] === 1;
    steps.push({
      line: 7,
      explanation: `dp[${n - 1}]=${dp[n - 1]}. Can${result ? '' : 'not'} reach last index. ${result ? 'True' : 'False'}.`,
      variables: { result },
      visualization: makeViz(n - 1),
    });

    return steps;
  },
};

export default jumpGameDP;

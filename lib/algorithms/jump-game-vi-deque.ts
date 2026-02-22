import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const jumpGameVIDeque: AlgorithmDefinition = {
  id: 'jump-game-vi-deque',
  title: 'Jump Game VI (Deque)',
  leetcodeNumber: 1696,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'You are given an array nums and integer k. Starting at index 0, in each jump you can move at most k indices forward. Maximize the score (sum of chosen elements). Uses a monotonic deque to maintain the maximum dp value in the window of size k.',
  tags: ['Stack', 'Deque', 'Monotonic Queue', 'Dynamic Programming', 'Sliding Window'],
  code: {
    pseudocode: `function maxResult(nums, k):
  n = len(nums)
  dp = array of -INF, dp[0] = nums[0]
  deque = [0]  // stores indices, monotonic decreasing dp
  for i from 1 to n-1:
    while deque front is out of window (< i-k):
      remove front
    dp[i] = dp[deque.front] + nums[i]
    while deque back dp <= dp[i]:
      remove back
    add i to back
  return dp[n-1]`,
    python: `from collections import deque
def maxResult(nums, k):
    n = len(nums)
    dp = [float('-inf')] * n
    dp[0] = nums[0]
    dq = deque([0])
    for i in range(1, n):
        while dq and dq[0] < i - k:
            dq.popleft()
        dp[i] = dp[dq[0]] + nums[i]
        while dq and dp[dq[-1]] <= dp[i]:
            dq.pop()
        dq.append(i)
    return dp[n-1]`,
    javascript: `function maxResult(nums, k) {
  const n = nums.length;
  const dp = new Array(n).fill(-Infinity);
  dp[0] = nums[0];
  const deque = [0];
  for (let i = 1; i < n; i++) {
    while (deque[0] < i - k) deque.shift();
    dp[i] = dp[deque[0]] + nums[i];
    while (deque.length && dp[deque[deque.length-1]] <= dp[i])
      deque.pop();
    deque.push(i);
  }
  return dp[n-1];
}`,
    java: `public int maxResult(int[] nums, int k) {
    int n = nums.length;
    int[] dp = new int[n];
    dp[0] = nums[0];
    Deque<Integer> dq = new ArrayDeque<>();
    dq.offerLast(0);
    for (int i = 1; i < n; i++) {
        while (dq.peekFirst() < i - k) dq.pollFirst();
        dp[i] = dp[dq.peekFirst()] + nums[i];
        while (!dq.isEmpty() && dp[dq.peekLast()] <= dp[i])
            dq.pollLast();
        dq.offerLast(i);
    }
    return dp[n-1];
}`,
  },
  defaultInput: { nums: [1, -1, -2, 4, -7, 3], k: 2 },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, -1, -2, 4, -7, 3],
      placeholder: 'e.g. 1,-1,-2,4,-7,3',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'k',
      label: 'Max Jump (k)',
      type: 'number',
      defaultValue: 2,
      placeholder: 'e.g. 2',
      helperText: 'Maximum number of indices to jump',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = (input.nums as number[]).slice();
    const k = input.k as number;
    const n = nums.length;
    const steps: AlgorithmStep[] = [];
    const dp: number[] = new Array(n).fill(-Infinity);
    dp[0] = nums[0];
    const deque: number[] = [0];

    const makeViz = (i: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: deque.map(idx => `i${idx}(dp=${dp[idx]})`),
      inputChars: nums.map(v => String(v)),
      currentIndex: i,
      action,
    });

    steps.push({
      line: 1,
      explanation: `nums=[${nums.join(', ')}], k=${k}. dp[0]=${dp[0]}. Deque=[0]. Find max score path.`,
      variables: { dp: [...dp], deque: [...deque] },
      visualization: makeViz(0, 'idle'),
    });

    for (let i = 1; i < n; i++) {
      // Remove out-of-window front
      while (deque.length > 0 && deque[0] < i - k) {
        const removed = deque.shift()!;
        steps.push({
          line: 5,
          explanation: `Index ${removed} is out of window [${i - k}..${i}]. Remove from deque front.`,
          variables: { removed, windowStart: i - k },
          visualization: makeViz(i, 'pop'),
        });
      }

      dp[i] = dp[deque[0]] + nums[i];
      steps.push({
        line: 6,
        explanation: `dp[${i}] = dp[${deque[0]}]=${dp[deque[0]]} + nums[${i}]=${nums[i]} = ${dp[i]}.`,
        variables: { i, 'dp[i]': dp[i], 'dp[front]': dp[deque[0]] },
        visualization: makeViz(i, 'idle'),
      });

      // Remove smaller dp from back
      while (deque.length > 0 && dp[deque[deque.length - 1]] <= dp[i]) {
        const removed = deque.pop()!;
        steps.push({
          line: 7,
          explanation: `dp[${removed}]=${dp[removed]} <= dp[${i}]=${dp[i]}. Remove from back.`,
          variables: { removed },
          visualization: makeViz(i, 'pop'),
        });
      }

      deque.push(i);
      steps.push({
        line: 8,
        explanation: `Push index ${i} to deque back. Deque=[${deque.join(',')}].`,
        variables: { i, deque: [...deque], dp: [...dp] },
        visualization: makeViz(i, 'push'),
      });
    }

    steps.push({
      line: 9,
      explanation: `Done. Max score = dp[${n - 1}] = ${dp[n - 1]}.`,
      variables: { result: dp[n - 1] },
      visualization: makeViz(n - 1, 'match'),
    });

    return steps;
  },
};

export default jumpGameVIDeque;

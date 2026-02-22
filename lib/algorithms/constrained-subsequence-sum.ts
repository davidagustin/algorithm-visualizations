import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const constrainedSubsequenceSum: AlgorithmDefinition = {
  id: 'constrained-subsequence-sum',
  title: 'Constrained Subsequence Sum',
  leetcodeNumber: 1425,
  difficulty: 'Hard',
  category: 'Stack',
  description:
    'Given an integer array nums and integer k, return the maximum sum of a non-empty subsequence where for every consecutive pair (i, j) in the subsequence, i < j <= i+k. Use DP with a monotonic deque to maintain the max dp value in the window of size k.',
  tags: ['Stack', 'Deque', 'Monotonic Queue', 'Dynamic Programming', 'Hard'],
  code: {
    pseudocode: `function constrainedSubsetSum(nums, k):
  n = len(nums)
  dp = copy of nums
  deque = []  // monotonic decreasing dp values, stores indices
  result = max(nums)
  for i from 0 to n-1:
    if deque not empty:
      dp[i] = max(dp[i], dp[deque.front] + nums[i])
    while deque not empty and dp[deque.back] <= dp[i]:
      deque.pop_back()
    deque.push_back(i)
    while deque.front < i - k + 1:
      deque.pop_front()
    result = max(result, dp[i])
  return result`,
    python: `from collections import deque
def constrainedSubsetSum(nums, k):
    n = len(nums)
    dp = nums[:]
    dq = deque()
    for i in range(n):
        if dq:
            dp[i] = max(dp[i], dp[dq[0]] + nums[i])
        while dq and dp[dq[-1]] <= dp[i]:
            dq.pop()
        dq.append(i)
        if dq[0] < i - k + 1:
            dq.popleft()
    return max(dp)`,
    javascript: `function constrainedSubsetSum(nums, k) {
  const n = nums.length;
  const dp = [...nums];
  const deque = [];
  for (let i = 0; i < n; i++) {
    if (deque.length) dp[i] = Math.max(dp[i], dp[deque[0]] + nums[i]);
    while (deque.length && dp[deque[deque.length-1]] <= dp[i])
      deque.pop();
    deque.push(i);
    if (deque[0] < i - k + 1) deque.shift();
  }
  return Math.max(...dp);
}`,
    java: `public int constrainedSubsetSum(int[] nums, int k) {
    int n = nums.length;
    int[] dp = nums.clone();
    Deque<Integer> dq = new ArrayDeque<>();
    int result = Integer.MIN_VALUE;
    for (int i = 0; i < n; i++) {
        if (!dq.isEmpty()) dp[i] = Math.max(dp[i], dp[dq.peekFirst()] + nums[i]);
        while (!dq.isEmpty() && dp[dq.peekLast()] <= dp[i]) dq.pollLast();
        dq.offerLast(i);
        if (dq.peekFirst() < i - k + 1) dq.pollFirst();
        result = Math.max(result, dp[i]);
    }
    return result;
}`,
  },
  defaultInput: { nums: [10, 2, -10, 5, 20], k: 2 },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [10, 2, -10, 5, 20],
      placeholder: 'e.g. 10,2,-10,5,20',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'k',
      label: 'Max Gap (k)',
      type: 'number',
      defaultValue: 2,
      placeholder: 'e.g. 2',
      helperText: 'Max index gap between consecutive elements',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = (input.nums as number[]).slice();
    const k = input.k as number;
    const n = nums.length;
    const steps: AlgorithmStep[] = [];
    const dp = [...nums];
    const deque: number[] = [];

    const makeViz = (i: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: deque.map(idx => `i${idx}(dp=${dp[idx]})`),
      inputChars: nums.map(v => String(v)),
      currentIndex: i,
      action,
    });

    steps.push({
      line: 1,
      explanation: `nums=[${nums.join(', ')}], k=${k}. dp=nums initially. Use monotonic deque for window max of dp.`,
      variables: { dp: [...dp], k },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < n; i++) {
      steps.push({
        line: 6,
        explanation: `i=${i}, nums[i]=${nums[i]}. Check deque for max dp in window.`,
        variables: { i, 'nums[i]': nums[i] },
        visualization: makeViz(i, 'idle'),
      });

      if (deque.length > 0) {
        dp[i] = Math.max(dp[i], dp[deque[0]] + nums[i]);
        steps.push({
          line: 7,
          explanation: `dp[${i}] = max(${nums[i]}, dp[${deque[0]}]=${dp[deque[0]]}+${nums[i]}) = ${dp[i]}.`,
          variables: { i, 'dp[i]': dp[i], windowMaxIdx: deque[0] },
          visualization: makeViz(i, 'idle'),
        });
      }

      while (deque.length > 0 && dp[deque[deque.length - 1]] <= dp[i]) {
        const removed = deque.pop()!;
        steps.push({
          line: 8,
          explanation: `dp[${removed}]=${dp[removed]} <= dp[${i}]=${dp[i]}. Pop from back.`,
          variables: { removed },
          visualization: makeViz(i, 'pop'),
        });
      }

      deque.push(i);

      if (deque[0] < i - k + 1) {
        const removed = deque.shift()!;
        steps.push({
          line: 11,
          explanation: `Index ${removed} out of window. Pop from front.`,
          variables: { removed, windowStart: i - k + 1 },
          visualization: makeViz(i, 'pop'),
        });
      }

      steps.push({
        line: 12,
        explanation: `Push ${i}. dp[${i}]=${dp[i]}. Deque=[${deque.join(',')}].`,
        variables: { i, 'dp[i]': dp[i], deque: [...deque] },
        visualization: makeViz(i, 'push'),
      });
    }

    const result = Math.max(...dp);
    steps.push({
      line: 13,
      explanation: `Done. dp=[${dp.join(', ')}]. Max constrained subsequence sum = ${result}.`,
      variables: { result, dp: [...dp] },
      visualization: makeViz(n - 1, 'match'),
    });

    return steps;
  },
};

export default constrainedSubsequenceSum;

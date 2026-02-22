import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const shortestSubarrayWithSumAtLeastK: AlgorithmDefinition = {
  id: 'shortest-subarray-with-sum-at-least-k',
  title: 'Shortest Subarray with Sum at Least K',
  leetcodeNumber: 862,
  difficulty: 'Hard',
  category: 'Sliding Window',
  description:
    'Given an integer array nums and integer k, find the length of the shortest non-empty subarray with sum at least k. Because nums can have negative numbers, a simple sliding window fails. Use prefix sums with a monotonic deque: maintain an increasing deque of prefix sum indices. When prefix[right] - prefix[deque front] >= k, update the answer and pop from front.',
  tags: ['sliding window', 'deque', 'prefix sum', 'monotonic queue'],

  code: {
    pseudocode: `function shortestSubarray(nums, k):
  n = len(nums)
  prefix = [0] * (n + 1)
  for i in range(n):
    prefix[i+1] = prefix[i] + nums[i]
  result = INF
  deque = []
  for right in range(n + 1):
    while deque and prefix[right] - prefix[deque[0]] >= k:
      result = min(result, right - deque.popleft())
    while deque and prefix[right] <= prefix[deque[-1]]:
      deque.pop()
    deque.append(right)
  return result if result != INF else -1`,

    python: `def shortestSubarray(nums: list[int], k: int) -> int:
    from collections import deque
    n = len(nums)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i+1] = prefix[i] + nums[i]
    result = float('inf')
    dq = deque()
    for right in range(n + 1):
        while dq and prefix[right] - prefix[dq[0]] >= k:
            result = min(result, right - dq.popleft())
        while dq and prefix[right] <= prefix[dq[-1]]:
            dq.pop()
        dq.append(right)
    return result if result != float('inf') else -1`,

    javascript: `function shortestSubarray(nums, k) {
  const n = nums.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i+1] = prefix[i] + nums[i];
  let result = Infinity;
  const dq = [];
  for (let right = 0; right <= n; right++) {
    while (dq.length && prefix[right] - prefix[dq[0]] >= k) {
      result = Math.min(result, right - dq.shift());
    }
    while (dq.length && prefix[right] <= prefix[dq[dq.length-1]]) {
      dq.pop();
    }
    dq.push(right);
  }
  return result === Infinity ? -1 : result;
}`,

    java: `public int shortestSubarray(int[] nums, int k) {
    int n = nums.length;
    long[] prefix = new long[n + 1];
    for (int i = 0; i < n; i++) prefix[i+1] = prefix[i] + nums[i];
    int result = Integer.MAX_VALUE;
    Deque<Integer> dq = new ArrayDeque<>();
    for (int right = 0; right <= n; right++) {
        while (!dq.isEmpty() && prefix[right] - prefix[dq.peekFirst()] >= k)
            result = Math.min(result, right - dq.pollFirst());
        while (!dq.isEmpty() && prefix[right] <= prefix[dq.peekLast()])
            dq.pollLast();
        dq.addLast(right);
    }
    return result == Integer.MAX_VALUE ? -1 : result;
}`,
  },

  defaultInput: {
    nums: [2, -1, 2],
    k: 3,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [2, -1, 2],
      placeholder: '2,-1,2',
      helperText: 'Array of integers (may include negatives)',
    },
    {
      name: 'k',
      label: 'Target Sum (k)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Minimum required subarray sum',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    const prefix = new Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];

    steps.push({
      line: 1,
      explanation: `Array=[${nums.join(', ')}], k=${k}. Build prefix sums: [${prefix.join(', ')}]. Use monotonic deque to find shortest subarray.`,
      variables: { k, prefixSums: prefix.join(', ') },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      },
    });

    steps.push({
      line: 6,
      explanation: `Prefix sum array (index 0 to ${n}): [${prefix.join(', ')}]. We scan this with a monotonic increasing deque.`,
      variables: { prefix: prefix.join(', ') },
      visualization: {
        type: 'array',
        array: [...prefix],
        highlights: {},
        labels: {},
      },
    });

    let result = Infinity;
    const dq: number[] = [];

    for (let right = 0; right <= n; right++) {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      highlights[right] = 'current';
      labels[right] = `P[${right}]=${prefix[right]}`;

      if (dq.length) {
        labels[dq[0]] = `front=${prefix[dq[0]]}`;
      }

      steps.push({
        line: 8,
        explanation: `right=${right}, prefix[${right}]=${prefix[right]}. Deque=[${dq.join(', ')}].`,
        variables: { right, prefixRight: prefix[right], deque: dq.join(', '), result: result === Infinity ? 'INF' : result },
        visualization: {
          type: 'array',
          array: [...prefix],
          highlights,
          labels,
        },
      });

      while (dq.length && prefix[right] - prefix[dq[0]] >= k) {
        const front = dq.shift()!;
        const len = right - front;
        result = Math.min(result, len);

        const foundHighlights: Record<number, string> = {};
        foundHighlights[front] = 'found';
        foundHighlights[right] = 'found';

        steps.push({
          line: 9,
          explanation: `prefix[${right}] - prefix[${front}] = ${prefix[right] - prefix[front]} >= k=${k}. Subarray [${front}, ${right - 1}] has sum >= k, length=${len}. Best=${result}.`,
          variables: { front, right, sum: prefix[right] - prefix[front], length: len, result },
          visualization: {
            type: 'array',
            array: [...prefix],
            highlights: foundHighlights,
            labels: { [front]: 'front', [right]: 'right' },
          },
        });
      }

      while (dq.length && prefix[right] <= prefix[dq[dq.length - 1]]) {
        const removed = dq.pop()!;
        steps.push({
          line: 11,
          explanation: `prefix[${right}]=${prefix[right]} <= prefix[${removed}]=${prefix[removed]}. Remove ${removed} from deque back to maintain increasing order.`,
          variables: { right, removed, prefixRight: prefix[right], prefixRemoved: prefix[removed] },
          visualization: {
            type: 'array',
            array: [...prefix],
            highlights: { [right]: 'active', [removed]: 'mismatch' },
            labels: {},
          },
        });
      }

      dq.push(right);
    }

    const finalResult = result === Infinity ? -1 : result;

    steps.push({
      line: 14,
      explanation: `Done. Shortest subarray with sum >= k=${k} has length ${finalResult === -1 ? 'none found (-1)' : finalResult}.`,
      variables: { result: finalResult, k },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      },
    });

    return steps;
  },
};

export default shortestSubarrayWithSumAtLeastK;

import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const shortestSubarrayWithSumAtLeastKIi: AlgorithmDefinition = {
  id: 'shortest-subarray-with-sum-at-least-k-ii',
  title: 'Shortest Subarray with Sum at Least K II',
  leetcodeNumber: 862,
  difficulty: 'Hard',
  category: 'Sliding Window',
  description:
    'Given an integer array nums (may contain negatives) and an integer k, return the length of the shortest non-empty subarray with a sum of at least k. If there is no such subarray, return -1. Uses prefix sums combined with a monotonic deque to achieve O(n) time.',
  tags: ['Sliding Window', 'Deque', 'Prefix Sum', 'Monotonic Queue'],
  code: {
    pseudocode: `function shortestSubarray(nums, k):
  n = len(nums)
  prefix = [0] * (n+1)
  for i in range(n): prefix[i+1] = prefix[i] + nums[i]
  result = inf
  deque = []
  for i in range(n+1):
    while deque and prefix[i]-prefix[deque[0]] >= k:
      result = min(result, i - deque.popleft())
    while deque and prefix[i] <= prefix[deque[-1]]:
      deque.pop()
    deque.append(i)
  return result if result != inf else -1`,
    python: `from collections import deque
def shortestSubarray(nums, k):
    n = len(nums)
    prefix = [0]*(n+1)
    for i in range(n): prefix[i+1]=prefix[i]+nums[i]
    res=float('inf'); dq=deque()
    for i in range(n+1):
        while dq and prefix[i]-prefix[dq[0]]>=k:
            res=min(res,i-dq.popleft())
        while dq and prefix[i]<=prefix[dq[-1]]:
            dq.pop()
        dq.append(i)
    return res if res!=float('inf') else -1`,
    javascript: `function shortestSubarray(nums, k) {
  const n=nums.length, prefix=new Array(n+1).fill(0);
  for (let i=0;i<n;i++) prefix[i+1]=prefix[i]+nums[i];
  let res=Infinity; const dq=[];
  for (let i=0;i<=n;i++) {
    while (dq.length&&prefix[i]-prefix[dq[0]]>=k) res=Math.min(res,i-dq.shift());
    while (dq.length&&prefix[i]<=prefix[dq[dq.length-1]]) dq.pop();
    dq.push(i);
  }
  return res===Infinity?-1:res;
}`,
    java: `public int shortestSubarray(int[] nums, int k) {
    int n=nums.length; long[] prefix=new long[n+1];
    for(int i=0;i<n;i++) prefix[i+1]=prefix[i]+nums[i];
    int res=Integer.MAX_VALUE; Deque<Integer> dq=new ArrayDeque<>();
    for(int i=0;i<=n;i++){
        while(!dq.isEmpty()&&prefix[i]-prefix[dq.peekFirst()]>=k) res=Math.min(res,i-dq.pollFirst());
        while(!dq.isEmpty()&&prefix[i]<=prefix[dq.peekLast()]) dq.pollLast();
        dq.addLast(i);
    }
    return res==Integer.MAX_VALUE?-1:res;
}`,
  },
  defaultInput: { nums: [2, -1, 2], k: 3 },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [2, -1, 2],
      placeholder: '2,-1,2',
      helperText: 'Input array (may contain negatives)',
    },
    {
      name: 'k',
      label: 'k',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Target minimum sum',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    const prefix: number[] = new Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];

    function makeViz(highlights: Record<number, string>, labels: Record<number, string>, res: number): ArrayVisualization {
      return {
        type: 'array',
        array: [...nums],
        highlights,
        labels,
        auxData: {
          label: `Shortest Subarray Sum >= ${k}`,
          entries: [
            { key: 'Prefix Sums', value: prefix.join(', ') },
            { key: 'Min Length', value: res === Infinity ? 'not found' : String(res) },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Shortest subarray with sum >= ${k} in array with possible negatives. Build prefix sums + monotonic deque.`,
      variables: { n, k, prefix: [...prefix] },
      visualization: makeViz({}, {}, Infinity),
    });

    let res = Infinity;
    const dq: number[] = [];

    for (let i = 0; i <= n; i++) {
      while (dq.length && prefix[i] - prefix[dq[0]] >= k) {
        const front = dq.shift()!;
        const len = i - front;
        if (len < res) res = len;
        const h: Record<number, string> = {};
        for (let j = front; j < i; j++) h[j] = 'found';
        steps.push({
          line: 7,
          explanation: `Subarray [${front}..${i - 1}] sum = ${prefix[i] - prefix[front]} >= ${k}. Length=${len}. minLen=${res}.`,
          variables: { start: front, end: i - 1, sum: prefix[i] - prefix[front], length: len, res },
          visualization: makeViz(h, { [front]: 'S', [i - 1 < n ? i - 1 : n - 1]: 'E' }, res),
        });
      }

      while (dq.length && prefix[i] <= prefix[dq[dq.length - 1]]) dq.pop();
      dq.push(i);

      if (i < n) {
        const h: Record<number, string> = { [i]: 'active' };
        steps.push({
          line: 11,
          explanation: `Process index ${i}: prefix[${i + 1}]=${prefix[i + 1]}. Deque: [${dq.join(', ')}]. MinLen so far: ${res === Infinity ? 'not found' : res}.`,
          variables: { i, prefixVal: prefix[i + 1], dequeSize: dq.length, res },
          visualization: makeViz(h, { [i]: `p${prefix[i + 1]}` }, res),
        });
      }
    }

    const result = res === Infinity ? -1 : res;
    const finalH: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalH[i] = 'sorted';
    steps.push({
      line: 13,
      explanation: `Done. Shortest subarray with sum >= ${k}: length = ${result === -1 ? 'not found (-1)' : result}.`,
      variables: { result },
      visualization: makeViz(finalH, {}, res),
    });

    return steps;
  },
};

export default shortestSubarrayWithSumAtLeastKIi;

import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const sumOfSubarrayMinimums: AlgorithmDefinition = {
  id: 'sum-of-subarray-minimums',
  title: 'Sum of Subarray Minimums',
  leetcodeNumber: 907,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Given an array, find the sum of min(b) for every subarray b. Use a monotonic increasing stack to find for each element, how many subarrays have that element as their minimum. For each element arr[i], calculate left span (distance to previous smaller) and right span (distance to next smaller or equal), then add arr[i] * left * right.',
  tags: ['stack', 'monotonic stack', 'array', 'math', 'modulo'],

  code: {
    pseudocode: `function sumSubarrayMins(arr):
  MOD = 1e9 + 7
  n = len(arr)
  left = [0] * n    // distance to previous smaller
  right = [0] * n   // distance to next smaller or equal
  stack = []
  for i = 0 to n-1:
    while stack and arr[stack.top] >= arr[i]:
      stack.pop()
    left[i] = i + 1 if stack empty else i - stack.top
    stack.push(i)
  stack = []
  for i = n-1 to 0:
    while stack and arr[stack.top] > arr[i]:
      stack.pop()
    right[i] = n - i if stack empty else stack.top - i
    stack.push(i)
  return sum(arr[i] * left[i] * right[i]) % MOD`,

    python: `def sumSubarrayMins(arr: list[int]) -> int:
    MOD = 10 ** 9 + 7
    n = len(arr)
    left = [0] * n
    right = [0] * n
    stack = []
    for i in range(n):
        while stack and arr[stack[-1]] >= arr[i]:
            stack.pop()
        left[i] = i + 1 if not stack else i - stack[-1]
        stack.append(i)
    stack = []
    for i in range(n - 1, -1, -1):
        while stack and arr[stack[-1]] > arr[i]:
            stack.pop()
        right[i] = n - i if not stack else stack[-1] - i
        stack.append(i)
    return sum(arr[i] * left[i] * right[i] for i in range(n)) % MOD`,

    javascript: `function sumSubarrayMins(arr) {
  const MOD = 1e9 + 7;
  const n = arr.length;
  const left = new Array(n), right = new Array(n);
  let stack = [];
  for (let i = 0; i < n; i++) {
    while (stack.length && arr[stack.at(-1)] >= arr[i]) stack.pop();
    left[i] = stack.length ? i - stack.at(-1) : i + 1;
    stack.push(i);
  }
  stack = [];
  for (let i = n - 1; i >= 0; i--) {
    while (stack.length && arr[stack.at(-1)] > arr[i]) stack.pop();
    right[i] = stack.length ? stack.at(-1) - i : n - i;
    stack.push(i);
  }
  let ans = 0;
  for (let i = 0; i < n; i++) ans = (ans + arr[i] * left[i] * right[i]) % MOD;
  return ans;
}`,

    java: `public int sumSubarrayMins(int[] arr) {
    int MOD = 1_000_000_007, n = arr.length;
    int[] left = new int[n], right = new int[n];
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && arr[stack.peek()] >= arr[i]) stack.pop();
        left[i] = stack.isEmpty() ? i + 1 : i - stack.peek();
        stack.push(i);
    }
    stack.clear();
    for (int i = n - 1; i >= 0; i--) {
        while (!stack.isEmpty() && arr[stack.peek()] > arr[i]) stack.pop();
        right[i] = stack.isEmpty() ? n - i : stack.peek() - i;
        stack.push(i);
    }
    long ans = 0;
    for (int i = 0; i < n; i++) ans = (ans + (long) arr[i] * left[i] * right[i]) % MOD;
    return (int) ans;
}`,
  },

  defaultInput: {
    arr: [3, 1, 2, 4],
  },

  inputFields: [
    {
      name: 'arr',
      label: 'Array',
      type: 'array',
      defaultValue: [3, 1, 2, 4],
      placeholder: '3,1,2,4',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = input.arr as number[];
    const MOD = 1000000007;
    const n = arr.length;
    const steps: AlgorithmStep[] = [];
    const left = new Array(n).fill(0);
    const right = new Array(n).fill(0);
    let stack: number[] = [];

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map(i => `[${i}]=${arr[i]}`),
      inputChars: arr.map(v => String(v)),
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Array = [${arr.join(', ')}]. Compute left spans (distance to previous smaller).`,
      variables: { arr: [...arr], left: [...left], right: [...right] },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < n; i++) {
      while (stack.length > 0 && arr[stack[stack.length - 1]] >= arr[i]) {
        stack.pop();
      }
      left[i] = stack.length === 0 ? i + 1 : i - stack[stack.length - 1];
      stack.push(i);

      steps.push({
        line: 9,
        explanation: `left[${i}] = ${left[i]}. arr[${i}]=${arr[i]} can extend ${left[i]} subarrays to the left where it is minimum.`,
        variables: { i, value: arr[i], leftSpan: left[i], stack: stack.map(s => arr[s]) },
        visualization: makeViz(i, 'push'),
      });
    }

    stack = [];

    steps.push({
      line: 11,
      explanation: 'Now compute right spans (distance to next smaller or equal). Scan right to left.',
      variables: { left: [...left] },
      visualization: makeViz(n - 1, 'idle'),
    });

    for (let i = n - 1; i >= 0; i--) {
      while (stack.length > 0 && arr[stack[stack.length - 1]] > arr[i]) {
        stack.pop();
      }
      right[i] = stack.length === 0 ? n - i : stack[stack.length - 1] - i;
      stack.push(i);

      steps.push({
        line: 15,
        explanation: `right[${i}] = ${right[i]}. arr[${i}]=${arr[i]} contributes to ${right[i]} subarrays to the right.`,
        variables: { i, value: arr[i], rightSpan: right[i], stack: stack.map(s => arr[s]) },
        visualization: makeViz(i, 'push'),
      });
    }

    let ans = 0;
    for (let i = 0; i < n; i++) {
      ans = (ans + arr[i] * left[i] * right[i]) % MOD;
    }

    steps.push({
      line: 17,
      explanation: `Sum of contributions: ${arr.map((v, i) => `${v}*${left[i]}*${right[i]}`).join(' + ')} = ${ans} (mod 10^9+7).`,
      variables: { left: [...left], right: [...right], result: ans },
      visualization: makeViz(0, 'match'),
    });

    return steps;
  },
};

export default sumOfSubarrayMinimums;

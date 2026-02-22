import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const sumOfSubarrayMinimumsII: AlgorithmDefinition = {
  id: 'sum-of-subarray-minimums-ii',
  title: 'Sum of Subarray Minimums II',
  leetcodeNumber: 907,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Find the sum of min(b) over every subarray b. For each element, use a monotonic stack to find how many subarrays it is the minimum of. Contribution = arr[i] * left_count * right_count. Return sum mod 1e9+7.',
  tags: ['Stack', 'Monotonic Stack', 'Array', 'Math'],
  code: {
    pseudocode: `function sumSubarrayMins(arr):
  MOD = 1e9 + 7
  stack = []  // monotonic increasing
  result = 0
  for i from 0 to n (inclusive, use sentinel n):
    while stack and arr[stack.top] >= arr[i]:
      mid = stack.pop()
      left = mid - (stack.top if stack else -1)
      right = i - mid
      result += arr[mid] * left * right
    stack.push(i)
  return result % MOD`,
    python: `def sumSubarrayMins(arr):
    MOD = 10**9 + 7
    stack = []
    result = 0
    arr = [0] + arr + [0]  # sentinels
    for i in range(len(arr)):
        while stack and arr[stack[-1]] >= arr[i]:
            mid = stack.pop()
            left = mid - stack[-1]
            right = i - mid
            result += arr[mid] * left * right
        stack.append(i)
    return result % MOD`,
    javascript: `function sumSubarrayMins(arr) {
  const MOD = 1e9 + 7;
  const a = [0, ...arr, 0];
  const stack = [];
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    while (stack.length && a[stack[stack.length-1]] >= a[i]) {
      const mid = stack.pop();
      const left = mid - stack[stack.length-1];
      const right = i - mid;
      result = (result + a[mid] * left * right) % MOD;
    }
    stack.push(i);
  }
  return result;
}`,
    java: `public int sumSubarrayMins(int[] arr) {
    int MOD = 1_000_000_007;
    int n = arr.length;
    int[] a = new int[n+2];
    for (int i = 0; i < n; i++) a[i+1] = arr[i];
    Deque<Integer> stack = new ArrayDeque<>();
    long result = 0;
    for (int i = 0; i < n+2; i++) {
        while (!stack.isEmpty() && a[stack.peek()] >= a[i]) {
            int mid = stack.pop();
            int left = mid - (stack.isEmpty() ? 0 : stack.peek());
            int right = i - mid;
            result = (result + (long)a[mid] * left * right) % MOD;
        }
        stack.push(i);
    }
    return (int)result;
}`,
  },
  defaultInput: { arr: [3, 1, 2, 4] },
  inputFields: [
    {
      name: 'arr',
      label: 'Array',
      type: 'array',
      defaultValue: [3, 1, 2, 4],
      placeholder: 'e.g. 3,1,2,4',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = (input.arr as number[]).slice();
    const MOD = 1000000007;
    const a = [0, ...arr, 0];
    const steps: AlgorithmStep[] = [];
    const stack: number[] = [];
    let result = 0;

    const makeViz = (i: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map(idx => `i${idx}(${a[idx]})`),
      inputChars: a.map(v => String(v)),
      currentIndex: i,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Add sentinel 0 at both ends: [${a.join(', ')}]. Use monotonic increasing stack to find contribution of each element.`,
      variables: { a: [...a], result: 0 },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < a.length; i++) {
      steps.push({
        line: 5,
        explanation: `i=${i}, a[i]=${a[i]}. Check stack for elements >= current.`,
        variables: { i, val: a[i], stack: [...stack], result },
        visualization: makeViz(i, 'idle'),
      });

      while (stack.length > 0 && a[stack[stack.length - 1]] >= a[i]) {
        const mid = stack.pop()!;
        const left = mid - (stack.length > 0 ? stack[stack.length - 1] : 0);
        const right = i - mid;
        const contribution = a[mid] * left * right;
        result = (result + contribution) % MOD;

        steps.push({
          line: 7,
          explanation: `Pop mid=${mid} (val=${a[mid]}). Left span=${left}, Right span=${right}. Contribution=${a[mid]}*${left}*${right}=${contribution}. result=${result}.`,
          variables: { mid, val: a[mid], left, right, contribution, result },
          visualization: makeViz(i, 'pop'),
        });
      }

      stack.push(i);
      steps.push({
        line: 9,
        explanation: `Push index ${i} (val=${a[i]}) onto stack.`,
        variables: { i, stack: [...stack] },
        visualization: makeViz(i, 'push'),
      });
    }

    steps.push({
      line: 10,
      explanation: `Done. Sum of subarray minimums = ${result} (mod 1e9+7).`,
      variables: { result },
      visualization: makeViz(a.length - 1, 'match'),
    });

    return steps;
  },
};

export default sumOfSubarrayMinimumsII;

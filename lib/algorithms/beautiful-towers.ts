import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const beautifulTowers: AlgorithmDefinition = {
  id: 'beautiful-towers',
  title: 'Beautiful Towers',
  leetcodeNumber: 2866,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Given maxHeights[], assign heights to towers such that they form a mountain shape (non-decreasing then non-increasing) and each height <= maxHeights[i]. Maximize the sum. For each peak candidate, use monotonic stacks to compute max sum of left and right sides.',
  tags: ['Stack', 'Monotonic Stack', 'Array', 'Dynamic Programming'],
  code: {
    pseudocode: `function maximumSumOfHeights(maxHeights):
  n = len(maxHeights)
  // For each peak i, compute leftSum and rightSum using monotonic stacks
  leftSum = array of size n
  rightSum = array of size n
  stack = []
  // Left pass (monotonic increasing stack)
  prefix = 0
  for i from 0 to n-1:
    while stack and maxHeights[stack.top] >= maxHeights[i]:
      j = stack.pop()
      prefix -= maxHeights[j] * (j - (stack.top if stack else -1))
    prefix += maxHeights[i] * (i - (stack.top if stack else -1))
    leftSum[i] = prefix
    stack.push(i)
  // Similar right pass for rightSum
  // Answer = max(leftSum[i] + rightSum[i] - maxHeights[i]) for all i`,
    python: `def maximumSumOfHeights(maxHeights):
    n = len(maxHeights)
    left = [0] * n
    right = [0] * n
    stack = []
    # Left pass
    for i in range(n):
        while stack and maxHeights[stack[-1]] >= maxHeights[i]:
            j = stack.pop()
            left[i] -= maxHeights[j] * (j - (stack[-1] if stack else -1))
        left[i] += maxHeights[i] * (i - (stack[-1] if stack else -1))
        if i > 0: left[i] += left[stack[-1]] if stack else 0
        stack.append(i)
    # Right pass (mirror)
    stack = []
    for i in range(n-1, -1, -1):
        while stack and maxHeights[stack[-1]] >= maxHeights[i]:
            j = stack.pop()
            right[i] -= maxHeights[j] * ((stack[-1] if stack else n) - j)
        right[i] += maxHeights[i] * ((stack[-1] if stack else n) - i)
        if i < n-1: right[i] += right[stack[-1]] if stack else 0
        stack.append(i)
    return max(left[i] + right[i] - maxHeights[i] for i in range(n))`,
    javascript: `function maximumSumOfHeights(maxHeights) {
  const n = maxHeights.length;
  const left = new Array(n).fill(0);
  const right = new Array(n).fill(0);
  let stack = [];
  for (let i = 0; i < n; i++) {
    while (stack.length && maxHeights[stack[stack.length-1]] >= maxHeights[i]) {
      const j = stack.pop();
      left[i] -= maxHeights[j] * (j - (stack.length ? stack[stack.length-1] : -1));
    }
    left[i] += maxHeights[i] * (i - (stack.length ? stack[stack.length-1] : -1));
    if (stack.length) left[i] += left[stack[stack.length-1]];
    stack.push(i);
  }
  stack = [];
  for (let i = n-1; i >= 0; i--) {
    while (stack.length && maxHeights[stack[stack.length-1]] >= maxHeights[i]) {
      const j = stack.pop();
      right[i] -= maxHeights[j] * ((stack.length ? stack[stack.length-1] : n) - j);
    }
    right[i] += maxHeights[i] * ((stack.length ? stack[stack.length-1] : n) - i);
    if (stack.length) right[i] += right[stack[stack.length-1]];
    stack.push(i);
  }
  let ans = 0;
  for (let i = 0; i < n; i++) ans = Math.max(ans, left[i] + right[i] - maxHeights[i]);
  return ans;
}`,
    java: `public long maximumSumOfHeights(int[] maxHeights) {
    int n = maxHeights.length;
    long[] left = new long[n], right = new long[n];
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && maxHeights[stack.peek()] >= maxHeights[i]) {
            int j = stack.pop();
            left[i] -= (long)maxHeights[j] * (j - (stack.isEmpty() ? -1 : stack.peek()));
        }
        left[i] += (long)maxHeights[i] * (i - (stack.isEmpty() ? -1 : stack.peek()));
        if (!stack.isEmpty()) left[i] += left[stack.peek()];
        stack.push(i);
    }
    stack.clear();
    for (int i = n-1; i >= 0; i--) {
        while (!stack.isEmpty() && maxHeights[stack.peek()] >= maxHeights[i]) {
            int j = stack.pop();
            right[i] -= (long)maxHeights[j] * ((stack.isEmpty() ? n : stack.peek()) - j);
        }
        right[i] += (long)maxHeights[i] * ((stack.isEmpty() ? n : stack.peek()) - i);
        if (!stack.isEmpty()) right[i] += right[stack.peek()];
        stack.push(i);
    }
    long ans = 0;
    for (int i = 0; i < n; i++) ans = Math.max(ans, left[i] + right[i] - maxHeights[i]);
    return ans;
}`,
  },
  defaultInput: { maxHeights: [5, 3, 4, 1, 1] },
  inputFields: [
    {
      name: 'maxHeights',
      label: 'Max Heights',
      type: 'array',
      defaultValue: [5, 3, 4, 1, 1],
      placeholder: 'e.g. 5,3,4,1,1',
      helperText: 'Comma-separated max heights for each tower',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const maxHeights = (input.maxHeights as number[]).slice();
    const n = maxHeights.length;
    const steps: AlgorithmStep[] = [];
    const left: number[] = new Array(n).fill(0);
    const right: number[] = new Array(n).fill(0);
    let stack: number[] = [];

    const makeViz = (i: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map(idx => `i${idx}(h=${maxHeights[idx]})`),
      inputChars: maxHeights.map(h => String(h)),
      currentIndex: i,
      action,
    });

    steps.push({
      line: 1,
      explanation: `maxHeights=[${maxHeights.join(', ')}]. Use monotonic stacks to compute left[] and right[] contribution arrays for each possible peak.`,
      variables: { n, maxHeights: [...maxHeights] },
      visualization: makeViz(-1, 'idle'),
    });

    // Left pass
    steps.push({
      line: 5,
      explanation: `Left pass: for each index i, compute the max sum of a non-decreasing sequence ending at i (mountain left side).`,
      variables: {},
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < n; i++) {
      while (stack.length > 0 && maxHeights[stack[stack.length - 1]] >= maxHeights[i]) {
        const j = stack.pop()!;
        left[i] -= maxHeights[j] * (j - (stack.length > 0 ? stack[stack.length - 1] : -1));
        steps.push({
          line: 7,
          explanation: `Pop index ${j} (h=${maxHeights[j]}) because h >= maxHeights[${i}]=${maxHeights[i]}. Subtract its contribution from left[${i}].`,
          variables: { j, left: [...left] },
          visualization: makeViz(i, 'pop'),
        });
      }
      left[i] += maxHeights[i] * (i - (stack.length > 0 ? stack[stack.length - 1] : -1));
      if (stack.length > 0) left[i] += left[stack[stack.length - 1]];
      stack.push(i);

      steps.push({
        line: 10,
        explanation: `left[${i}]=${left[i]}: best mountain left sum if peak at i.`,
        variables: { i, 'left[i]': left[i] },
        visualization: makeViz(i, 'push'),
      });
    }

    // Right pass
    stack = [];
    steps.push({
      line: 12,
      explanation: `Right pass: scan right-to-left for non-increasing side.`,
      variables: {},
      visualization: makeViz(n - 1, 'idle'),
    });

    for (let i = n - 1; i >= 0; i--) {
      while (stack.length > 0 && maxHeights[stack[stack.length - 1]] >= maxHeights[i]) {
        const j = stack.pop()!;
        right[i] -= maxHeights[j] * ((stack.length > 0 ? stack[stack.length - 1] : n) - j);
        steps.push({
          line: 14,
          explanation: `Pop index ${j} right-side. Adjust right[${i}].`,
          variables: { j, right: [...right] },
          visualization: makeViz(i, 'pop'),
        });
      }
      right[i] += maxHeights[i] * ((stack.length > 0 ? stack[stack.length - 1] : n) - i);
      if (stack.length > 0) right[i] += right[stack[stack.length - 1]];
      stack.push(i);

      steps.push({
        line: 17,
        explanation: `right[${i}]=${right[i]}: best mountain right sum if peak at i.`,
        variables: { i, 'right[i]': right[i] },
        visualization: makeViz(i, 'push'),
      });
    }

    let ans = 0;
    let bestPeak = 0;
    for (let i = 0; i < n; i++) {
      const total = left[i] + right[i] - maxHeights[i];
      if (total > ans) {
        ans = total;
        bestPeak = i;
      }
    }

    steps.push({
      line: 20,
      explanation: `Best peak at index ${bestPeak} (h=${maxHeights[bestPeak]}). Max sum = left[${bestPeak}] + right[${bestPeak}] - maxHeights[${bestPeak}] = ${ans}.`,
      variables: { result: ans, bestPeak },
      visualization: makeViz(bestPeak, 'match'),
    });

    return steps;
  },
};

export default beautifulTowers;

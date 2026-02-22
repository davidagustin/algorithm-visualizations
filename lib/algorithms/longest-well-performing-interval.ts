import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const longestWellPerformingInterval: AlgorithmDefinition = {
  id: 'longest-well-performing-interval',
  title: 'Longest Well-Performing Interval',
  leetcodeNumber: 1124,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'A day is "tiring" if you work > 8 hours. A well-performing interval has more tiring days than non-tiring. Find the longest such interval. Convert to +1/-1 scores, compute prefix sums, then use a monotonic stack to find the longest subarray with positive sum.',
  tags: ['Stack', 'Monotonic Stack', 'Prefix Sum', 'Hash Map'],
  code: {
    pseudocode: `function longestWPI(hours):
  // Convert to +1 (>8h) or -1 (<=8h)
  // Compute prefix sums
  // Use monotonic stack for longest subarray with sum > 0
  score = [+1 if h>8 else -1 for h in hours]
  prefix[0] = 0
  for i from 1 to n: prefix[i] = prefix[i-1] + score[i-1]
  // Build stack of indices where prefix is decreasing (candidates for left bound)
  stack = []
  for i from 0 to n:
    if stack empty or prefix[stack.top] > prefix[i]:
      stack.push(i)
  // Scan right-to-left to find max width
  ans = 0
  for j from n down to 0:
    while stack and prefix[stack.top] < prefix[j]:
      ans = max(ans, j - stack.pop())
  return ans`,
    python: `def longestWPI(hours):
    n = len(hours)
    prefix = [0] * (n + 1)
    for i, h in enumerate(hours):
        prefix[i+1] = prefix[i] + (1 if h > 8 else -1)
    stack = []
    for i in range(n + 1):
        if not stack or prefix[stack[-1]] > prefix[i]:
            stack.append(i)
    ans = 0
    for j in range(n, -1, -1):
        while stack and prefix[stack[-1]] < prefix[j]:
            ans = max(ans, j - stack.pop())
    return ans`,
    javascript: `function longestWPI(hours) {
  const n = hours.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++)
    prefix[i+1] = prefix[i] + (hours[i] > 8 ? 1 : -1);
  const stack = [];
  for (let i = 0; i <= n; i++)
    if (!stack.length || prefix[stack[stack.length-1]] > prefix[i])
      stack.push(i);
  let ans = 0;
  for (let j = n; j >= 0; j--)
    while (stack.length && prefix[stack[stack.length-1]] < prefix[j]) {
      ans = Math.max(ans, j - stack.pop());
    }
  return ans;
}`,
    java: `public int longestWPI(int[] hours) {
    int n = hours.length;
    int[] prefix = new int[n + 1];
    for (int i = 0; i < n; i++)
        prefix[i+1] = prefix[i] + (hours[i] > 8 ? 1 : -1);
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = 0; i <= n; i++)
        if (stack.isEmpty() || prefix[stack.peek()] > prefix[i])
            stack.push(i);
    int ans = 0;
    for (int j = n; j >= 0; j--)
        while (!stack.isEmpty() && prefix[stack.peek()] < prefix[j])
            ans = Math.max(ans, j - stack.pop());
    return ans;
}`,
  },
  defaultInput: { hours: [9, 9, 6, 0, 6, 6, 9] },
  inputFields: [
    {
      name: 'hours',
      label: 'Hours Worked',
      type: 'array',
      defaultValue: [9, 9, 6, 0, 6, 6, 9],
      placeholder: 'e.g. 9,9,6,0,6,6,9',
      helperText: 'Comma-separated hours per day',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const hours = (input.hours as number[]).slice();
    const n = hours.length;
    const steps: AlgorithmStep[] = [];
    const stack: number[] = [];

    const makeViz = (i: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map(idx => `i${idx}(pre=${prefix[idx]})`),
      inputChars: hours.map(h => String(h)),
      currentIndex: i,
      action,
    });

    const prefix: number[] = new Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) {
      prefix[i + 1] = prefix[i] + (hours[i] > 8 ? 1 : -1);
    }

    steps.push({
      line: 1,
      explanation: `hours=[${hours.join(', ')}]. Convert: >8h is +1, <=8h is -1. Prefix sums: [${prefix.join(', ')}].`,
      variables: { prefix: [...prefix] },
      visualization: makeViz(-1, 'idle'),
    });

    // Build monotonic decreasing stack
    steps.push({
      line: 8,
      explanation: `Phase 1: Build stack of candidate left bounds (monotonic decreasing prefix values).`,
      variables: {},
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i <= n; i++) {
      if (stack.length === 0 || prefix[stack[stack.length - 1]] > prefix[i]) {
        stack.push(i);
        steps.push({
          line: 9,
          explanation: `prefix[${i}]=${prefix[i]} < stack top (or empty). Push index ${i} as candidate left boundary.`,
          variables: { i, 'prefix[i]': prefix[i], stack: [...stack] },
          visualization: makeViz(i, 'push'),
        });
      } else {
        steps.push({
          line: 9,
          explanation: `prefix[${i}]=${prefix[i]} >= stack top ${prefix[stack[stack.length - 1]]}. Skip (not a new minimum).`,
          variables: { i, 'prefix[i]': prefix[i] },
          visualization: makeViz(i, 'idle'),
        });
      }
    }

    // Scan right-to-left
    steps.push({
      line: 11,
      explanation: `Phase 2: Scan right-to-left. For each j, pop left candidates where prefix[stack.top] < prefix[j] (positive sum subarray).`,
      variables: {},
      visualization: makeViz(n, 'idle'),
    });

    let ans = 0;
    for (let j = n; j >= 0; j--) {
      while (stack.length > 0 && prefix[stack[stack.length - 1]] < prefix[j]) {
        const leftIdx = stack.pop()!;
        const len = j - leftIdx;
        ans = Math.max(ans, len);

        steps.push({
          line: 13,
          explanation: `prefix[${leftIdx}]=${prefix[leftIdx]} < prefix[${j}]=${prefix[j]}. Subarray [${leftIdx}..${j - 1}] has positive sum. Length=${len}. ans=${ans}.`,
          variables: { leftIdx, j, length: len, ans },
          visualization: makeViz(j, 'pop'),
        });
      }
    }

    steps.push({
      line: 14,
      explanation: `Done. Longest well-performing interval = ${ans} days.`,
      variables: { result: ans },
      visualization: makeViz(0, 'match'),
    });

    return steps;
  },
};

export default longestWellPerformingInterval;

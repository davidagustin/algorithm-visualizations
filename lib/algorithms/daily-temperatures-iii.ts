import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const dailyTemperaturesIII: AlgorithmDefinition = {
  id: 'daily-temperatures-iii',
  title: 'Daily Temperatures III (Advanced)',
  leetcodeNumber: 739,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'An advanced variant of Daily Temperatures: for each day find how many days until a warmer temperature, AND find the second next greater element. Extend the classic monotonic stack to track multiple future temperature records per day.',
  tags: ['Stack', 'Monotonic Stack', 'Array', 'Extended Variant'],
  code: {
    pseudocode: `function dailyTemperaturesAdvanced(temps):
  n = len(temps)
  next1 = array of 0s  // days until first warmer
  next2 = array of 0s  // days until second warmer
  stack = []  // monotonic decreasing
  for i from n-1 down to 0:
    while stack not empty and temps[stack.top] <= temps[i]:
      pop stack
    if stack not empty:
      next1[i] = stack.top - i
      j = stack.top
      // Look for second warmer from j's perspective
      if next1[j] > 0:
        k = j + next1[j]
        if temps[k] > temps[i]:
          next2[i] = k - i
    stack.push(i)
  return next1, next2`,
    python: `def dailyTemperaturesAdvanced(temperatures):
    n = len(temperatures)
    next1 = [0] * n
    stack = []
    for i in range(n - 1, -1, -1):
        while stack and temperatures[stack[-1]] <= temperatures[i]:
            stack.pop()
        if stack:
            next1[i] = stack[-1] - i
        stack.append(i)
    # Find next2 using next1
    next2 = [0] * n
    for i in range(n):
        if next1[i] > 0:
            j = i + next1[i]
            if next1[j] > 0:
                next2[i] = next1[i] + next1[j]
    return next1, next2`,
    javascript: `function dailyTemperaturesAdvanced(temperatures) {
  const n = temperatures.length;
  const next1 = new Array(n).fill(0);
  const stack = [];
  for (let i = n - 1; i >= 0; i--) {
    while (stack.length && temperatures[stack[stack.length-1]] <= temperatures[i])
      stack.pop();
    if (stack.length) next1[i] = stack[stack.length-1] - i;
    stack.push(i);
  }
  const next2 = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    if (next1[i]) {
      const j = i + next1[i];
      if (next1[j]) next2[i] = next1[i] + next1[j];
    }
  }
  return [next1, next2];
}`,
    java: `public int[][] dailyTemperaturesAdvanced(int[] temps) {
    int n = temps.length;
    int[] next1 = new int[n], next2 = new int[n];
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = n-1; i >= 0; i--) {
        while (!stack.isEmpty() && temps[stack.peek()] <= temps[i]) stack.pop();
        if (!stack.isEmpty()) next1[i] = stack.peek() - i;
        stack.push(i);
    }
    for (int i = 0; i < n; i++) {
        if (next1[i] > 0) {
            int j = i + next1[i];
            if (next1[j] > 0) next2[i] = next1[i] + next1[j];
        }
    }
    return new int[][]{next1, next2};
}`,
  },
  defaultInput: { temperatures: [73, 74, 75, 71, 69, 72, 76, 73] },
  inputFields: [
    {
      name: 'temperatures',
      label: 'Temperatures',
      type: 'array',
      defaultValue: [73, 74, 75, 71, 69, 72, 76, 73],
      placeholder: 'e.g. 73,74,75,71,69,72,76,73',
      helperText: 'Comma-separated daily temperatures',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const temps = (input.temperatures as number[]).slice();
    const n = temps.length;
    const steps: AlgorithmStep[] = [];
    const stack: number[] = [];
    const next1: number[] = new Array(n).fill(0);
    const next2: number[] = new Array(n).fill(0);

    const makeViz = (i: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map(idx => `i${idx}(${temps[idx]})`),
      inputChars: temps.map(t => String(t)),
      currentIndex: i,
      action,
    });

    steps.push({
      line: 1,
      explanation: `temps=[${temps.join(', ')}]. Phase 1: Compute next1[] (days to next warmer day) via monotonic decreasing stack.`,
      variables: { next1: [...next1] },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = n - 1; i >= 0; i--) {
      while (stack.length > 0 && temps[stack[stack.length - 1]] <= temps[i]) {
        const popped = stack.pop()!;
        steps.push({
          line: 6,
          explanation: `Pop index ${popped} (temp=${temps[popped]}) because ${temps[popped]} <= ${temps[i]}.`,
          variables: { popped },
          visualization: makeViz(i, 'pop'),
        });
      }

      if (stack.length > 0) {
        next1[i] = stack[stack.length - 1] - i;
        steps.push({
          line: 8,
          explanation: `next1[${i}]=${next1[i]}: first warmer day is index ${stack[stack.length - 1]} (${temps[stack[stack.length - 1]]}).`,
          variables: { i, 'next1[i]': next1[i] },
          visualization: makeViz(i, 'match'),
        });
      } else {
        steps.push({
          line: 8,
          explanation: `No warmer day to the right of ${i}. next1[${i}]=0.`,
          variables: { i, 'next1[i]': 0 },
          visualization: makeViz(i, 'mismatch'),
        });
      }

      stack.push(i);
      steps.push({
        line: 10,
        explanation: `Push index ${i}.`,
        variables: { stack: [...stack] },
        visualization: makeViz(i, 'push'),
      });
    }

    steps.push({
      line: 11,
      explanation: `Phase 2: Compute next2[] (days to second warmer day) using next1[].`,
      variables: { next1: [...next1] },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < n; i++) {
      if (next1[i] > 0) {
        const j = i + next1[i];
        if (next1[j] > 0) {
          next2[i] = next1[i] + next1[j];
        }
      }
      steps.push({
        line: 14,
        explanation: `i=${i}: next1=${next1[i]}, next2=${next2[i]}. ${next2[i] > 0 ? `Second warmer at index ${i + next2[i]}.` : 'No second warmer.'}`,
        variables: { i, 'next1[i]': next1[i], 'next2[i]': next2[i] },
        visualization: makeViz(i, next2[i] > 0 ? 'match' : 'idle'),
      });
    }

    steps.push({
      line: 15,
      explanation: `Done. next1=[${next1.join(', ')}], next2=[${next2.join(', ')}].`,
      variables: { next1: [...next1], next2: [...next2] },
      visualization: makeViz(n - 1, 'match'),
    });

    return steps;
  },
};

export default dailyTemperaturesIII;

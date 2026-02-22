import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const numberOfVisiblePeople: AlgorithmDefinition = {
  id: 'number-of-visible-people',
  title: 'Number of Visible People in a Queue',
  leetcodeNumber: 1944,
  difficulty: 'Hard',
  category: 'Stack',
  description:
    'Given an array of heights representing people standing in a queue, return an array where result[i] is the number of people that person i can see. Person i can see person j (j > i) if all people between them are shorter than both. Use a monotonic decreasing stack scanning from right to left.',
  tags: ['stack', 'monotonic stack', 'array', 'queue'],

  code: {
    pseudocode: `function canSeePersonsCount(heights):
  n = len(heights)
  result = [0] * n
  stack = []
  for i from n-1 to 0:
    count = 0
    while stack not empty and heights[i] > stack.top:
      stack.pop()
      count += 1
    if stack not empty:
      count += 1
    result[i] = count
    stack.push(heights[i])
  return result`,

    python: `def canSeePersonsCount(heights: list[int]) -> list[int]:
    n = len(heights)
    result = [0] * n
    stack = []
    for i in range(n - 1, -1, -1):
        count = 0
        while stack and heights[i] > stack[-1]:
            stack.pop()
            count += 1
        if stack:
            count += 1
        result[i] = count
        stack.append(heights[i])
    return result`,

    javascript: `function canSeePersonsCount(heights) {
  const n = heights.length;
  const result = new Array(n).fill(0);
  const stack = [];
  for (let i = n - 1; i >= 0; i--) {
    let count = 0;
    while (stack.length && heights[i] > stack.at(-1)) {
      stack.pop();
      count++;
    }
    if (stack.length) count++;
    result[i] = count;
    stack.push(heights[i]);
  }
  return result;
}`,

    java: `public int[] canSeePersonsCount(int[] heights) {
    int n = heights.length;
    int[] result = new int[n];
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = n - 1; i >= 0; i--) {
        int count = 0;
        while (!stack.isEmpty() && heights[i] > stack.peek()) {
            stack.pop();
            count++;
        }
        if (!stack.isEmpty()) count++;
        result[i] = count;
        stack.push(heights[i]);
    }
    return result;
}`,
  },

  defaultInput: {
    heights: [10, 6, 8, 5, 11, 9],
  },

  inputFields: [
    {
      name: 'heights',
      label: 'Heights',
      type: 'array',
      defaultValue: [10, 6, 8, 5, 11, 9],
      placeholder: '10,6,8,5,11,9',
      helperText: 'Comma-separated distinct heights',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const heights = input.heights as number[];
    const n = heights.length;
    const steps: AlgorithmStep[] = [];
    const result = new Array(n).fill(0);
    const stack: number[] = [];

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map(v => String(v)),
      inputChars: heights.map(h => String(h)),
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Initialize result array of ${n} zeros and empty stack. Scan from right to left.`,
      variables: { result: [...result], stack: [] },
      visualization: makeViz(n - 1, 'idle'),
    });

    for (let i = n - 1; i >= 0; i--) {
      let count = 0;

      steps.push({
        line: 5,
        explanation: `Person ${i} has height ${heights[i]}. Check who they can see.`,
        variables: { i, height: heights[i], stack: [...stack], count },
        visualization: makeViz(i, 'idle'),
      });

      while (stack.length > 0 && heights[i] > stack[stack.length - 1]) {
        const popped = stack.pop()!;
        count++;
        steps.push({
          line: 7,
          explanation: `Height ${heights[i]} > stack top ${popped}. Pop ${popped} (can see them). Count = ${count}.`,
          variables: { i, height: heights[i], popped, count, stack: [...stack] },
          visualization: makeViz(i, 'pop'),
        });
      }

      if (stack.length > 0) {
        count++;
        steps.push({
          line: 9,
          explanation: `Stack still has ${stack[stack.length - 1]} which blocks further view. +1 for this person. Count = ${count}.`,
          variables: { i, count, blocker: stack[stack.length - 1] },
          visualization: makeViz(i, 'idle'),
        });
      }

      result[i] = count;
      stack.push(heights[i]);

      steps.push({
        line: 11,
        explanation: `result[${i}] = ${count}. Push height ${heights[i]} onto stack. Stack = [${stack.join(', ')}].`,
        variables: { i, result: [...result], stack: [...stack] },
        visualization: makeViz(i, 'push'),
      });
    }

    steps.push({
      line: 12,
      explanation: `Done. Result = [${result.join(', ')}].`,
      variables: { result: [...result] },
      visualization: makeViz(0, 'match'),
    });

    return steps;
  },
};

export default numberOfVisiblePeople;

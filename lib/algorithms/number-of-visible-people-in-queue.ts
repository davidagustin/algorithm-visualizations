import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const numberOfVisiblePeopleInQueue: AlgorithmDefinition = {
  id: 'number-of-visible-people-in-queue',
  title: 'Number of Visible People in a Queue',
  leetcodeNumber: 1944,
  difficulty: 'Hard',
  category: 'Stack',
  description:
    'Given heights of people in a queue, for each person count how many others they can see to their right. Person i can see person j if all people between i and j are shorter than min(heights[i], heights[j]). Use a monotonic decreasing stack scanning right-to-left.',
  tags: ['Stack', 'Monotonic Stack', 'Array', 'Hard'],
  code: {
    pseudocode: `function canSeePersonsCount(heights):
  n = len(heights)
  result = array of zeros size n
  stack = []  // monotonic decreasing
  for i from n-1 down to 0:
    count = 0
    while stack not empty and heights[i] > stack.top:
      stack.pop()
      count += 1
    if stack not empty:
      count += 1  // can see the first taller person
    result[i] = count
    stack.push(heights[i])
  return result`,
    python: `def canSeePersonsCount(heights):
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
    while (stack.length && heights[i] > stack[stack.length-1]) {
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
            stack.pop(); count++;
        }
        if (!stack.isEmpty()) count++;
        result[i] = count;
        stack.push(heights[i]);
    }
    return result;
}`,
  },
  defaultInput: { heights: [10, 6, 8, 5, 11, 9] },
  inputFields: [
    {
      name: 'heights',
      label: 'Heights',
      type: 'array',
      defaultValue: [10, 6, 8, 5, 11, 9],
      placeholder: 'e.g. 10,6,8,5,11,9',
      helperText: 'Comma-separated heights (all distinct)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const heights = (input.heights as number[]).slice();
    const n = heights.length;
    const steps: AlgorithmStep[] = [];
    const stack: number[] = [];
    const result: number[] = new Array(n).fill(0);

    const makeViz = (i: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map(v => String(v)),
      inputChars: heights.map(h => String(h)),
      currentIndex: i,
      action,
    });

    steps.push({
      line: 1,
      explanation: `heights=[${heights.join(', ')}]. Process right-to-left with monotonic decreasing stack. Count visible people for each position.`,
      variables: { result: [...result] },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = n - 1; i >= 0; i--) {
      let count = 0;

      steps.push({
        line: 5,
        explanation: `Person ${i} (h=${heights[i]}). Count who they can see to the right.`,
        variables: { i, height: heights[i], count },
        visualization: makeViz(i, 'idle'),
      });

      while (stack.length > 0 && heights[i] > stack[stack.length - 1]) {
        const popped = stack.pop()!;
        count++;
        steps.push({
          line: 7,
          explanation: `Person ${i} (h=${heights[i]}) can see over shorter person (h=${popped}). Pop. count=${count}.`,
          variables: { poppedHeight: popped, count },
          visualization: makeViz(i, 'pop'),
        });
      }

      if (stack.length > 0) {
        count++;
        steps.push({
          line: 9,
          explanation: `First taller person (h=${stack[stack.length - 1]}) blocks further view. count+1=${count}.`,
          variables: { blockerHeight: stack[stack.length - 1], count },
          visualization: makeViz(i, 'mismatch'),
        });
      }

      result[i] = count;
      stack.push(heights[i]);

      steps.push({
        line: 11,
        explanation: `result[${i}]=${count}. Push ${heights[i]} onto stack.`,
        variables: { i, 'result[i]': count, result: [...result] },
        visualization: makeViz(i, 'push'),
      });
    }

    steps.push({
      line: 12,
      explanation: `Done. Visible counts: [${result.join(', ')}].`,
      variables: { result: [...result] },
      visualization: makeViz(0, 'match'),
    });

    return steps;
  },
};

export default numberOfVisiblePeopleInQueue;

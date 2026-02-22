import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const largestRectangleInHistogramIi: AlgorithmDefinition = {
  id: 'largest-rectangle-in-histogram-ii',
  title: 'Largest Rectangle in Histogram (Alternative)',
  leetcodeNumber: 84,
  difficulty: 'Hard',
  category: 'Stack',
  description:
    'Given an array of bar heights in a histogram, find the largest rectangle area. This alternative monotonic stack approach appends a 0-height sentinel bar at the end. Maintain an increasing stack. When a shorter bar is seen, pop and compute area using the current index as the right boundary and the new stack top as the left boundary.',
  tags: ['stack', 'monotonic stack', 'array', 'histogram', 'math'],

  code: {
    pseudocode: `function largestRectangleArea(heights):
  heights.append(0)   // sentinel
  stack = [-1]        // sentinel index
  maxArea = 0
  for i = 0 to len(heights)-1:
    while stack.top != -1 and heights[stack.top] >= heights[i]:
      h = heights[stack.pop()]
      w = i - stack.top - 1
      maxArea = max(maxArea, h * w)
    stack.push(i)
  return maxArea`,

    python: `def largestRectangleArea(heights: list[int]) -> int:
    heights = heights + [0]
    stack = [-1]
    max_area = 0
    for i, h in enumerate(heights):
        while stack[-1] != -1 and heights[stack[-1]] >= h:
            height = heights[stack.pop()]
            width = i - stack[-1] - 1
            max_area = max(max_area, height * width)
        stack.append(i)
    return max_area`,

    javascript: `function largestRectangleArea(heights) {
  heights = [...heights, 0];
  const stack = [-1];
  let maxArea = 0;
  for (let i = 0; i < heights.length; i++) {
    while (stack.at(-1) !== -1 && heights[stack.at(-1)] >= heights[i]) {
      const h = heights[stack.pop()];
      const w = i - stack.at(-1) - 1;
      maxArea = Math.max(maxArea, h * w);
    }
    stack.push(i);
  }
  return maxArea;
}`,

    java: `public int largestRectangleArea(int[] heights) {
    int n = heights.length;
    int[] h = Arrays.copyOf(heights, n + 1);
    Deque<Integer> stack = new ArrayDeque<>();
    stack.push(-1);
    int maxArea = 0;
    for (int i = 0; i <= n; i++) {
        while (stack.peek() != -1 && h[stack.peek()] >= h[i]) {
            int height = h[stack.pop()];
            int width = i - stack.peek() - 1;
            maxArea = Math.max(maxArea, height * width);
        }
        stack.push(i);
    }
    return maxArea;
}`,
  },

  defaultInput: {
    heights: [2, 1, 5, 6, 2, 3],
  },

  inputFields: [
    {
      name: 'heights',
      label: 'Bar Heights',
      type: 'array',
      defaultValue: [2, 1, 5, 6, 2, 3],
      placeholder: '2,1,5,6,2,3',
      helperText: 'Comma-separated non-negative bar heights',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const origHeights = input.heights as number[];
    const heights = [...origHeights, 0];
    const n = heights.length;
    const steps: AlgorithmStep[] = [];
    const stack: number[] = [-1];
    let maxArea = 0;

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map(v => v === -1 ? 'sentinel' : `[${v}]h=${heights[v]}`),
      inputChars: heights.map(v => String(v)),
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `heights = [${origHeights.join(', ')}] + [0 sentinel]. Stack = [-1 sentinel]. Find max rectangle.`,
      variables: { heights: [...heights], stack: [-1], maxArea: 0 },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < n; i++) {
      steps.push({
        line: 4,
        explanation: `Process heights[${i}] = ${heights[i]}. Check against stack top.`,
        variables: { i, height: heights[i], stack: [...stack], maxArea },
        visualization: makeViz(i, 'idle'),
      });

      while (stack[stack.length - 1] !== -1 && heights[stack[stack.length - 1]] >= heights[i]) {
        const topIdx = stack.pop()!;
        const h = heights[topIdx];
        const leftBoundary = stack[stack.length - 1];
        const w = i - leftBoundary - 1;
        const area = h * w;
        maxArea = Math.max(maxArea, area);

        steps.push({
          line: 7,
          explanation: `Pop index ${topIdx} (h=${h}). Width = ${i} - ${leftBoundary} - 1 = ${w}. Area = ${h} * ${w} = ${area}. maxArea = ${maxArea}.`,
          variables: { topIdx, h, leftBoundary, w, area, maxArea },
          visualization: makeViz(i, 'pop'),
        });
      }

      stack.push(i);
      steps.push({
        line: 9,
        explanation: `Push index ${i} (h=${heights[i]}). Stack = [${stack.map(v => v === -1 ? '-1' : v).join(', ')}].`,
        variables: { i, stack: [...stack], maxArea },
        visualization: makeViz(i, 'push'),
      });
    }

    steps.push({
      line: 10,
      explanation: `Done. Largest rectangle area = ${maxArea}.`,
      variables: { result: maxArea },
      visualization: makeViz(0, 'match'),
    });

    return steps;
  },
};

export default largestRectangleInHistogramIi;

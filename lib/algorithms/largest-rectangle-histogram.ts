import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const largestRectangleHistogram: AlgorithmDefinition = {
  id: 'largest-rectangle-histogram',
  title: 'Largest Rectangle in Histogram',
  leetcodeNumber: 84,
  difficulty: 'Hard',
  category: 'Stack',
  description:
    'Find the largest rectangle area in a histogram. Use a monotonic increasing stack of indices. When a bar shorter than the stack top is encountered, pop and compute the area extending leftward from the popped index.',
  tags: ['Stack', 'Array', 'Monotonic Stack'],
  code: {
    pseudocode: `function largestRectangleArea(heights):
  stack = []  // indices, increasing height
  maxArea = 0
  heights.append(0)  // sentinel
  for i from 0 to len(heights)-1:
    while stack not empty and heights[i] < heights[stack.top]:
      h = heights[stack.pop()]
      w = i if stack empty else i - stack.top - 1
      maxArea = max(maxArea, h * w)
    stack.push(i)
  return maxArea`,
    python: `def largestRectangleArea(heights):
    heights = heights + [0]
    stack = []
    max_area = 0
    for i, h in enumerate(heights):
        start = i
        while stack and stack[-1][1] > h:
            idx, height = stack.pop()
            max_area = max(max_area, height * (i - idx))
            start = idx
        stack.append((start, h))
    return max_area`,
    javascript: `function largestRectangleArea(heights) {
  const stack = []; // [index, height]
  let maxArea = 0;
  heights = [...heights, 0];
  for (let i = 0; i < heights.length; i++) {
    let start = i;
    while (stack.length && stack[stack.length - 1][1] > heights[i]) {
      const [idx, height] = stack.pop();
      maxArea = Math.max(maxArea, height * (i - idx));
      start = idx;
    }
    stack.push([start, heights[i]]);
  }
  return maxArea;
}`,
    java: `public int largestRectangleArea(int[] heights) {
    Deque<int[]> stack = new ArrayDeque<>();
    int maxArea = 0;
    int[] h = Arrays.copyOf(heights, heights.length + 1);
    for (int i = 0; i < h.length; i++) {
        int start = i;
        while (!stack.isEmpty() && stack.peek()[1] > h[i]) {
            int[] top = stack.pop();
            maxArea = Math.max(maxArea, top[1] * (i - top[0]));
            start = top[0];
        }
        stack.push(new int[]{start, h[i]});
    }
    return maxArea;
}`,
  },
  defaultInput: { heights: [2, 1, 5, 6, 2, 3] },
  inputFields: [
    {
      name: 'heights',
      label: 'Heights',
      type: 'array',
      defaultValue: [2, 1, 5, 6, 2, 3],
      placeholder: 'e.g. 2,1,5,6,2,3',
      helperText: 'Comma-separated histogram bar heights',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const origHeights = (input.heights as number[]).slice();
    const heights = [...origHeights, 0]; // sentinel
    const n = origHeights.length;
    const steps: AlgorithmStep[] = [];
    const stack: [number, number][] = []; // [startIdx, height]
    let maxArea = 0;

    function makeViz(activeIdx: number | null, lastArea?: number): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let i = 0; i < n; i++) {
        highlights[i] = 'default';
      }
      for (const [idx] of stack) {
        if (idx < n) {
          highlights[idx] = 'active';
          labels[idx] = 'stk';
        }
      }
      if (activeIdx !== null && activeIdx < n) {
        highlights[activeIdx] = 'current';
        labels[activeIdx] = 'curr';
      }

      return {
        type: 'array',
        array: origHeights,
        highlights,
        labels,
        auxData: {
          label: 'Stack & Max Area',
          entries: [
            {
              key: 'Stack (start,h)',
              value: stack.length > 0 ? stack.map(([s, h]) => `(${s},${h})`).join(' ') : 'empty',
            },
            { key: 'Max Area', value: String(maxArea) },
            ...(lastArea !== undefined ? [{ key: 'Last Area', value: String(lastArea) }] : []),
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Initialize empty stack and maxArea=0. A sentinel 0 is appended to flush the stack at the end.`,
      variables: { heights: origHeights, maxArea },
      visualization: makeViz(null),
    });

    for (let i = 0; i < heights.length; i++) {
      const activeDisplay = i < n ? i : null;
      steps.push({
        line: 5,
        explanation: i < n
          ? `Bar ${i}: height=${heights[i]}. Check if it is shorter than stack top.`
          : `Sentinel bar (height=0) at end. Flush all remaining bars from stack.`,
        variables: { i, height: heights[i], stack: stack.map(([s, h]) => `(${s},${h})`) },
        visualization: makeViz(activeDisplay),
      });

      let start = i;
      while (stack.length > 0 && stack[stack.length - 1][1] > heights[i]) {
        const [idx, height] = stack.pop()!;
        const area = height * (i - idx);
        if (area > maxArea) maxArea = area;
        start = idx;
        steps.push({
          line: 7,
          explanation: `Pop (start=${idx}, height=${height}). Width = ${i} - ${idx} = ${i - idx}. Area = ${height} * ${i - idx} = ${area}. MaxArea = ${maxArea}.`,
          variables: { popped: { idx, height }, area, maxArea, stack: stack.map(([s, h]) => `(${s},${h})`) },
          visualization: makeViz(activeDisplay, area),
        });
      }

      stack.push([start, heights[i]]);
      if (i < n) {
        steps.push({
          line: 9,
          explanation: `Push (start=${start}, height=${heights[i]}) onto stack.`,
          variables: { pushed: [start, heights[i]], stack: stack.map(([s, h]) => `(${s},${h})`) },
          visualization: makeViz(activeDisplay),
        });
      }
    }

    steps.push({
      line: 10,
      explanation: `Done! Largest rectangle area = ${maxArea}.`,
      variables: { maxArea },
      visualization: (() => {
        const h: Record<number, string> = {};
        for (let i = 0; i < n; i++) h[i] = 'sorted';
        return {
          type: 'array' as const,
          array: origHeights,
          highlights: h,
          labels: {},
          auxData: {
            label: 'Result',
            entries: [{ key: 'Largest Rectangle Area', value: String(maxArea) }],
          },
        };
      })(),
    });

    return steps;
  },
};

export default largestRectangleHistogram;

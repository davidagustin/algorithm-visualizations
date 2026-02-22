import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const trappingRainWaterStack: AlgorithmDefinition = {
  id: 'trapping-rain-water-stack',
  title: 'Trapping Rain Water (Stack)',
  leetcodeNumber: 42,
  difficulty: 'Hard',
  category: 'Stack',
  description:
    'Given an elevation map where each bar has unit width, compute how much rain water can be trapped after raining. The stack approach maintains a monotonic decreasing stack of indices. When we find a bar taller than the top, we pop and calculate trapped water between the new bar and the remaining stack top.',
  tags: ['stack', 'monotonic stack', 'array', 'water trapping'],

  code: {
    pseudocode: `function trap(height):
  stack = []
  water = 0
  for i = 0 to n-1:
    while stack not empty and height[i] > height[stack.top]:
      top = stack.pop()
      if stack is empty: break
      distance = i - stack.top - 1
      bounded_height = min(height[i], height[stack.top]) - height[top]
      water += distance * bounded_height
    stack.push(i)
  return water`,

    python: `def trap(height: list[int]) -> int:
    stack = []
    water = 0
    for i, h in enumerate(height):
        while stack and height[i] > height[stack[-1]]:
            top = stack.pop()
            if not stack:
                break
            distance = i - stack[-1] - 1
            bounded_height = min(height[i], height[stack[-1]]) - height[top]
            water += distance * bounded_height
        stack.append(i)
    return water`,

    javascript: `function trap(height) {
  const stack = [];
  let water = 0;
  for (let i = 0; i < height.length; i++) {
    while (stack.length && height[i] > height[stack.at(-1)]) {
      const top = stack.pop();
      if (!stack.length) break;
      const distance = i - stack.at(-1) - 1;
      const boundedHeight = Math.min(height[i], height[stack.at(-1)]) - height[top];
      water += distance * boundedHeight;
    }
    stack.push(i);
  }
  return water;
}`,

    java: `public int trap(int[] height) {
    Deque<Integer> stack = new ArrayDeque<>();
    int water = 0;
    for (int i = 0; i < height.length; i++) {
        while (!stack.isEmpty() && height[i] > height[stack.peek()]) {
            int top = stack.pop();
            if (stack.isEmpty()) break;
            int distance = i - stack.peek() - 1;
            int boundedHeight = Math.min(height[i], height[stack.peek()]) - height[top];
            water += distance * boundedHeight;
        }
        stack.push(i);
    }
    return water;
}`,
  },

  defaultInput: {
    height: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
  },

  inputFields: [
    {
      name: 'height',
      label: 'Height Map',
      type: 'array',
      defaultValue: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
      placeholder: '0,1,0,2,1,0,1,3,2,1,2,1',
      helperText: 'Comma-separated non-negative integers representing bar heights',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const height = input.height as number[];
    const steps: AlgorithmStep[] = [];
    const stack: number[] = [];
    let water = 0;

    const makeViz = (currentIndex: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map(idx => `h[${idx}]=${height[idx]}`),
      inputChars: height.map(h => String(h)),
      currentIndex,
      action,
    });

    steps.push({
      line: 1,
      explanation: 'Initialize empty stack and water counter = 0.',
      variables: { stack: [], water: 0 },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < height.length; i++) {
      steps.push({
        line: 4,
        explanation: `Processing index ${i}, height = ${height[i]}. Check if taller than stack top.`,
        variables: { i, height_i: height[i], stack: [...stack], water },
        visualization: makeViz(i, 'idle'),
      });

      while (stack.length > 0 && height[i] > height[stack[stack.length - 1]]) {
        const top = stack.pop()!;
        if (stack.length === 0) {
          steps.push({
            line: 7,
            explanation: `Popped index ${top} but stack is now empty. No left boundary, skip water calculation.`,
            variables: { top, stack: [], water },
            visualization: makeViz(i, 'pop'),
          });
          break;
        }
        const distance = i - stack[stack.length - 1] - 1;
        const boundedHeight = Math.min(height[i], height[stack[stack.length - 1]]) - height[top];
        const trapped = distance * boundedHeight;
        water += trapped;
        steps.push({
          line: 9,
          explanation: `Popped top index ${top} (h=${height[top]}). Left boundary at ${stack[stack.length - 1]} (h=${height[stack[stack.length - 1]]}), right boundary at ${i} (h=${height[i]}). Distance=${distance}, bounded_height=${boundedHeight}, trapped=${trapped}. Total water=${water}.`,
          variables: { top, left: stack[stack.length - 1], right: i, distance, boundedHeight, trapped, water },
          visualization: makeViz(i, 'match'),
        });
      }

      stack.push(i);
      steps.push({
        line: 10,
        explanation: `Push index ${i} (height=${height[i]}) onto stack.`,
        variables: { i, stack: [...stack], water },
        visualization: makeViz(i, 'push'),
      });
    }

    steps.push({
      line: 11,
      explanation: `All bars processed. Total trapped water = ${water}.`,
      variables: { water, result: water },
      visualization: makeViz(height.length, 'idle'),
    });

    return steps;
  },
};

export default trappingRainWaterStack;

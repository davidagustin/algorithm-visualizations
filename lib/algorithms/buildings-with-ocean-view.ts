import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const buildingsWithOceanView: AlgorithmDefinition = {
  id: 'buildings-with-ocean-view',
  title: 'Buildings With Ocean View',
  leetcodeNumber: 1762,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Given an array of building heights, find all buildings that have an ocean view (to the right). A building has an ocean view if all buildings to its right are shorter. Use a monotonic decreasing stack: traverse right-to-left, maintaining the maximum height seen.',
  tags: ['Stack', 'Monotonic Stack', 'Array', 'Greedy'],
  code: {
    pseudocode: `function findBuildings(heights):
  result = []
  maxRight = 0
  for i from n-1 down to 0:
    if heights[i] > maxRight:
      result.prepend(i)
      maxRight = heights[i]
  return result`,
    python: `def findBuildings(heights):
    result = []
    max_right = 0
    for i in range(len(heights) - 1, -1, -1):
        if heights[i] > max_right:
            result.append(i)
            max_right = heights[i]
    return result[::-1]`,
    javascript: `function findBuildings(heights) {
  const result = [];
  let maxRight = 0;
  for (let i = heights.length - 1; i >= 0; i--) {
    if (heights[i] > maxRight) {
      result.unshift(i);
      maxRight = heights[i];
    }
  }
  return result;
}`,
    java: `public int[] findBuildings(int[] heights) {
    List<Integer> result = new ArrayList<>();
    int maxRight = 0;
    for (int i = heights.length - 1; i >= 0; i--) {
        if (heights[i] > maxRight) {
            result.add(0, i);
            maxRight = heights[i];
        }
    }
    return result.stream().mapToInt(x->x).toArray();
}`,
  },
  defaultInput: { heights: [4, 2, 3, 1] },
  inputFields: [
    {
      name: 'heights',
      label: 'Building Heights',
      type: 'array',
      defaultValue: [4, 2, 3, 1],
      placeholder: 'e.g. 4,2,3,1',
      helperText: 'Comma-separated building heights',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const heights = (input.heights as number[]).slice();
    const n = heights.length;
    const steps: AlgorithmStep[] = [];
    const stack: string[] = [];
    const result: number[] = [];
    let maxRight = 0;

    const makeViz = (i: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: [...stack],
      inputChars: heights.map(h => String(h)),
      currentIndex: i,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Scan right-to-left. A building has ocean view if it is taller than all buildings to its right. maxRight=0.`,
      variables: { maxRight, result: [] },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = n - 1; i >= 0; i--) {
      steps.push({
        line: 4,
        explanation: `Building ${i} (h=${heights[i]}). maxRight so far = ${maxRight}.`,
        variables: { i, height: heights[i], maxRight },
        visualization: makeViz(i, 'idle'),
      });

      if (heights[i] > maxRight) {
        result.unshift(i);
        maxRight = heights[i];
        stack.unshift(`b${i}(h=${heights[i]})`);

        steps.push({
          line: 5,
          explanation: `heights[${i}]=${heights[i]} > maxRight=${maxRight === heights[i] ? 0 : maxRight}. Building ${i} has ocean view! Update maxRight=${maxRight}.`,
          variables: { i, height: heights[i], maxRight, result: [...result] },
          visualization: makeViz(i, 'push'),
        });
      } else {
        steps.push({
          line: 7,
          explanation: `heights[${i}]=${heights[i]} <= maxRight=${maxRight}. Building ${i} blocked. No ocean view.`,
          variables: { i, height: heights[i], maxRight },
          visualization: makeViz(i, 'mismatch'),
        });
      }
    }

    steps.push({
      line: 8,
      explanation: `Done. Buildings with ocean view: [${result.join(', ')}] (indices).`,
      variables: { result: [...result] },
      visualization: makeViz(0, 'match'),
    });

    return steps;
  },
};

export default buildingsWithOceanView;

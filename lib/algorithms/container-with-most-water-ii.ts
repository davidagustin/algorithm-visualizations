import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const containerWithMostWaterIi: AlgorithmDefinition = {
  id: 'container-with-most-water-ii',
  title: 'Container With Most Water (Greedy Proof)',
  leetcodeNumber: 11,
  difficulty: 'Medium',
  category: 'Two Pointers',
  description:
    'Find two lines that together with the x-axis form a container holding the most water. Use two pointers: always move the pointer at the shorter line inward. Proof: moving the taller line can only decrease or maintain width while the height is bounded by the shorter line anyway.',
  tags: ['two pointers', 'array', 'greedy'],

  code: {
    pseudocode: `function maxArea(height):
  left = 0, right = n-1
  maxWater = 0
  while left < right:
    h = min(height[left], height[right])
    width = right - left
    area = h * width
    maxWater = max(maxWater, area)
    if height[left] < height[right]: left++
    else: right--
  return maxWater`,

    python: `def maxArea(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    max_water = 0
    while left < right:
        h = min(height[left], height[right])
        area = h * (right - left)
        max_water = max(max_water, area)
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_water`,

    javascript: `function maxArea(height) {
  let left = 0, right = height.length - 1, maxWater = 0;
  while (left < right) {
    const h = Math.min(height[left], height[right]);
    const area = h * (right - left);
    maxWater = Math.max(maxWater, area);
    if (height[left] < height[right]) left++;
    else right--;
  }
  return maxWater;
}`,

    java: `public int maxArea(int[] height) {
    int left = 0, right = height.length - 1, maxWater = 0;
    while (left < right) {
        int h = Math.min(height[left], height[right]);
        int area = h * (right - left);
        maxWater = Math.max(maxWater, area);
        if (height[left] < height[right]) left++;
        else right--;
    }
    return maxWater;
}`,
  },

  defaultInput: {
    height: [1, 8, 6, 2, 5, 4, 8, 3, 7],
  },

  inputFields: [
    {
      name: 'height',
      label: 'Heights',
      type: 'array',
      defaultValue: [1, 8, 6, 2, 5, 4, 8, 3, 7],
      placeholder: '1,8,6,2,5,4,8,3,7',
      helperText: 'Comma-separated non-negative integers representing line heights',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const height = input.height as number[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...height],
      highlights,
      labels,
    });

    let left = 0;
    let right = height.length - 1;
    let maxWater = 0;
    let bestLeft = 0;
    let bestRight = right;

    steps.push({
      line: 1,
      explanation: `Initialize left=${left}, right=${right}. The area = min(h[L], h[R]) * (R - L). Always move the shorter pointer.`,
      variables: { left, right, maxWater },
      visualization: makeViz({ [left]: 'pointer', [right]: 'pointer' }, { [left]: 'L', [right]: 'R' }),
    });

    while (left < right) {
      const h = Math.min(height[left], height[right]);
      const width = right - left;
      const area = h * width;
      const improved = area > maxWater;
      if (improved) {
        maxWater = area;
        bestLeft = left;
        bestRight = right;
      }

      steps.push({
        line: 4,
        explanation: `h=min(${height[left]},${height[right]})=${h}, width=${width}, area=${area}. ${improved ? `New max! maxWater=${maxWater}.` : `Not better than ${maxWater}.`}`,
        variables: { left, right, h, width, area, maxWater },
        visualization: makeViz({ [left]: 'active', [right]: 'active' }, { [left]: `h=${height[left]}`, [right]: `h=${height[right]}` }),
      });

      if (height[left] < height[right]) {
        steps.push({
          line: 8,
          explanation: `height[${left}]=${height[left]} < height[${right}]=${height[right]}. Move left inward (shorter line limits area).`,
          variables: { left: left + 1, right },
          visualization: makeViz({ [left]: 'mismatch', [right]: 'pointer' }, { [left]: 'L++', [right]: 'R' }),
        });
        left++;
      } else {
        steps.push({
          line: 9,
          explanation: `height[${right}]=${height[right]} <= height[${left}]=${height[left]}. Move right inward.`,
          variables: { left, right: right - 1 },
          visualization: makeViz({ [left]: 'pointer', [right]: 'mismatch' }, { [left]: 'L', [right]: 'R--' }),
        });
        right--;
      }
    }

    steps.push({
      line: 10,
      explanation: `Maximum water contained: ${maxWater} (between indices ${bestLeft} and ${bestRight}).`,
      variables: { maxWater, bestLeft, bestRight },
      visualization: makeViz({ [bestLeft]: 'found', [bestRight]: 'found' }, { [bestLeft]: 'best-L', [bestRight]: 'best-R' }),
    });

    return steps;
  },
};

export default containerWithMostWaterIi;

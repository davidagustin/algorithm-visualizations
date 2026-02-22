import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const largestContainer: AlgorithmDefinition = {
  id: 'largest-container',
  title: 'Container With Most Water',
  leetcodeNumber: 11,
  difficulty: 'Medium',
  category: 'Two Pointers',
  description:
    'Given n non-negative integers representing the heights of vertical lines, find two lines that together with the x-axis form a container that holds the most water. Uses two pointers starting from both ends, always moving the shorter line inward.',
  tags: ['two pointers', 'array', 'greedy'],

  code: {
    pseudocode: `function maxArea(height):
  left = 0
  right = length(height) - 1
  maxWater = 0
  while left < right:
    w = right - left
    h = min(height[left], height[right])
    area = w * h
    maxWater = max(maxWater, area)
    if height[left] < height[right]:
      left++
    else:
      right--
  return maxWater`,

    python: `def maxArea(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    max_water = 0
    while left < right:
        w = right - left
        h = min(height[left], height[right])
        area = w * h
        max_water = max(max_water, area)
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_water`,

    javascript: `function maxArea(height) {
  let left = 0, right = height.length - 1;
  let maxWater = 0;
  while (left < right) {
    const w = right - left;
    const h = Math.min(height[left], height[right]);
    const area = w * h;
    maxWater = Math.max(maxWater, area);
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  return maxWater;
}`,

    java: `public int maxArea(int[] height) {
    int left = 0, right = height.length - 1;
    int maxWater = 0;
    while (left < right) {
        int w = right - left;
        int h = Math.min(height[left], height[right]);
        int area = w * h;
        maxWater = Math.max(maxWater, area);
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
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
    let bestRight = 0;

    // Step: Initialize
    steps.push({
      line: 2,
      explanation: `Initialize left = 0 (height ${height[0]}), right = ${right} (height ${height[right]}), maxWater = 0.`,
      variables: { left, right, maxWater },
      visualization: makeViz(
        { [left]: 'pointer', [right]: 'pointer' },
        { [left]: 'L', [right]: 'R' }
      ),
    });

    while (left < right) {
      const w = right - left;
      const h = Math.min(height[left], height[right]);
      const area = w * h;

      // Step: Compute area
      const computeHighlights: Record<number, string> = {};
      for (let k = left; k <= right; k++) {
        computeHighlights[k] = 'active';
      }
      computeHighlights[left] = 'comparing';
      computeHighlights[right] = 'comparing';

      steps.push({
        line: 7,
        explanation: `Width = ${right} - ${left} = ${w}. Height = min(${height[left]}, ${height[right]}) = ${h}. Area = ${w} * ${h} = ${area}.`,
        variables: { left, right, width: w, height_val: h, area, maxWater },
        visualization: makeViz(
          computeHighlights,
          { [left]: `L(${height[left]})`, [right]: `R(${height[right]})` }
        ),
      });

      if (area > maxWater) {
        maxWater = area;
        bestLeft = left;
        bestRight = right;

        steps.push({
          line: 8,
          explanation: `New max area! maxWater = ${maxWater} (between indices ${left} and ${right}).`,
          variables: { maxWater, bestLeft, bestRight },
          visualization: makeViz(
            { [left]: 'found', [right]: 'found' },
            { [left]: 'L', [right]: 'R' }
          ),
        });
      }

      // Move pointer
      if (height[left] < height[right]) {
        steps.push({
          line: 10,
          explanation: `height[${left}] = ${height[left]} < height[${right}] = ${height[right]}. Move left pointer right to find a taller line.`,
          variables: { left, right, maxWater },
          visualization: makeViz(
            { [left]: 'active', [right]: 'pointer' },
            { [left]: 'L++', [right]: 'R' }
          ),
        });
        left++;
      } else {
        steps.push({
          line: 12,
          explanation: `height[${left}] = ${height[left]} >= height[${right}] = ${height[right]}. Move right pointer left to find a taller line.`,
          variables: { left, right, maxWater },
          visualization: makeViz(
            { [left]: 'pointer', [right]: 'active' },
            { [left]: 'L', [right]: 'R--' }
          ),
        });
        right--;
      }
    }

    // Final result
    steps.push({
      line: 13,
      explanation: `Done! Maximum water = ${maxWater}, formed between indices ${bestLeft} and ${bestRight}.`,
      variables: { maxWater, bestLeft, bestRight, result: maxWater },
      visualization: makeViz(
        { [bestLeft]: 'found', [bestRight]: 'found' },
        { [bestLeft]: 'best L', [bestRight]: 'best R' }
      ),
    });

    return steps;
  },
};

export default largestContainer;

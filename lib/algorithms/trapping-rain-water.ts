import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const trappingRainWater: AlgorithmDefinition = {
  id: 'trapping-rain-water',
  title: 'Trapping Rain Water',
  leetcodeNumber: 42,
  difficulty: 'Hard',
  category: 'Two Pointers',
  description:
    'Given n non-negative integers representing elevation heights, compute how much water it can trap after raining. Uses two pointers from both ends, tracking left and right maximums to calculate trapped water at each position.',
  tags: ['two pointers', 'array', 'dynamic programming', 'stack'],

  code: {
    pseudocode: `function trap(height):
  left = 0, right = length(height) - 1
  leftMax = 0, rightMax = 0
  water = 0
  while left < right:
    if height[left] < height[right]:
      if height[left] >= leftMax:
        leftMax = height[left]
      else:
        water += leftMax - height[left]
      left++
    else:
      if height[right] >= rightMax:
        rightMax = height[right]
      else:
        water += rightMax - height[right]
      right--
  return water`,

    python: `def trap(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    left_max, right_max = 0, 0
    water = 0
    while left < right:
        if height[left] < height[right]:
            if height[left] >= left_max:
                left_max = height[left]
            else:
                water += left_max - height[left]
            left += 1
        else:
            if height[right] >= right_max:
                right_max = height[right]
            else:
                water += right_max - height[right]
            right -= 1
    return water`,

    javascript: `function trap(height) {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0;
  let water = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) leftMax = height[left];
      else water += leftMax - height[left];
      left++;
    } else {
      if (height[right] >= rightMax) rightMax = height[right];
      else water += rightMax - height[right];
      right--;
    }
  }
  return water;
}`,

    java: `public int trap(int[] height) {
    int left = 0, right = height.length - 1;
    int leftMax = 0, rightMax = 0, water = 0;
    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= leftMax) leftMax = height[left];
            else water += leftMax - height[left];
            left++;
        } else {
            if (height[right] >= rightMax) rightMax = height[right];
            else water += rightMax - height[right];
            right--;
        }
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
      label: 'Height Array',
      type: 'array',
      defaultValue: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
      placeholder: '0,1,0,2,1,0,1,3,2,1,2,1',
      helperText: 'Non-negative integers representing bar heights',
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

    steps.push({
      line: 1,
      explanation: `Height array: [${height.join(', ')}]. We'll use two pointers to compute trapped water without extra space.`,
      variables: { height: [...height] },
      visualization: makeViz({}, {}),
    });

    let left = 0;
    let right = height.length - 1;
    let leftMax = 0;
    let rightMax = 0;
    let water = 0;

    steps.push({
      line: 2,
      explanation: `Initialize: left = 0, right = ${right}, leftMax = 0, rightMax = 0, water = 0.`,
      variables: { left, right, leftMax, rightMax, water },
      visualization: makeViz(
        { [left]: 'pointer', [right]: 'pointer' },
        { [left]: 'L', [right]: 'R' }
      ),
    });

    while (left < right) {
      if (height[left] < height[right]) {
        if (height[left] >= leftMax) {
          leftMax = height[left];
          steps.push({
            line: 7,
            explanation: `height[${left}] = ${height[left]} >= leftMax = ${leftMax - height[left] === 0 ? leftMax : leftMax}. Update leftMax to ${leftMax}.`,
            variables: { left, right, leftMax, rightMax, water, 'height[left]': height[left] },
            visualization: makeViz(
              { [left]: 'active', [right]: 'pointer' },
              { [left]: 'max', [right]: 'R' }
            ),
          });
        } else {
          const trapped = leftMax - height[left];
          water += trapped;
          steps.push({
            line: 9,
            explanation: `height[${left}] = ${height[left]} < leftMax = ${leftMax}. Trap ${trapped} units of water here. Total water = ${water}.`,
            variables: { left, right, leftMax, rightMax, water, trapped, 'height[left]': height[left] },
            visualization: makeViz(
              { [left]: 'found', [right]: 'pointer' },
              { [left]: `+${trapped}`, [right]: 'R' }
            ),
          });
        }
        left++;
        steps.push({
          line: 10,
          explanation: `Move left pointer right to ${left}.`,
          variables: { left, right, leftMax, rightMax, water },
          visualization: makeViz(
            { [left]: 'pointer', [right]: 'pointer' },
            { [left]: 'L', [right]: 'R' }
          ),
        });
      } else {
        if (height[right] >= rightMax) {
          rightMax = height[right];
          steps.push({
            line: 12,
            explanation: `height[${right}] = ${height[right]} >= rightMax. Update rightMax to ${rightMax}.`,
            variables: { left, right, leftMax, rightMax, water, 'height[right]': height[right] },
            visualization: makeViz(
              { [left]: 'pointer', [right]: 'active' },
              { [left]: 'L', [right]: 'max' }
            ),
          });
        } else {
          const trapped = rightMax - height[right];
          water += trapped;
          steps.push({
            line: 14,
            explanation: `height[${right}] = ${height[right]} < rightMax = ${rightMax}. Trap ${trapped} units of water here. Total water = ${water}.`,
            variables: { left, right, leftMax, rightMax, water, trapped, 'height[right]': height[right] },
            visualization: makeViz(
              { [left]: 'pointer', [right]: 'found' },
              { [left]: 'L', [right]: `+${trapped}` }
            ),
          });
        }
        right--;
        steps.push({
          line: 15,
          explanation: `Move right pointer left to ${right}.`,
          variables: { left, right, leftMax, rightMax, water },
          visualization: makeViz(
            { [left]: 'pointer', [right]: 'pointer' },
            { [left]: 'L', [right]: 'R' }
          ),
        });
      }
    }

    steps.push({
      line: 16,
      explanation: `Pointers met. Total trapped water = ${water} units.`,
      variables: { water, leftMax, rightMax },
      visualization: makeViz(
        Object.fromEntries(height.map((_, i) => [i, 'sorted'])),
        {}
      ),
    });

    return steps;
  },
};

export default trappingRainWater;

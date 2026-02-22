import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const trappingRainWaterTwoPointer: AlgorithmDefinition = {
  id: 'trapping-rain-water-two-pointer',
  title: 'Trapping Rain Water (Two Pointer)',
  leetcodeNumber: 42,
  difficulty: 'Hard',
  category: 'Two Pointers',
  description:
    'Calculate how much water is trapped after raining given elevation heights. Two pointer approach: maintain left and right pointers with maxLeft and maxRight. Move the pointer with the smaller max inward, adding water trapped at that position (max - height[ptr]).',
  tags: ['two pointers', 'array', 'dynamic programming'],

  code: {
    pseudocode: `function trap(height):
  left = 0, right = n-1
  maxLeft = maxRight = 0
  water = 0
  while left < right:
    if height[left] < height[right]:
      if height[left] >= maxLeft: maxLeft = height[left]
      else: water += maxLeft - height[left]
      left++
    else:
      if height[right] >= maxRight: maxRight = height[right]
      else: water += maxRight - height[right]
      right--
  return water`,

    python: `def trap(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    max_left = max_right = 0
    water = 0
    while left < right:
        if height[left] < height[right]:
            if height[left] >= max_left:
                max_left = height[left]
            else:
                water += max_left - height[left]
            left += 1
        else:
            if height[right] >= max_right:
                max_right = height[right]
            else:
                water += max_right - height[right]
            right -= 1
    return water`,

    javascript: `function trap(height) {
  let left = 0, right = height.length - 1;
  let maxLeft = 0, maxRight = 0, water = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= maxLeft) maxLeft = height[left];
      else water += maxLeft - height[left];
      left++;
    } else {
      if (height[right] >= maxRight) maxRight = height[right];
      else water += maxRight - height[right];
      right--;
    }
  }
  return water;
}`,

    java: `public int trap(int[] height) {
    int left = 0, right = height.length - 1;
    int maxLeft = 0, maxRight = 0, water = 0;
    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= maxLeft) maxLeft = height[left];
            else water += maxLeft - height[left];
            left++;
        } else {
            if (height[right] >= maxRight) maxRight = height[right];
            else water += maxRight - height[right];
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
      helperText: 'Comma-separated non-negative integers representing elevation heights',
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
    let maxLeft = 0;
    let maxRight = 0;
    let water = 0;

    steps.push({
      line: 1,
      explanation: `Initialize left=${left}, right=${right}, maxLeft=0, maxRight=0, water=0.`,
      variables: { left, right, maxLeft, maxRight, water },
      visualization: makeViz({ [left]: 'pointer', [right]: 'pointer' }, { [left]: 'L', [right]: 'R' }),
    });

    while (left < right) {
      if (height[left] < height[right]) {
        if (height[left] >= maxLeft) {
          maxLeft = height[left];
          steps.push({
            line: 6,
            explanation: `height[${left}]=${height[left]} >= maxLeft=${maxLeft - height[left] === 0 ? maxLeft : maxLeft}. Update maxLeft=${maxLeft}.`,
            variables: { left, right, 'height[left]': height[left], maxLeft, water },
            visualization: makeViz({ [left]: 'active', [right]: 'pointer' }, { [left]: `maxL=${maxLeft}`, [right]: 'R' }),
          });
        } else {
          const trapped = maxLeft - height[left];
          water += trapped;
          steps.push({
            line: 7,
            explanation: `height[${left}]=${height[left]} < maxLeft=${maxLeft}. Trap ${trapped} units. Total water=${water}.`,
            variables: { left, 'height[left]': height[left], maxLeft, trapped, water },
            visualization: makeViz({ [left]: 'found', [right]: 'pointer' }, { [left]: `+${trapped}`, [right]: 'R' }),
          });
        }
        left++;
      } else {
        if (height[right] >= maxRight) {
          maxRight = height[right];
          steps.push({
            line: 11,
            explanation: `height[${right}]=${height[right]} >= maxRight=${maxRight}. Update maxRight=${maxRight}.`,
            variables: { left, right, 'height[right]': height[right], maxRight, water },
            visualization: makeViz({ [left]: 'pointer', [right]: 'active' }, { [left]: 'L', [right]: `maxR=${maxRight}` }),
          });
        } else {
          const trapped = maxRight - height[right];
          water += trapped;
          steps.push({
            line: 12,
            explanation: `height[${right}]=${height[right]} < maxRight=${maxRight}. Trap ${trapped} units. Total water=${water}.`,
            variables: { right, 'height[right]': height[right], maxRight, trapped, water },
            visualization: makeViz({ [left]: 'pointer', [right]: 'found' }, { [left]: 'L', [right]: `+${trapped}` }),
          });
        }
        right--;
      }
    }

    steps.push({
      line: 13,
      explanation: `Pointers met. Total trapped water: ${water} units.`,
      variables: { water },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default trappingRainWaterTwoPointer;

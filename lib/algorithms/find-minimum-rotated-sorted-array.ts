import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findMinimumRotatedSortedArray: AlgorithmDefinition = {
  id: 'find-minimum-rotated-sorted-array',
  title: 'Find Minimum in Rotated Sorted Array',
  leetcodeNumber: 153,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Find the minimum element in a sorted array that has been rotated at an unknown pivot. Use binary search: if the left half is sorted, the minimum is either in the right half or at left; otherwise it is in the left half. Achieves O(log n) time.',
  tags: ['binary search', 'array', 'rotated', 'minimum'],

  code: {
    pseudocode: `function findMin(nums):
  left = 0, right = n - 1
  while left < right:
    mid = left + (right - left) / 2
    if nums[mid] > nums[right]:
      left = mid + 1
    else:
      right = mid
  return nums[left]`,

    python: `def findMin(nums: list[int]) -> int:
    left, right = 0, len(nums) - 1
    while left < right:
        mid = left + (right - left) // 2
        if nums[mid] > nums[right]:
            left = mid + 1
        else:
            right = mid
    return nums[left]`,

    javascript: `function findMin(nums) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] > nums[right]) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  return nums[left];
}`,

    java: `public int findMin(int[] nums) {
    int left = 0, right = nums.length - 1;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] > nums[right]) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    return nums[left];
}`,
  },

  defaultInput: {
    nums: [4, 5, 6, 7, 0, 1, 2],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Rotated Sorted Array',
      type: 'array',
      defaultValue: [4, 5, 6, 7, 0, 1, 2],
      placeholder: '4,5,6,7,0,1,2',
      helperText: 'Comma-separated rotated sorted distinct integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    const eliminated = new Set<number>();

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => {
      const merged: Record<number, string> = {};
      eliminated.forEach((idx) => { merged[idx] = 'visited'; });
      for (const [k, v] of Object.entries(highlights)) {
        merged[Number(k)] = v;
      }
      return { type: 'array', array: [...nums], highlights: merged, labels };
    };

    let left = 0;
    let right = n - 1;

    steps.push({
      line: 2,
      explanation: `Initialize left=0 (${nums[0]}), right=${right} (${nums[right]}). Find the rotation pivot.`,
      variables: { left, right },
      visualization: makeViz(
        { [left]: 'pointer', [right]: 'pointer' },
        { [left]: 'L', [right]: 'R' }
      ),
    });

    while (left < right) {
      const mid = left + Math.floor((right - left) / 2);

      steps.push({
        line: 4,
        explanation: `mid = ${mid}, nums[mid] = ${nums[mid]}, nums[right] = ${nums[right]}.`,
        variables: { left, right, mid, 'nums[mid]': nums[mid], 'nums[right]': nums[right] },
        visualization: makeViz(
          { [left]: 'pointer', [right]: 'pointer', [mid]: 'active' },
          { [left]: 'L', [right]: 'R', [mid]: 'mid' }
        ),
      });

      if (nums[mid] > nums[right]) {
        steps.push({
          line: 5,
          explanation: `nums[mid]=${nums[mid]} > nums[right]=${nums[right]}: rotation is in right half. Min must be right of mid. Set left = ${mid + 1}.`,
          variables: { left: mid + 1, right, decision: 'search right half' },
          visualization: makeViz(
            { [mid]: 'comparing', [right]: 'comparing' },
            { [left]: 'L', [right]: 'R', [mid]: 'mid' }
          ),
        });
        for (let i = left; i <= mid; i++) eliminated.add(i);
        left = mid + 1;
      } else {
        steps.push({
          line: 7,
          explanation: `nums[mid]=${nums[mid]} <= nums[right]=${nums[right]}: right half is sorted, min is in left half or at mid. Set right = ${mid}.`,
          variables: { left, right: mid, decision: 'search left half (include mid)' },
          visualization: makeViz(
            { [mid]: 'comparing', [right]: 'comparing' },
            { [left]: 'L', [right]: 'R', [mid]: 'mid' }
          ),
        });
        for (let i = mid + 1; i <= right; i++) eliminated.add(i);
        right = mid;
      }

      if (left < right) {
        steps.push({
          line: 3,
          explanation: `New range: left=${left} (${nums[left]}), right=${right} (${nums[right]}).`,
          variables: { left, right },
          visualization: makeViz(
            { [left]: 'pointer', [right]: 'pointer' },
            { [left]: 'L', [right]: 'R' }
          ),
        });
      }
    }

    steps.push({
      line: 8,
      explanation: `left == right == ${left}. Minimum element is nums[${left}] = ${nums[left]}.`,
      variables: { result: nums[left], index: left },
      visualization: makeViz({ [left]: 'found' }, { [left]: 'min' }),
    });

    return steps;
  },
};

export default findMinimumRotatedSortedArray;

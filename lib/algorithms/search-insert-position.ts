import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const searchInsertPosition: AlgorithmDefinition = {
  id: 'search-insert-position',
  title: 'Search Insert Position',
  leetcodeNumber: 35,
  difficulty: 'Easy',
  category: 'Binary Search',
  description:
    'Given a sorted array and a target value, return the index if the target is found. If not found, return the index where it would be inserted to keep the array sorted. Uses binary search for O(log n) time complexity with step-by-step tracking.',
  tags: ['binary search', 'array', 'sorted'],

  code: {
    pseudocode: `function searchInsert(nums, target):
  left = 0
  right = length(nums) - 1
  while left <= right:
    mid = (left + right) / 2
    if nums[mid] == target:
      return mid
    else if nums[mid] < target:
      left = mid + 1
    else:
      right = mid - 1
  return left`,

    python: `def searchInsert(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return left`,

    javascript: `function searchInsert(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    else if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return left;
}`,

    java: `public int searchInsert(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left <= right) {
        int mid = (left + right) / 2;
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return left;
}`,
  },

  defaultInput: {
    nums: [1, 3, 5, 6, 8, 10],
    target: 5,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Sorted Array',
      type: 'array',
      defaultValue: [1, 3, 5, 6, 8, 10],
      placeholder: '1,3,5,6,8,10',
      helperText: 'Comma-separated sorted integers',
    },
    {
      name: 'target',
      label: 'Target',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Value to search or insert',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    let left = 0;
    let right = nums.length - 1;

    steps.push({
      line: 1,
      explanation: `Initialize binary search. left=0, right=${right}, target=${target}.`,
      variables: { left, right, target },
      visualization: makeViz(
        { [left]: 'pointer', [right]: 'pointer' },
        { [left]: 'L', [right]: 'R' }
      ),
    });

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      steps.push({
        line: 4,
        explanation: `Compute mid = floor((${left}+${right})/2) = ${mid}. nums[${mid}]=${nums[mid]}.`,
        variables: { left, right, mid, 'nums[mid]': nums[mid], target },
        visualization: makeViz(
          { [left]: 'active', [right]: 'active', [mid]: 'comparing' },
          { [left]: 'L', [right]: 'R', [mid]: 'mid' }
        ),
      });

      if (nums[mid] === target) {
        steps.push({
          line: 6,
          explanation: `nums[${mid}]=${nums[mid]} equals target=${target}. Target found at index ${mid}.`,
          variables: { left, right, mid, result: mid },
          visualization: makeViz(
            { [mid]: 'found' },
            { [mid]: `ans=${mid}` }
          ),
        });
        return steps;
      } else if (nums[mid] < target) {
        steps.push({
          line: 8,
          explanation: `nums[${mid}]=${nums[mid]} < target=${target}. Move left to mid+1=${mid + 1}.`,
          variables: { left, right, mid, 'nums[mid]': nums[mid], target },
          visualization: makeViz(
            { [mid]: 'mismatch', [right]: 'pointer' },
            { [mid]: 'mid', [right]: 'R' }
          ),
        });
        left = mid + 1;
      } else {
        steps.push({
          line: 10,
          explanation: `nums[${mid}]=${nums[mid]} > target=${target}. Move right to mid-1=${mid - 1}.`,
          variables: { left, right, mid, 'nums[mid]': nums[mid], target },
          visualization: makeViz(
            { [left]: 'pointer', [mid]: 'mismatch' },
            { [left]: 'L', [mid]: 'mid' }
          ),
        });
        right = mid - 1;
      }
    }

    steps.push({
      line: 11,
      explanation: `Search ended. Target not found. Insert position is left=${left}.`,
      variables: { left, right, result: left },
      visualization: makeViz({}, { [left]: `ins=${left}` }),
    });

    return steps;
  },
};

export default searchInsertPosition;

import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const localMaximaInArray: AlgorithmDefinition = {
  id: 'local-maxima-in-array',
  title: 'Local Maxima in Array (Find Peak Element)',
  leetcodeNumber: 162,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Find a peak element in an array where nums[i] != nums[i+1]. A peak is an element greater than its neighbors. Use binary search on the gradient: if nums[mid] < nums[mid+1], the peak is to the right; otherwise it is to the left (or at mid). O(log n) time.',
  tags: ['Binary Search', 'Array', 'Peak Finding'],
  code: {
    pseudocode: `function findPeakElement(nums):
  left = 0, right = n - 1
  while left < right:
    mid = left + (right - left) / 2
    if nums[mid] < nums[mid + 1]:
      left = mid + 1
    else:
      right = mid
  return left`,
    python: `def findPeakElement(nums):
    left, right = 0, len(nums) - 1
    while left < right:
        mid = left + (right - left) // 2
        if nums[mid] < nums[mid + 1]:
            left = mid + 1
        else:
            right = mid
    return left`,
    javascript: `function findPeakElement(nums) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] < nums[mid + 1]) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  return left;
}`,
    java: `public int findPeakElement(int[] nums) {
    int left = 0, right = nums.length - 1;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] < nums[mid + 1]) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    return left;
}`,
  },
  defaultInput: { nums: [1, 2, 3, 1] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 3, 1],
      placeholder: '1,2,3,1',
      helperText: 'Comma-separated integers where adjacent elements differ',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    let left = 0;
    let right = n - 1;

    steps.push({
      line: 2,
      explanation: `Find a peak element in [${nums.join(', ')}]. Initialize left=0, right=${right}.`,
      variables: { left, right },
      visualization: makeViz(
        { [left]: 'pointer', [right]: 'pointer' },
        { [left]: 'L', [right]: 'R' },
      ),
    });

    while (left < right) {
      const mid = left + Math.floor((right - left) / 2);

      steps.push({
        line: 4,
        explanation: `mid = ${mid}. Compare nums[${mid}]=${nums[mid]} with nums[${mid + 1}]=${nums[mid + 1]}.`,
        variables: { left, right, mid, 'nums[mid]': nums[mid], 'nums[mid+1]': nums[mid + 1] },
        visualization: makeViz(
          { [left]: 'pointer', [right]: 'pointer', [mid]: 'active', [mid + 1]: 'comparing' },
          { [left]: 'L', [right]: 'R', [mid]: 'mid', [mid + 1]: 'mid+1' },
        ),
      });

      if (nums[mid] < nums[mid + 1]) {
        steps.push({
          line: 6,
          explanation: `nums[${mid}]=${nums[mid]} < nums[${mid + 1}]=${nums[mid + 1]}. Ascending slope: peak is to the RIGHT. left = ${mid + 1}.`,
          variables: { left: mid + 1, right, direction: 'right' },
          visualization: makeViz(
            { [mid + 1]: 'pointer', [right]: 'pointer', [mid]: 'visited' },
            { [mid + 1]: 'L', [right]: 'R' },
          ),
        });
        left = mid + 1;
      } else {
        steps.push({
          line: 8,
          explanation: `nums[${mid}]=${nums[mid]} > nums[${mid + 1}]=${nums[mid + 1]}. Descending slope: peak is at mid or LEFT. right = ${mid}.`,
          variables: { left, right: mid, direction: 'left/mid' },
          visualization: makeViz(
            { [left]: 'pointer', [mid]: 'pointer' },
            { [left]: 'L', [mid]: 'R' },
          ),
        });
        right = mid;
      }
    }

    steps.push({
      line: 9,
      explanation: `left == right == ${left}. Peak element found at index ${left} with value ${nums[left]}.`,
      variables: { peakIndex: left, peakValue: nums[left] },
      visualization: makeViz(
        { [left]: 'found' },
        { [left]: 'peak' },
      ),
    });

    return steps;
  },
};

export default localMaximaInArray;

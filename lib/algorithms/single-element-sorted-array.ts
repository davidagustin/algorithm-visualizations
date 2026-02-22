import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const singleElementSortedArray: AlgorithmDefinition = {
  id: 'single-element-sorted-array',
  title: 'Single Element in a Sorted Array',
  leetcodeNumber: 540,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Find the single element in a sorted array where every other element appears exactly twice. Use binary search: at each mid, check the pairing to determine which side the single element is on. Works in O(log n) time and O(1) space.',
  tags: ['binary search', 'array', 'sorted', 'bit manipulation'],

  code: {
    pseudocode: `function singleNonDuplicate(nums):
  left = 0, right = n - 1
  while left < right:
    mid = left + (right - left) / 2
    if mid % 2 == 1: mid -= 1
    if nums[mid] == nums[mid + 1]:
      left = mid + 2
    else:
      right = mid
  return nums[left]`,

    python: `def singleNonDuplicate(nums: list[int]) -> int:
    left, right = 0, len(nums) - 1
    while left < right:
        mid = left + (right - left) // 2
        if mid % 2 == 1:
            mid -= 1
        if nums[mid] == nums[mid + 1]:
            left = mid + 2
        else:
            right = mid
    return nums[left]`,

    javascript: `function singleNonDuplicate(nums) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    let mid = left + Math.floor((right - left) / 2);
    if (mid % 2 === 1) mid--;
    if (nums[mid] === nums[mid + 1]) {
      left = mid + 2;
    } else {
      right = mid;
    }
  }
  return nums[left];
}`,

    java: `public int singleNonDuplicate(int[] nums) {
    int left = 0, right = nums.length - 1;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (mid % 2 == 1) mid--;
        if (nums[mid] == nums[mid + 1]) {
            left = mid + 2;
        } else {
            right = mid;
        }
    }
    return nums[left];
}`,
  },

  defaultInput: {
    nums: [1, 1, 2, 3, 3, 4, 4, 8, 8],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Sorted Array',
      type: 'array',
      defaultValue: [1, 1, 2, 3, 3, 4, 4, 8, 8],
      placeholder: '1,1,2,3,3,4,4,8,8',
      helperText: 'Odd-length sorted array where all but one element appear twice',
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
      explanation: `Initialize left=0, right=${right}. All pairs are intact on even/odd indices. Find the singleton.`,
      variables: { left, right },
      visualization: makeViz(
        { [left]: 'pointer', [right]: 'pointer' },
        { [left]: 'L', [right]: 'R' }
      ),
    });

    while (left < right) {
      let mid = left + Math.floor((right - left) / 2);
      const originalMid = mid;

      steps.push({
        line: 4,
        explanation: `mid = ${mid}${mid % 2 === 1 ? ' (odd, adjust to ' + (mid - 1) + ')' : ' (even, no adjustment)'}. Check nums[mid] vs nums[mid+1].`,
        variables: { left, right, mid: originalMid },
        visualization: makeViz(
          { [left]: 'pointer', [right]: 'pointer', [mid]: 'active' },
          { [left]: 'L', [right]: 'R', [mid]: 'mid' }
        ),
      });

      if (mid % 2 === 1) mid--;

      steps.push({
        line: 5,
        explanation: `Even mid = ${mid}. nums[${mid}]=${nums[mid]}, nums[${mid + 1}]=${nums[mid + 1]}.`,
        variables: { mid, 'nums[mid]': nums[mid], 'nums[mid+1]': nums[mid + 1] },
        visualization: makeViz(
          { [left]: 'pointer', [right]: 'pointer', [mid]: 'comparing', [mid + 1]: 'comparing' },
          { [left]: 'L', [right]: 'R', [mid]: `${mid}`, [mid + 1]: `${mid + 1}` }
        ),
      });

      if (nums[mid] === nums[mid + 1]) {
        steps.push({
          line: 6,
          explanation: `nums[${mid}] == nums[${mid + 1}] = ${nums[mid]}: pair is intact. Single element is to the right. Set left = ${mid + 2}.`,
          variables: { left: mid + 2, right, pairIntact: true },
          visualization: makeViz(
            { [mid]: 'sorted', [mid + 1]: 'sorted' },
            { [left]: 'L', [right]: 'R' }
          ),
        });
        for (let i = left; i <= mid + 1; i++) eliminated.add(i);
        left = mid + 2;
      } else {
        steps.push({
          line: 8,
          explanation: `nums[${mid}] != nums[${mid + 1}] (${nums[mid]} vs ${nums[mid + 1]}): pair is broken. Single element is here or to the left. Set right = ${mid}.`,
          variables: { left, right: mid, pairBroken: true },
          visualization: makeViz(
            { [mid]: 'mismatch', [mid + 1]: 'mismatch' },
            { [left]: 'L', [right]: 'R' }
          ),
        });
        for (let i = mid + 1; i <= right; i++) eliminated.add(i);
        right = mid;
      }

      if (left < right) {
        steps.push({
          line: 2,
          explanation: `New range: [${left}, ${right}].`,
          variables: { left, right },
          visualization: makeViz(
            { [left]: 'pointer', [right]: 'pointer' },
            { [left]: 'L', [right]: 'R' }
          ),
        });
      }
    }

    steps.push({
      line: 9,
      explanation: `left == right == ${left}. The single element is nums[${left}] = ${nums[left]}.`,
      variables: { result: nums[left], index: left },
      visualization: makeViz({ [left]: 'found' }, { [left]: 'single' }),
    });

    return steps;
  },
};

export default singleElementSortedArray;

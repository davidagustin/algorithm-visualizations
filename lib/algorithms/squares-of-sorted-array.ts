import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const squaresOfSortedArray: AlgorithmDefinition = {
  id: 'squares-of-sorted-array',
  title: 'Squares of a Sorted Array',
  leetcodeNumber: 977,
  difficulty: 'Easy',
  category: 'Two Pointers',
  description:
    'Given an integer array sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order. Use two pointers from both ends — the largest squares are at the extremes.',
  tags: ['two pointers', 'array', 'sorting', 'squares'],

  code: {
    pseudocode: `function sortedSquares(nums):
  n = length(nums)
  result = array of size n
  left = 0, right = n - 1
  pos = n - 1
  while left <= right:
    leftSq = nums[left] * nums[left]
    rightSq = nums[right] * nums[right]
    if leftSq > rightSq:
      result[pos] = leftSq
      left++
    else:
      result[pos] = rightSq
      right--
    pos--
  return result`,

    python: `def sortedSquares(nums: list[int]) -> list[int]:
    n = len(nums)
    result = [0] * n
    left, right = 0, n - 1
    pos = n - 1
    while left <= right:
        left_sq = nums[left] ** 2
        right_sq = nums[right] ** 2
        if left_sq > right_sq:
            result[pos] = left_sq
            left += 1
        else:
            result[pos] = right_sq
            right -= 1
        pos -= 1
    return result`,

    javascript: `function sortedSquares(nums) {
  const n = nums.length;
  const result = new Array(n);
  let left = 0, right = n - 1, pos = n - 1;
  while (left <= right) {
    const leftSq = nums[left] ** 2;
    const rightSq = nums[right] ** 2;
    if (leftSq > rightSq) {
      result[pos] = leftSq;
      left++;
    } else {
      result[pos] = rightSq;
      right--;
    }
    pos--;
  }
  return result;
}`,

    java: `public int[] sortedSquares(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    int left = 0, right = n - 1, pos = n - 1;
    while (left <= right) {
        int leftSq = nums[left] * nums[left];
        int rightSq = nums[right] * nums[right];
        if (leftSq > rightSq) {
            result[pos] = leftSq;
            left++;
        } else {
            result[pos] = rightSq;
            right--;
        }
        pos--;
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [-4, -1, 0, 3, 10],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Sorted Array',
      type: 'array',
      defaultValue: [-4, -1, 0, 3, 10],
      placeholder: '-4,-1,0,3,10',
      helperText: 'Comma-separated sorted integers (may include negatives)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const n = nums.length;
    const result = new Array(n).fill(0);
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      arr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Input array: [${nums.join(', ')}]. Squares of negatives can be larger, so we use two pointers from ends.`,
      variables: { nums: [...nums] },
      visualization: makeViz(nums, {}, {}),
    });

    steps.push({
      line: 4,
      explanation: `Initialize: left = 0, right = ${n - 1}, pos = ${n - 1} (fill result from the back with largest squares first).`,
      variables: { left: 0, right: n - 1, pos: n - 1, result: [...result] },
      visualization: makeViz(nums, { [0]: 'pointer', [n - 1]: 'pointer' }, { [0]: 'L', [n - 1]: 'R' }),
    });

    let left = 0;
    let right = n - 1;
    let pos = n - 1;

    while (left <= right) {
      const leftSq = nums[left] * nums[left];
      const rightSq = nums[right] * nums[right];

      steps.push({
        line: 7,
        explanation: `Compare: nums[${left}]² = ${nums[left]}² = ${leftSq} vs nums[${right}]² = ${nums[right]}² = ${rightSq}.`,
        variables: { left, right, pos, leftSq, rightSq },
        visualization: makeViz(nums, { [left]: 'comparing', [right]: 'comparing' }, { [left]: 'L', [right]: 'R' }),
      });

      if (leftSq > rightSq) {
        result[pos] = leftSq;
        steps.push({
          line: 10,
          explanation: `Left square ${leftSq} > right square ${rightSq}. Place ${leftSq} at result[${pos}]. Move left right.`,
          variables: { left, right, pos, placed: leftSq, result: [...result] },
          visualization: makeViz(nums, { [left]: 'found', [right]: 'pointer' }, { [left]: `sq=${leftSq}`, [right]: 'R' }),
        });
        left++;
      } else {
        result[pos] = rightSq;
        steps.push({
          line: 13,
          explanation: `Right square ${rightSq} >= left square ${leftSq}. Place ${rightSq} at result[${pos}]. Move right left.`,
          variables: { left, right, pos, placed: rightSq, result: [...result] },
          visualization: makeViz(nums, { [left]: 'pointer', [right]: 'found' }, { [left]: 'L', [right]: `sq=${rightSq}` }),
        });
        right--;
      }
      pos--;
    }

    steps.push({
      line: 15,
      explanation: `Done! Sorted squares: [${result.join(', ')}].`,
      variables: { result: [...result] },
      visualization: makeViz(result, Object.fromEntries(result.map((_, i) => [i, 'sorted'])), {}),
    });

    return steps;
  },
};

export default squaresOfSortedArray;

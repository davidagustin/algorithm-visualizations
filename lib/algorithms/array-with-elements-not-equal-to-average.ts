import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const arrayWithElementsNotEqualToAverage: AlgorithmDefinition = {
  id: 'array-with-elements-not-equal-to-average',
  title: 'Array With Elements Not Equal to Average of Neighbors',
  leetcodeNumber: 1968,
  difficulty: 'Medium',
  category: 'Two Pointers',
  description:
    'Rearrange a distinct array such that no element equals the average of its neighbors. Sort the array, then interleave the smaller half and larger half: place elements at even indices from the smaller half and odd indices from the larger half.',
  tags: ['two pointers', 'array', 'sorting', 'greedy'],

  code: {
    pseudocode: `function rearrangeArray(nums):
  sort(nums)
  n = length(nums)
  result = new array[n]
  mid = n / 2
  j = 0
  for i = 0 to mid-1:
    result[j] = nums[i]         // smaller half at even indices
    result[j+1] = nums[i+mid]   // larger half at odd indices
    j += 2
  if n is odd: result[n-1] = nums[n-1]
  return result`,

    python: `def rearrangeArray(nums: list[int]) -> list[int]:
    nums.sort()
    n = len(nums)
    result = [0] * n
    mid = n // 2
    j = 0
    for i in range(mid):
        result[j] = nums[i]
        result[j+1] = nums[i+mid]
        j += 2
    if n % 2 == 1:
        result[n-1] = nums[n-1]
    return result`,

    javascript: `function rearrangeArray(nums) {
  nums.sort((a, b) => a - b);
  const n = nums.length, result = new Array(n);
  const mid = Math.floor(n / 2);
  let j = 0;
  for (let i = 0; i < mid; i++) {
    result[j] = nums[i];
    result[j+1] = nums[i+mid];
    j += 2;
  }
  if (n % 2 === 1) result[n-1] = nums[n-1];
  return result;
}`,

    java: `public int[] rearrangeArray(int[] nums) {
    Arrays.sort(nums);
    int n = nums.length;
    int[] result = new int[n];
    int mid = n / 2, j = 0;
    for (int i = 0; i < mid; i++) {
        result[j] = nums[i];
        result[j+1] = nums[i+mid];
        j += 2;
    }
    if (n % 2 == 1) result[n-1] = nums[n-1];
    return result;
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 4, 5],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5],
      placeholder: '1,2,3,4,5',
      helperText: 'Comma-separated distinct integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawNums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    const sorted = [...rawNums].sort((a, b) => a - b);
    const n = sorted.length;
    const result: number[] = new Array(n).fill(0);
    const mid = Math.floor(n / 2);

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
      explanation: `Sort array: [${sorted.join(', ')}]. Mid=${mid}. Interleave: smaller half at even indices, larger half at odd indices.`,
      variables: { sorted: [...sorted], mid },
      visualization: makeViz(sorted, {}, {}),
    });

    let j = 0;
    for (let i = 0; i < mid; i++) {
      result[j] = sorted[i];
      result[j + 1] = sorted[i + mid];

      steps.push({
        line: 7,
        explanation: `Place sorted[${i}]=${sorted[i]} at result[${j}] (even), sorted[${i + mid}]=${sorted[i + mid]} at result[${j + 1}] (odd).`,
        variables: { i, j, small: sorted[i], large: sorted[i + mid] },
        visualization: makeViz(result, { [j]: 'found', [j + 1]: 'active' }, { [j]: `${sorted[i]}(s)`, [j + 1]: `${sorted[i + mid]}(l)` }),
      });

      j += 2;
    }

    if (n % 2 === 1) {
      result[n - 1] = sorted[n - 1];
      steps.push({
        line: 10,
        explanation: `Odd length: place last element sorted[${n - 1}]=${sorted[n - 1]} at result[${n - 1}].`,
        variables: { lastVal: sorted[n - 1] },
        visualization: makeViz(result, { [n - 1]: 'comparing' }, { [n - 1]: 'mid' }),
      });
    }

    steps.push({
      line: 11,
      explanation: `Result: [${result.join(', ')}]. No element equals average of its neighbors.`,
      variables: { result: [...result] },
      visualization: makeViz(result, Object.fromEntries(result.map((_, i) => [i, 'found'])), {}),
    });

    return steps;
  },
};

export default arrayWithElementsNotEqualToAverage;

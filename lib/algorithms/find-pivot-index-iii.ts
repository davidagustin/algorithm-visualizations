import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findPivotIndexIII: AlgorithmDefinition = {
  id: 'find-pivot-index-iii',
  title: 'Find Pivot Index III',
  leetcodeNumber: 724,
  difficulty: 'Easy',
  category: 'Prefix Sum',
  description:
    'Find the leftmost index where the sum of all elements to the left equals the sum of all elements to the right. Compute total sum, then scan left to right maintaining leftSum. At each index, rightSum = total - leftSum - nums[i]. If leftSum == rightSum, return the index.',
  tags: ['Prefix Sum', 'Array'],
  code: {
    pseudocode: `function pivotIndex(nums):
  total = sum(nums)
  leftSum = 0
  for i from 0 to n-1:
    rightSum = total - leftSum - nums[i]
    if leftSum == rightSum:
      return i
    leftSum += nums[i]
  return -1`,
    python: `def pivotIndex(nums: list[int]) -> int:
    total = sum(nums)
    left_sum = 0
    for i, num in enumerate(nums):
        if left_sum == total - left_sum - num:
            return i
        left_sum += num
    return -1`,
    javascript: `function pivotIndex(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  let leftSum = 0;
  for (let i = 0; i < nums.length; i++) {
    if (leftSum === total - leftSum - nums[i]) return i;
    leftSum += nums[i];
  }
  return -1;
}`,
    java: `public int pivotIndex(int[] nums) {
    int total = Arrays.stream(nums).sum();
    int leftSum = 0;
    for (int i = 0; i < nums.length; i++) {
        if (leftSum == total - leftSum - nums[i]) return i;
        leftSum += nums[i];
    }
    return -1;
}`,
  },
  defaultInput: { nums: [1, 7, 3, 6, 5, 6] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 7, 3, 6, 5, 6],
      placeholder: '1,7,3,6,5,6',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    const total = nums.reduce((a, b) => a + b, 0);
    let leftSum = 0;
    let pivotResult = -1;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Find pivot index in [${nums.join(', ')}]. Total sum = ${total}.`,
      variables: { nums, total },
      visualization: makeViz({}, { 0: `sum=${total}` }),
    });

    for (let i = 0; i < n; i++) {
      const rightSum = total - leftSum - nums[i];

      steps.push({
        line: 4,
        explanation: `Index ${i}: leftSum=${leftSum}, nums[${i}]=${nums[i]}, rightSum=${total}-${leftSum}-${nums[i]}=${rightSum}. Equal? ${leftSum === rightSum}.`,
        variables: { i, leftSum, rightSum, 'nums[i]': nums[i] },
        visualization: makeViz(
          {
            ...Object.fromEntries(Array.from({ length: i }, (_, k) => [k, 'visited'])),
            [i]: leftSum === rightSum ? 'found' : 'active',
            ...Object.fromEntries(Array.from({ length: n - i - 1 }, (_, k) => [i + 1 + k, leftSum === rightSum ? 'comparing' : 'default'])),
          },
          { [i]: `L=${leftSum} R=${rightSum}` },
        ),
      });

      if (leftSum === rightSum) {
        pivotResult = i;
        steps.push({
          line: 6,
          explanation: `Pivot found at index ${i}! leftSum(${leftSum}) == rightSum(${rightSum}).`,
          variables: { pivot: i },
          visualization: makeViz(
            {
              ...Object.fromEntries(Array.from({ length: i }, (_, k) => [k, 'comparing'])),
              [i]: 'found',
              ...Object.fromEntries(Array.from({ length: n - i - 1 }, (_, k) => [i + 1 + k, 'comparing'])),
            },
            { [i]: 'PIVOT' },
          ),
        });
        break;
      }
      leftSum += nums[i];
    }

    if (pivotResult === -1) {
      steps.push({
        line: 9,
        explanation: `No pivot index found. Return -1.`,
        variables: { result: -1 },
        visualization: makeViz(Object.fromEntries(nums.map((_, i) => [i, 'mismatch'])), {}),
      });
    }

    return steps;
  },
};

export default findPivotIndexIII;

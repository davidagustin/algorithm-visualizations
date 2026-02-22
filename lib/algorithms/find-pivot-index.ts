import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findPivotIndex: AlgorithmDefinition = {
  id: 'find-pivot-index',
  title: 'Find Pivot Index',
  leetcodeNumber: 724,
  difficulty: 'Easy',
  category: 'Prefix Sum',
  description:
    'Find the pivot index where the sum of all elements to the left equals the sum of all elements to the right. Compute total sum, then iterate keeping a running left sum. At each index, right sum = total - leftSum - nums[i]. If leftSum == rightSum, that index is the pivot.',
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
    python: `def pivotIndex(nums):
    total = sum(nums)
    left_sum = 0
    for i, num in enumerate(nums):
        right_sum = total - left_sum - num
        if left_sum == right_sum:
            return i
        left_sum += num
    return -1`,
    javascript: `function pivotIndex(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  let leftSum = 0;
  for (let i = 0; i < nums.length; i++) {
    const rightSum = total - leftSum - nums[i];
    if (leftSum === rightSum) return i;
    leftSum += nums[i];
  }
  return -1;
}`,
    java: `public int pivotIndex(int[] nums) {
    int total = 0;
    for (int n : nums) total += n;
    int leftSum = 0;
    for (int i = 0; i < nums.length; i++) {
        int rightSum = total - leftSum - nums[i];
        if (leftSum == rightSum) return i;
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
      placeholder: '[1,7,3,6,5,6]',
      helperText: 'Array of integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const total = nums.reduce((a, b) => a + b, 0);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
      auxData: { label: 'Pivot Search', entries: auxEntries },
    });

    steps.push({
      line: 2,
      explanation: `Compute total sum = ${total}. For each index i, check if leftSum == rightSum where rightSum = total - leftSum - nums[i].`,
      variables: { total },
      visualization: makeViz({}, {}, [
        { key: 'total', value: String(total) },
        { key: 'leftSum', value: '0' },
        { key: 'pivot', value: 'not found' },
      ]),
    });

    let leftSum = 0;
    let pivotFound = -1;

    for (let i = 0; i < nums.length; i++) {
      const rightSum = total - leftSum - nums[i];
      const isPivot = leftSum === rightSum;

      const hl: Record<number, string> = {};
      for (let j = 0; j < i; j++) hl[j] = 'visited';
      hl[i] = isPivot ? 'found' : 'active';
      for (let j = i + 1; j < nums.length; j++) hl[j] = isPivot ? 'visited' : 'default';

      const lbl: Record<number, string> = { [i]: `i=${i}` };
      if (i > 0) lbl[0] = 'L→';
      if (i < nums.length - 1) lbl[nums.length - 1] = '←R';

      steps.push({
        line: isPivot ? 6 : 4,
        explanation: isPivot
          ? `Pivot found at index ${i}! leftSum(${leftSum}) == rightSum(${rightSum}). Return ${i}.`
          : `i=${i}: leftSum=${leftSum}, rightSum=${total}-${leftSum}-${nums[i]}=${rightSum}. Not equal, continue.`,
        variables: { i, leftSum, rightSum, nums_i: nums[i], isPivot },
        visualization: makeViz(hl, lbl, [
          { key: 'i', value: String(i) },
          { key: 'leftSum', value: String(leftSum) },
          { key: 'nums[i]', value: String(nums[i]) },
          { key: 'rightSum', value: String(rightSum) },
          { key: 'leftSum == rightSum', value: String(isPivot) },
        ]),
      });

      if (isPivot) {
        pivotFound = i;
        break;
      }
      leftSum += nums[i];
    }

    if (pivotFound === -1) {
      const finalHl: Record<number, string> = {};
      for (let j = 0; j < nums.length; j++) finalHl[j] = 'mismatch';
      steps.push({
        line: 8,
        explanation: `No pivot index found. Return -1.`,
        variables: { result: -1 },
        visualization: makeViz(finalHl, {}, [{ key: 'result', value: '-1' }]),
      });
    }

    return steps;
  },
};

export default findPivotIndex;

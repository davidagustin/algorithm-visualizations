import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const missingNumberBit: AlgorithmDefinition = {
  id: 'missing-number-bit',
  title: 'Missing Number (Bit Approach)',
  leetcodeNumber: 268,
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  description:
    'Given an array nums containing n distinct numbers in range [0, n], find the missing number using XOR. XOR all indices 0..n with all elements. Pairs cancel out, leaving only the missing number. This is an elegant O(n) time, O(1) space solution.',
  tags: ['bit manipulation', 'array', 'xor'],

  code: {
    pseudocode: `function missingNumber(nums):
  result = len(nums)  // start with n
  for i in 0..n-1:
    result ^= i ^ nums[i]
  return result`,

    python: `def missingNumber(nums: list[int]) -> int:
    result = len(nums)
    for i, n in enumerate(nums):
        result ^= i ^ n
    return result`,

    javascript: `function missingNumber(nums) {
  let result = nums.length;
  for (let i = 0; i < nums.length; i++) result ^= i ^ nums[i];
  return result;
}`,

    java: `public int missingNumber(int[] nums) {
    int result = nums.length;
    for (int i = 0; i < nums.length; i++) result ^= i ^ nums[i];
    return result;
}`,
  },

  defaultInput: { nums: [3, 0, 1] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [3, 0, 1],
      placeholder: '3,0,1',
      helperText: 'Array with n distinct numbers in [0,n] with one missing',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const n = nums.length;
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      extra: { key: string; value: string }[]
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
      auxData: { label: 'Missing Number XOR', entries: extra },
    });

    let result = n;
    steps.push({
      line: 1,
      explanation: `nums=[${nums.join(', ')}], n=${n}. Initialize result=${n} (the last index). XOR each index i with nums[i]; pairs cancel.`,
      variables: { result, n },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'active'])),
        Object.fromEntries(nums.map((v, i) => [i, String(v)])),
        [{ key: 'result (start)', value: `${n} (${n.toString(2)})` }]
      ),
    });

    for (let i = 0; i < n; i++) {
      const prev = result;
      result ^= i ^ nums[i];
      steps.push({
        line: 3,
        explanation: `i=${i}: result ^= ${i} ^ nums[${i}] = ${i} ^ ${nums[i]} = ${i ^ nums[i]}. result: ${prev} ^ ${i ^ nums[i]} = ${result} (${result.toString(2)}).`,
        variables: { i, 'nums[i]': nums[i], 'i^nums[i]': i ^ nums[i], prev, result },
        visualization: makeViz(
          Object.fromEntries(nums.map((_, j) => [j, j < i ? 'visited' : j === i ? 'active' : 'default'])),
          { [i]: `^${i}^${nums[i]}` },
          [
            { key: `i=${i}, nums[i]=${nums[i]}`, value: `${i}^${nums[i]}=${i ^ nums[i]}` },
            { key: 'result', value: `${result} (${result.toString(2)})` },
          ]
        ),
      });
    }

    steps.push({
      line: 4,
      explanation: `All pairs cancelled. Missing number = ${result}. (All indices 0..${n} XOR all nums[i] leaves only the missing one.)`,
      variables: { missing: result },
      visualization: makeViz(
        Object.fromEntries(nums.map((v, i) => [i, v === result ? 'mismatch' : 'visited'])),
        {},
        [{ key: 'missing number', value: String(result) }]
      ),
    });

    return steps;
  },
};

export default missingNumberBit;

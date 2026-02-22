import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findXorBeauty: AlgorithmDefinition = {
  id: 'find-xor-beauty',
  title: 'Find XOR Beauty of Array',
  leetcodeNumber: 2527,
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  description:
    'Given an array nums, the XOR beauty is defined as XOR of all "effective values" (((nums[i] OR nums[j]) AND nums[k]) for all 0<=i,j,k<n). The answer simplifies to just XOR of all elements. When you expand the expression, all intermediate cross terms cancel, leaving XOR(nums[0], nums[1], ..., nums[n-1]).',
  tags: ['bit manipulation', 'math', 'xor'],

  code: {
    pseudocode: `function xorBeauty(nums):
  // The XOR beauty simplifies to XOR of all elements
  result = 0
  for num in nums:
    result ^= num
  return result`,

    python: `def xorBeauty(nums: list[int]) -> int:
    result = 0
    for num in nums:
        result ^= num
    return result`,

    javascript: `function xorBeauty(nums) {
  return nums.reduce((acc, n) => acc ^ n, 0);
}`,

    java: `public int xorBeauty(int[] nums) {
    int result = 0;
    for (int n : nums) result ^= n;
    return result;
}`,
  },

  defaultInput: { nums: [1, 4] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 4],
      placeholder: '1,4',
      helperText: 'Array of non-negative integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
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
      auxData: { label: 'XOR Beauty', entries: extra },
    });

    steps.push({
      line: 1,
      explanation: `XOR beauty = XOR of all ((nums[i] OR nums[j]) AND nums[k]) for all i,j,k. This algebraically simplifies to XOR of all nums.`,
      variables: { nums },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'active'])),
        {},
        [{ key: 'insight', value: 'beauty = XOR of all nums' }]
      ),
    });

    let result = 0;
    for (let i = 0; i < nums.length; i++) {
      const prev = result;
      result ^= nums[i];
      steps.push({
        line: 3,
        explanation: `XOR result with nums[${i}]=${nums[i]}: ${prev} ^ ${nums[i]} = ${result} (binary: ${result.toString(2)}).`,
        variables: { i, 'nums[i]': nums[i], prev, result },
        visualization: makeViz(
          Object.fromEntries(nums.map((_, j) => [j, j < i ? 'visited' : j === i ? 'active' : 'default'])),
          { [i]: `^${nums[i]}` },
          [
            { key: 'result', value: `${result} (${result.toString(2)})` },
          ]
        ),
      });
    }

    steps.push({
      line: 5,
      explanation: `XOR beauty of [${nums.join(', ')}] = ${result}.`,
      variables: { result },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        {},
        [{ key: 'xorBeauty', value: String(result) }]
      ),
    });

    return steps;
  },
};

export default findXorBeauty;

import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumXorAfterOperations: AlgorithmDefinition = {
  id: 'maximum-xor-after-operations',
  title: 'Maximum XOR After Operations',
  leetcodeNumber: 2317,
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  description:
    'Given nums array, you can apply operations: choose i, then replace nums[i] with nums[i] AND (nums[i] XOR x) for any x >= 0. You can clear any subset of bits in any element. The maximum XOR of any subarray is the OR of all elements, because we can always zero out bits to achieve any subset XOR up to the OR of all elements.',
  tags: ['bit manipulation', 'math', 'xor'],

  code: {
    pseudocode: `function maximumXOR(nums):
  // After operations, max XOR of any subarray = OR of all elements
  result = 0
  for num in nums:
    result |= num
  return result`,

    python: `def maximumXOR(nums: list[int]) -> int:
    result = 0
    for num in nums:
        result |= num
    return result`,

    javascript: `function maximumXOR(nums) {
  return nums.reduce((acc, n) => acc | n, 0);
}`,

    java: `public int maximumXOR(int[] nums) {
    int result = 0;
    for (int n : nums) result |= n;
    return result;
}`,
  },

  defaultInput: { nums: [3, 2, 4, 6] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [3, 2, 4, 6],
      placeholder: '3,2,4,6',
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
      auxData: { label: 'Max XOR', entries: extra },
    });

    steps.push({
      line: 1,
      explanation: `Key insight: operations allow clearing any bits in any element. The maximum achievable XOR equals the OR of all elements (we can activate each bit independently).`,
      variables: { nums },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'active'])),
        {},
        [{ key: 'insight', value: 'max XOR = OR of all elements' }]
      ),
    });

    let result = 0;
    for (let i = 0; i < nums.length; i++) {
      const prev = result;
      result |= nums[i];
      steps.push({
        line: 3,
        explanation: `OR result with nums[${i}]=${nums[i]} (${nums[i].toString(2)}): ${prev} | ${nums[i]} = ${result} (${result.toString(2)}). New bits from nums[${i}] are now reachable.`,
        variables: { i, 'nums[i]': nums[i], prev, result },
        visualization: makeViz(
          Object.fromEntries(nums.map((_, j) => [j, j < i ? 'visited' : j === i ? 'active' : 'default'])),
          { [i]: `|${nums[i]}` },
          [
            { key: 'result (OR)', value: `${result} (${result.toString(2)})` },
          ]
        ),
      });
    }

    steps.push({
      line: 5,
      explanation: `Maximum XOR after operations = ${result} (binary: ${result.toString(2)}).`,
      variables: { result },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        {},
        [{ key: 'maximumXOR', value: `${result} (${result.toString(2)})` }]
      ),
    });

    return steps;
  },
};

export default maximumXorAfterOperations;

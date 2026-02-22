import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const lonelyInteger: AlgorithmDefinition = {
  id: 'lonely-integer',
  title: 'Single Number',
  leetcodeNumber: 136,
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  description:
    'Given a non-empty array of integers where every element appears twice except for one, find that single one. XOR all elements together: pairs cancel out (a XOR a = 0), leaving only the unique element.',
  tags: ['bit manipulation', 'array'],

  code: {
    pseudocode: `function singleNumber(nums):
  result = 0
  for num in nums:
    result = result XOR num
  return result`,

    python: `def singleNumber(nums: list[int]) -> int:
    result = 0
    for num in nums:
        result ^= num
    return result`,

    javascript: `function singleNumber(nums) {
  let result = 0;
  for (const num of nums) {
    result ^= num;
  }
  return result;
}`,

    java: `public int singleNumber(int[] nums) {
    int result = 0;
    for (int num : nums) {
        result ^= num;
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [4, 1, 2, 1, 2],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [4, 1, 2, 1, 2],
      placeholder: '4,1,2,1,2',
      helperText: 'Comma-separated integers (every number appears twice except one)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    let result = 0;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
      auxData: {
        label: 'XOR State',
        entries: [
          { key: 'result', value: `${result} (binary: ${result.toString(2)})` },
        ],
      },
    });

    // Step: Initialize
    steps.push({
      line: 2,
      explanation: `Initialize result = 0. We will XOR every element. Pairs cancel out (a XOR a = 0), leaving the unique number.`,
      variables: { result: 0 },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < nums.length; i++) {
      const prevResult = result;
      result ^= nums[i];

      const highlights: Record<number, string> = {};
      for (let k = 0; k < i; k++) highlights[k] = 'visited';
      highlights[i] = 'active';

      steps.push({
        line: 4,
        explanation: `XOR result with nums[${i}] = ${nums[i]}: ${prevResult} XOR ${nums[i]} = ${result} (binary: ${prevResult.toString(2)} XOR ${nums[i].toString(2)} = ${result.toString(2)}).`,
        variables: { i, 'nums[i]': nums[i], prevResult, result, binary: result.toString(2) },
        visualization: makeViz(highlights, { [i]: `^${nums[i]}` }),
      });
    }

    // Find the index of the single number for final highlight
    const singleVal = result;
    const singleIdx = nums.indexOf(singleVal);

    steps.push({
      line: 5,
      explanation: `Done! All pairs cancelled out. The single number is ${result}.`,
      variables: { result },
      visualization: makeViz(
        Object.fromEntries(nums.map((v, i) => [i, v === singleVal ? 'found' : 'visited'])),
        singleIdx >= 0 ? { [singleIdx]: 'single!' } : {}
      ),
    });

    return steps;
  },
};

export default lonelyInteger;

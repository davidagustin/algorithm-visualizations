import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const singleNumberIii: AlgorithmDefinition = {
  id: 'single-number-iii',
  title: 'Single Number III',
  leetcodeNumber: 260,
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  description:
    'Given an integer array where exactly two elements appear only once and all others appear exactly twice, find the two single numbers. XOR all numbers to get xor of the two singles, then use the lowest set bit to partition numbers into two groups, each containing one unique number.',
  tags: ['bit manipulation', 'xor', 'array'],

  code: {
    pseudocode: `function singleNumber(nums):
  xor = 0
  for n in nums: xor ^= n
  diff = xor & (-xor)  // lowest set bit
  a = 0
  for n in nums:
    if n & diff != 0: a ^= n
  b = xor ^ a
  return [a, b]`,

    python: `def singleNumber(nums):
    xor = 0
    for n in nums:
        xor ^= n
    diff = xor & (-xor)
    a = 0
    for n in nums:
        if n & diff:
            a ^= n
    return [a, xor ^ a]`,

    javascript: `function singleNumber(nums) {
  let xor = 0;
  for (const n of nums) xor ^= n;
  const diff = xor & (-xor);
  let a = 0;
  for (const n of nums) {
    if (n & diff) a ^= n;
  }
  return [a, xor ^ a];
}`,

    java: `public int[] singleNumber(int[] nums) {
    int xor = 0;
    for (int n : nums) xor ^= n;
    int diff = xor & (-xor);
    int a = 0;
    for (int n : nums) {
        if ((n & diff) != 0) a ^= n;
    }
    return new int[]{a, xor ^ a};
}`,
  },

  defaultInput: {
    nums: [1, 2, 1, 3, 2, 5],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 1, 3, 2, 5],
      placeholder: '1,2,1,3,2,5',
      helperText: 'Array where exactly two numbers appear once',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: 'Start by XORing all numbers. Pairs cancel out, leaving XOR of the two unique numbers.',
      variables: { xor: 0 },
      visualization: makeViz({}, {}),
    });

    let xor = 0;
    for (let i = 0; i < nums.length; i++) {
      xor ^= nums[i];
      steps.push({
        line: 2,
        explanation: `XOR with nums[${i}] = ${nums[i]}. xor is now ${xor} (binary: ${xor.toString(2)}).`,
        variables: { xor, current: nums[i] },
        visualization: makeViz({ [i]: 'active' }, { [i]: 'cur' }),
      });
    }

    const diff = xor & -xor;
    steps.push({
      line: 3,
      explanation: `xor = ${xor} (binary: ${xor.toString(2)}). Lowest set bit = ${diff} (binary: ${diff.toString(2)}). This bit differs between the two unique numbers.`,
      variables: { xor, diff },
      visualization: makeViz({}, {}),
    });

    steps.push({
      line: 4,
      explanation: `Partition array into two groups: those with bit ${diff} set and those without. XOR within each group yields one unique number.`,
      variables: { xor, diff, a: 0 },
      visualization: makeViz({}, {}),
    });

    let a = 0;
    for (let i = 0; i < nums.length; i++) {
      const inGroupA = (nums[i] & diff) !== 0;
      if (inGroupA) {
        a ^= nums[i];
        steps.push({
          line: 6,
          explanation: `nums[${i}] = ${nums[i]} has bit ${diff} set. XOR into group A. a = ${a}.`,
          variables: { a, current: nums[i], diff },
          visualization: makeViz({ [i]: 'found' }, { [i]: 'A' }),
        });
      } else {
        steps.push({
          line: 6,
          explanation: `nums[${i}] = ${nums[i]} does NOT have bit ${diff} set. Goes into group B.`,
          variables: { a, current: nums[i], diff },
          visualization: makeViz({ [i]: 'visited' }, { [i]: 'B' }),
        });
      }
    }

    const b = xor ^ a;
    steps.push({
      line: 8,
      explanation: `a = ${a}, b = xor ^ a = ${xor} ^ ${a} = ${b}. The two unique numbers are [${a}, ${b}].`,
      variables: { a, b, result: [a, b] },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default singleNumberIii;

import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const totalHammingDistance: AlgorithmDefinition = {
  id: 'total-hamming-distance',
  title: 'Total Hamming Distance',
  leetcodeNumber: 477,
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  description:
    'The Hamming distance between two integers is the number of positions where corresponding bits differ. Given an integer array, return the sum of Hamming distances between all pairs. For each bit position, count numbers with that bit set (ones) and unset (zeros). Contribution = ones * zeros.',
  tags: ['bit manipulation', 'array', 'math'],

  code: {
    pseudocode: `function totalHammingDistance(nums):
  total = 0
  for bit from 0 to 31:
    ones = count of nums where (n >> bit) & 1 == 1
    zeros = len(nums) - ones
    total += ones * zeros
  return total`,

    python: `def totalHammingDistance(nums):
    total = 0
    for bit in range(32):
        ones = sum((n >> bit) & 1 for n in nums)
        total += ones * (len(nums) - ones)
    return total`,

    javascript: `function totalHammingDistance(nums) {
  let total = 0;
  for (let bit = 0; bit < 32; bit++) {
    let ones = 0;
    for (const n of nums) ones += (n >> bit) & 1;
    total += ones * (nums.length - ones);
  }
  return total;
}`,

    java: `public int totalHammingDistance(int[] nums) {
    int total = 0;
    for (int bit = 0; bit < 32; bit++) {
        int ones = 0;
        for (int n : nums) ones += (n >> bit) & 1;
        total += ones * (nums.length - ones);
    }
    return total;
}`,
  },

  defaultInput: {
    nums: [4, 14, 2],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [4, 14, 2],
      placeholder: '4,14,2',
      helperText: 'Non-negative integers',
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
      explanation: `Compute total Hamming distance for [${nums.join(', ')}]. For each bit position, ones * zeros counts differing pairs.`,
      variables: { total: 0 },
      visualization: makeViz({}, {}),
    });

    let total = 0;
    const maxBit = Math.max(...nums).toString(2).length;

    for (let bit = 0; bit < maxBit; bit++) {
      let ones = 0;
      const bitLabels: Record<number, string> = {};
      const bitHighlights: Record<number, string> = {};

      for (let idx = 0; idx < nums.length; idx++) {
        const bitVal = (nums[idx] >> bit) & 1;
        if (bitVal === 1) {
          ones++;
          bitHighlights[idx] = 'found';
          bitLabels[idx] = `bit${bit}=1`;
        } else {
          bitHighlights[idx] = 'visited';
          bitLabels[idx] = `bit${bit}=0`;
        }
      }

      const zeros = nums.length - ones;
      const contribution = ones * zeros;
      total += contribution;

      steps.push({
        line: 3,
        explanation: `Bit ${bit}: ${ones} number(s) have this bit set, ${zeros} do not. Contribution = ${ones} * ${zeros} = ${contribution}. Total = ${total}.`,
        variables: { bit, ones, zeros, contribution, total },
        visualization: makeViz(bitHighlights, bitLabels),
      });
    }

    steps.push({
      line: 6,
      explanation: `Total Hamming distance = ${total}.`,
      variables: { result: total },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'sorted'])),
        Object.fromEntries(nums.map((n, i) => [i, n.toString(2)]))
      ),
    });

    return steps;
  },
};

export default totalHammingDistance;

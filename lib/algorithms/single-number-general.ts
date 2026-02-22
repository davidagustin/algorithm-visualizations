import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const singleNumberGeneral: AlgorithmDefinition = {
  id: 'single-number-general',
  title: 'Single Number (General k)',
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  description:
    'In an array where every element appears k times except one element that appears once, find that single element. For each bit position, count how many numbers have that bit set. The count modulo k gives the bit of the single number. Works for any k.',
  tags: ['bit manipulation', 'array', 'math'],

  code: {
    pseudocode: `function singleNumber(nums, k):
  result = 0
  for bit from 0 to 31:
    total = sum of (n >> bit) & 1 for n in nums
    if total % k != 0:
      result |= (1 << bit)
  return result`,

    python: `def singleNumber(nums, k):
    result = 0
    for bit in range(32):
        total = sum((n >> bit) & 1 for n in nums)
        if total % k != 0:
            result |= (1 << bit)
    return result`,

    javascript: `function singleNumber(nums, k) {
  let result = 0;
  for (let bit = 0; bit < 32; bit++) {
    let total = 0;
    for (const n of nums) total += (n >> bit) & 1;
    if (total % k !== 0) result |= (1 << bit);
  }
  return result;
}`,

    java: `public int singleNumber(int[] nums, int k) {
    int result = 0;
    for (int bit = 0; bit < 32; bit++) {
        int total = 0;
        for (int n : nums) total += (n >> bit) & 1;
        if (total % k != 0) result |= (1 << bit);
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [2, 2, 3, 2],
    k: 3,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [2, 2, 3, 2],
      placeholder: '2,2,3,2',
      helperText: 'Array where all but one element appears k times',
    },
    {
      name: 'k',
      label: 'k (repetition count)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of times each element appears (except the single one)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Find single number in [${nums.join(', ')}] where every other element appears ${k} times. Check bit counts modulo ${k}.`,
      variables: { k, result: 0 },
      visualization: makeViz({}, {}),
    });

    let result = 0;
    const maxBit = Math.max(...nums.map(n => n.toString(2).length));

    for (let bit = 0; bit < maxBit; bit++) {
      let total = 0;
      const bitHighlights: Record<number, string> = {};
      const bitLabels: Record<number, string> = {};

      for (let i = 0; i < nums.length; i++) {
        const bitVal = (nums[i] >> bit) & 1;
        total += bitVal;
        bitHighlights[i] = bitVal === 1 ? 'active' : 'visited';
        bitLabels[i] = `b${bit}=${bitVal}`;
      }

      const remainder = total % k;
      if (remainder !== 0) {
        result |= (1 << bit);
        steps.push({
          line: 4,
          explanation: `Bit ${bit}: sum of bits = ${total}. ${total} % ${k} = ${remainder} (non-zero). Single number has bit ${bit} set. result = ${result}.`,
          variables: { bit, total, remainder, result },
          visualization: makeViz(bitHighlights, bitLabels),
        });
      } else {
        steps.push({
          line: 4,
          explanation: `Bit ${bit}: sum of bits = ${total}. ${total} % ${k} = 0. Single number does NOT have bit ${bit} set.`,
          variables: { bit, total, remainder, result },
          visualization: makeViz(bitHighlights, bitLabels),
        });
      }
    }

    steps.push({
      line: 6,
      explanation: `Single number = ${result} (binary: ${result.toString(2)}).`,
      variables: { result },
      visualization: makeViz(
        Object.fromEntries(nums.map((n, i) => [i, n === result ? 'found' : 'visited'])),
        Object.fromEntries(nums.map((n, i) => [i, n === result ? 'single' : '']))
      ),
    });

    return steps;
  },
};

export default singleNumberGeneral;

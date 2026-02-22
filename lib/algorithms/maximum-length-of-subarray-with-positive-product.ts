import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumLengthOfSubarrayWithPositiveProduct: AlgorithmDefinition = {
  id: 'maximum-length-of-subarray-with-positive-product',
  title: 'Maximum Length of Subarray With Positive Product',
  leetcodeNumber: 1567,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Given an array of integers, find the maximum length of a subarray with a positive product. Greedy: track two lengths - pos (length of longest subarray ending here with positive product) and neg (length with negative product). When encountering a positive number, both extend; negative number swaps pos and neg; zero resets both.',
  tags: ['greedy', 'array', 'dynamic programming'],

  code: {
    pseudocode: `function getMaxLen(nums):
  pos = neg = 0, result = 0
  for n in nums:
    if n == 0:
      pos = neg = 0
    elif n > 0:
      pos = pos + 1
      neg = neg + 1 if neg > 0 else 0
    else: // n < 0
      newPos = neg + 1 if neg > 0 else 0
      newNeg = pos + 1
      pos, neg = newPos, newNeg
    result = max(result, pos)
  return result`,

    python: `def getMaxLen(nums: list[int]) -> int:
    pos = neg = result = 0
    for n in nums:
        if n == 0:
            pos = neg = 0
        elif n > 0:
            pos += 1
            neg = neg + 1 if neg > 0 else 0
        else:
            pos, neg = (neg + 1 if neg > 0 else 0), pos + 1
        result = max(result, pos)
    return result`,

    javascript: `function getMaxLen(nums) {
  let pos = 0, neg = 0, result = 0;
  for (const n of nums) {
    if (n === 0) {
      pos = neg = 0;
    } else if (n > 0) {
      pos++;
      neg = neg > 0 ? neg + 1 : 0;
    } else {
      [pos, neg] = [neg > 0 ? neg + 1 : 0, pos + 1];
    }
    result = Math.max(result, pos);
  }
  return result;
}`,

    java: `public int getMaxLen(int[] nums) {
    int pos = 0, neg = 0, result = 0;
    for (int n : nums) {
        if (n == 0) { pos = neg = 0; }
        else if (n > 0) { pos++; neg = neg > 0 ? neg + 1 : 0; }
        else { int newPos = neg > 0 ? neg + 1 : 0; neg = pos + 1; pos = newPos; }
        result = Math.max(result, pos);
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [1, -2, -3, 4],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, -2, -3, 4],
      placeholder: '1,-2,-3,4',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Track pos=length of subarray ending here with positive product, neg=with negative product. Both start at 0.`,
      variables: { pos: 0, neg: 0, result: 0 },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      },
    });

    let pos = 0;
    let neg = 0;
    let result = 0;

    for (let i = 0; i < nums.length; i++) {
      const n = nums[i];
      const prevPos = pos;
      const prevNeg = neg;

      if (n === 0) {
        pos = 0;
        neg = 0;
        steps.push({
          line: 4,
          explanation: `nums[${i}]=${n}: zero resets both. pos=0, neg=0. Any subarray through 0 has product 0.`,
          variables: { i, n, pos, neg, result },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [i]: 'mismatch' } as Record<number, string>,
            labels: { [i]: '0 reset' } as Record<number, string>,
          },
        });
      } else if (n > 0) {
        pos = prevPos + 1;
        neg = prevNeg > 0 ? prevNeg + 1 : 0;
        steps.push({
          line: 6,
          explanation: `nums[${i}]=${n} > 0: positive extends pos subarray. pos=${pos}, neg=${neg}.`,
          variables: { i, n, pos, neg, result },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [i]: 'active' } as Record<number, string>,
            labels: { [i]: `pos=${pos}` } as Record<number, string>,
          },
        });
      } else {
        const newPos = prevNeg > 0 ? prevNeg + 1 : 0;
        const newNeg = prevPos + 1;
        pos = newPos;
        neg = newNeg;
        steps.push({
          line: 9,
          explanation: `nums[${i}]=${n} < 0: negative flips sign. pos=neg+1=${pos}, neg=pos+1=${neg} (swapped from ${prevPos},${prevNeg}).`,
          variables: { i, n, pos, neg, prevPos, prevNeg, result },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [i]: 'comparing' } as Record<number, string>,
            labels: { [i]: `pos=${pos}` } as Record<number, string>,
          },
        });
      }

      const prevResult = result;
      result = Math.max(result, pos);

      if (result > prevResult) {
        steps.push({
          line: 11,
          explanation: `New best: pos=${pos} subarray ending at index ${i}. result = ${result}.`,
          variables: { i, pos, neg, result },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: Object.fromEntries(Array.from({ length: pos }, (_, j) => [i - j, 'found'])) as Record<number, string>,
            labels: { [i]: `best=${result}` } as Record<number, string>,
          },
        });
      }
    }

    steps.push({
      line: 12,
      explanation: `Maximum length of subarray with positive product: ${result}.`,
      variables: { result },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: Object.fromEntries(nums.map((_, i) => [i, 'sorted'])) as Record<number, string>,
        labels: {},
      },
    });

    return steps;
  },
};

export default maximumLengthOfSubarrayWithPositiveProduct;

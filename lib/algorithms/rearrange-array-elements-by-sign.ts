import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const rearrangeArrayElementsBySign: AlgorithmDefinition = {
  id: 'rearrange-array-elements-by-sign',
  title: 'Rearrange Array Elements by Sign',
  leetcodeNumber: 2149,
  difficulty: 'Medium',
  category: 'Two Pointers',
  description:
    'Given an array with equal numbers of positive and negative integers, rearrange them so that positives occupy even indices and negatives occupy odd indices, preserving relative order. Use two pointers tracking next positive and negative positions.',
  tags: ['two pointers', 'array', 'sorting'],

  code: {
    pseudocode: `function rearrangeArray(nums):
  result = array of size n
  pos = 0, neg = 1
  for num in nums:
    if num > 0:
      result[pos] = num
      pos += 2
    else:
      result[neg] = num
      neg += 2
  return result`,

    python: `def rearrangeArray(nums: list[int]) -> list[int]:
    n = len(nums)
    result = [0] * n
    pos, neg = 0, 1
    for num in nums:
        if num > 0:
            result[pos] = num
            pos += 2
        else:
            result[neg] = num
            neg += 2
    return result`,

    javascript: `function rearrangeArray(nums) {
  const n = nums.length;
  const result = new Array(n);
  let pos = 0, neg = 1;
  for (const num of nums) {
    if (num > 0) {
      result[pos] = num;
      pos += 2;
    } else {
      result[neg] = num;
      neg += 2;
    }
  }
  return result;
}`,

    java: `public int[] rearrangeArray(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    int pos = 0, neg = 1;
    for (int num : nums) {
        if (num > 0) { result[pos] = num; pos += 2; }
        else { result[neg] = num; neg += 2; }
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [3, 1, -2, -5, 2, -4],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [3, 1, -2, -5, 2, -4],
      placeholder: '3,1,-2,-5,2,-4',
      helperText: 'Comma-separated integers with equal positives and negatives',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const n = nums.length;
    const steps: AlgorithmStep[] = [];

    const result: number[] = new Array(n).fill(0);

    const makeViz = (
      src: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...src],
      highlights,
      labels,
    });

    let pos = 0;
    let neg = 1;

    steps.push({
      line: 1,
      explanation: `Initialize result array of size ${n}. pos pointer=0 (even indices for positives), neg pointer=1 (odd indices for negatives).`,
      variables: { pos, neg },
      visualization: makeViz(result, {}, {}),
    });

    for (let idx = 0; idx < nums.length; idx++) {
      const num = nums[idx];
      if (num > 0) {
        result[pos] = num;
        steps.push({
          line: 4,
          explanation: `nums[${idx}]=${num} is positive. Place at result[${pos}]=${num}. pos advances to ${pos + 2}.`,
          variables: { num, placedAt: pos, nextPos: pos + 2 },
          visualization: makeViz(result, { [pos]: 'found' }, { [pos]: `+${num}` }),
        });
        pos += 2;
      } else {
        result[neg] = num;
        steps.push({
          line: 7,
          explanation: `nums[${idx}]=${num} is negative. Place at result[${neg}]=${num}. neg advances to ${neg + 2}.`,
          variables: { num, placedAt: neg, nextNeg: neg + 2 },
          visualization: makeViz(result, { [neg]: 'active' }, { [neg]: `${num}` }),
        });
        neg += 2;
      }
    }

    steps.push({
      line: 9,
      explanation: `Done. Positives at even indices, negatives at odd indices: [${result.join(', ')}].`,
      variables: { result: [...result] },
      visualization: makeViz(
        result,
        Object.fromEntries(result.map((_, i) => [i, i % 2 === 0 ? 'found' : 'active'])),
        Object.fromEntries(result.map((v, i) => [i, i % 2 === 0 ? '+' : '-']))
      ),
    });

    return steps;
  },
};

export default rearrangeArrayElementsBySign;

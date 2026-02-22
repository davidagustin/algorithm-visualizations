import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumXorForEachQuery: AlgorithmDefinition = {
  id: 'maximum-xor-for-each-query',
  title: 'Maximum XOR for Each Query',
  leetcodeNumber: 1829,
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  description:
    'Given a sorted array nums and maximumBit, for each query find k (0 <= k < 2^maximumBit) such that XOR of all nums XOR k is maximized. The optimal k is the bitwise NOT of the current prefix XOR masked to maximumBit bits. Process queries from right to left, removing the last element each time.',
  tags: ['bit manipulation', 'prefix xor', 'array'],

  code: {
    pseudocode: `function getMaximumXor(nums, maximumBit):
  mask = (1 << maximumBit) - 1
  xorAll = XOR of all nums
  result = []
  for i from n-1 to 0:
    result.append(xorAll XOR mask)  // flip all bits = maximum
    xorAll ^= nums[i]               // remove nums[i]
  return result`,

    python: `def getMaximumXor(nums, maximumBit):
    mask = (1 << maximumBit) - 1
    xor_all = 0
    for n in nums: xor_all ^= n
    result = []
    for n in reversed(nums):
        result.append(xor_all ^ mask)
        xor_all ^= n
    return result`,

    javascript: `function getMaximumXor(nums, maximumBit) {
  const mask = (1 << maximumBit) - 1;
  let xorAll = nums.reduce((a, b) => a ^ b, 0);
  const result = [];
  for (let i = nums.length - 1; i >= 0; i--) {
    result.push(xorAll ^ mask);
    xorAll ^= nums[i];
  }
  return result;
}`,

    java: `public int[] getMaximumXor(int[] nums, int maximumBit) {
    int mask = (1 << maximumBit) - 1;
    int xorAll = 0;
    for (int n : nums) xorAll ^= n;
    int[] result = new int[nums.length];
    for (int i = nums.length - 1; i >= 0; i--) {
        result[nums.length - 1 - i] = xorAll ^ mask;
        xorAll ^= nums[i];
    }
    return result;
}`,
  },

  defaultInput: { nums: [0, 1, 1, 3], maximumBit: 2 },
  inputFields: [
    {
      name: 'nums',
      label: 'nums (sorted)',
      type: 'array',
      defaultValue: [0, 1, 1, 3],
      placeholder: '0,1,1,3',
    },
    {
      name: 'maximumBit',
      label: 'maximumBit',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'k must satisfy 0 <= k < 2^maximumBit',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const maximumBit = input.maximumBit as number;
    const steps: AlgorithmStep[] = [];
    const mask = (1 << maximumBit) - 1;

    const makeViz = (
      arr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>,
      extra: { key: string; value: string }[]
    ): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
      auxData: { label: 'XOR Query', entries: extra },
    });

    let xorAll = 0;
    for (const n of nums) xorAll ^= n;

    steps.push({
      line: 1,
      explanation: `mask = (1 << ${maximumBit}) - 1 = ${mask} (${mask.toString(2)}). XOR of all nums = ${xorAll} (${xorAll.toString(2)}).`,
      variables: { mask, xorAll, maximumBit },
      visualization: makeViz(
        [...nums],
        Object.fromEntries(nums.map((_, i) => [i, 'active'])),
        {},
        [
          { key: 'mask', value: `${mask} (${mask.toString(2)})` },
          { key: 'xorAll', value: `${xorAll} (${xorAll.toString(2)})` },
        ]
      ),
    });

    const result: number[] = [];
    for (let i = nums.length - 1; i >= 0; i--) {
      const k = xorAll ^ mask;
      result.push(k);
      steps.push({
        line: 5,
        explanation: `Query ${nums.length - i}: xorAll=${xorAll} (${xorAll.toString(2)}). Best k = xorAll XOR mask = ${k} (${k.toString(2)}). This flips all bits to maximize XOR.`,
        variables: { query: nums.length - i, xorAll, k, 'xorAll^mask': k },
        visualization: makeViz(
          [...nums],
          Object.fromEntries(nums.map((_, j) => [j, j <= i ? 'active' : 'visited'])),
          { [i]: 'removing' },
          [
            { key: 'xorAll', value: `${xorAll} (${xorAll.toString(2)})` },
            { key: 'k (answer)', value: `${k} (${k.toString(2)})` },
            { key: 'results so far', value: result.join(', ') },
          ]
        ),
      });
      xorAll ^= nums[i];
    }

    steps.push({
      line: 7,
      explanation: `Done! Results for each query: [${result.join(', ')}].`,
      variables: { result },
      visualization: makeViz(
        result,
        Object.fromEntries(result.map((_, i) => [i, 'found'])),
        Object.fromEntries(result.map((v, i) => [i, `Q${i + 1}`])),
        [{ key: 'result', value: `[${result.join(', ')}]` }]
      ),
    });

    return steps;
  },
};

export default maximumXorForEachQuery;

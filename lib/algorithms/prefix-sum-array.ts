import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const prefixSumArray: AlgorithmDefinition = {
  id: 'prefix-sum-array',
  title: 'Prefix Sum Array',
  difficulty: 'Easy',
  category: 'Prefix Sum',
  description:
    'Build a prefix sum array where prefix[i] = sum of nums[0..i-1]. Once built, any subarray sum from index l to r can be computed in O(1) as prefix[r+1] - prefix[l]. This transforms O(n) range queries into O(1) after O(n) preprocessing.',
  tags: ['prefix sum', 'array', 'range query'],

  code: {
    pseudocode: `function buildPrefixSum(nums):
  prefix = [0] * (n+1)
  for i in 0..n-1:
    prefix[i+1] = prefix[i] + nums[i]
  return prefix

function rangeSum(prefix, l, r):
  return prefix[r+1] - prefix[l]`,

    python: `def buildPrefixSum(nums):
    n = len(nums)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i+1] = prefix[i] + nums[i]
    return prefix

def rangeSum(prefix, l, r):
    return prefix[r+1] - prefix[l]`,

    javascript: `function buildPrefixSum(nums) {
  const n = nums.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i+1] = prefix[i] + nums[i];
  }
  return prefix;
}
function rangeSum(prefix, l, r) {
  return prefix[r+1] - prefix[l];
}`,

    java: `public int[] buildPrefixSum(int[] nums) {
    int n = nums.length;
    int[] prefix = new int[n + 1];
    for (int i = 0; i < n; i++)
        prefix[i+1] = prefix[i] + nums[i];
    return prefix;
}
public int rangeSum(int[] prefix, int l, int r) {
    return prefix[r+1] - prefix[l];
}`,
  },

  defaultInput: {
    nums: [3, 1, 4, 1, 5, 9, 2, 6],
    queryL: 2,
    queryR: 5,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [3, 1, 4, 1, 5, 9, 2, 6],
      placeholder: '3,1,4,1,5,9,2,6',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'queryL',
      label: 'Query Left Index',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Start index of range query (inclusive)',
    },
    {
      name: 'queryR',
      label: 'Query Right Index',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'End index of range query (inclusive)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const queryL = input.queryL as number;
    const queryR = input.queryR as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    const prefix = new Array(n + 1).fill(0);

    steps.push({
      line: 1,
      explanation: `Build prefix sum for nums = [${nums.join(', ')}]. prefix[0] = 0.`,
      variables: { n, prefix: '[0]' },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: Object.fromEntries(nums.map((_, i) => [i, `nums[${i}]=${nums[i]}`])),
      },
    });

    for (let i = 0; i < n; i++) {
      prefix[i + 1] = prefix[i] + nums[i];

      steps.push({
        line: 3,
        explanation: `prefix[${i + 1}] = prefix[${i}] + nums[${i}] = ${prefix[i]} + ${nums[i]} = ${prefix[i + 1]}.`,
        variables: { i, 'prefix[i]': prefix[i], 'nums[i]': nums[i], 'prefix[i+1]': prefix[i + 1] },
        visualization: {
          type: 'array',
          array: prefix.slice(0, i + 2),
          highlights: { [i + 1]: 'active' },
          labels: Object.fromEntries(prefix.slice(0, i + 2).map((v, j) => [j, `p[${j}]=${v}`])),
        },
      });
    }

    steps.push({
      line: 4,
      explanation: `Prefix sum array complete: [${prefix.join(', ')}]. Now answer range query [${queryL}, ${queryR}].`,
      variables: { prefix: `[${prefix.join(', ')}]` },
      visualization: {
        type: 'array',
        array: [...prefix],
        highlights: {},
        labels: Object.fromEntries(prefix.map((v, i) => [i, `p[${i}]=${v}`])),
      },
    });

    const rangeSum = prefix[queryR + 1] - prefix[queryL];

    steps.push({
      line: 7,
      explanation: `rangeSum(${queryL}, ${queryR}) = prefix[${queryR + 1}] - prefix[${queryL}] = ${prefix[queryR + 1]} - ${prefix[queryL]} = ${rangeSum}.`,
      variables: { queryL, queryR, 'prefix[r+1]': prefix[queryR + 1], 'prefix[l]': prefix[queryL], rangeSum },
      visualization: {
        type: 'array',
        array: [...prefix],
        highlights: { [queryL]: 'active', [queryR + 1]: 'active' },
        labels: Object.fromEntries(prefix.map((v, i) => [i,
          i === queryL ? `L p[${i}]=${v}` :
          i === queryR + 1 ? `R p[${i}]=${v}` :
          `p[${i}]=${v}`
        ])),
      },
    });

    steps.push({
      line: 7,
      explanation: `Sum of nums[${queryL}..${queryR}] = [${nums.slice(queryL, queryR + 1).join('+')}] = ${rangeSum}.`,
      variables: { result: rangeSum },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: Object.fromEntries(nums.map((_, i) => [i, i >= queryL && i <= queryR ? 'found' : 'default'])),
        labels: Object.fromEntries(nums.map((v, i) => [i, i >= queryL && i <= queryR ? `${v}` : `${v}`])),
      },
    });

    return steps;
  },
};

export default prefixSumArray;

import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const tupleWithSameProduct: AlgorithmDefinition = {
  id: 'tuple-with-same-product',
  title: 'Tuple with Same Product',
  leetcodeNumber: 1726,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Given an array nums of distinct positive integers, count tuples (a, b, c, d) such that a * b == c * d where a, b, c, d are elements from nums and a != b != c != d. For every pair (i, j), store their product in a map. Each time a product is seen k times before, it contributes k * 8 new tuples.',
  tags: ['hash map', 'array', 'counting', 'math'],

  code: {
    pseudocode: `function tupleSameProduct(nums):
  productCount = {}
  result = 0
  for i in range(len(nums)):
    for j in range(i+1, len(nums)):
      p = nums[i] * nums[j]
      result += productCount.get(p, 0) * 8
      productCount[p] += 1
  return result`,
    python: `def tupleSameProduct(nums):
    from collections import defaultdict
    productCount = defaultdict(int)
    result = 0
    for i in range(len(nums)):
        for j in range(i+1, len(nums)):
            p = nums[i] * nums[j]
            result += productCount[p] * 8
            productCount[p] += 1
    return result`,
    javascript: `function tupleSameProduct(nums) {
  const productCount = new Map();
  let result = 0;
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      const p = nums[i] * nums[j];
      result += (productCount.get(p) || 0) * 8;
      productCount.set(p, (productCount.get(p)||0)+1);
    }
  }
  return result;
}`,
    java: `public int tupleSameProduct(int[] nums) {
    Map<Integer,Integer> pc = new HashMap<>();
    int result = 0;
    for (int i = 0; i < nums.length; i++) {
        for (int j = i+1; j < nums.length; j++) {
            int p = nums[i]*nums[j];
            result += pc.getOrDefault(p,0)*8;
            pc.merge(p, 1, Integer::sum);
        }
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [2, 3, 4, 6],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [2, 3, 4, 6],
      placeholder: '2,3,4,6',
      helperText: 'Distinct positive integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    const productCount = new Map<number, number>();
    let result = 0;

    steps.push({
      line: 1,
      explanation: 'For every pair (i,j), compute product and check how many previous pairs had the same product. Each matching pair contributes 8 tuples.',
      variables: { result, productCount: '{}' },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < nums.length; i++) {
      for (let j = i + 1; j < nums.length; j++) {
        const p = nums[i] * nums[j];
        const prev = productCount.get(p) || 0;
        const added = prev * 8;
        result += added;
        productCount.set(p, prev + 1);

        steps.push({
          line: 5,
          explanation: `Pair (${nums[i]}, ${nums[j]}): product=${p}. Previous pairs with product ${p}: ${prev}. Adding ${added} to result. result=${result}`,
          variables: { i, j, valI: nums[i], valJ: nums[j], product: p, prev, added, result },
          visualization: makeViz(
            { [i]: 'active', [j]: 'comparing' },
            { [i]: `${nums[i]}`, [j]: `x${nums[j]}=${p}` }
          ),
        });
      }
    }

    steps.push({
      line: 8,
      explanation: `All pairs processed. Total tuples (a,b,c,d) where a*b==c*d: ${result}.`,
      variables: { result },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'sorted'])),
        Object.fromEntries(nums.map((_, i) => [i, `${nums[i]}`]))
      ),
    });

    return steps;
  },
};

export default tupleWithSameProduct;

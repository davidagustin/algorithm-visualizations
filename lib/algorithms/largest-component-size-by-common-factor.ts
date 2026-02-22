import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const largestComponentSizeByCommonFactor: AlgorithmDefinition = {
  id: 'largest-component-size-by-common-factor',
  title: 'Largest Component Size by Common Factor',
  leetcodeNumber: 952,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Given an array of unique positive integers, two values are connected if they share a common factor greater than 1. Find the size of the largest connected component. Use union find: for each number, factor it and union the number with each of its prime factors. Then count the largest group.',
  tags: ['union find', 'graph', 'math', 'prime factors'],

  code: {
    pseudocode: `function largestComponentSize(nums):
  max_val = max(nums)
  parent = [0..max_val]
  for num in nums:
    f = 2
    while f * f <= num:
      if num % f == 0:
        union(num, f)
        union(num, num // f)
      f += 1
    // num itself is its own factor
  // Count component sizes
  count = {}
  result = 0
  for num in nums:
    root = find(num)
    count[root] = count.get(root, 0) + 1
    result = max(result, count[root])
  return result`,

    python: `def largestComponentSize(nums):
    max_val = max(nums)
    parent = list(range(max_val + 1))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    def union(a, b):
        parent[find(a)] = find(b)
    for num in nums:
        f = 2
        while f * f <= num:
            if num % f == 0:
                union(num, f)
                union(num, num // f)
            f += 1
    count = {}
    result = 0
    for num in nums:
        root = find(num)
        count[root] = count.get(root, 0) + 1
        result = max(result, count[root])
    return result`,

    javascript: `function largestComponentSize(nums) {
  const maxVal = Math.max(...nums);
  const parent = Array.from({length: maxVal + 1}, (_, i) => i);
  function find(x) {
    while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
    return x;
  }
  function union(a, b) { parent[find(a)] = find(b); }
  for (const num of nums) {
    for (let f = 2; f * f <= num; f++) {
      if (num % f === 0) { union(num, f); union(num, num / f); }
    }
  }
  const count = new Map();
  let result = 0;
  for (const num of nums) {
    const root = find(num);
    count.set(root, (count.get(root) || 0) + 1);
    result = Math.max(result, count.get(root));
  }
  return result;
}`,

    java: `public int largestComponentSize(int[] nums) {
    int maxVal = Arrays.stream(nums).max().getAsInt();
    int[] parent = new int[maxVal + 1];
    for (int i = 0; i <= maxVal; i++) parent[i] = i;
    for (int num : nums)
        for (int f = 2; f * f <= num; f++)
            if (num % f == 0) { union(parent, num, f); union(parent, num, num/f); }
    Map<Integer,Integer> count = new HashMap<>();
    int res = 0;
    for (int num : nums) {
        int root = find(parent, num);
        count.merge(root, 1, Integer::sum);
        res = Math.max(res, count.get(root));
    }
    return res;
}`,
  },

  defaultInput: {
    nums: [4, 6, 15, 35],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Numbers',
      type: 'array',
      defaultValue: [4, 6, 15, 35],
      placeholder: '4,6,15,35',
      helperText: 'Unique positive integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const maxVal = Math.max(...nums);
    const parent: number[] = Array.from({ length: maxVal + 1 }, (_, i) => i);

    function find(x: number): number {
      while (parent[x] !== x) {
        parent[x] = parent[parent[x]];
        x = parent[x];
      }
      return x;
    }

    function union(a: number, b: number): void {
      parent[find(a)] = find(b);
    }

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Initialize union-find for values 0 to ${maxVal}. Process each number and union with its prime factors.`,
      variables: { maxVal, numCount: nums.length },
      visualization: makeViz({}, Object.fromEntries(nums.map((v, i) => [i, String(v)]))),
    });

    for (let idx = 0; idx < nums.length; idx++) {
      const num = nums[idx];
      const factors: number[] = [];

      steps.push({
        line: 4,
        explanation: `Processing number ${num}. Finding its prime factors to union with.`,
        variables: { num },
        visualization: makeViz({ [idx]: 'active' }, { [idx]: String(num) }),
      });

      for (let f = 2; f * f <= num; f++) {
        if (num % f === 0) {
          factors.push(f);
          union(num, f);
          union(num, Math.floor(num / f));
          steps.push({
            line: 7,
            explanation: `${num} is divisible by ${f} (and ${Math.floor(num / f)}). Union ${num} with factors ${f} and ${Math.floor(num / f)}.`,
            variables: { num, factor: f, coFactor: Math.floor(num / f), findNum: find(num) },
            visualization: makeViz({ [idx]: 'comparing' }, { [idx]: `factors:${factors.join(',')}` }),
          });
        }
      }
    }

    // Count component sizes using only nums
    const count: Map<number, number> = new Map();
    let result = 0;

    steps.push({
      line: 12,
      explanation: 'All unions done. Now count component sizes for each number in the input array.',
      variables: { phase: 'counting' },
      visualization: makeViz({}, Object.fromEntries(nums.map((v, i) => [i, `root:${find(v)}`]))),
    });

    for (let idx = 0; idx < nums.length; idx++) {
      const num = nums[idx];
      const root = find(num);
      count.set(root, (count.get(root) ?? 0) + 1);
      result = Math.max(result, count.get(root)!);

      steps.push({
        line: 14,
        explanation: `find(${num}) = ${root}. Component of root ${root} now has size ${count.get(root)}. Max so far: ${result}.`,
        variables: { num, root, componentSize: count.get(root), maxSize: result },
        visualization: makeViz(
          { [idx]: result === count.get(root) ? 'found' : 'visited' },
          { [idx]: `sz:${count.get(root)}` }
        ),
      });
    }

    steps.push({
      line: 16,
      explanation: `Largest connected component size: ${result}.`,
      variables: { result },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'sorted'])),
        { 0: `result:${result}` }
      ),
    });

    return steps;
  },
};

export default largestComponentSizeByCommonFactor;

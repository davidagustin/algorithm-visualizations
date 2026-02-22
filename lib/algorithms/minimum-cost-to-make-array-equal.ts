import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const minimumCostToMakeArrayEqual: AlgorithmDefinition = {
  id: 'minimum-cost-to-make-array-equal',
  title: 'Minimum Cost to Make Array Equal',
  leetcodeNumber: 2448,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given arrays nums and cost, find a target value x minimizing sum(cost[i] * |nums[i] - x|). The optimal x is the weighted median of nums with weights cost. Use prefix sums on sorted (value, cost) pairs to compute cost at each candidate target efficiently.',
  tags: ['Dynamic Programming', 'Binary Search', 'Prefix Sum', 'Weighted Median'],
  code: {
    pseudocode: `function minCost(nums, cost):
  pairs = sort(zip(nums, cost)) by value
  totalCost = sum(cost)
  prefixCost = prefix sums of cost
  // Find weighted median: first x where prefix >= totalCost/2
  // Evaluate cost at each candidate from sorted unique values
  best = Infinity
  for each candidate value v:
    total = sum cost[i] * |nums[i] - v|
  return min total`,
    python: `def minCost(nums, cost):
    pairs = sorted(zip(nums, cost))
    def calc(target):
        return sum(c * abs(n - target) for n, c in pairs)
    lo, hi = min(nums), max(nums)
    while lo < hi:
        mid = (lo + hi) // 2
        if calc(mid) <= calc(mid + 1):
            hi = mid
        else:
            lo = mid + 1
    return calc(lo)`,
    javascript: `function minCost(nums, cost) {
  const calc = t => nums.reduce((s,n,i) => s + cost[i]*Math.abs(n-t), 0);
  let lo = Math.min(...nums), hi = Math.max(...nums);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (calc(mid) <= calc(mid + 1)) hi = mid;
    else lo = mid + 1;
  }
  return calc(lo);
}`,
    java: `public long minCost(int[] nums, int[] cost) {
    long lo = 0, hi = (long)1e6;
    while (lo < hi) {
        long mid = (lo + hi) / 2;
        if (calc(nums, cost, mid) <= calc(nums, cost, mid+1)) hi = mid;
        else lo = mid + 1;
    }
    return calc(nums, cost, lo);
}
long calc(int[] nums, int[] cost, long t) {
    long s = 0;
    for (int i = 0; i < nums.length; i++) s += (long)cost[i]*Math.abs(nums[i]-t);
    return s;
}`,
  },
  defaultInput: { nums: [1, 3, 5, 2], cost: [2, 3, 1, 14] },
  inputFields: [
    {
      name: 'nums',
      label: 'Values (nums)',
      type: 'array',
      defaultValue: [1, 3, 5, 2],
      placeholder: '1,3,5,2',
      helperText: 'Array of values to make equal',
    },
    {
      name: 'cost',
      label: 'Costs',
      type: 'array',
      defaultValue: [2, 3, 1, 14],
      placeholder: '2,3,1,14',
      helperText: 'Cost to change each element by 1 unit',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const cost = input.cost as number[];
    const n = nums.length;
    const steps: AlgorithmStep[] = [];

    const minVal = Math.min(...nums);
    const maxVal = Math.max(...nums);

    // Evaluate costs at each unique value
    const candidates = [...new Set(nums)].sort((a, b) => a - b);
    const costs: number[] = candidates.map(t =>
      nums.reduce((s, num, i) => s + cost[i] * Math.abs(num - t), 0)
    );

    const labels: string[] = candidates.map(v => `v=${v}`);

    function makeViz(activeIdx: number): DPVisualization {
      const highlights: Record<number, string> = {};
      const minC = Math.min(...costs);
      for (let i = 0; i < candidates.length; i++) {
        if (i === activeIdx) highlights[i] = 'active';
        else if (costs[i] === minC) highlights[i] = 'found';
        else highlights[i] = 'comparing';
      }
      return { type: 'dp-table', values: costs.slice(), highlights, labels };
    }

    steps.push({
      line: 1,
      explanation: `nums=[${nums.join(',')}], cost=[${cost.join(',')}]. Compute total cost for each candidate target value. Range: [${minVal}, ${maxVal}].`,
      variables: { n, minVal, maxVal },
      visualization: makeViz(-1),
    });

    for (let i = 0; i < candidates.length; i++) {
      const t = candidates[i];
      const totalCost = costs[i];

      steps.push({
        line: 6,
        explanation: `Target=${t}: total cost = sum(cost[i]*|nums[i]-${t}|) = ${totalCost}.`,
        variables: { target: t, totalCost },
        visualization: makeViz(i),
      });
    }

    const result = Math.min(...costs);
    const bestIdx = costs.indexOf(result);

    steps.push({
      line: 7,
      explanation: `Minimum cost = ${result} at target value ${candidates[bestIdx]} (weighted median).`,
      variables: { result, bestTarget: candidates[bestIdx] },
      visualization: makeViz(bestIdx),
    });

    return steps;
  },
};

export default minimumCostToMakeArrayEqual;

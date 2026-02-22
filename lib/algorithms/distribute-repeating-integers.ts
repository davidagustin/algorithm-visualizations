import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const distributeRepeatingIntegers: AlgorithmDefinition = {
  id: 'distribute-repeating-integers',
  title: 'Distribute Repeating Integers',
  leetcodeNumber: 1655,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given an array of integers and customer quantity requirements, determine if all customers can be satisfied. Uses bitmask DP over customer subsets where dp[mask] = minimum number of distinct integers needed to satisfy customers in mask.',
  tags: ['Dynamic Programming', 'Bitmask', 'Backtracking', 'Bit Manipulation'],
  code: {
    pseudocode: `function canDistribute(nums, quantity):
  count = frequency of each distinct value
  m = length(quantity)
  subSum[mask] = sum of quantity for customers in mask
  dp = array of size 2^m, fill false
  dp[0] = true
  for each cnt in count:
    for mask from 2^m-1 down to 0:
      if not dp[mask]: continue
      for sub = mask; sub > 0; sub = (sub-1) & mask:
        if subSum[sub] <= cnt:
          dp[mask | sub] = true
  return dp[(1<<m)-1]`,
    python: `def canDistribute(nums, quantity):
    from collections import Counter
    cnt = sorted(Counter(nums).values(), reverse=True)
    m = len(quantity)
    sub_sum = [0] * (1 << m)
    for mask in range(1 << m):
        for i in range(m):
            if mask & (1 << i):
                sub_sum[mask] += quantity[i]
    dp = [False] * (1 << m)
    dp[0] = True
    for c in cnt:
        for mask in range((1 << m) - 1, -1, -1):
            if not dp[mask]: continue
            sub = mask ^ ((1 << m) - 1)
            while sub:
                if sub_sum[sub] <= c:
                    dp[mask | sub] = True
                sub = (sub - 1) & (mask ^ ((1 << m) - 1))
    return dp[(1 << m) - 1]`,
    javascript: `function canDistribute(nums, quantity) {
  const cnt = Object.values(nums.reduce((f,x)=>(f[x]=(f[x]||0)+1,f),{}))
                    .sort((a,b)=>b-a);
  const m = quantity.length;
  const subSum = new Array(1 << m).fill(0);
  for (let mask = 0; mask < (1 << m); mask++)
    for (let i = 0; i < m; i++)
      if (mask & (1 << i)) subSum[mask] += quantity[i];
  const dp = new Array(1 << m).fill(false);
  dp[0] = true;
  for (const c of cnt) {
    for (let mask = (1 << m) - 1; mask >= 0; mask--) {
      if (!dp[mask]) continue;
      const avail = mask ^ ((1 << m) - 1);
      for (let sub = avail; sub > 0; sub = (sub - 1) & avail) {
        if (subSum[sub] <= c) dp[mask | sub] = true;
      }
    }
  }
  return dp[(1 << m) - 1];
}`,
    java: `public boolean canDistribute(int[] nums, int[] quantity) {
    Map<Integer,Integer> freq = new HashMap<>();
    for (int x : nums) freq.merge(x, 1, Integer::sum);
    int[] cnt = freq.values().stream().mapToInt(x->x).sorted().toArray();
    int m = quantity.length;
    int[] subSum = new int[1 << m];
    for (int mask = 0; mask < (1 << m); mask++)
        for (int i = 0; i < m; i++)
            if ((mask & (1 << i)) != 0) subSum[mask] += quantity[i];
    boolean[] dp = new boolean[1 << m];
    dp[0] = true;
    for (int c : cnt) {
        for (int mask = (1 << m) - 1; mask >= 0; mask--) {
            if (!dp[mask]) continue;
            int avail = mask ^ ((1 << m) - 1);
            for (int sub = avail; sub > 0; sub = (sub-1) & avail)
                if (subSum[sub] <= c) dp[mask | sub] = true;
        }
    }
    return dp[(1 << m) - 1];
}`,
  },
  defaultInput: { nums: [1, 2, 3, 4], quantity: [2] },
  inputFields: [
    {
      name: 'nums',
      label: 'Numbers',
      type: 'array',
      defaultValue: [1, 2, 3, 4],
      placeholder: '1,2,3,4',
      helperText: 'Array of integers to distribute',
    },
    {
      name: 'quantity',
      label: 'Customer Quantities',
      type: 'array',
      defaultValue: [2],
      placeholder: '2',
      helperText: 'Quantity each customer needs',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const quantity = (input.quantity as number[]).slice(0, 4);
    const m = quantity.length;
    const size = 1 << m;

    const freq: Record<number, number> = {};
    for (const x of nums) freq[x] = (freq[x] || 0) + 1;
    const cnt = Object.values(freq).sort((a, b) => b - a);

    const subSum: number[] = new Array(size).fill(0);
    for (let mask = 0; mask < size; mask++) {
      for (let i = 0; i < m; i++) {
        if (mask & (1 << i)) subSum[mask] += quantity[i];
      }
    }

    const dp: (number | null)[] = new Array(size).fill(0);
    dp[0] = 1;
    const labels: string[] = Array.from({ length: size }, (_, i) =>
      i.toString(2).padStart(m, '0')
    );
    const steps: AlgorithmStep[] = [];

    function makeViz(activeIdx: number | null, prevIdx: number | null): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let mask = 0; mask < size; mask++) {
        if (dp[mask] === 1) highlights[mask] = 'found';
      }
      if (prevIdx !== null) highlights[prevIdx] = 'comparing';
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'dp-table', values: dp.slice(), highlights, labels };
    }

    steps.push({
      line: 1,
      explanation: `nums=${JSON.stringify(nums)}, quantity=${JSON.stringify(quantity)}. counts=${JSON.stringify(cnt)}. dp[mask]=1 if customers in mask can be satisfied.`,
      variables: { cnt, quantity, m },
      visualization: makeViz(0, null),
    });

    for (const c of cnt) {
      for (let mask = size - 1; mask >= 0; mask--) {
        if (dp[mask] !== 1) continue;
        const avail = mask ^ (size - 1);
        for (let sub = avail; sub > 0; sub = (sub - 1) & avail) {
          if (subSum[sub] <= c && dp[mask | sub] !== 1) {
            dp[mask | sub] = 1;
            steps.push({
              line: 10,
              explanation: `cnt=${c}: mask=${mask.toString(2).padStart(m,'0')}, sub=${sub.toString(2).padStart(m,'0')} needs ${subSum[sub]}<=${c}. dp[${(mask|sub).toString(2).padStart(m,'0')}]=true.`,
              variables: { c, mask, sub, subSum: subSum[sub], newMask: mask | sub },
              visualization: makeViz(mask | sub, mask),
            });
          }
          if (sub === 0) break;
        }
      }
    }

    const fullMask = size - 1;
    const result = dp[fullMask] === 1;
    steps.push({
      line: 12,
      explanation: `dp[${fullMask.toString(2).padStart(m,'0')}]=${dp[fullMask]}. ${result ? 'All customers can be satisfied!' : 'Cannot satisfy all customers.'}`,
      variables: { result },
      visualization: makeViz(fullMask, null),
    });

    return steps;
  },
};

export default distributeRepeatingIntegers;

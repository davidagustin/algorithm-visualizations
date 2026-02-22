import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maxSumOfPairEqualDigitSum: AlgorithmDefinition = {
  id: 'max-sum-of-pair-equal-digit-sum',
  title: 'Max Sum of a Pair with Equal Sum of Digits',
  leetcodeNumber: 2342,
  difficulty: 'Medium',
  category: 'Prefix Sum',
  description:
    'Find the maximum sum of nums[i] + nums[j] where i != j and digitSum(nums[i]) == digitSum(nums[j]). Group numbers by their digit sum using a hash map, keeping the largest two per group. O(n * D) where D is number of digits.',
  tags: ['Prefix Sum', 'Hash Map', 'Array', 'Math'],
  code: {
    pseudocode: `function maximumSum(nums):
  best = {}  # digitSum -> largest num with that sum
  ans = -1
  for num in nums:
    ds = digitSum(num)
    if ds in best:
      ans = max(ans, best[ds] + num)
      best[ds] = max(best[ds], num)
    else:
      best[ds] = num
  return ans`,
    python: `def maximumSum(nums: list[int]) -> int:
    def digit_sum(n):
        s = 0
        while n:
            s += n % 10
            n //= 10
        return s

    best = {}
    ans = -1
    for num in nums:
        ds = digit_sum(num)
        if ds in best:
            ans = max(ans, best[ds] + num)
            best[ds] = max(best[ds], num)
        else:
            best[ds] = num
    return ans`,
    javascript: `function maximumSum(nums) {
  const digitSum = n => { let s = 0; while (n) { s += n % 10; n = Math.floor(n / 10); } return s; };
  const best = new Map();
  let ans = -1;
  for (const num of nums) {
    const ds = digitSum(num);
    if (best.has(ds)) {
      ans = Math.max(ans, best.get(ds) + num);
      best.set(ds, Math.max(best.get(ds), num));
    } else {
      best.set(ds, num);
    }
  }
  return ans;
}`,
    java: `public int maximumSum(int[] nums) {
    Map<Integer,Integer> best = new HashMap<>();
    int ans = -1;
    for (int num : nums) {
        int ds = 0, n = num;
        while (n > 0) { ds += n % 10; n /= 10; }
        if (best.containsKey(ds)) {
            ans = Math.max(ans, best.get(ds) + num);
            best.put(ds, Math.max(best.get(ds), num));
        } else best.put(ds, num);
    }
    return ans;
}`,
  },
  defaultInput: { nums: [18, 43, 36, 13, 7] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [18, 43, 36, 13, 7],
      placeholder: '18,43,36,13,7',
      helperText: 'Positive integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    const digitSum = (x: number) => {
      let s = 0;
      while (x) { s += x % 10; x = Math.floor(x / 10); }
      return s;
    };

    const best = new Map<number, number>();
    let ans = -1;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
      auxData: {
        label: 'Best by DigitSum',
        entries: Array.from(best.entries()).map(([ds, v]) => ({ key: `ds=${ds}`, value: `max=${v}` })),
      },
    });

    steps.push({
      line: 1,
      explanation: `Find max pair sum where digit sums match. nums = [${nums.join(', ')}].`,
      variables: { nums, ans },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < n; i++) {
      const ds = digitSum(nums[i]);

      steps.push({
        line: 4,
        explanation: `nums[${i}]=${nums[i]}, digitSum=${ds}. Best with ds=${ds}? ${best.has(ds) ? best.get(ds) : 'None'}.`,
        variables: { i, num: nums[i], digitSum: ds, 'best[ds]': best.get(ds) ?? 'N/A' },
        visualization: makeViz({ [i]: 'active' }, { [i]: `ds=${ds}` }),
      });

      if (best.has(ds)) {
        const candidate = best.get(ds)! + nums[i];
        const prevAns = ans;
        if (candidate > ans) ans = candidate;
        best.set(ds, Math.max(best.get(ds)!, nums[i]));

        steps.push({
          line: 7,
          explanation: `Pair found! best[${ds}](${best.get(ds)}) + nums[${i}](${nums[i]}) = ${candidate}. ans = ${ans}${candidate > prevAns ? ' (new max!)' : ''}.`,
          variables: { candidate, ans },
          visualization: makeViz({ [i]: 'found' }, { [i]: `pair=${candidate}` }),
        });
      } else {
        best.set(ds, nums[i]);
        steps.push({
          line: 9,
          explanation: `No previous with ds=${ds}. Record best[${ds}] = ${nums[i]}.`,
          variables: { 'best[ds]': nums[i] },
          visualization: makeViz({ [i]: 'visited' }, { [i]: `ds=${ds}` }),
        });
      }
    }

    steps.push({
      line: 10,
      explanation: `Done. Maximum pair sum with equal digit sums: ${ans}.`,
      variables: { result: ans },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        { 0: `ans=${ans}` },
      ),
    });

    return steps;
  },
};

export default maxSumOfPairEqualDigitSum;

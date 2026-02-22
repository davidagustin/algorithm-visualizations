import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumSumObtainedOfAnyPermutation: AlgorithmDefinition = {
  id: 'maximum-sum-obtained-of-any-permutation',
  title: 'Maximum Sum Obtained of Any Permutation',
  leetcodeNumber: 1589,
  difficulty: 'Medium',
  category: 'Prefix Sum',
  description:
    'Given requests [start, end] on an array, maximize the total sum. Count how many times each index is requested using a difference array (range increment), then sort both the frequency array and nums array in descending order to greedily assign largest values to most-requested indices. O(n log n).',
  tags: ['Prefix Sum', 'Greedy', 'Sorting', 'Array'],
  code: {
    pseudocode: `function maxSumRangeQuery(nums, requests):
  MOD = 1e9+7
  diff = difference array of size n+1
  for [s,e] in requests:
    diff[s]++; diff[e+1]--
  freq = prefix sum of diff
  sort nums desc, sort freq desc
  ans = sum of nums[i]*freq[i] for all i where freq[i]>0
  return ans % MOD`,
    python: `def maxSumRangeQuery(nums, requests):
    MOD = 10**9 + 7
    n = len(nums)
    diff = [0] * (n + 1)
    for s, e in requests:
        diff[s] += 1
        diff[e + 1] -= 1
    freq = list(itertools.accumulate(diff))
    nums.sort(reverse=True)
    freq.sort(reverse=True)
    return sum(a * b for a, b in zip(nums, freq) if b > 0) % MOD`,
    javascript: `function maxSumRangeQuery(nums, requests) {
  const MOD = 1_000_000_007n;
  const n = nums.length;
  const diff = new Array(n + 1).fill(0);
  for (const [s, e] of requests) { diff[s]++; diff[e+1]--; }
  const freq = [];
  let cur = 0;
  for (let i = 0; i < n; i++) { cur += diff[i]; freq.push(cur); }
  nums.sort((a,b) => b-a);
  freq.sort((a,b) => b-a);
  let ans = 0n;
  for (let i = 0; i < n && freq[i] > 0; i++) ans += BigInt(nums[i]) * BigInt(freq[i]);
  return Number(ans % MOD);
}`,
    java: `public int maxSumRangeQuery(int[] nums, int[][] requests) {
    final int MOD = 1_000_000_007;
    int n = nums.length;
    int[] diff = new int[n + 1];
    for (int[] r : requests) { diff[r[0]]++; diff[r[1]+1]--; }
    int[] freq = new int[n];
    int cur = 0;
    for (int i = 0; i < n; i++) { cur += diff[i]; freq[i] = cur; }
    Arrays.sort(nums); Arrays.sort(freq);
    long ans = 0;
    for (int i = 0; i < n; i++) if (freq[i] > 0) ans = (ans + (long)nums[i] * freq[i]) % MOD;
    return (int) ans;
}`,
  },
  defaultInput: { nums: [1, 2, 3, 4, 5], requests: [[1, 3], [0, 1]] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5],
      placeholder: '1,2,3,4,5',
      helperText: 'Array of integers',
    },
    {
      name: 'startReq',
      label: 'Request starts',
      type: 'array',
      defaultValue: [1, 0],
      placeholder: '1,0',
      helperText: 'Start indices of requests',
    },
    {
      name: 'endReq',
      label: 'Request ends',
      type: 'array',
      defaultValue: [3, 1],
      placeholder: '3,1',
      helperText: 'End indices of requests',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const starts = input.startReq as number[];
    const ends = input.endReq as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    const requests = starts.map((s, i) => [s, ends[i]]);

    const diff: number[] = new Array(n + 1).fill(0);
    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      arr?: number[],
    ): ArrayVisualization => ({
      type: 'array',
      array: arr ?? [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Maximize sum over requests. nums=[${nums.join(', ')}], requests=[${requests.map(r => `[${r}]`).join(', ')}]. Build difference array.`,
      variables: { nums, requests },
      visualization: makeViz({}, {}),
    });

    for (const [s, e] of requests) {
      diff[s]++;
      diff[e + 1]--;
      steps.push({
        line: 5,
        explanation: `Request [${s},${e}]: diff[${s}]++, diff[${e + 1}]--. diff=[${diff.slice(0, n).join(', ')}].`,
        variables: { s, e, diff: [...diff] },
        visualization: makeViz(
          Object.fromEntries(Array.from({ length: e - s + 1 }, (_, k) => [s + k, 'active'])),
          { [s]: 'start', [e]: 'end' },
        ),
      });
    }

    // Build freq
    const freq: number[] = [];
    let cur = 0;
    for (let i = 0; i < n; i++) { cur += diff[i]; freq.push(cur); }

    steps.push({
      line: 7,
      explanation: `Frequency array (prefix sum of diff): [${freq.join(', ')}]. This is how many times each index is requested.`,
      variables: { freq },
      visualization: makeViz(
        Object.fromEntries(freq.map((f, i) => [i, f > 0 ? 'active' : 'default'])),
        Object.fromEntries(freq.map((f, i) => [i, `f=${f}`])),
      ),
    });

    // Sort and compute
    const sortedNums = [...nums].sort((a, b) => b - a);
    const sortedFreq = [...freq].sort((a, b) => b - a);
    let ans = 0;
    for (let i = 0; i < n && sortedFreq[i] > 0; i++) ans += sortedNums[i] * sortedFreq[i];
    ans = ans % 1_000_000_007;

    steps.push({
      line: 9,
      explanation: `Sort nums desc=[${sortedNums.join(', ')}], freq desc=[${sortedFreq.join(', ')}]. Pair largest nums with most-requested. ans=${ans}.`,
      variables: { sortedNums, sortedFreq, result: ans },
      visualization: makeViz(
        Object.fromEntries(sortedNums.map((_, i) => [i, 'found'])),
        Object.fromEntries(sortedNums.map((v, i) => [i, `${v}*${sortedFreq[i]}`])),
        [...sortedNums],
      ),
    });

    return steps;
  },
};

export default maximumSumObtainedOfAnyPermutation;

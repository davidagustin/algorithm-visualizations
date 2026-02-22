import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const makeSumDivisibleByP: AlgorithmDefinition = {
  id: 'make-sum-divisible-by-p',
  title: 'Make Sum Divisible by P',
  leetcodeNumber: 1590,
  difficulty: 'Medium',
  category: 'Prefix Sum',
  description:
    'Find the smallest subarray to remove so the remaining sum is divisible by p. Compute total % p (target remainder). For each prefix sum mod p, check if a previous prefix sum equals (current - target + p) % p exists in a map. The gap length is the subarray to remove. O(n) time.',
  tags: ['Prefix Sum', 'Hash Map', 'Array'],
  code: {
    pseudocode: `function minSubarray(nums, p):
  target = sum(nums) % p
  if target == 0: return 0
  map = {0: -1}  # remainder -> latest index
  prefixSum = 0, minLen = n
  for i from 0 to n-1:
    prefixSum = (prefixSum + nums[i]) % p
    need = (prefixSum - target + p) % p
    if need in map:
      minLen = min(minLen, i - map[need])
    map[prefixSum] = i
  return minLen if minLen < n else -1`,
    python: `def minSubarray(nums: list[int], p: int) -> int:
    target = sum(nums) % p
    if target == 0: return 0
    last = {0: -1}
    prefix = 0
    min_len = len(nums)
    for i, num in enumerate(nums):
        prefix = (prefix + num) % p
        need = (prefix - target + p) % p
        if need in last:
            min_len = min(min_len, i - last[need])
        last[prefix] = i
    return min_len if min_len < len(nums) else -1`,
    javascript: `function minSubarray(nums, p) {
  const target = nums.reduce((a, b) => a + b, 0) % p;
  if (target === 0) return 0;
  const last = new Map([[0, -1]]);
  let prefix = 0, minLen = nums.length;
  for (let i = 0; i < nums.length; i++) {
    prefix = (prefix + nums[i]) % p;
    const need = (prefix - target + p) % p;
    if (last.has(need)) minLen = Math.min(minLen, i - last.get(need));
    last.set(prefix, i);
  }
  return minLen < nums.length ? minLen : -1;
}`,
    java: `public int minSubarray(int[] nums, int p) {
    int target = 0;
    for (int x : nums) target = (target + x) % p;
    if (target == 0) return 0;
    Map<Integer,Integer> last = new HashMap<>();
    last.put(0, -1);
    int prefix = 0, minLen = nums.length;
    for (int i = 0; i < nums.length; i++) {
        prefix = (prefix + nums[i]) % p;
        int need = (prefix - target + p) % p;
        if (last.containsKey(need)) minLen = Math.min(minLen, i - last.get(need));
        last.put(prefix, i);
    }
    return minLen < nums.length ? minLen : -1;
}`,
  },
  defaultInput: { nums: [3, 1, 4, 2], p: 6 },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [3, 1, 4, 2],
      placeholder: '3,1,4,2',
      helperText: 'Positive integers',
    },
    {
      name: 'p',
      label: 'Divisor p',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const p = input.p as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    const total = nums.reduce((a, b) => a + b, 0);
    const target = total % p;

    const last = new Map<number, number>([[0, -1]]);
    let prefix = 0;
    let minLen = n;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
      auxData: {
        label: 'Last Seen (rem -> idx)',
        entries: Array.from(last.entries()).map(([r, idx]) => ({ key: `rem=${r}`, value: `idx=${idx}` })),
      },
    });

    steps.push({
      line: 1,
      explanation: `Make sum divisible by p=${p}. total=${total}, target remainder=${target}${target === 0 ? ' → already divisible!' : ''}.`,
      variables: { total, target, p },
      visualization: makeViz({}, {}),
    });

    if (target === 0) {
      steps.push({
        line: 2,
        explanation: `Total sum is already divisible by ${p}. Return 0.`,
        variables: { result: 0 },
        visualization: makeViz(Object.fromEntries(nums.map((_, i) => [i, 'found'])), {}),
      });
      return steps;
    }

    for (let i = 0; i < n; i++) {
      prefix = (prefix + nums[i]) % p;
      const need = (prefix - target + p) % p;

      steps.push({
        line: 7,
        explanation: `Index ${i}: prefix mod p=${prefix}, need=${need} in last? ${last.has(need) ? `Yes at ${last.get(need)}` : 'No'}.`,
        variables: { i, prefix, need },
        visualization: makeViz({ [i]: 'active' }, { [i]: `r=${prefix}` }),
      });

      if (last.has(need)) {
        const prevIdx = last.get(need)!;
        const len = i - prevIdx;
        if (len < minLen) minLen = len;

        steps.push({
          line: 9,
          explanation: `Found! Subarray [${prevIdx + 1}..${i}] (length ${len}) can be removed. minLen=${minLen}.`,
          variables: { prevIdx, len, minLen },
          visualization: makeViz(
            Object.fromEntries(Array.from({ length: len }, (_, k) => [prevIdx + 1 + k, 'found'])),
            { [prevIdx + 1]: 'start', [i]: `len=${len}` },
          ),
        });
      }

      last.set(prefix, i);
    }

    const result = minLen < n ? minLen : -1;
    steps.push({
      line: 11,
      explanation: `Done. Minimum subarray length to remove: ${result}.`,
      variables: { result },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        { 0: `ans=${result}` },
      ),
    });

    return steps;
  },
};

export default makeSumDivisibleByP;

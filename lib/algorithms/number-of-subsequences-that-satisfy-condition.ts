import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfSubsequencesThatSatisfyCondition: AlgorithmDefinition = {
  id: 'number-of-subsequences-that-satisfy-condition',
  title: 'Number of Subsequences That Satisfy the Given Sum Condition',
  leetcodeNumber: 1498,
  difficulty: 'Medium',
  category: 'Two Pointers',
  description:
    'Count subsequences where the sum of min and max elements is <= target. Sort the array, then use two pointers: for each left pointer, find the rightmost index where nums[left]+nums[right]<=target. The count of valid subsequences with nums[left] as min is 2^(right-left).',
  tags: ['two pointers', 'array', 'sorting', 'combinatorics', 'modular arithmetic'],

  code: {
    pseudocode: `function numSubseq(nums, target):
  sort(nums)
  n = length(nums)
  MOD = 1e9+7
  precompute pow2[i] = 2^i mod MOD
  left = 0, right = n-1, ans = 0
  while left <= right:
    if nums[left] + nums[right] <= target:
      ans = (ans + pow2[right-left]) % MOD
      left++
    else:
      right--
  return ans`,

    python: `def numSubseq(nums: list[int], target: int) -> int:
    nums.sort()
    n = len(nums)
    MOD = 10**9 + 7
    pow2 = [1] * n
    for i in range(1, n):
        pow2[i] = pow2[i-1] * 2 % MOD
    left, right, ans = 0, n - 1, 0
    while left <= right:
        if nums[left] + nums[right] <= target:
            ans = (ans + pow2[right - left]) % MOD
            left += 1
        else:
            right -= 1
    return ans`,

    javascript: `function numSubseq(nums, target) {
  nums.sort((a, b) => a - b);
  const n = nums.length, MOD = 1e9 + 7;
  const pow2 = Array(n).fill(1);
  for (let i = 1; i < n; i++) pow2[i] = pow2[i-1] * 2 % MOD;
  let left = 0, right = n - 1, ans = 0;
  while (left <= right) {
    if (nums[left] + nums[right] <= target) {
      ans = (ans + pow2[right - left]) % MOD;
      left++;
    } else right--;
  }
  return ans;
}`,

    java: `public int numSubseq(int[] nums, int target) {
    Arrays.sort(nums);
    int n = nums.length, MOD = 1000000007;
    int[] pow2 = new int[n];
    pow2[0] = 1;
    for (int i = 1; i < n; i++) pow2[i] = pow2[i-1] * 2 % MOD;
    int left = 0, right = n - 1, ans = 0;
    while (left <= right) {
        if (nums[left] + nums[right] <= target) {
            ans = (ans + pow2[right - left]) % MOD;
            left++;
        } else right--;
    }
    return ans;
}`,
  },

  defaultInput: {
    nums: [3, 5, 6, 7],
    target: 9,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [3, 5, 6, 7],
      placeholder: '3,5,6,7',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'target',
      label: 'Target',
      type: 'number',
      defaultValue: 9,
      placeholder: '9',
      helperText: 'Max allowed sum of min+max of subsequence',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawNums = input.nums as number[];
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];

    const sorted = [...rawNums].sort((a, b) => a - b);
    const n = sorted.length;
    const MOD = 1000000007;

    const pow2: number[] = new Array(n).fill(1);
    for (let i = 1; i < n; i++) pow2[i] = (pow2[i - 1] * 2) % MOD;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...sorted],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Sort: [${sorted.join(', ')}]. Precompute powers of 2. For each valid (left,right) window, count 2^(right-left) subsequences.`,
      variables: { sorted: [...sorted], target },
      visualization: makeViz({}, {}),
    });

    let left = 0;
    let right = n - 1;
    let ans = 0;

    steps.push({
      line: 6,
      explanation: `Initialize left=${left}, right=${right}, ans=0.`,
      variables: { left, right, ans, target },
      visualization: makeViz({ [left]: 'pointer', [right]: 'pointer' }, { [left]: 'L', [right]: 'R' }),
    });

    while (left <= right) {
      const sum = sorted[left] + sorted[right];

      if (sum <= target) {
        const count = pow2[right - left];
        ans = (ans + count) % MOD;
        steps.push({
          line: 8,
          explanation: `nums[${left}]=${sorted[left]} + nums[${right}]=${sorted[right]}=${sum} <= ${target}. Add 2^(${right}-${left})=${count} subsequences. ans=${ans}. Advance left.`,
          variables: { left, right, sum, count, ans },
          visualization: makeViz(
            {
              [left]: 'found',
              ...Object.fromEntries(Array.from({ length: right - left - 1 }, (_, k) => [k + left + 1, 'comparing'])),
              [right]: 'found',
            },
            { [left]: 'min', [right]: 'max' }
          ),
        });
        left++;
      } else {
        steps.push({
          line: 10,
          explanation: `nums[${left}]=${sorted[left]} + nums[${right}]=${sorted[right]}=${sum} > ${target}. Shrink window from right.`,
          variables: { left, right, sum, ans },
          visualization: makeViz({ [left]: 'pointer', [right]: 'mismatch' }, { [left]: 'L', [right]: 'R' }),
        });
        right--;
      }
    }

    steps.push({
      line: 11,
      explanation: `Total valid subsequences: ${ans}.`,
      variables: { ans },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default numberOfSubsequencesThatSatisfyCondition;

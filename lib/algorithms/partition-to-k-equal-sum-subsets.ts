import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const partitionToKEqualSumSubsets: AlgorithmDefinition = {
  id: 'partition-to-k-equal-sum-subsets',
  title: 'Partition to K Equal Sum Subsets',
  leetcodeNumber: 698,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given an integer array and a number k, determine if the array can be partitioned into k non-empty subsets whose sums are all equal. Uses backtracking to try placing each number into one of k buckets, pruning when a bucket would exceed the target sum.',
  tags: ['backtracking', 'array', 'recursion', 'subset', 'partition'],

  code: {
    pseudocode: `function canPartitionKSubsets(nums, k):
  total = sum(nums)
  if total % k != 0: return false
  target = total / k
  sort nums descending
  if nums[0] > target: return false
  buckets = array of k zeros
  return backtrack(nums, 0, buckets, target)

function backtrack(nums, index, buckets, target):
  if index == length(nums): return true
  seen = set()
  for each bucket b:
    if buckets[b] + nums[index] <= target and buckets[b] not in seen:
      seen.add(buckets[b])
      buckets[b] += nums[index]
      if backtrack(nums, index+1, buckets, target): return true
      buckets[b] -= nums[index]
  return false`,

    python: `def canPartitionKSubsets(nums: list[int], k: int) -> bool:
    total = sum(nums)
    if total % k != 0:
        return False
    target = total // k
    nums.sort(reverse=True)
    if nums[0] > target:
        return False
    buckets = [0] * k
    def backtrack(index):
        if index == len(nums):
            return True
        seen = set()
        for b in range(k):
            if buckets[b] + nums[index] <= target and buckets[b] not in seen:
                seen.add(buckets[b])
                buckets[b] += nums[index]
                if backtrack(index + 1):
                    return True
                buckets[b] -= nums[index]
        return False
    return backtrack(0)`,

    javascript: `function canPartitionKSubsets(nums, k) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % k !== 0) return false;
  const target = total / k;
  nums.sort((a, b) => b - a);
  if (nums[0] > target) return false;
  const buckets = new Array(k).fill(0);
  function backtrack(index) {
    if (index === nums.length) return true;
    const seen = new Set();
    for (let b = 0; b < k; b++) {
      if (buckets[b] + nums[index] <= target && !seen.has(buckets[b])) {
        seen.add(buckets[b]);
        buckets[b] += nums[index];
        if (backtrack(index + 1)) return true;
        buckets[b] -= nums[index];
      }
    }
    return false;
  }
  return backtrack(0);
}`,

    java: `public boolean canPartitionKSubsets(int[] nums, int k) {
    int total = Arrays.stream(nums).sum();
    if (total % k != 0) return false;
    int target = total / k;
    Arrays.sort(nums);
    if (nums[nums.length - 1] > target) return false;
    int[] buckets = new int[k];
    return backtrack(nums, nums.length - 1, buckets, k, target);
}
private boolean backtrack(int[] nums, int index, int[] buckets, int k, int target) {
    if (index < 0) return true;
    Set<Integer> seen = new HashSet<>();
    for (int b = 0; b < k; b++) {
        if (buckets[b] + nums[index] <= target && seen.add(buckets[b])) {
            buckets[b] += nums[index];
            if (backtrack(nums, index - 1, buckets, k, target)) return true;
            buckets[b] -= nums[index];
        }
    }
    return false;
}`,
  },

  defaultInput: {
    nums: [4, 3, 2, 3, 5, 2, 1],
    k: 4,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Numbers',
      type: 'array',
      defaultValue: [4, 3, 2, 3, 5, 2, 1],
      placeholder: '4,3,2,3,5,2,1',
      helperText: 'Comma-separated positive integers',
    },
    {
      name: 'k',
      label: 'Number of Subsets (k)',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Number of equal-sum subsets to form',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = [...(input.nums as number[])].sort((a, b) => b - a);
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    const total = nums.reduce((a, b) => a + b, 0);

    steps.push({
      line: 1,
      explanation: `Checking partition feasibility. Total sum = ${total}, k = ${k}. Target per subset = ${total}/${k}.`,
      variables: { total, k, targetPerSubset: total % k === 0 ? total / k : 'N/A' },
      visualization: {
        type: 'array',
        array: nums,
        highlights: {},
        labels: nums.reduce((acc, _, i) => ({ ...acc, [i]: `${nums[i]}` }), {} as Record<number, string>),
      },
    });

    if (total % k !== 0) {
      steps.push({
        line: 3,
        explanation: `Total ${total} is not divisible by k=${k}. Partition is impossible.`,
        variables: { total, k, divisible: false },
        visualization: {
          type: 'array',
          array: nums,
          highlights: nums.reduce((acc, _, i) => ({ ...acc, [i]: 'mismatch' }), {}),
          labels: {},
        },
      });
      return steps;
    }

    const target = total / k;

    if (nums[0] > target) {
      steps.push({
        line: 7,
        explanation: `Largest element ${nums[0]} exceeds target ${target}. Partition is impossible.`,
        variables: { largest: nums[0], target, possible: false },
        visualization: {
          type: 'array',
          array: nums,
          highlights: { 0: 'mismatch' },
          labels: { 0: 'too big' },
        },
      });
      return steps;
    }

    const buckets = new Array(k).fill(0);
    let found = false;

    steps.push({
      line: 8,
      explanation: `Target per subset = ${target}. Nums sorted descending: [${nums.join(', ')}]. Starting backtracking with ${k} empty buckets.`,
      variables: { target, k, buckets: [...buckets], sortedNums: nums },
      visualization: {
        type: 'array',
        array: nums,
        highlights: {},
        labels: nums.reduce((acc, _, i) => ({ ...acc, [i]: `${nums[i]}` }), {} as Record<number, string>),
      },
    });

    function backtrack(index: number): boolean {
      if (index === nums.length) {
        found = true;
        steps.push({
          line: 10,
          explanation: `All numbers placed! Each bucket sums to ${target}. Partition is POSSIBLE!`,
          variables: { buckets: [...buckets], target, result: true },
          visualization: {
            type: 'array',
            array: [...buckets],
            highlights: buckets.reduce((acc, _, i) => ({ ...acc, [i]: 'found' }), {}),
            labels: buckets.reduce((acc, v, i) => ({ ...acc, [i]: `B${i+1}:${v}` }), {} as Record<number, string>),
          },
        });
        return true;
      }

      const seen = new Set<number>();
      for (let b = 0; b < k; b++) {
        if (buckets[b] + nums[index] <= target && !seen.has(buckets[b])) {
          seen.add(buckets[b]);
          buckets[b] += nums[index];

          steps.push({
            line: 14,
            explanation: `Place nums[${index}]=${nums[index]} into bucket ${b+1}. Bucket ${b+1} now = ${buckets[b]}/${target}.`,
            variables: { numPlaced: nums[index], bucket: b + 1, bucketSum: buckets[b], target, index },
            visualization: {
              type: 'array',
              array: [...buckets],
              highlights: { [b]: 'active' },
              labels: buckets.reduce((acc, v, i) => ({ ...acc, [i]: `B${i+1}:${v}` }), {} as Record<number, string>),
            },
          });

          if (backtrack(index + 1)) return true;

          buckets[b] -= nums[index];

          steps.push({
            line: 16,
            explanation: `Backtrack: remove ${nums[index]} from bucket ${b+1}. Bucket ${b+1} back to ${buckets[b]}.`,
            variables: { removed: nums[index], bucket: b + 1, bucketSum: buckets[b] },
            visualization: {
              type: 'array',
              array: [...buckets],
              highlights: { [b]: 'comparing' },
              labels: buckets.reduce((acc, v, i) => ({ ...acc, [i]: `B${i+1}:${v}` }), {} as Record<number, string>),
            },
          });
        }
      }
      return false;
    }

    const canPartition = backtrack(0);

    if (!found) {
      steps.push({
        line: 17,
        explanation: `Exhausted all possibilities. Cannot partition into ${k} subsets with equal sum ${target}.`,
        variables: { result: false, k, target },
        visualization: {
          type: 'array',
          array: nums,
          highlights: nums.reduce((acc, _, i) => ({ ...acc, [i]: 'mismatch' }), {}),
          labels: {},
        },
      });
    }

    return steps;
  },
};

export default partitionToKEqualSumSubsets;

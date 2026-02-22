import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const containsDuplicateIii: AlgorithmDefinition = {
  id: 'contains-duplicate-iii',
  title: 'Contains Duplicate III',
  leetcodeNumber: 220,
  difficulty: 'Hard',
  category: 'Sliding Window',
  description:
    'Given an integer array nums and two integers k and t, return true if there are two distinct indices i and j in the array such that abs(nums[i] - nums[j]) <= t and abs(i - j) <= k. Use a sliding window of size k with a sorted bucket approach to check value proximity.',
  tags: ['sliding window', 'bucket sort', 'ordered set', 'array'],

  code: {
    pseudocode: `function containsNearbyAlmostDuplicate(nums, k, t):
  buckets = {}
  w = t + 1
  for i in range(len(nums)):
    bucket = nums[i] // w
    if bucket in buckets:
      return true
    if bucket-1 in buckets and nums[i]-buckets[bucket-1] < w:
      return true
    if bucket+1 in buckets and buckets[bucket+1]-nums[i] < w:
      return true
    buckets[bucket] = nums[i]
    if i >= k:
      del buckets[nums[i-k] // w]
  return false`,

    python: `def containsNearbyAlmostDuplicate(nums, k, t):
    buckets = {}
    w = t + 1
    for i, n in enumerate(nums):
        bucket = n // w
        if bucket in buckets:
            return True
        if bucket - 1 in buckets and n - buckets[bucket-1] < w:
            return True
        if bucket + 1 in buckets and buckets[bucket+1] - n < w:
            return True
        buckets[bucket] = n
        if i >= k:
            del buckets[nums[i-k] // w]
    return False`,

    javascript: `function containsNearbyAlmostDuplicate(nums, k, t) {
  const buckets = new Map();
  const w = t + 1;
  for (let i = 0; i < nums.length; i++) {
    const bucket = Math.floor(nums[i] / w);
    if (buckets.has(bucket)) return true;
    if (buckets.has(bucket - 1) && nums[i] - buckets.get(bucket - 1) < w) return true;
    if (buckets.has(bucket + 1) && buckets.get(bucket + 1) - nums[i] < w) return true;
    buckets.set(bucket, nums[i]);
    if (i >= k) buckets.delete(Math.floor(nums[i - k] / w));
  }
  return false;
}`,

    java: `public boolean containsNearbyAlmostDuplicate(int[] nums, int k, int t) {
    Map<Long, Long> buckets = new HashMap<>();
    long w = (long) t + 1;
    for (int i = 0; i < nums.length; i++) {
        long bucket = Math.floorDiv(nums[i], w);
        if (buckets.containsKey(bucket)) return true;
        if (buckets.containsKey(bucket - 1) && nums[i] - buckets.get(bucket - 1) < w) return true;
        if (buckets.containsKey(bucket + 1) && buckets.get(bucket + 1) - nums[i] < w) return true;
        buckets.put(bucket, (long) nums[i]);
        if (i >= k) buckets.remove(Math.floorDiv(nums[i - k], w));
    }
    return false;
}`,
  },

  defaultInput: {
    nums: [1, 5, 9, 1, 5, 9],
    k: 2,
    t: 3,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 5, 9, 1, 5, 9],
      placeholder: '1,5,9,1,5,9',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'k',
      label: 'Index Distance k',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Max index distance between pair',
    },
    {
      name: 't',
      label: 'Value Difference t',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Max value difference between pair',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const t = input.t as number;
    const steps: AlgorithmStep[] = [];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Start: find two indices i,j where abs(nums[i]-nums[j]) <= ${t} and abs(i-j) <= ${k}. Window size = ${k}, bucket width = ${t + 1}.`,
      variables: { k, t, w: t + 1, result: false },
      visualization: makeViz({}, {}),
    });

    const buckets = new Map<number, number>();
    const w = t + 1;

    for (let i = 0; i < nums.length; i++) {
      const bucket = Math.floor(nums[i] / w);

      steps.push({
        line: 3,
        explanation: `Index ${i}: nums[${i}] = ${nums[i]}, bucket = floor(${nums[i]} / ${w}) = ${bucket}. Window covers indices [${Math.max(0, i - k)}..${i}].`,
        variables: { i, value: nums[i], bucket, windowSize: Math.min(i + 1, k + 1) },
        visualization: makeViz(
          { ...Object.fromEntries(Array.from({ length: Math.min(i, k) }, (_, idx) => [i - 1 - idx, 'active'])), [i]: 'current' },
          { [i]: `i=${i}` }
        ),
      });

      if (buckets.has(bucket)) {
        steps.push({
          line: 5,
          explanation: `Bucket ${bucket} already contains ${buckets.get(bucket)}. Difference is ${Math.abs(nums[i] - buckets.get(bucket)!)} <= ${t}. Return true!`,
          variables: { found: true, existing: buckets.get(bucket), current: nums[i] },
          visualization: makeViz({ [i]: 'found' }, { [i]: 'match' }),
        });
        return steps;
      }

      if (buckets.has(bucket - 1) && nums[i] - buckets.get(bucket - 1)! < w) {
        steps.push({
          line: 7,
          explanation: `Adjacent bucket ${bucket - 1} has ${buckets.get(bucket - 1)}. Difference ${nums[i] - buckets.get(bucket - 1)!} < ${w}. Return true!`,
          variables: { found: true, neighbor: buckets.get(bucket - 1), current: nums[i] },
          visualization: makeViz({ [i]: 'found' }, { [i]: 'match' }),
        });
        return steps;
      }

      if (buckets.has(bucket + 1) && buckets.get(bucket + 1)! - nums[i] < w) {
        steps.push({
          line: 9,
          explanation: `Adjacent bucket ${bucket + 1} has ${buckets.get(bucket + 1)}. Difference ${buckets.get(bucket + 1)! - nums[i]} < ${w}. Return true!`,
          variables: { found: true, neighbor: buckets.get(bucket + 1), current: nums[i] },
          visualization: makeViz({ [i]: 'found' }, { [i]: 'match' }),
        });
        return steps;
      }

      buckets.set(bucket, nums[i]);

      if (i >= k) {
        const removeBucket = Math.floor(nums[i - k] / w);
        buckets.delete(removeBucket);
        steps.push({
          line: 11,
          explanation: `Window full. Remove nums[${i - k}] = ${nums[i - k]} (bucket ${removeBucket}) from window. Window now has ${buckets.size} elements.`,
          variables: { i, removed: nums[i - k], removedBucket: removeBucket },
          visualization: makeViz({ [i - k]: 'sorted', [i]: 'active' }, { [i - k]: 'out', [i]: 'in' }),
        });
      }
    }

    steps.push({
      line: 12,
      explanation: 'Processed all elements. No valid pair found. Return false.',
      variables: { result: false },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default containsDuplicateIii;

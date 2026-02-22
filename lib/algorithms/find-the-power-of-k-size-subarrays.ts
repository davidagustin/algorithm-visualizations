import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findThePowerOfKSizeSubarrays: AlgorithmDefinition = {
  id: 'find-the-power-of-k-size-subarrays',
  title: 'Find the Power of K-Size Subarrays I',
  leetcodeNumber: 3254,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given an array nums and integer k, find the power of each k-size subarray. The power of an array is the maximum element if consecutive and sorted, otherwise -1. Return an array of results for each k-size window.',
  tags: ['sliding window', 'array'],

  code: {
    pseudocode: `function resultsArray(nums, k):
  result = []
  consec = 1
  for i in range(1, len(nums)):
    if nums[i] == nums[i-1] + 1:
      consec++
    else:
      consec = 1
    if i >= k - 1:
      if consec >= k:
        result.append(nums[i])
      else:
        result.append(-1)
  return result`,

    python: `def resultsArray(nums: list[int], k: int) -> list[int]:
    result = []
    consec = 1
    for i in range(1, len(nums)):
        if nums[i] == nums[i-1] + 1:
            consec += 1
        else:
            consec = 1
        if i >= k - 1:
            result.append(nums[i] if consec >= k else -1)
    if k == 1:
        return nums[:]
    return result`,

    javascript: `function resultsArray(nums, k) {
  if (k === 1) return [...nums];
  const result = [];
  let consec = 1;
  for (let i = 1; i < nums.length; i++) {
    consec = nums[i] === nums[i-1] + 1 ? consec + 1 : 1;
    if (i >= k - 1) result.push(consec >= k ? nums[i] : -1);
  }
  return result;
}`,

    java: `public int[] resultsArray(int[] nums, int k) {
    if (k == 1) return nums.clone();
    int n = nums.length;
    int[] result = new int[n - k + 1];
    int consec = 1;
    for (int i = 1; i < n; i++) {
        consec = nums[i] == nums[i-1] + 1 ? consec + 1 : 1;
        if (i >= k - 1) result[i - k + 1] = consec >= k ? nums[i] : -1;
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 4, 3, 2, 5],
    k: 3,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 3, 2, 5],
      placeholder: '1,2,3,4,3,2,5',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'k',
      label: 'Window Size k',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Size of each subarray window',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    steps.push({
      line: 1,
      explanation: `Find power of each ${k}-size subarray. A window is "powerful" if all elements are consecutive and sorted (difference of 1 each step). Power = max element or -1.`,
      variables: { k, windows: n - k + 1 },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    const result: number[] = [];
    let consec = 1;

    if (k === 1) {
      for (let i = 0; i < n; i++) {
        result.push(nums[i]);
        steps.push({
          line: 9,
          explanation: `Window of size 1 at index ${i}: power = ${nums[i]}.`,
          variables: { i, power: nums[i] },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [i]: 'active' },
            labels: { [i]: `${nums[i]}` },
          } as ArrayVisualization,
        });
      }
    } else {
      for (let i = 1; i < n; i++) {
        if (nums[i] === nums[i - 1] + 1) {
          consec++;
        } else {
          consec = 1;
        }

        if (i >= k - 1) {
          const power = consec >= k ? nums[i] : -1;
          result.push(power);
          const winStart = i - k + 1;

          steps.push({
            line: 9,
            explanation: `Window [${winStart}..${i}] = [${nums.slice(winStart, i + 1).join(', ')}]. Consecutive run length = ${consec}. ${consec >= k ? `Consecutive and sorted! Power = ${nums[i]}.` : `Not fully consecutive. Power = -1.`}`,
            variables: { windowStart: winStart, windowEnd: i, consec, power, result: [...result] },
            visualization: {
              type: 'array',
              array: [...nums],
              highlights: Object.fromEntries(Array.from({ length: k }, (_, idx) => [winStart + idx, power !== -1 ? 'found' : 'mismatch'])),
              labels: { [winStart]: 'L', [i]: 'R' },
            } as ArrayVisualization,
          });
        }
      }
    }

    steps.push({
      line: 12,
      explanation: `Result array: [${result.join(', ')}].`,
      variables: { result: result.join(',') },
      visualization: {
        type: 'array',
        array: result,
        highlights: Object.fromEntries(result.map((v, i) => [i, v !== -1 ? 'found' : 'mismatch'])),
        labels: {},
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default findThePowerOfKSizeSubarrays;

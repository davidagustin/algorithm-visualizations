import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maxSumOfTwoNonOverlappingSubarrays: AlgorithmDefinition = {
  id: 'max-sum-of-two-non-overlapping-subarrays',
  title: 'Maximum Sum of Two Non-Overlapping Subarrays',
  leetcodeNumber: 1031,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given an integer array nums and two integers firstLen and secondLen, find the maximum sum of elements in two non-overlapping subarrays of lengths firstLen and secondLen. Consider two cases: the firstLen subarray appears before the secondLen subarray, and vice versa. Use prefix sums and track rolling maximum of each subarray as you slide.',
  tags: ['sliding window', 'array', 'prefix sum', 'greedy'],

  code: {
    pseudocode: `function maxSumTwoNoOverlap(nums, firstLen, secondLen):
  prefix = build prefix sums
  result = 0
  maxFirst = 0
  for i in range(firstLen + secondLen - 1, len(nums)):
    maxFirst = max(maxFirst, prefix[i - secondLen + 1] - prefix[i - secondLen - firstLen + 1])
    result = max(result, maxFirst + prefix[i + 1] - prefix[i - secondLen + 1])
  maxSecond = 0
  for i in range(firstLen + secondLen - 1, len(nums)):
    maxSecond = max(maxSecond, prefix[i - firstLen + 1] - prefix[i - firstLen - secondLen + 1])
    result = max(result, maxSecond + prefix[i + 1] - prefix[i - firstLen + 1])
  return result`,

    python: `def maxSumTwoNoOverlap(nums: list[int], firstLen: int, secondLen: int) -> int:
    n = len(nums)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i+1] = prefix[i] + nums[i]
    def rangeSum(l, r): return prefix[r+1] - prefix[l]
    result = maxL = maxR = 0
    for i in range(firstLen + secondLen - 1, n):
        maxL = max(maxL, rangeSum(i - firstLen - secondLen + 1, i - secondLen))
        maxR = max(maxR, rangeSum(i - firstLen - secondLen + 1, i - firstLen))
        result = max(result,
                     maxL + rangeSum(i - secondLen + 1, i),
                     maxR + rangeSum(i - firstLen + 1, i))
    return result`,

    javascript: `function maxSumTwoNoOverlap(nums, firstLen, secondLen) {
  const n = nums.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i+1] = prefix[i] + nums[i];
  const sum = (l, r) => prefix[r+1] - prefix[l];
  let result = 0, maxL = 0, maxR = 0;
  for (let i = firstLen + secondLen - 1; i < n; i++) {
    maxL = Math.max(maxL, sum(i - firstLen - secondLen + 1, i - secondLen));
    maxR = Math.max(maxR, sum(i - firstLen - secondLen + 1, i - firstLen));
    result = Math.max(result,
      maxL + sum(i - secondLen + 1, i),
      maxR + sum(i - firstLen + 1, i));
  }
  return result;
}`,

    java: `public int maxSumTwoNoOverlap(int[] nums, int firstLen, int secondLen) {
    int n = nums.length;
    int[] p = new int[n+1];
    for (int i = 0; i < n; i++) p[i+1] = p[i] + nums[i];
    IntBinaryOperator s = (l,r) -> p[r+1] - p[l];
    int result = 0, maxL = 0, maxR = 0;
    for (int i = firstLen + secondLen - 1; i < n; i++) {
        maxL = Math.max(maxL, s.applyAsInt(i-firstLen-secondLen+1, i-secondLen));
        maxR = Math.max(maxR, s.applyAsInt(i-firstLen-secondLen+1, i-firstLen));
        result = Math.max(result, Math.max(
            maxL + s.applyAsInt(i-secondLen+1, i),
            maxR + s.applyAsInt(i-firstLen+1, i)));
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [0, 6, 5, 2, 2, 5, 1, 9, 4],
    firstLen: 1,
    secondLen: 2,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [0, 6, 5, 2, 2, 5, 1, 9, 4],
      placeholder: '0,6,5,2,2,5,1,9,4',
      helperText: 'Array of non-negative integers',
    },
    {
      name: 'firstLen',
      label: 'First Subarray Length',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Length of first non-overlapping subarray',
    },
    {
      name: 'secondLen',
      label: 'Second Subarray Length',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Length of second non-overlapping subarray',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const firstLen = input.firstLen as number;
    const secondLen = input.secondLen as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    const prefix = new Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
    const rangeSum = (l: number, r: number) => prefix[r + 1] - prefix[l];

    steps.push({
      line: 1,
      explanation: `Find max sum of two non-overlapping subarrays of lengths ${firstLen} and ${secondLen}. Prefix sums: [${prefix.join(', ')}].`,
      variables: { firstLen, secondLen, prefixSums: prefix.join(', ') },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      },
    });

    let result = 0;
    let maxL = 0;
    let maxR = 0;

    for (let i = firstLen + secondLen - 1; i < n; i++) {
      const lStart = i - firstLen - secondLen + 1;
      const lEnd = i - secondLen;
      const rStart = i - firstLen - secondLen + 1;
      const rEnd = i - firstLen;
      const secondStart = i - secondLen + 1;
      const firstStart = i - firstLen + 1;

      maxL = Math.max(maxL, lStart >= 0 ? rangeSum(lStart, lEnd) : 0);
      maxR = Math.max(maxR, rStart >= 0 ? rangeSum(rStart, rEnd) : 0);

      const option1 = maxL + rangeSum(secondStart, i);
      const option2 = maxR + rangeSum(firstStart, i);
      const prevResult = result;
      result = Math.max(result, option1, option2);

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      if (option1 > option2) {
        for (let j = lStart >= 0 ? lStart : 0; j <= lEnd; j++) highlights[j] = 'active';
        for (let j = secondStart; j <= i; j++) highlights[j] = 'found';
        labels[secondStart] = '2nd';
        labels[i] = 'R';
      } else {
        for (let j = rStart >= 0 ? rStart : 0; j <= rEnd; j++) highlights[j] = 'active';
        for (let j = firstStart; j <= i; j++) highlights[j] = 'found';
        labels[firstStart] = '1st';
        labels[i] = 'R';
      }

      steps.push({
        line: 6,
        explanation: `i=${i}. Case1=(first then second): maxL=${maxL} + second[${secondStart}..${i}]=${rangeSum(secondStart, i)} = ${option1}. Case2=(second then first): maxR=${maxR} + first[${firstStart}..${i}]=${rangeSum(firstStart, i)} = ${option2}. Best=${result}.`,
        variables: { i, maxL, maxR, option1, option2, result },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights,
          labels,
        },
      });
    }

    steps.push({
      line: 10,
      explanation: `Done. Maximum sum of two non-overlapping subarrays (lengths ${firstLen} and ${secondLen}) = ${result}.`,
      variables: { result, firstLen, secondLen },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      },
    });

    return steps;
  },
};

export default maxSumOfTwoNonOverlappingSubarrays;

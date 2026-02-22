import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const numberOfLongestIncreasingSubsequence: AlgorithmDefinition = {
  id: 'number-of-longest-increasing-subsequence',
  title: 'Number of Longest Increasing Subsequences',
  leetcodeNumber: 673,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given an integer array nums, return the number of longest increasing subsequences. Maintain two DP arrays: len[i] is the length of the LIS ending at index i, and cnt[i] is the count of such subsequences. If a longer LIS is found update len and reset cnt; if equal length, add to cnt.',
  tags: ['dynamic programming', 'array', 'LIS', 'counting'],

  code: {
    pseudocode: `function findNumberOfLIS(nums):
  n = len(nums)
  len_ = [1]*n, cnt = [1]*n
  for i from 1 to n-1:
    for j from 0 to i-1:
      if nums[j] < nums[i]:
        if len_[j]+1 > len_[i]:
          len_[i] = len_[j]+1; cnt[i] = cnt[j]
        elif len_[j]+1 == len_[i]:
          cnt[i] += cnt[j]
  maxLen = max(len_)
  return sum(cnt[i] for i if len_[i]==maxLen)`,

    python: `def findNumberOfLIS(nums: list[int]) -> int:
    n = len(nums)
    length = [1] * n
    count = [1] * n
    for i in range(1, n):
        for j in range(i):
            if nums[j] < nums[i]:
                if length[j] + 1 > length[i]:
                    length[i] = length[j] + 1
                    count[i] = count[j]
                elif length[j] + 1 == length[i]:
                    count[i] += count[j]
    max_len = max(length)
    return sum(c for l, c in zip(length, count) if l == max_len)`,

    javascript: `function findNumberOfLIS(nums) {
  const n = nums.length;
  const len = new Array(n).fill(1);
  const cnt = new Array(n).fill(1);
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        if (len[j] + 1 > len[i]) {
          len[i] = len[j] + 1;
          cnt[i] = cnt[j];
        } else if (len[j] + 1 === len[i]) {
          cnt[i] += cnt[j];
        }
      }
    }
  }
  const maxLen = Math.max(...len);
  return len.reduce((acc, l, i) => l === maxLen ? acc + cnt[i] : acc, 0);
}`,

    java: `public int findNumberOfLIS(int[] nums) {
    int n = nums.length;
    int[] len = new int[n], cnt = new int[n];
    Arrays.fill(len, 1); Arrays.fill(cnt, 1);
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                if (len[j] + 1 > len[i]) {
                    len[i] = len[j] + 1; cnt[i] = cnt[j];
                } else if (len[j] + 1 == len[i]) {
                    cnt[i] += cnt[j];
                }
            }
        }
    }
    int maxLen = 0;
    for (int l : len) maxLen = Math.max(maxLen, l);
    int res = 0;
    for (int i = 0; i < n; i++) if (len[i] == maxLen) res += cnt[i];
    return res;
}`,
  },

  defaultInput: { nums: [1, 3, 5, 4, 7] },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 3, 5, 4, 7],
      placeholder: '1,3,5,4,7',
      helperText: 'Integer array to find longest increasing subsequences',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const n = nums.length;
    const steps: AlgorithmStep[] = [];

    const len: number[] = Array(n).fill(1);
    const cnt: number[] = Array(n).fill(1);

    steps.push({
      line: 2,
      explanation: `Initialize len[] = [${len.join(',')}] and cnt[] = [${cnt.join(',')}]. Each element is an LIS of length 1 with count 1.`,
      variables: { len: len.join(','), cnt: cnt.join(',') },
      visualization: {
        type: 'dp-table',
        values: [...len],
        highlights: Object.fromEntries(len.map((_, i) => [i, 'pointer'])),
        labels: nums.map((v, i) => `[${i}]=${v}`),
      },
    });

    for (let i = 1; i < n; i++) {
      for (let j = 0; j < i; j++) {
        if (nums[j] < nums[i]) {
          if (len[j] + 1 > len[i]) {
            len[i] = len[j] + 1;
            cnt[i] = cnt[j];
            steps.push({
              line: 7,
              explanation: `i=${i}(val=${nums[i]}), j=${j}(val=${nums[j]}): new longer LIS found. len[${i}]=${len[i]}, cnt[${i}]=${cnt[i]} (copied from cnt[${j}]).`,
              variables: { i, j, [`len[${i}]`]: len[i], [`cnt[${i}]`]: cnt[i] },
              visualization: {
                type: 'dp-table',
                values: [...len],
                highlights: Object.fromEntries(len.map((_, k) => [k, k === i ? 'active' : k === j ? 'comparing' : 'default'])),
                labels: nums.map((v, k) => `[${k}]=${v}`),
              },
            });
          } else if (len[j] + 1 === len[i]) {
            cnt[i] += cnt[j];
            steps.push({
              line: 9,
              explanation: `i=${i}(val=${nums[i]}), j=${j}(val=${nums[j]}): same length LIS found. cnt[${i}] += cnt[${j}] => cnt[${i}]=${cnt[i]}.`,
              variables: { i, j, [`len[${i}]`]: len[i], [`cnt[${i}]`]: cnt[i] },
              visualization: {
                type: 'dp-table',
                values: [...len],
                highlights: Object.fromEntries(len.map((_, k) => [k, k === i ? 'active' : k === j ? 'comparing' : 'default'])),
                labels: nums.map((v, k) => `[${k}]=${v}`),
              },
            });
          }
        }
      }
    }

    const maxLen = Math.max(...len);
    let result = 0;
    for (let i = 0; i < n; i++) if (len[i] === maxLen) result += cnt[i];

    steps.push({
      line: 11,
      explanation: `Max LIS length = ${maxLen}. Sum counts where len[i] == ${maxLen}: result = ${result}.`,
      variables: { maxLen, result, len: len.join(','), cnt: cnt.join(',') },
      visualization: {
        type: 'dp-table',
        values: [...len],
        highlights: Object.fromEntries(len.map((v, i) => [i, v === maxLen ? 'found' : 'sorted'])),
        labels: nums.map((v, i) => `[${i}]=${v}`),
      },
    });

    return steps;
  },
};

export default numberOfLongestIncreasingSubsequence;

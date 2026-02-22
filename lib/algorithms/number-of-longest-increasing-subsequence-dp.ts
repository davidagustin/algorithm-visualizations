import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfLongestIncreasingSubsequenceDp: AlgorithmDefinition = {
  id: 'number-of-longest-increasing-subsequence-dp',
  title: 'Number of Longest Increasing Subsequences (DP)',
  leetcodeNumber: 673,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Count the number of distinct longest increasing subsequences. dp[i] = LIS length ending at index i. count[i] = number of LIS of that length ending at i. If extending from j gives same length, add counts; if longer, reset count.',
  tags: ['dynamic programming', 'array', 'lis', 'counting'],

  code: {
    pseudocode: `function findNumberOfLIS(nums):
  n = len(nums)
  dp[i] = LIS length ending at i (init 1)
  cnt[i] = number of such LIS (init 1)
  for i in 1..n-1:
    for j in 0..i-1:
      if nums[j] < nums[i]:
        if dp[j]+1 > dp[i]:
          dp[i] = dp[j]+1; cnt[i] = cnt[j]
        elif dp[j]+1 == dp[i]:
          cnt[i] += cnt[j]
  maxLen = max(dp)
  return sum(cnt[i] for i if dp[i]==maxLen)`,
    python: `def findNumberOfLIS(nums: list[int]) -> int:
    n = len(nums)
    dp = [1]*n; cnt = [1]*n
    for i in range(1,n):
        for j in range(i):
            if nums[j] < nums[i]:
                if dp[j]+1 > dp[i]:
                    dp[i]=dp[j]+1; cnt[i]=cnt[j]
                elif dp[j]+1==dp[i]:
                    cnt[i]+=cnt[j]
    maxLen = max(dp)
    return sum(c for d,c in zip(dp,cnt) if d==maxLen)`,
    javascript: `function findNumberOfLIS(nums) {
  const n=nums.length,dp=new Array(n).fill(1),cnt=new Array(n).fill(1);
  for(let i=1;i<n;i++)for(let j=0;j<i;j++)
    if(nums[j]<nums[i])
      if(dp[j]+1>dp[i]){dp[i]=dp[j]+1;cnt[i]=cnt[j];}
      else if(dp[j]+1===dp[i]) cnt[i]+=cnt[j];
  const maxLen=Math.max(...dp);
  return dp.reduce((s,d,i)=>s+(d===maxLen?cnt[i]:0),0);
}`,
    java: `public int findNumberOfLIS(int[] nums) {
    int n=nums.length;
    int[] dp=new int[n],cnt=new int[n];
    Arrays.fill(dp,1);Arrays.fill(cnt,1);
    for(int i=1;i<n;i++)for(int j=0;j<i;j++)
        if(nums[j]<nums[i])
            if(dp[j]+1>dp[i]){dp[i]=dp[j]+1;cnt[i]=cnt[j];}
            else if(dp[j]+1==dp[i]) cnt[i]+=cnt[j];
    int maxLen=0,res=0;
    for(int d:dp) maxLen=Math.max(maxLen,d);
    for(int i=0;i<n;i++) if(dp[i]==maxLen) res+=cnt[i];
    return res;
}`,
  },

  defaultInput: {
    nums: [1, 3, 5, 4, 7],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 3, 5, 4, 7],
      placeholder: '1,3,5,4,7',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const n = nums.length;
    const steps: AlgorithmStep[] = [];
    const dp: number[] = new Array(n).fill(1);
    const cnt: number[] = new Array(n).fill(1);

    steps.push({
      line: 2,
      explanation: `nums=[${nums}]. dp[i]=LIS length ending at i, cnt[i]=count of such LIS. Both init to 1.`,
      variables: { dp: JSON.stringify(dp), cnt: JSON.stringify(cnt) },
      visualization: {
        type: 'array',
        array: [...dp],
        highlights: {},
        labels: nums.reduce((a, _, i) => ({ ...a, [i]: `cnt=${cnt[i]}` }), {}),
      } as ArrayVisualization,
    });

    for (let i = 1; i < n; i++) {
      for (let j = 0; j < i; j++) {
        if (nums[j] < nums[i]) {
          if (dp[j] + 1 > dp[i]) {
            dp[i] = dp[j] + 1;
            cnt[i] = cnt[j];
            steps.push({
              line: 8,
              explanation: `nums[${j}]=${nums[j]}<nums[${i}]=${nums[i]}: dp[${j}]+1=${dp[j] + 1}>dp[${i}] old. dp[${i}]=${dp[i]}, cnt[${i}]=cnt[${j}]=${cnt[i]}.`,
              variables: { i, j, 'dp[i]': dp[i], 'cnt[i]': cnt[i] },
              visualization: {
                type: 'array',
                array: [...dp],
                highlights: { [i]: 'active', [j]: 'found' },
                labels: { [i]: `dp=${dp[i]},cnt=${cnt[i]}` },
              } as ArrayVisualization,
            });
          } else if (dp[j] + 1 === dp[i]) {
            cnt[i] += cnt[j];
            steps.push({
              line: 10,
              explanation: `nums[${j}]=${nums[j]}<nums[${i}]=${nums[i]}: dp[${j}]+1 == dp[${i}]. cnt[${i}] += cnt[${j}]=${cnt[j]}. cnt[${i}]=${cnt[i]}.`,
              variables: { i, j, 'dp[i]': dp[i], 'cnt[i]': cnt[i] },
              visualization: {
                type: 'array',
                array: [...cnt],
                highlights: { [i]: 'active', [j]: 'comparing' },
                labels: { [i]: `cnt=${cnt[i]}` },
              } as ArrayVisualization,
            });
          }
        }
      }
    }

    const maxLen = Math.max(...dp);
    const result = dp.reduce((s, d, i) => s + (d === maxLen ? cnt[i] : 0), 0);

    steps.push({
      line: 12,
      explanation: `maxLen=${maxLen}. Count all cnt[i] where dp[i]==maxLen. Result=${result}.`,
      variables: { maxLen, result, dp: JSON.stringify(dp), cnt: JSON.stringify(cnt) },
      visualization: {
        type: 'array',
        array: [...cnt],
        highlights: dp.reduce((a, d, i) => (d === maxLen ? { ...a, [i]: 'found' } : a), {}),
        labels: dp.reduce((a, d, i) => (d === maxLen ? { ...a, [i]: `cnt=${cnt[i]}` } : a), {}),
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default numberOfLongestIncreasingSubsequenceDp;

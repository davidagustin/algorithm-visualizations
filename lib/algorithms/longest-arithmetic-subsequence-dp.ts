import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestArithmeticSubsequenceDp: AlgorithmDefinition = {
  id: 'longest-arithmetic-subsequence-dp',
  title: 'Longest Arithmetic Subsequence (DP)',
  leetcodeNumber: 1027,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Find the length of the longest arithmetic subsequence in an array. dp[i] is a map from difference d to the length of longest arithmetic subsequence ending at index i with common difference d. For each pair (j, i), update dp[i][nums[i]-nums[j]] = dp[j][diff] + 1.',
  tags: ['dynamic programming', 'hash map', 'array', 'arithmetic'],

  code: {
    pseudocode: `function longestArithSeqLength(nums):
  n = len(nums)
  dp[i] = map: diff -> longest arith subseq ending at i
  for i in 0..n-1:
    for j in 0..i-1:
      diff = nums[i] - nums[j]
      prev = dp[j].get(diff, 1)
      dp[i][diff] = max(dp[i].get(diff,2), prev+1)
  return max(max(v) for v in dp)`,
    python: `def longestArithSeqLength(nums: list[int]) -> int:
    n = len(nums)
    dp = [dict() for _ in range(n)]
    result = 2
    for i in range(1, n):
        for j in range(i):
            diff = nums[i]-nums[j]
            prev = dp[j].get(diff, 1)
            dp[i][diff] = max(dp[i].get(diff, 2), prev+1)
            result = max(result, dp[i][diff])
    return result`,
    javascript: `function longestArithSeqLength(nums) {
  const n=nums.length,dp=Array.from({length:n},()=>new Map());
  let result=2;
  for(let i=1;i<n;i++)for(let j=0;j<i;j++){
    const diff=nums[i]-nums[j];
    const prev=(dp[j].get(diff)||1);
    const val=Math.max(dp[i].get(diff)||2,prev+1);
    dp[i].set(diff,val);
    result=Math.max(result,val);
  }
  return result;
}`,
    java: `public int longestArithSeqLength(int[] nums) {
    int n=nums.length;
    Map<Integer,Integer>[] dp=new HashMap[n];
    for(int i=0;i<n;i++) dp[i]=new HashMap<>();
    int result=2;
    for(int i=1;i<n;i++)for(int j=0;j<i;j++){
        int diff=nums[i]-nums[j];
        int prev=dp[j].getOrDefault(diff,1);
        int val=Math.max(dp[i].getOrDefault(diff,2),prev+1);
        dp[i].put(diff,val);
        result=Math.max(result,val);
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [3, 6, 9, 12],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [3, 6, 9, 12],
      placeholder: '3,6,9,12',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const n = nums.length;
    const steps: AlgorithmStep[] = [];

    const dp: Map<number, number>[] = Array.from({ length: n }, () => new Map());
    let result = 2;

    steps.push({
      line: 1,
      explanation: `nums=[${nums}]. dp[i] maps difference -> longest arith subseq length ending at i.`,
      variables: { nums: JSON.stringify(nums), n },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    for (let i = 1; i < n; i++) {
      steps.push({
        line: 4,
        explanation: `i=${i}: nums[i]=${nums[i]}. Check all j<${i}.`,
        variables: { i, 'nums[i]': nums[i] },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: { [i]: 'active' },
          labels: { [i]: `i=${i}` },
        } as ArrayVisualization,
      });

      for (let j = 0; j < i; j++) {
        const diff = nums[i] - nums[j];
        const prev = dp[j].get(diff) ?? 1;
        const val = Math.max(dp[i].get(diff) ?? 2, prev + 1);
        dp[i].set(diff, val);
        if (val > result) {
          result = val;
          steps.push({
            line: 7,
            explanation: `j=${j}: diff=${diff}, prev=${prev}. dp[${i}][${diff}]=${val}. New best result=${result}.`,
            variables: { i, j, diff, val, result },
            visualization: {
              type: 'array',
              array: [...nums],
              highlights: { [i]: 'found', [j]: 'comparing' },
              labels: { [i]: `len=${val}`, [j]: `diff=${diff}` },
            } as ArrayVisualization,
          });
        }
      }
    }

    steps.push({
      line: 9,
      explanation: `Longest arithmetic subsequence length = ${result}.`,
      variables: { result },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: { 0: `ans=${result}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default longestArithmeticSubsequenceDp;

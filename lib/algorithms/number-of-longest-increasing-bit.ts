import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfLongestIncreasingBIT: AlgorithmDefinition = {
  id: 'number-of-longest-increasing-bit',
  title: 'Number of Longest Increasing Subsequences (BIT)',
  leetcodeNumber: 673,
  difficulty: 'Hard',
  category: 'Tree',
  description:
    'Count the number of longest increasing subsequences. Use two BITs after coordinate compression: one tracks max LIS length ending at each rank, another tracks count of such subsequences. For each element, query both BITs, then update.',
  tags: ['Binary Indexed Tree', 'Dynamic Programming', 'Segment Tree'],
  code: {
    pseudocode: `function findNumberOfLIS(nums):
  coords = sorted unique values
  rank[v] = 1-indexed position
  lenBIT = max-BIT for LIS lengths
  cntBIT = count-BIT for number of LIS

  for x in nums:
    r = rank[x]
    bestLen = lenBIT.queryMax(r-1) + 1
    bestCnt = (bestLen == 1) ? 1 : cntBIT.queryCountAtMax(r-1, bestLen-1)
    lenBIT.update(r, bestLen)
    cntBIT.update(r, bestLen, bestCnt)

  globalLen = lenBIT.queryMax(all)
  return cntBIT.queryCountAtMax(all, globalLen)`,
    python: `class Solution:
    def findNumberOfLIS(self, nums):
        if not nums: return 0
        n = len(nums)
        dp_len = [1] * n
        dp_cnt = [1] * n

        for i in range(n):
            for j in range(i):
                if nums[j] < nums[i]:
                    if dp_len[j] + 1 > dp_len[i]:
                        dp_len[i] = dp_len[j] + 1
                        dp_cnt[i] = dp_cnt[j]
                    elif dp_len[j] + 1 == dp_len[i]:
                        dp_cnt[i] += dp_cnt[j]

        maxLen = max(dp_len)
        return sum(c for l,c in zip(dp_len,dp_cnt) if l==maxLen)`,
    javascript: `var findNumberOfLIS = function(nums) {
  const n=nums.length;
  const dpLen=new Array(n).fill(1);
  const dpCnt=new Array(n).fill(1);
  for(let i=0;i<n;i++){
    for(let j=0;j<i;j++){
      if(nums[j]<nums[i]){
        if(dpLen[j]+1>dpLen[i]){dpLen[i]=dpLen[j]+1;dpCnt[i]=dpCnt[j];}
        else if(dpLen[j]+1===dpLen[i]) dpCnt[i]+=dpCnt[j];
      }
    }
  }
  const maxLen=Math.max(...dpLen);
  return dpLen.reduce((s,l,i)=>l===maxLen?s+dpCnt[i]:s,0);
};`,
    java: `class Solution {
    public int findNumberOfLIS(int[] nums) {
        int n=nums.length;
        int[] len=new int[n], cnt=new int[n];
        Arrays.fill(len,1); Arrays.fill(cnt,1);
        for(int i=0;i<n;i++)
            for(int j=0;j<i;j++)
                if(nums[j]<nums[i]){
                    if(len[j]+1>len[i]){len[i]=len[j]+1;cnt[i]=cnt[j];}
                    else if(len[j]+1==len[i]) cnt[i]+=cnt[j];
                }
        int maxLen=0; for(int l:len) maxLen=Math.max(maxLen,l);
        int ans=0; for(int i=0;i<n;i++) if(len[i]==maxLen) ans+=cnt[i];
        return ans;
    }
}`,
  },
  defaultInput: { nums: [1, 3, 5, 4, 7] },
  inputFields: [
    { name: 'nums', label: 'Array', type: 'array', defaultValue: [1,3,5,4,7], placeholder: '1,3,5,4,7' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    const dpLen = new Array(n).fill(1);
    const dpCnt = new Array(n).fill(1);

    steps.push({
      line: 1,
      explanation: `Count # of longest increasing subsequences in [${nums.join(',')}].`,
      variables: { nums: [...nums] },
      visualization: { type: 'array', array: nums, highlights: {}, labels: {} },
    });

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < i; j++) {
        if (nums[j] < nums[i]) {
          if (dpLen[j] + 1 > dpLen[i]) {
            dpLen[i] = dpLen[j] + 1;
            dpCnt[i] = dpCnt[j];
          } else if (dpLen[j] + 1 === dpLen[i]) {
            dpCnt[i] += dpCnt[j];
          }
        }
      }

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let k = 0; k <= i; k++) {
        highlights[k] = k === i ? 'active' : 'visited';
        labels[k] = `L=${dpLen[k]},C=${dpCnt[k]}`;
      }

      steps.push({
        line: 8,
        explanation: `nums[${i}]=${nums[i]}: dpLen=${dpLen[i]}, dpCnt=${dpCnt[i]}`,
        variables: { i, 'nums[i]': nums[i], 'dpLen[i]': dpLen[i], 'dpCnt[i]': dpCnt[i] },
        visualization: { type: 'array', array: nums, highlights, labels },
      });
    }

    const maxLen = Math.max(...dpLen);
    const ans = dpLen.reduce((s, l, i) => l === maxLen ? s + dpCnt[i] : s, 0);

    steps.push({
      line: 13,
      explanation: `Max LIS length: ${maxLen}. Number of such subsequences: ${ans}`,
      variables: { maxLen, ans, dpLen, dpCnt },
      visualization: {
        type: 'array',
        array: dpLen,
        highlights: Object.fromEntries(dpLen.map((l, i) => [i, l === maxLen ? 'found' : 'visited'])),
        labels: { 0: `ans=${ans}` },
      },
    });

    return steps;
  },
};

export default numberOfLongestIncreasingBIT;

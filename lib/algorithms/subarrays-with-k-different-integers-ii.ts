import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const subarraysWithKDifferentIntegersIi: AlgorithmDefinition = {
  id: 'subarrays-with-k-different-integers-ii',
  title: 'Subarrays with K Different Integers II',
  leetcodeNumber: 992,
  difficulty: 'Hard',
  category: 'Sliding Window',
  description:
    'Given an integer array nums and an integer k, return the number of good subarrays (with exactly k different integers). Key insight: count(exactly k) = count(at most k) - count(at most k-1). Use two sliding windows with "at most k distinct" helper function.',
  tags: ['Sliding Window', 'Hash Map', 'Two Pointers', 'Array'],
  code: {
    pseudocode: `function subarraysWithKDistinct(nums, k):
  return atMostK(nums, k) - atMostK(nums, k-1)

atMostK(nums, k):
  count = {}, left = 0, result = 0
  for right in 0..n-1:
    count[nums[right]] += 1
    while len(count) > k:
      count[nums[left]] -= 1
      if count[nums[left]] == 0: del count[nums[left]]
      left++
    result += right - left + 1
  return result`,
    python: `from collections import defaultdict
def subarraysWithKDistinct(nums, k):
    def atMostK(k):
        cnt = defaultdict(int)
        left = res = 0
        for right, num in enumerate(nums):
            cnt[num] += 1
            while len(cnt) > k:
                cnt[nums[left]] -= 1
                if cnt[nums[left]] == 0: del cnt[nums[left]]
                left += 1
            res += right - left + 1
        return res
    return atMostK(k) - atMostK(k-1)`,
    javascript: `function subarraysWithKDistinct(nums, k) {
  function atMostK(k) {
    const cnt=new Map(); let left=0,res=0;
    for (let r=0;r<nums.length;r++) {
      cnt.set(nums[r],(cnt.get(nums[r])||0)+1);
      while(cnt.size>k){cnt.set(nums[left],cnt.get(nums[left])-1);if(!cnt.get(nums[left]))cnt.delete(nums[left]);left++;}
      res+=r-left+1;
    }
    return res;
  }
  return atMostK(k)-atMostK(k-1);
}`,
    java: `public int subarraysWithKDistinct(int[] nums, int k) {
    return atMostK(nums,k)-atMostK(nums,k-1);
}
int atMostK(int[] nums,int k){
    Map<Integer,Integer> cnt=new HashMap<>();int left=0,res=0;
    for(int r=0;r<nums.length;r++){cnt.merge(nums[r],1,Integer::sum);while(cnt.size()>k){cnt.merge(nums[left],-1,Integer::sum);if(cnt.get(nums[left])==0)cnt.remove(nums[left]);left++;}res+=r-left+1;}
    return res;
}`,
  },
  defaultInput: { nums: [1, 2, 1, 2, 3], k: 2 },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 1, 2, 3],
      placeholder: '1,2,1,2,3',
      helperText: 'Input array of positive integers',
    },
    {
      name: 'k',
      label: 'k (distinct integers)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Required number of distinct integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    function atMostK(limit: number): number {
      const cnt = new Map<number, number>();
      let left = 0, res = 0;
      for (let r = 0; r < n; r++) {
        cnt.set(nums[r], (cnt.get(nums[r]) || 0) + 1);
        while (cnt.size > limit) {
          cnt.set(nums[left], cnt.get(nums[left])! - 1);
          if (cnt.get(nums[left]) === 0) cnt.delete(nums[left]);
          left++;
        }
        res += r - left + 1;
      }
      return res;
    }

    function makeViz(highlights: Record<number, string>, labels: Record<number, string>, countK: number, countKm1: number): ArrayVisualization {
      return {
        type: 'array',
        array: [...nums],
        highlights,
        labels,
        auxData: {
          label: `Exactly ${k} Distinct Subarrays`,
          entries: [
            { key: `atMost(${k})`, value: String(countK) },
            { key: `atMost(${k - 1})`, value: String(countKm1) },
            { key: `Exactly ${k}`, value: String(countK - countKm1) },
          ],
        },
      };
    }

    const countK = atMostK(k);
    const countKm1 = atMostK(k - 1);
    const result = countK - countKm1;

    steps.push({
      line: 1,
      explanation: `Exactly k=${k} distinct: atMost(${k}) - atMost(${k - 1}). Formula converts hard problem to two easy sliding windows.`,
      variables: { n, k },
      visualization: makeViz({}, {}, 0, 0),
    });

    // Simulate at-most-k step by step
    const cnt = new Map<number, number>();
    let left = 0, curCount = 0;
    for (let right = 0; right < n; right++) {
      cnt.set(nums[right], (cnt.get(nums[right]) || 0) + 1);
      while (cnt.size > k) {
        cnt.set(nums[left], cnt.get(nums[left])! - 1);
        if (cnt.get(nums[left]) === 0) cnt.delete(nums[left]);
        left++;
      }
      curCount += right - left + 1;

      const h: Record<number, string> = {};
      const l: Record<number, string> = { [left]: 'L', [right]: 'R' };
      for (let i = left; i <= right; i++) h[i] = 'pointer';
      h[right] = 'active';

      steps.push({
        line: 6,
        explanation: `atMost(${k}): Window [${left}..${right}], ${cnt.size} distinct. +${right - left + 1} subarrays. Running total=${curCount}.`,
        variables: { right, left, distinct: cnt.size, added: right - left + 1, curCount },
        visualization: makeViz(h, l, curCount, 0),
      });
    }

    const finalH: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalH[i] = 'sorted';
    steps.push({
      line: 12,
      explanation: `atMost(${k})=${countK}, atMost(${k - 1})=${countKm1}. Exactly ${k} distinct subarrays = ${result}.`,
      variables: { countK, countKm1, result },
      visualization: makeViz(finalH, {}, countK, countKm1),
    });

    return steps;
  },
};

export default subarraysWithKDifferentIntegersIi;

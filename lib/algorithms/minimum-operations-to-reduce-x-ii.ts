import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumOperationsToReduceXIi: AlgorithmDefinition = {
  id: 'minimum-operations-to-reduce-x-ii',
  title: 'Minimum Operations to Reduce X to Zero II',
  leetcodeNumber: 1658,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given an integer array nums and integer x, find the minimum number of operations to reduce x to exactly 0 by removing elements from the left or right ends. Instead of tracking removed elements, find the longest subarray with sum = totalSum - x. The answer is n minus that subarray length.',
  tags: ['Sliding Window', 'Hash Map', 'Two Pointers', 'Prefix Sum'],
  code: {
    pseudocode: `function minOperations(nums, x):
  target = sum(nums) - x
  if target < 0: return -1
  if target == 0: return len(nums)
  left = cur = 0
  maxLen = -1
  for right in 0..n-1:
    cur += nums[right]
    while cur > target and left <= right:
      cur -= nums[left]; left++
    if cur == target:
      maxLen = max(maxLen, right - left + 1)
  return n - maxLen if maxLen != -1 else -1`,
    python: `def minOperations(nums, x):
    total = sum(nums)
    target = total - x
    if target < 0: return -1
    if target == 0: return len(nums)
    left = cur = 0; max_len = -1
    for right, num in enumerate(nums):
        cur += num
        while cur > target:
            cur -= nums[left]; left += 1
        if cur == target:
            max_len = max(max_len, right-left+1)
    return len(nums)-max_len if max_len!=-1 else -1`,
    javascript: `function minOperations(nums, x) {
  const total=nums.reduce((a,b)=>a+b,0), target=total-x;
  if (target<0) return -1;
  if (target===0) return nums.length;
  let left=0,cur=0,maxLen=-1;
  for (let right=0;right<nums.length;right++) {
    cur+=nums[right];
    while (cur>target) cur-=nums[left++];
    if (cur===target) maxLen=Math.max(maxLen,right-left+1);
  }
  return maxLen===-1?-1:nums.length-maxLen;
}`,
    java: `public int minOperations(int[] nums, int x) {
    int total=0; for(int n:nums) total+=n;
    int target=total-x;
    if(target<0) return -1; if(target==0) return nums.length;
    int left=0,cur=0,maxLen=-1;
    for(int right=0;right<nums.length;right++){
        cur+=nums[right];
        while(cur>target) cur-=nums[left++];
        if(cur==target) maxLen=Math.max(maxLen,right-left+1);
    }
    return maxLen==-1?-1:nums.length-maxLen;
}`,
  },
  defaultInput: { nums: [1, 1, 4, 2, 3], x: 5 },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 1, 4, 2, 3],
      placeholder: '1,1,4,2,3',
      helperText: 'Input array of positive integers',
    },
    {
      name: 'x',
      label: 'x',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Target value to reduce to zero',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const x = input.x as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    const total = nums.reduce((a, b) => a + b, 0);
    const target = total - x;

    function makeViz(highlights: Record<number, string>, labels: Record<number, string>, maxLen: number): ArrayVisualization {
      return {
        type: 'array',
        array: [...nums],
        highlights,
        labels,
        auxData: {
          label: `Min Ops to Reduce x=${x} to Zero`,
          entries: [
            { key: 'Total Sum', value: String(total) },
            { key: 'Target (keep)', value: String(target) },
            { key: 'Max Kept Len', value: String(maxLen) },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Total sum=${total}. Target subarray to keep = ${total} - ${x} = ${target}. Find longest such subarray.`,
      variables: { total, x, target, n },
      visualization: makeViz({}, {}, -1),
    });

    if (target < 0) {
      steps.push({ line: 2, explanation: `target=${target} < 0: impossible. Return -1.`, variables: { result: -1 }, visualization: makeViz({}, {}, -1) });
      return steps;
    }

    let left = 0, cur = 0, maxLen = -1;
    for (let right = 0; right < n; right++) {
      cur += nums[right];

      while (cur > target && left <= right) {
        cur -= nums[left];
        left++;
      }

      const h: Record<number, string> = {};
      const l: Record<number, string> = { [left]: 'L', [right]: 'R' };
      for (let i = left; i <= right; i++) h[i] = cur === target ? 'found' : 'pointer';
      h[right] = cur === target ? 'match' : 'active';

      if (cur === target) {
        const len = right - left + 1;
        if (len > maxLen) maxLen = len;
        steps.push({
          line: 9,
          explanation: `Window [${left}..${right}] sum=${cur}==${target}. Length=${len}. maxLen=${maxLen}. Answer = ${n} - ${maxLen} = ${n - maxLen}.`,
          variables: { left, right, cur, maxLen, answer: n - maxLen },
          visualization: makeViz(h, l, maxLen),
        });
      } else {
        steps.push({
          line: 7,
          explanation: `Window [${left}..${right}] sum=${cur} != ${target}. Continue expanding.`,
          variables: { left, right, cur, maxLen },
          visualization: makeViz(h, l, maxLen),
        });
      }
    }

    const result = maxLen === -1 ? -1 : n - maxLen;
    const finalH: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalH[i] = 'sorted';
    steps.push({
      line: 12,
      explanation: `Done. Minimum operations to reduce x=${x} to zero = ${result}.`,
      variables: { result },
      visualization: makeViz(finalH, {}, maxLen),
    });

    return steps;
  },
};

export default minimumOperationsToReduceXIi;

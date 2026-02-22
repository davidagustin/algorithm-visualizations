import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestNiceSubarrayIi: AlgorithmDefinition = {
  id: 'longest-nice-subarray-ii',
  title: 'Longest Nice Subarray II',
  leetcodeNumber: 2401,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given an array of positive integers, find the longest subarray where the bitwise AND of every pair of adjacent elements is 0 (no bit is shared between any two elements). Use a sliding window and track used bits. When a new element shares bits with used bits, shrink the window from the left.',
  tags: ['Sliding Window', 'Bit Manipulation', 'Two Pointers'],
  code: {
    pseudocode: `function longestNiceSubarray(nums):
  left = 0, usedBits = 0, maxLen = 0
  for right in 0..n-1:
    while usedBits AND nums[right] != 0:
      usedBits XOR= nums[left]  // remove left element bits
      left++
    usedBits OR= nums[right]  // add right element bits
    maxLen = max(maxLen, right - left + 1)
  return maxLen`,
    python: `def longestNiceSubarray(nums):
    left = used_bits = 0
    max_len = 0
    for right, num in enumerate(nums):
        while used_bits & num:
            used_bits ^= nums[left]
            left += 1
        used_bits |= num
        max_len = max(max_len, right - left + 1)
    return max_len`,
    javascript: `function longestNiceSubarray(nums) {
  let left=0, usedBits=0, maxLen=0;
  for (let right=0;right<nums.length;right++) {
    while (usedBits & nums[right]) { usedBits ^= nums[left++]; }
    usedBits |= nums[right];
    maxLen = Math.max(maxLen, right-left+1);
  }
  return maxLen;
}`,
    java: `public int longestNiceSubarray(int[] nums) {
    int left=0, usedBits=0, maxLen=0;
    for (int right=0;right<nums.length;right++) {
        while ((usedBits & nums[right])!=0) { usedBits^=nums[left++]; }
        usedBits|=nums[right];
        maxLen=Math.max(maxLen,right-left+1);
    }
    return maxLen;
}`,
  },
  defaultInput: { nums: [1, 3, 8, 48, 10] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 3, 8, 48, 10],
      placeholder: '1,3,8,48,10',
      helperText: 'Array of positive integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    let left = 0, usedBits = 0, maxLen = 0;

    function makeViz(highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization {
      return {
        type: 'array',
        array: [...nums],
        highlights,
        labels,
        auxData: {
          label: 'Longest Nice Subarray (No Shared Bits)',
          entries: [
            { key: 'Used Bits', value: `0b${usedBits.toString(2)}` },
            { key: 'Max Length', value: String(maxLen) },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Find longest subarray where all pairs have no shared bits (AND=0). Track used bits with OR, remove with XOR.`,
      variables: { n },
      visualization: makeViz({}, {}),
    });

    for (let right = 0; right < n; right++) {
      const num = nums[right];

      while (usedBits & num) {
        usedBits ^= nums[left];
        const h: Record<number, string> = { [left]: 'mismatch', [right]: 'comparing' };
        steps.push({
          line: 4,
          explanation: `Bit conflict! nums[${right}]=${num} (0b${num.toString(2)}) shares bits with window. Remove nums[${left}]=${nums[left]}. usedBits=0b${usedBits.toString(2)}.`,
          variables: { left, right, conflictNum: num, removedNum: nums[left], usedBits },
          visualization: makeViz(h, { [left]: 'XOR', [right]: 'conf' }),
        });
        left++;
      }

      usedBits |= num;
      const len = right - left + 1;
      if (len > maxLen) maxLen = len;

      const h: Record<number, string> = {};
      const l: Record<number, string> = { [left]: 'L', [right]: 'R' };
      for (let i = left; i <= right; i++) h[i] = len === maxLen ? 'found' : 'pointer';
      h[right] = 'active';

      steps.push({
        line: 6,
        explanation: `Added nums[${right}]=${num} (0b${num.toString(2)}). usedBits=0b${usedBits.toString(2)}. Window [${left}..${right}], length=${len}. maxLen=${maxLen}.`,
        variables: { right, left, num, usedBits, windowLen: len, maxLen },
        visualization: makeViz(h, l),
      });
    }

    const finalH: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalH[i] = 'sorted';
    steps.push({
      line: 8,
      explanation: `Done. Longest nice subarray length = ${maxLen}.`,
      variables: { result: maxLen },
      visualization: makeViz(finalH, {}),
    });

    return steps;
  },
};

export default longestNiceSubarrayIi;

import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestSubstringWithAtMostKDistinctSegment: AlgorithmDefinition = {
  id: 'longest-substring-with-at-most-k-distinct-segment',
  title: 'Longest Substring with At Most K Distinct Characters',
  leetcodeNumber: 340,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Find the length of the longest substring with at most k distinct characters. Use a sliding window with a frequency map: expand right pointer, when distinct chars exceed k shrink left pointer until within limit.',
  tags: ['Sliding Window', 'Hash Map', 'String', 'Two Pointers'],
  code: {
    pseudocode: `function lengthOfLongestSubstringKDistinct(s, k):
  left = 0
  freq = {}  // char -> count in current window
  maxLen = 0

  for right from 0 to len(s)-1:
    freq[s[right]] += 1

    while len(freq) > k:
      freq[s[left]] -= 1
      if freq[s[left]] == 0:
        delete freq[s[left]]
      left++

    maxLen = max(maxLen, right - left + 1)

  return maxLen`,
    python: `class Solution:
    def lengthOfLongestSubstringKDistinct(self, s, k):
        from collections import defaultdict
        freq = defaultdict(int)
        left = 0
        maxLen = 0

        for right in range(len(s)):
            freq[s[right]] += 1
            while len(freq) > k:
                freq[s[left]] -= 1
                if freq[s[left]] == 0:
                    del freq[s[left]]
                left += 1
            maxLen = max(maxLen, right - left + 1)

        return maxLen`,
    javascript: `var lengthOfLongestSubstringKDistinct = function(s, k) {
  const freq = new Map();
  let left = 0, maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    freq.set(s[right], (freq.get(s[right])||0) + 1);
    while (freq.size > k) {
      const lc = s[left];
      freq.set(lc, freq.get(lc) - 1);
      if (freq.get(lc) === 0) freq.delete(lc);
      left++;
    }
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
};`,
    java: `class Solution {
    public int lengthOfLongestSubstringKDistinct(String s, int k) {
        Map<Character,Integer> freq=new HashMap<>();
        int left=0, maxLen=0;
        for(int right=0;right<s.length();right++){
            char rc=s.charAt(right);
            freq.merge(rc,1,Integer::sum);
            while(freq.size()>k){
                char lc=s.charAt(left);
                if(freq.merge(lc,-1,Integer::sum)==0) freq.remove(lc);
                left++;
            }
            maxLen=Math.max(maxLen,right-left+1);
        }
        return maxLen;
    }
}`,
  },
  defaultInput: { s: 'eceba', k: 2 },
  inputFields: [
    { name: 's', label: 'String', type: 'string', defaultValue: 'eceba', placeholder: 'eceba' },
    { name: 'k', label: 'k (distinct chars)', type: 'number', defaultValue: 2 },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const n = s.length;

    const charCodes = Array.from(s).map(c => c.charCodeAt(0) - 96);

    steps.push({
      line: 1,
      explanation: `Find longest substring with at most ${k} distinct chars in "${s}".`,
      variables: { s, k },
      visualization: { type: 'array', array: charCodes, highlights: {}, labels: Object.fromEntries(charCodes.map((_,i)=>[i,s[i]])) },
    });

    const freq = new Map<string, number>();
    let left = 0, maxLen = 0;

    for (let right = 0; right < n; right++) {
      freq.set(s[right], (freq.get(s[right]) || 0) + 1);

      while (freq.size > k) {
        const lc = s[left];
        freq.set(lc, freq.get(lc)! - 1);
        if (freq.get(lc) === 0) freq.delete(lc);
        left++;
      }

      const len = right - left + 1;
      if (len > maxLen) maxLen = len;

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < n; i++) {
        if (i < left) highlights[i] = 'visited';
        else if (i <= right) highlights[i] = 'active';
        else highlights[i] = 'default';
      }
      labels[left] = 'L';
      labels[right] = 'R';

      steps.push({
        line: 9,
        explanation: `Window [${left},${right}]="${s.slice(left,right+1)}": ${freq.size} distinct chars, len=${len}. Best=${maxLen}`,
        variables: { left, right, distinct: freq.size, windowLen: len, maxLen, freq: Object.fromEntries(freq) },
        visualization: { type: 'array', array: charCodes, highlights, labels },
      });
    }

    steps.push({
      line: 13,
      explanation: `Longest substring with ≤ ${k} distinct chars: ${maxLen}`,
      variables: { maxLen },
      visualization: {
        type: 'array',
        array: charCodes,
        highlights: Object.fromEntries(charCodes.map((_, i) => [i, 'found'])),
        labels: { 0: `ans=${maxLen}` },
      },
    });

    return steps;
  },
};

export default longestSubstringWithAtMostKDistinctSegment;

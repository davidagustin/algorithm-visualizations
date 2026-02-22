import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumNumberOfFlips: AlgorithmDefinition = {
  id: 'minimum-number-of-flips',
  title: 'Minimum Number of Flips to Make Binary String Alternating',
  leetcodeNumber: 1888,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given a binary string s, you can perform two operations: remove the first character and append it to the end, or flip any character. Return the minimum number of flips needed to make s alternating. Use a sliding window on the doubled string to find the best alignment.',
  tags: ['sliding window', 'string', 'greedy'],

  code: {
    pseudocode: `function minFlips(s):
  n = len(s)
  s = s + s
  alt1 = ""  // "010101..."
  alt2 = ""  // "101010..."
  for i in range(len(s)):
    alt1 += "0" if i%2==0 else "1"
    alt2 += "1" if i%2==0 else "0"
  diff1 = diff2 = 0
  result = n
  left = 0
  for right in range(len(s)):
    if s[right] != alt1[right]: diff1++
    if s[right] != alt2[right]: diff2++
    if right - left + 1 > n:
      if s[left] != alt1[left]: diff1--
      if s[left] != alt2[left]: diff2--
      left++
    if right - left + 1 == n:
      result = min(result, diff1, diff2)
  return result`,

    python: `def minFlips(s: str) -> int:
    n = len(s)
    s = s + s
    alt1 = "".join("0" if i % 2 == 0 else "1" for i in range(len(s)))
    alt2 = "".join("1" if i % 2 == 0 else "0" for i in range(len(s)))
    diff1 = diff2 = 0
    result = n
    left = 0
    for right in range(len(s)):
        if s[right] != alt1[right]: diff1 += 1
        if s[right] != alt2[right]: diff2 += 1
        if right - left + 1 > n:
            if s[left] != alt1[left]: diff1 -= 1
            if s[left] != alt2[left]: diff2 -= 1
            left += 1
        if right - left + 1 == n:
            result = min(result, diff1, diff2)
    return result`,

    javascript: `function minFlips(s) {
  const n = s.length;
  s = s + s;
  let diff1 = 0, diff2 = 0, result = n, left = 0;
  for (let right = 0; right < s.length; right++) {
    const exp1 = right % 2 === 0 ? '0' : '1';
    const exp2 = right % 2 === 0 ? '1' : '0';
    if (s[right] !== exp1) diff1++;
    if (s[right] !== exp2) diff2++;
    if (right - left + 1 > n) {
      const lexp1 = left % 2 === 0 ? '0' : '1';
      const lexp2 = left % 2 === 0 ? '1' : '0';
      if (s[left] !== lexp1) diff1--;
      if (s[left] !== lexp2) diff2--;
      left++;
    }
    if (right - left + 1 === n) result = Math.min(result, diff1, diff2);
  }
  return result;
}`,

    java: `public int minFlips(String s) {
    int n = s.length();
    s = s + s;
    int diff1 = 0, diff2 = 0, result = n, left = 0;
    for (int right = 0; right < s.length(); right++) {
        char exp1 = right % 2 == 0 ? '0' : '1';
        char exp2 = right % 2 == 0 ? '1' : '0';
        if (s.charAt(right) != exp1) diff1++;
        if (s.charAt(right) != exp2) diff2++;
        if (right - left + 1 > n) {
            char lexp1 = left % 2 == 0 ? '0' : '1';
            char lexp2 = left % 2 == 0 ? '1' : '0';
            if (s.charAt(left) != lexp1) diff1--;
            if (s.charAt(left) != lexp2) diff2--;
            left++;
        }
        if (right - left + 1 == n) result = Math.min(result, Math.min(diff1, diff2));
    }
    return result;
}`,
  },

  defaultInput: {
    s: '010',
  },

  inputFields: [
    {
      name: 's',
      label: 'Binary String',
      type: 'string',
      defaultValue: '010',
      placeholder: '010',
      helperText: 'Binary string of 0s and 1s',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const n = s.length;
    const original = s;
    s = s + s;

    const arr = s.split('').map(Number);

    steps.push({
      line: 1,
      explanation: `Input string "${original}" of length ${n}. Double it to "${s}" to simulate rotations.`,
      variables: { n, doubled: s },
      visualization: {
        type: 'array',
        array: arr,
        highlights: {},
        labels: { [n - 1]: 'end', [n]: 'copy start' },
      } as ArrayVisualization,
    });

    let diff1 = 0;
    let diff2 = 0;
    let result = n;
    let left = 0;

    for (let right = 0; right < s.length; right++) {
      const exp1 = right % 2 === 0 ? '0' : '1';
      const exp2 = right % 2 === 0 ? '1' : '0';
      if (s[right] !== exp1) diff1++;
      if (s[right] !== exp2) diff2++;

      if (right - left + 1 > n) {
        const lexp1 = left % 2 === 0 ? '0' : '1';
        const lexp2 = left % 2 === 0 ? '1' : '0';
        if (s[left] !== lexp1) diff1--;
        if (s[left] !== lexp2) diff2--;
        left++;
      }

      if (right - left + 1 === n) {
        result = Math.min(result, diff1, diff2);
        steps.push({
          line: 16,
          explanation: `Window [${left}..${right}] of size ${n}: diff from "010..." = ${diff1}, diff from "101..." = ${diff2}. Best so far = ${result}.`,
          variables: { left, right, diff1, diff2, result },
          visualization: {
            type: 'array',
            array: arr,
            highlights: Object.fromEntries(
              Array.from({ length: n }, (_, idx) => [left + idx, idx === 0 || idx === n - 1 ? 'pointer' : 'active'])
            ),
            labels: { [left]: 'L', [right]: 'R' },
          } as ArrayVisualization,
        });
      }
    }

    steps.push({
      line: 18,
      explanation: `All windows checked. Minimum flips needed = ${result}.`,
      variables: { result },
      visualization: {
        type: 'array',
        array: original.split('').map(Number),
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default minimumNumberOfFlips;

import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const additiveNumber: AlgorithmDefinition = {
  id: 'additive-number',
  title: 'Additive Number',
  leetcodeNumber: 306,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'An additive number is a string whose digits can form an additive sequence: each number equals the sum of the two preceding it (like Fibonacci). Given a string of digits, determine if it forms a valid additive number. Uses backtracking to try all possible first-two-number splits.',
  tags: ['backtracking', 'string', 'math', 'recursion', 'big number'],

  code: {
    pseudocode: `function isAdditiveNumber(num):
  n = length(num)
  for i from 1 to n/2:
    for j from i+1 to n:
      if isValid(num, 0, i, j):
        return true
  return false

function isValid(num, start, mid, end):
  s1 = num[start..mid]
  s2 = num[mid..end]
  if leading zeros: return false
  while end < length(num):
    sum = add(s1, s2)
    if num[end..end+len(sum)] != sum: return false
    s1 = s2
    s2 = sum
    end += len(sum)
  return end == length(num)`,

    python: `def isAdditiveNumber(num: str) -> bool:
    n = len(num)
    for i in range(1, n):
        for j in range(i + 1, n):
            s1 = num[:i]
            s2 = num[i:j]
            if (len(s1) > 1 and s1[0] == '0') or (len(s2) > 1 and s2[0] == '0'):
                continue
            if is_valid(num, s1, s2, j):
                return True
    return False

def is_valid(num, s1, s2, pos):
    while pos < len(num):
        next_sum = str(int(s1) + int(s2))
        if not num[pos:].startswith(next_sum):
            return False
        s1, s2 = s2, next_sum
        pos += len(next_sum)
    return pos == len(num)`,

    javascript: `function isAdditiveNumber(num) {
  const n = num.length;
  for (let i = 1; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const s1 = num.slice(0, i), s2 = num.slice(i, j);
      if ((s1.length > 1 && s1[0] === '0') || (s2.length > 1 && s2[0] === '0')) continue;
      if (isValid(num, s1, s2, j)) return true;
    }
  }
  return false;
}
function isValid(num, s1, s2, pos) {
  while (pos < num.length) {
    const nextSum = String(BigInt(s1) + BigInt(s2));
    if (!num.startsWith(nextSum, pos)) return false;
    [s1, s2] = [s2, nextSum];
    pos += nextSum.length;
  }
  return pos === num.length;
}`,

    java: `public boolean isAdditiveNumber(String num) {
    int n = num.length();
    for (int i = 1; i <= n / 2; i++) {
        for (int j = i + 1; j < n; j++) {
            if (isValid(num, 0, i, j)) return true;
        }
    }
    return false;
}
private boolean isValid(String num, int s, int m, int e) {
    if ((m - s > 1 && num.charAt(s) == '0') || (e - m > 1 && num.charAt(m) == '0')) return false;
    while (e < num.length()) {
        String sum = add(num.substring(s, m), num.substring(m, e));
        if (!num.startsWith(sum, e)) return false;
        s = m; m = e; e += sum.length();
    }
    return e == num.length();
}`,
  },

  defaultInput: {
    num: '199100199',
  },

  inputFields: [
    {
      name: 'num',
      label: 'Number String',
      type: 'string',
      defaultValue: '199100199',
      placeholder: '199100199',
      helperText: 'String of digits to check for additive property',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const num = input.num as string;
    const steps: AlgorithmStep[] = [];
    const n = num.length;

    steps.push({
      line: 1,
      explanation: `Checking if "${num}" is an additive number. Will try all splits for first two numbers.`,
      variables: { num, length: n },
      visualization: {
        type: 'array',
        array: num.split('').map(Number),
        highlights: {},
        labels: num.split('').reduce((acc, c, i) => ({ ...acc, [i]: c }), {} as Record<number, string>),
      },
    });

    function isValid(s1: string, s2: string, pos: number): boolean {
      let curr1 = s1, curr2 = s2, currPos = pos;
      while (currPos < n) {
        const nextSum = String(BigInt(curr1) + BigInt(curr2));
        if (!num.startsWith(nextSum, currPos)) return false;
        curr1 = curr2;
        curr2 = nextSum;
        currPos += nextSum.length;
      }
      return currPos === n;
    }

    let found = false;

    outer: for (let i = 1; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const s1 = num.slice(0, i);
        const s2 = num.slice(i, j);

        if ((s1.length > 1 && s1[0] === '0') || (s2.length > 1 && s2[0] === '0')) {
          steps.push({
            line: 4,
            explanation: `Skip: s1="${s1}" or s2="${s2}" has leading zero (invalid partition).`,
            variables: { s1, s2, reason: 'leading zero' },
            visualization: {
              type: 'array',
              array: num.split('').map(Number),
              highlights: { 0: 'mismatch' },
              labels: { 0: s1, [i]: s2 },
            },
          });
          continue;
        }

        steps.push({
          line: 5,
          explanation: `Try split: s1="${s1}", s2="${s2}", remainder="${num.slice(j)}". Check if additive sequence holds.`,
          variables: { s1, s2, remainder: num.slice(j), splitAt: [i, j] },
          visualization: {
            type: 'array',
            array: num.split('').map(Number),
            highlights: num.split('').reduce((acc, _, idx) => ({
              ...acc,
              [idx]: idx < i ? 'active' : idx < j ? 'comparing' : 'pointer',
            }), {}),
            labels: { 0: `s1:${s1}`, [i]: `s2:${s2}`, [j]: 'rest' },
          },
        });

        let curr1 = s1, curr2 = s2, pos = j;
        let valid = true;

        while (pos < n) {
          const nextSum = String(BigInt(curr1) + BigInt(curr2));
          if (!num.startsWith(nextSum, pos)) {
            valid = false;
            steps.push({
              line: 14,
              explanation: `Mismatch: expected sum ${curr1}+${curr2}=${nextSum}, but found "${num.slice(pos, pos + nextSum.length)}" at pos ${pos}.`,
              variables: { s1: curr1, s2: curr2, expectedSum: nextSum, found: num.slice(pos, pos + nextSum.length) },
              visualization: {
                type: 'array',
                array: num.split('').map(Number),
                highlights: num.split('').reduce((acc, _, idx) => ({
                  ...acc,
                  [idx]: idx >= pos && idx < pos + nextSum.length ? 'mismatch' : 'default',
                }), {}),
                labels: { [pos]: `exp:${nextSum}` },
              },
            });
            break;
          }

          steps.push({
            line: 15,
            explanation: `Sum matches: ${curr1}+${curr2}=${nextSum} found at pos ${pos}. Advance by ${nextSum.length}.`,
            variables: { s1: curr1, s2: curr2, sum: nextSum, newPos: pos + nextSum.length },
            visualization: {
              type: 'array',
              array: num.split('').map(Number),
              highlights: num.split('').reduce((acc, _, idx) => ({
                ...acc,
                [idx]: idx >= pos && idx < pos + nextSum.length ? 'found' : 'default',
              }), {}),
              labels: { [pos]: nextSum },
            },
          });

          curr1 = curr2;
          curr2 = nextSum;
          pos += nextSum.length;
        }

        if (valid && pos === n) {
          found = true;
          steps.push({
            line: 5,
            explanation: `Valid additive sequence! "${num}" IS an additive number with s1="${s1}", s2="${s2}".`,
            variables: { result: true, s1, s2, num },
            visualization: {
              type: 'array',
              array: num.split('').map(Number),
              highlights: num.split('').reduce((acc, _, idx) => ({ ...acc, [idx]: 'found' }), {}),
              labels: {},
            },
          });
          break outer;
        }
      }
    }

    if (!found) {
      steps.push({
        line: 8,
        explanation: `No valid additive sequence found. "${num}" is NOT an additive number.`,
        variables: { result: false, num },
        visualization: {
          type: 'array',
          array: num.split('').map(Number),
          highlights: num.split('').reduce((acc, _, i) => ({ ...acc, [i]: 'mismatch' }), {}),
          labels: {},
        },
      });
    }

    return steps;
  },
};

export default additiveNumber;

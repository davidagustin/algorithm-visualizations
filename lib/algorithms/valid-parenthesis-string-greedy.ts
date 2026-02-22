import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const validParenthesisStringGreedy: AlgorithmDefinition = {
  id: 'valid-parenthesis-string-greedy',
  title: 'Valid Parenthesis String (Greedy Low/High)',
  leetcodeNumber: 678,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Given a string with "(", ")", and "*" (which can be "(", ")", or empty), determine if it is valid. Greedy: track the range [lo, hi] of possible open parenthesis counts. "(" increases both, ")" decreases both, "*" widens the range. If hi < 0 at any point, invalid. If lo <= 0 <= hi at end, valid.',
  tags: ['greedy', 'string', 'dynamic programming'],

  code: {
    pseudocode: `function checkValidString(s):
  lo = hi = 0
  for c in s:
    if c == '(':
      lo++; hi++
    elif c == ')':
      lo--; hi--
    else: // '*'
      lo--; hi++
    if hi < 0: return false
    lo = max(lo, 0)
  return lo == 0`,

    python: `def checkValidString(s: str) -> bool:
    lo = hi = 0
    for c in s:
        if c == '(':
            lo += 1; hi += 1
        elif c == ')':
            lo -= 1; hi -= 1
        else:
            lo -= 1; hi += 1
        if hi < 0:
            return False
        lo = max(lo, 0)
    return lo == 0`,

    javascript: `function checkValidString(s) {
  let lo = 0, hi = 0;
  for (const c of s) {
    if (c === '(') { lo++; hi++; }
    else if (c === ')') { lo--; hi--; }
    else { lo--; hi++; }
    if (hi < 0) return false;
    lo = Math.max(lo, 0);
  }
  return lo === 0;
}`,

    java: `public boolean checkValidString(String s) {
    int lo = 0, hi = 0;
    for (char c : s.toCharArray()) {
        if (c == '(') { lo++; hi++; }
        else if (c == ')') { lo--; hi--; }
        else { lo--; hi++; }
        if (hi < 0) return false;
        lo = Math.max(lo, 0);
    }
    return lo == 0;
}`,
  },

  defaultInput: {
    s: '(*)',
  },

  inputFields: [
    {
      name: 's',
      label: 'Parenthesis String',
      type: 'string',
      defaultValue: '(*)',
      placeholder: '(*)',
      helperText: 'String with (, ), and * characters',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Check if "${s}" is a valid parenthesis string. Track range [lo, hi] of possible open bracket counts.`,
      variables: { lo: 0, hi: 0 },
      visualization: {
        type: 'array',
        array: s.split('').map((_, i) => i),
        highlights: {},
        labels: Object.fromEntries(s.split('').map((c, i) => [i, c])) as Record<number, string>,
      },
    });

    let lo = 0;
    let hi = 0;

    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      const prevLo = lo;
      const prevHi = hi;

      if (c === '(') {
        lo++;
        hi++;
      } else if (c === ')') {
        lo--;
        hi--;
      } else {
        lo--;
        hi++;
      }

      if (hi < 0) {
        steps.push({
          line: 7,
          explanation: `Position ${i} "${c}": hi dropped to ${hi} < 0. Too many closing brackets even in best case. Return false.`,
          variables: { i, c, lo, hi, result: false },
          visualization: {
            type: 'array',
            array: s.split('').map((_, j) => j),
            highlights: { [i]: 'mismatch' } as Record<number, string>,
            labels: { [i]: c } as Record<number, string>,
          },
        });
        return steps;
      }

      lo = Math.max(lo, 0);

      steps.push({
        line: c === '(' ? 3 : c === ')' ? 5 : 6,
        explanation: `Position ${i} "${c}": was [${prevLo}, ${prevHi}], now [${lo}, ${hi}]. ${c === '*' ? '"*" widens range' : c === '(' ? '"(" increases both' : '")" decreases both'}.`,
        variables: { i, c, lo, hi },
        visualization: {
          type: 'array',
          array: s.split('').map((_, j) => j),
          highlights: { [i]: 'active' } as Record<number, string>,
          labels: { [i]: `[${lo},${hi}]` } as Record<number, string>,
        },
      });
    }

    const valid = lo === 0;
    steps.push({
      line: 9,
      explanation: `End of string. lo=${lo}. ${valid ? 'lo=0 means 0 unmatched open brackets is achievable. Valid.' : 'lo>0 means some open brackets cannot be closed. Invalid.'}`,
      variables: { lo, hi, result: valid },
      visualization: {
        type: 'array',
        array: s.split('').map((_, i) => i),
        highlights: Object.fromEntries(s.split('').map((_, i) => [i, valid ? 'found' : 'mismatch'])) as Record<number, string>,
        labels: {},
      },
    });

    return steps;
  },
};

export default validParenthesisStringGreedy;

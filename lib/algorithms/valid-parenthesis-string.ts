import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const validParenthesisString: AlgorithmDefinition = {
  id: 'valid-parenthesis-string',
  title: 'Valid Parenthesis String',
  leetcodeNumber: 678,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Given a string with "(", ")", and "*" characters (where "*" can be "(", ")", or empty), check if the string is valid. Use two counters: lo (minimum open count) and hi (maximum open count) to track the range of possible open parenthesis counts.',
  tags: ['stack', 'greedy', 'string', 'two pointers'],

  code: {
    pseudocode: `function checkValidString(s):
  lo = 0 (min possible open parens)
  hi = 0 (max possible open parens)
  for char in s:
    if char == '(':
      lo++, hi++
    elif char == ')':
      lo--, hi--
    else (star):
      lo-- (treat as ')'), hi++ (treat as '(')
    lo = max(lo, 0)
    if hi < 0: return false
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
        lo = max(lo, 0)
        if hi < 0:
            return False
    return lo == 0`,

    javascript: `function checkValidString(s) {
  let lo = 0, hi = 0;
  for (const c of s) {
    if (c === '(') { lo++; hi++; }
    else if (c === ')') { lo--; hi--; }
    else { lo--; hi++; }
    lo = Math.max(lo, 0);
    if (hi < 0) return false;
  }
  return lo === 0;
}`,

    java: `public boolean checkValidString(String s) {
    int lo = 0, hi = 0;
    for (char c : s.toCharArray()) {
        if (c == '(') { lo++; hi++; }
        else if (c == ')') { lo--; hi--; }
        else { lo--; hi++; }
        lo = Math.max(lo, 0);
        if (hi < 0) return false;
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
      helperText: 'String containing "(", ")", and "*" characters',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Input: "${s}". Track lo (min open count) and hi (max open count). "*" can be "(", ")", or empty.`,
      variables: { s, lo: 0, hi: 0 },
      visualization: {
        type: 'array',
        array: s.split('').map((_, i) => i),
        highlights: {},
        labels: Object.fromEntries(s.split('').map((c, i) => [i, c])),
      },
    });

    let lo = 0;
    let hi = 0;

    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      let explanation = '';

      if (c === '(') {
        lo++;
        hi++;
        explanation = `"(": both lo and hi increase. lo=${lo}, hi=${hi}.`;
      } else if (c === ')') {
        lo--;
        hi--;
        explanation = `")": both lo and hi decrease. lo (before clamp)=${lo}, hi=${hi}.`;
      } else {
        lo--;
        hi++;
        explanation = `"*": treat as ")" for lo (${lo}) and "(" for hi (${hi}).`;
      }

      lo = Math.max(lo, 0);

      steps.push({
        line: c === '(' ? 5 : c === ')' ? 7 : 9,
        explanation: `Index ${i}, char "${c}": ${explanation} After clamp: lo=${lo}, hi=${hi}.`,
        variables: { index: i, char: c, lo, hi },
        visualization: {
          type: 'array',
          array: s.split('').map((_, idx) => idx),
          highlights: {
            [i]: hi < 0 ? 'mismatch' : 'active',
            ...Object.fromEntries(Array.from({ length: i }, (_, k) => [k, 'sorted'])),
          },
          labels: Object.fromEntries(s.split('').map((ch, idx) => [idx, ch])),
        },
      });

      if (hi < 0) {
        steps.push({
          line: 11,
          explanation: `hi < 0: too many ")" even if all "*" are "(". String cannot be valid. Return false.`,
          variables: { lo, hi, result: false },
          visualization: {
            type: 'array',
            array: s.split('').map((_, idx) => idx),
            highlights: Object.fromEntries(s.split('').map((_, idx) => [idx, idx <= i ? 'mismatch' : 'default'])),
            labels: Object.fromEntries(s.split('').map((ch, idx) => [idx, ch])),
          },
        });
        return steps;
      }
    }

    const result = lo === 0;
    steps.push({
      line: 12,
      explanation: `Finished. lo=${lo}. ${result ? 'lo==0: valid range includes 0 open parens. Return true.' : `lo=${lo} > 0: minimum ${lo} unmatched "(". Return false.`}`,
      variables: { lo, hi, result },
      visualization: {
        type: 'array',
        array: s.split('').map((_, i) => i),
        highlights: Object.fromEntries(s.split('').map((_, i) => [i, result ? 'found' : 'mismatch'])),
        labels: Object.fromEntries(s.split('').map((c, i) => [i, c])),
      },
    });

    return steps;
  },
};

export default validParenthesisString;

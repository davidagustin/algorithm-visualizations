import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const minimumAddValidParentheses: AlgorithmDefinition = {
  id: 'minimum-add-valid-parentheses',
  title: 'Minimum Add to Make Parentheses Valid',
  leetcodeNumber: 921,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Given a parentheses string, find the minimum number of parentheses to add to make it valid. Track unmatched "(" with an open counter and unmatched ")" with a close counter. The answer is open + close.',
  tags: ['stack', 'greedy', 'string', 'counting'],

  code: {
    pseudocode: `function minAddToMakeValid(s):
  open = 0  (unmatched '(')
  close = 0 (unmatched ')')
  for char in s:
    if char == '(':
      open++
    else:
      if open > 0:
        open-- (match with unmatched '(')
      else:
        close++ (unmatched ')')
  return open + close`,

    python: `def minAddToMakeValid(s: str) -> int:
    open_count = close_count = 0
    for c in s:
        if c == '(':
            open_count += 1
        else:
            if open_count > 0:
                open_count -= 1
            else:
                close_count += 1
    return open_count + close_count`,

    javascript: `function minAddToMakeValid(s) {
  let open = 0, close = 0;
  for (const c of s) {
    if (c === '(') open++;
    else {
      if (open > 0) open--;
      else close++;
    }
  }
  return open + close;
}`,

    java: `public int minAddToMakeValid(String s) {
    int open = 0, close = 0;
    for (char c : s.toCharArray()) {
        if (c == '(') open++;
        else if (open > 0) open--;
        else close++;
    }
    return open + close;
}`,
  },

  defaultInput: {
    s: '())',
  },

  inputFields: [
    {
      name: 's',
      label: 'Parentheses String',
      type: 'string',
      defaultValue: '())',
      placeholder: '())',
      helperText: 'String of parentheses to make valid',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Input: "${s}". Count unmatched "(" (open) and unmatched ")" (close). Answer = open + close.`,
      variables: { s, open: 0, close: 0 },
      visualization: {
        type: 'array',
        array: s.split('').map((_, i) => i),
        highlights: {},
        labels: Object.fromEntries(s.split('').map((c, i) => [i, c])),
      },
    });

    let open = 0;
    let close = 0;

    for (let i = 0; i < s.length; i++) {
      const c = s[i];

      if (c === '(') {
        open++;
        steps.push({
          line: 5,
          explanation: `Index ${i}: "(". Unmatched open increases. open=${open}, close=${close}.`,
          variables: { index: i, char: c, open, close },
          visualization: {
            type: 'array',
            array: s.split('').map((_, idx) => idx),
            highlights: {
              [i]: 'active',
              ...Object.fromEntries(Array.from({ length: i }, (_, k) => [k, 'sorted'])),
            },
            labels: Object.fromEntries(s.split('').map((ch, idx) => [idx, ch])),
          },
        });
      } else {
        if (open > 0) {
          open--;
          steps.push({
            line: 8,
            explanation: `Index ${i}: ")". Matches an unmatched "(". open decreases. open=${open}, close=${close}.`,
            variables: { index: i, char: c, open, close, matched: true },
            visualization: {
              type: 'array',
              array: s.split('').map((_, idx) => idx),
              highlights: {
                [i]: 'found',
                ...Object.fromEntries(Array.from({ length: i }, (_, k) => [k, 'sorted'])),
              },
              labels: Object.fromEntries(s.split('').map((ch, idx) => [idx, ch])),
            },
          });
        } else {
          close++;
          steps.push({
            line: 10,
            explanation: `Index ${i}: ")". No unmatched "(". Unmatched close increases. open=${open}, close=${close}.`,
            variables: { index: i, char: c, open, close, unmatched: true },
            visualization: {
              type: 'array',
              array: s.split('').map((_, idx) => idx),
              highlights: {
                [i]: 'mismatch',
                ...Object.fromEntries(Array.from({ length: i }, (_, k) => [k, 'sorted'])),
              },
              labels: Object.fromEntries(s.split('').map((ch, idx) => [idx, ch])),
            },
          });
        }
      }
    }

    const result = open + close;
    steps.push({
      line: 12,
      explanation: `Done. ${open} unmatched "(" need a ")" added. ${close} unmatched ")" need a "(" added. Minimum additions: ${result}.`,
      variables: { open, close, result },
      visualization: {
        type: 'array',
        array: s.split('').map((_, i) => i),
        highlights: Object.fromEntries(s.split('').map((_, i) => [i, result === 0 ? 'found' : 'active'])),
        labels: Object.fromEntries(s.split('').map((c, i) => [i, c])),
      },
    });

    return steps;
  },
};

export default minimumAddValidParentheses;

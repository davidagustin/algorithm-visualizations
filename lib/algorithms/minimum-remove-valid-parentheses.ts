import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const minimumRemoveValidParentheses: AlgorithmDefinition = {
  id: 'minimum-remove-valid-parentheses',
  title: 'Minimum Remove to Make Valid Parentheses',
  leetcodeNumber: 1249,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Given a string with parentheses and letters, remove the minimum number of parentheses to make it valid. A valid string has no unmatched parentheses. Use a stack to track unmatched open parentheses and mark invalid ones for removal.',
  tags: ['stack', 'string', 'greedy'],

  code: {
    pseudocode: `function minRemoveToMakeValid(s):
  stack = [] (stores indices of unmatched '(')
  remove = set()
  for i, char in enumerate(s):
    if char == '(':
      stack.push(i)
    elif char == ')':
      if stack is not empty:
        stack.pop()
      else:
        remove.add(i)
  remove.union(stack)
  return s without chars at indices in remove`,

    python: `def minRemoveToMakeValid(s: str) -> str:
    stack = []
    remove = set()
    for i, c in enumerate(s):
        if c == '(':
            stack.append(i)
        elif c == ')':
            if stack:
                stack.pop()
            else:
                remove.add(i)
    remove |= set(stack)
    return ''.join(c for i, c in enumerate(s) if i not in remove)`,

    javascript: `function minRemoveToMakeValid(s) {
  const stack = [], remove = new Set();
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') stack.push(i);
    else if (s[i] === ')') {
      if (stack.length) stack.pop();
      else remove.add(i);
    }
  }
  for (const i of stack) remove.add(i);
  return [...s].filter((_, i) => !remove.has(i)).join('');
}`,

    java: `public String minRemoveToMakeValid(String s) {
    Deque<Integer> stack = new ArrayDeque<>();
    Set<Integer> remove = new HashSet<>();
    for (int i = 0; i < s.length(); i++) {
        if (s.charAt(i) == '(') stack.push(i);
        else if (s.charAt(i) == ')') {
            if (!stack.isEmpty()) stack.pop();
            else remove.add(i);
        }
    }
    remove.addAll(stack);
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < s.length(); i++)
        if (!remove.contains(i)) sb.append(s.charAt(i));
    return sb.toString();
}`,
  },

  defaultInput: {
    s: 'lee(t(c)o)de)',
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'lee(t(c)o)de)',
      placeholder: 'lee(t(c)o)de)',
      helperText: 'String with parentheses and letters',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const stack: number[] = [];
    const remove = new Set<number>();

    steps.push({
      line: 1,
      explanation: `Input: "${s}". Use a stack to track unmatched open parenthesis indices.`,
      variables: { s, stack: '[]', remove: '{}' },
      visualization: {
        type: 'array',
        array: s.split('').map((_, i) => i),
        highlights: {},
        labels: Object.fromEntries(s.split('').map((c, i) => [i, c])),
      },
    });

    for (let i = 0; i < s.length; i++) {
      const c = s[i];

      if (c === '(') {
        stack.push(i);
        steps.push({
          line: 5,
          explanation: `Index ${i}: "(" found. Push index ${i} to stack. Stack: [${stack.join(', ')}]`,
          variables: { index: i, char: c, stack: stack.join(', '), stackSize: stack.length },
          visualization: {
            type: 'array',
            array: s.split('').map((_, idx) => idx),
            highlights: {
              [i]: 'active',
              ...Object.fromEntries([...remove].map(r => [r, 'mismatch'])),
              ...Object.fromEntries(stack.slice(0, -1).map(si => [si, 'pointer'])),
            },
            labels: Object.fromEntries(s.split('').map((ch, idx) => [idx, ch])),
          },
        });
      } else if (c === ')') {
        if (stack.length > 0) {
          const matched = stack.pop()!;
          steps.push({
            line: 8,
            explanation: `Index ${i}: ")" matches open "(" at index ${matched}. Pop from stack. Stack: [${stack.join(', ')}]`,
            variables: { index: i, char: c, matchedWith: matched, stack: stack.join(', ') },
            visualization: {
              type: 'array',
              array: s.split('').map((_, idx) => idx),
              highlights: {
                [i]: 'found',
                [matched]: 'found',
                ...Object.fromEntries([...remove].map(r => [r, 'mismatch'])),
              },
              labels: Object.fromEntries(s.split('').map((ch, idx) => [idx, ch])),
            },
          });
        } else {
          remove.add(i);
          steps.push({
            line: 10,
            explanation: `Index ${i}: ")" with no matching "(". Mark index ${i} for removal. Remove set: {${[...remove].join(', ')}}`,
            variables: { index: i, char: c, stack: '[]', removeSet: [...remove].join(', ') },
            visualization: {
              type: 'array',
              array: s.split('').map((_, idx) => idx),
              highlights: {
                [i]: 'mismatch',
                ...Object.fromEntries([...remove].filter(r => r !== i).map(r => [r, 'mismatch'])),
              },
              labels: Object.fromEntries(s.split('').map((ch, idx) => [idx, ch])),
            },
          });
        }
      }
    }

    for (const idx of stack) remove.add(idx);

    steps.push({
      line: 11,
      explanation: `Remaining stack indices are unmatched "(": [${stack.join(', ')}]. Add to remove set: {${[...remove].join(', ')}}`,
      variables: { unmatchedOpen: stack.join(', '), removeSet: [...remove].join(', ') },
      visualization: {
        type: 'array',
        array: s.split('').map((_, idx) => idx),
        highlights: {
          ...Object.fromEntries([...remove].map(r => [r, 'mismatch'])),
        },
        labels: Object.fromEntries(s.split('').map((c, idx) => [idx, c])),
      },
    });

    const result = s.split('').filter((_, i) => !remove.has(i)).join('');
    steps.push({
      line: 12,
      explanation: `Remove chars at indices {${[...remove].join(', ')}}. Result: "${result}"`,
      variables: { removedIndices: [...remove].join(', '), result },
      visualization: {
        type: 'array',
        array: s.split('').map((_, idx) => idx),
        highlights: Object.fromEntries(s.split('').map((_, idx) => [idx, remove.has(idx) ? 'mismatch' : 'found'])),
        labels: Object.fromEntries(s.split('').map((c, idx) => [idx, c])),
      },
    });

    return steps;
  },
};

export default minimumRemoveValidParentheses;

import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const removeAllAdjacentDuplicates: AlgorithmDefinition = {
  id: 'remove-all-adjacent-duplicates',
  title: 'Remove All Adjacent Duplicates In String',
  leetcodeNumber: 1047,
  difficulty: 'Easy',
  category: 'Stack',
  description:
    'Given a string s, repeatedly remove all adjacent pairs of duplicate characters until no more can be removed. Use a stack: push each character if it differs from the stack top, otherwise pop the top (both characters cancel out).',
  tags: ['stack', 'string', 'greedy'],

  code: {
    pseudocode: `function removeDuplicates(s):
  stack = []
  for char in s:
    if stack is not empty and stack.top == char:
      stack.pop() (remove the pair)
    else:
      stack.push(char)
  return stack.join("")`,

    python: `def removeDuplicates(s: str) -> str:
    stack = []
    for c in s:
        if stack and stack[-1] == c:
            stack.pop()
        else:
            stack.append(c)
    return ''.join(stack)`,

    javascript: `function removeDuplicates(s) {
  const stack = [];
  for (const c of s) {
    if (stack.length && stack[stack.length - 1] === c) {
      stack.pop();
    } else {
      stack.push(c);
    }
  }
  return stack.join('');
}`,

    java: `public String removeDuplicates(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (!stack.isEmpty() && stack.peek() == c) {
            stack.pop();
        } else {
            stack.push(c);
        }
    }
    StringBuilder sb = new StringBuilder();
    for (char c : stack) sb.append(c);
    return sb.reverse().toString();
}`,
  },

  defaultInput: {
    s: 'abbaca',
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'abbaca',
      placeholder: 'abbaca',
      helperText: 'String to remove adjacent duplicates from',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const stack: string[] = [];

    steps.push({
      line: 1,
      explanation: `Input: "${s}". Use a stack. If the current char equals the top of the stack, pop (cancel them). Otherwise push.`,
      variables: { s, stack: '[]' },
      visualization: {
        type: 'array',
        array: s.split('').map((_, i) => i),
        highlights: {},
        labels: Object.fromEntries(s.split('').map((c, i) => [i, c])),
      },
    });

    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      const top = stack.length > 0 ? stack[stack.length - 1] : null;

      if (top === c) {
        stack.pop();
        steps.push({
          line: 4,
          explanation: `char[${i}]="${c}" == stack top "${top}". Remove the pair! Stack becomes: [${stack.join(', ')}]`,
          variables: { index: i, char: c, stackTop: top, action: 'POP', stack: stack.join('') },
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
      } else {
        stack.push(c);
        steps.push({
          line: 6,
          explanation: `char[${i}]="${c}" != stack top "${top ?? 'empty'}". Push "${c}" to stack. Stack: [${stack.join(', ')}]`,
          variables: { index: i, char: c, stackTop: top ?? 'empty', action: 'PUSH', stack: stack.join('') },
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
      }

      steps.push({
        line: 3,
        explanation: `Stack after processing "${c}": "${stack.join('')}" (size=${stack.length})`,
        variables: { stack: stack.join(''), stackSize: stack.length },
        visualization: {
          type: 'array',
          array: stack.length > 0 ? stack as unknown as number[] : [0],
          highlights: Object.fromEntries(stack.map((_, k) => [k, k === stack.length - 1 ? 'pointer' : 'active'])),
          labels: Object.fromEntries(stack.map((ch, k) => [k, ch])),
        },
      });
    }

    const result = stack.join('');
    steps.push({
      line: 7,
      explanation: `All characters processed. Stack contains: "${result}". This is the final result after all adjacent duplicates removed.`,
      variables: { result },
      visualization: {
        type: 'array',
        array: result.length > 0 ? result.split('').map((_, i) => i) : [0],
        highlights: Object.fromEntries(result.split('').map((_, i) => [i, 'found'])),
        labels: result.length > 0
          ? Object.fromEntries(result.split('').map((c, i) => [i, c]))
          : { 0: '(empty)' },
      },
    });

    return steps;
  },
};

export default removeAllAdjacentDuplicates;

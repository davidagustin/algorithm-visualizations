import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const scoreOfParentheses: AlgorithmDefinition = {
  id: 'score-of-parentheses',
  title: 'Score of Parentheses',
  leetcodeNumber: 856,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Given a balanced parentheses string, return its score. The scoring rules are: "()" has score 1, "AB" (concatenation) has score A+B, and "(A)" has score 2*A. Use a stack to track scores at each nesting level. On "(", push 0. On ")", pop and if value is 0 push 1, else push 2 * value.',
  tags: ['stack', 'string', 'parentheses', 'scoring'],

  code: {
    pseudocode: `function scoreOfParentheses(s):
  stack = [0]
  for each char c in s:
    if c == '(':
      stack.push(0)
    else:
      v = stack.pop()
      stack.top += max(2 * v, 1)
  return stack[0]`,

    python: `def scoreOfParentheses(s: str) -> int:
    stack = [0]
    for c in s:
        if c == '(':
            stack.append(0)
        else:
            v = stack.pop()
            stack[-1] += max(2 * v, 1)
    return stack[0]`,

    javascript: `function scoreOfParentheses(s) {
  const stack = [0];
  for (const c of s) {
    if (c === '(') {
      stack.push(0);
    } else {
      const v = stack.pop();
      stack[stack.length - 1] += Math.max(2 * v, 1);
    }
  }
  return stack[0];
}`,

    java: `public int scoreOfParentheses(String s) {
    Deque<Integer> stack = new ArrayDeque<>();
    stack.push(0);
    for (char c : s.toCharArray()) {
        if (c == '(') {
            stack.push(0);
        } else {
            int v = stack.pop();
            stack.push(stack.pop() + Math.max(2 * v, 1));
        }
    }
    return stack.peek();
}`,
  },

  defaultInput: {
    s: '(()(()))',
  },

  inputFields: [
    {
      name: 's',
      label: 'Parentheses String',
      type: 'string',
      defaultValue: '(()(()))',
      placeholder: '(()(()))',
      helperText: 'A balanced parentheses string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const stack: number[] = [0];

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map(v => String(v)),
      inputChars: s.split(''),
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: 'Initialize stack with [0] representing score at the outermost level.',
      variables: { stack: [0] },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < s.length; i++) {
      const c = s[i];

      if (c === '(') {
        stack.push(0);
        steps.push({
          line: 4,
          explanation: `"(" at index ${i}: Open new level. Push 0 onto stack. Stack = [${stack.join(', ')}].`,
          variables: { i, char: c, stack: [...stack] },
          visualization: makeViz(i, 'push'),
        });
      } else {
        const v = stack.pop()!;
        const added = Math.max(2 * v, 1);
        stack[stack.length - 1] += added;
        steps.push({
          line: 7,
          explanation: `")" at index ${i}: Pop v=${v}. Add max(2*${v}, 1)=${added} to new top. Stack = [${stack.join(', ')}].`,
          variables: { i, char: c, v, added, stack: [...stack] },
          visualization: makeViz(i, 'pop'),
        });
      }
    }

    steps.push({
      line: 8,
      explanation: `Done. Total score = ${stack[0]}.`,
      variables: { result: stack[0] },
      visualization: makeViz(s.length, 'match'),
    });

    return steps;
  },
};

export default scoreOfParentheses;

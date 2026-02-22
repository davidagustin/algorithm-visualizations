import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const longestValidParentheses: AlgorithmDefinition = {
  id: 'longest-valid-parentheses',
  title: 'Longest Valid Parentheses',
  leetcodeNumber: 32,
  difficulty: 'Hard',
  category: 'Stack',
  description:
    'Given a string containing only parentheses, find the length of the longest valid (well-formed) parentheses substring. Use a stack initialized with -1 as a base index. Push indices of opening brackets; on closing brackets pop and compute length using current index minus new stack top.',
  tags: ['stack', 'string', 'dynamic programming', 'parentheses'],

  code: {
    pseudocode: `function longestValidParentheses(s):
  stack = [-1]
  maxLen = 0
  for i = 0 to n-1:
    if s[i] == '(':
      stack.push(i)
    else:
      stack.pop()
      if stack is empty:
        stack.push(i)
      else:
        maxLen = max(maxLen, i - stack.top)
  return maxLen`,

    python: `def longestValidParentheses(s: str) -> int:
    stack = [-1]
    max_len = 0
    for i, c in enumerate(s):
        if c == '(':
            stack.append(i)
        else:
            stack.pop()
            if not stack:
                stack.append(i)
            else:
                max_len = max(max_len, i - stack[-1])
    return max_len`,

    javascript: `function longestValidParentheses(s) {
  const stack = [-1];
  let maxLen = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') {
      stack.push(i);
    } else {
      stack.pop();
      if (!stack.length) {
        stack.push(i);
      } else {
        maxLen = Math.max(maxLen, i - stack.at(-1));
      }
    }
  }
  return maxLen;
}`,

    java: `public int longestValidParentheses(String s) {
    Deque<Integer> stack = new ArrayDeque<>();
    stack.push(-1);
    int maxLen = 0;
    for (int i = 0; i < s.length(); i++) {
        if (s.charAt(i) == '(') {
            stack.push(i);
        } else {
            stack.pop();
            if (stack.isEmpty()) {
                stack.push(i);
            } else {
                maxLen = Math.max(maxLen, i - stack.peek());
            }
        }
    }
    return maxLen;
}`,
  },

  defaultInput: {
    s: '(()())',
  },

  inputFields: [
    {
      name: 's',
      label: 'Parentheses String',
      type: 'string',
      defaultValue: '(()())',
      placeholder: '(()())',
      helperText: 'String containing only ( and )',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const stack: number[] = [-1];
    let maxLen = 0;

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map(v => v === -1 ? 'base(-1)' : `idx(${v})`),
      inputChars: s.split(''),
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: 'Initialize stack with sentinel -1 as base index. maxLen = 0.',
      variables: { stack: [-1], maxLen: 0 },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < s.length; i++) {
      const c = s[i];

      if (c === '(') {
        stack.push(i);
        steps.push({
          line: 5,
          explanation: `s[${i}] = '(' : Push index ${i} onto stack.`,
          variables: { i, char: c, stack: [...stack], maxLen },
          visualization: makeViz(i, 'push'),
        });
      } else {
        stack.pop();
        if (stack.length === 0) {
          stack.push(i);
          steps.push({
            line: 9,
            explanation: `s[${i}] = ')' : Stack was empty after pop. Push ${i} as new base index.`,
            variables: { i, char: c, stack: [...stack], maxLen },
            visualization: makeViz(i, 'mismatch'),
          });
        } else {
          const len = i - stack[stack.length - 1];
          maxLen = Math.max(maxLen, len);
          steps.push({
            line: 11,
            explanation: `s[${i}] = ')' : Popped. Stack top = ${stack[stack.length - 1]}. Valid length = ${i} - ${stack[stack.length - 1]} = ${len}. maxLen = ${maxLen}.`,
            variables: { i, char: c, stack: [...stack], len, maxLen },
            visualization: makeViz(i, 'match'),
          });
        }
      }
    }

    steps.push({
      line: 12,
      explanation: `Done. Longest valid parentheses = ${maxLen}.`,
      variables: { result: maxLen },
      visualization: makeViz(s.length, 'idle'),
    });

    return steps;
  },
};

export default longestValidParentheses;

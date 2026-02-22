import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const reverseSubstringsBetweenParentheses: AlgorithmDefinition = {
  id: 'reverse-substrings-between-parentheses',
  title: 'Reverse Substrings Between Each Pair of Parentheses',
  leetcodeNumber: 1190,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Given a string with lowercase letters and parentheses, reverse the substrings in each pair of matching parentheses. Process from the innermost parentheses outward. Use a stack of character arrays: push a new buffer on open paren, and on close paren pop the top buffer, reverse it, and append to the buffer below.',
  tags: ['stack', 'string', 'parentheses'],

  code: {
    pseudocode: `function reverseParentheses(s):
  stack = [[]]
  for c in s:
    if c == '(':
      stack.push([])  // new buffer for inner content
    elif c == ')':
      top = stack.pop()
      top.reverse()
      stack.top().extend(top)
    else:
      stack.top().append(c)
  return join(stack[0])`,

    python: `def reverseParentheses(s: str) -> str:
    stack = [[]]
    for c in s:
        if c == '(':
            stack.append([])
        elif c == ')':
            top = stack.pop()
            top.reverse()
            stack[-1].extend(top)
        else:
            stack[-1].append(c)
    return ''.join(stack[0])`,

    javascript: `function reverseParentheses(s) {
  const stack = [[]];
  for (const c of s) {
    if (c === '(') {
      stack.push([]);
    } else if (c === ')') {
      const top = stack.pop();
      top.reverse();
      stack[stack.length - 1].push(...top);
    } else {
      stack[stack.length - 1].push(c);
    }
  }
  return stack[0].join('');
}`,

    java: `public String reverseParentheses(String s) {
    Deque<List<Character>> stack = new ArrayDeque<>();
    stack.push(new ArrayList<>());
    for (char c : s.toCharArray()) {
        if (c == '(') {
            stack.push(new ArrayList<>());
        } else if (c == ')') {
            List<Character> top = stack.pop();
            Collections.reverse(top);
            stack.peek().addAll(top);
        } else {
            stack.peek().add(c);
        }
    }
    StringBuilder sb = new StringBuilder();
    for (char c : stack.peek()) sb.append(c);
    return sb.toString();
}`,
  },

  defaultInput: {
    s: '(ed(et(oc))el)',
  },

  inputFields: [
    {
      name: 's',
      label: 'Input String',
      type: 'string',
      defaultValue: '(ed(et(oc))el)',
      placeholder: '(ed(et(oc))el)',
      helperText: 'String with lowercase letters and parentheses',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const chars = s.split('');

    // Stack of string arrays representing buffers
    const buffers: string[][] = [[]];
    // For visualization stack items
    const stackDisplay: string[] = [];

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: buffers.map(b => '[' + b.join('') + ']'),
      inputChars: chars,
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Reverse substrings inside parentheses in "${s}". Use a stack of character buffers.`,
      variables: { s, buffers: ['[]'] },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];

      if (c === '(') {
        buffers.push([]);
        steps.push({
          line: 3,
          explanation: `'(' at index ${i}: push a new empty buffer onto stack. Now have ${buffers.length} buffers.`,
          variables: { i, char: c, bufferCount: buffers.length },
          visualization: makeViz(i, 'push'),
        });
      } else if (c === ')') {
        const top = buffers.pop()!;
        const reversed = [...top].reverse();
        buffers[buffers.length - 1].push(...reversed);
        steps.push({
          line: 5,
          explanation: `')' at index ${i}: pop top buffer "${top.join('')}", reverse it to "${reversed.join('')}", append to buffer below. Buffer below now: "${buffers[buffers.length - 1].join('')}".`,
          variables: { i, popped: top.join(''), reversed: reversed.join(''), bufferBelow: buffers[buffers.length - 1].join('') },
          visualization: makeViz(i, 'pop'),
        });
      } else {
        buffers[buffers.length - 1].push(c);
        steps.push({
          line: 9,
          explanation: `Letter '${c}' at index ${i}: append to top buffer. Top buffer: "${buffers[buffers.length - 1].join('')}".`,
          variables: { i, char: c, topBuffer: buffers[buffers.length - 1].join('') },
          visualization: makeViz(i, 'idle'),
        });
      }
    }

    const result = buffers[0].join('');
    steps.push({
      line: 10,
      explanation: `Done. Final result: "${result}".`,
      variables: { result },
      visualization: makeViz(-1, 'found'),
    });

    void stackDisplay; // suppress unused warning
    return steps;
  },
};

export default reverseSubstringsBetweenParentheses;

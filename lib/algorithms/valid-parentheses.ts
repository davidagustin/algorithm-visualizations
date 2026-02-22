import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const validParentheses: AlgorithmDefinition = {
  id: 'valid-parentheses',
  title: 'Valid Parentheses',
  leetcodeNumber: 20,
  difficulty: 'Easy',
  category: 'Stack',
  description:
    'Given a string containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid. An input string is valid if every open bracket is closed by the same type of bracket in the correct order.',
  tags: ['stack', 'string', 'matching'],

  code: {
    pseudocode: `function isValid(s):
  stack = []
  pairs = { ')':'(', ']':'[', '}':'{' }
  for each char in s:
    if char is opening bracket:
      push char onto stack
    else:
      if stack is empty or top != pairs[char]:
        return false
      pop from stack
  return stack is empty`,

    python: `def isValid(s: str) -> bool:
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    for char in s:
        if char in '({[':
            stack.append(char)
        else:
            if not stack or stack[-1] != pairs[char]:
                return False
            stack.pop()
    return len(stack) == 0`,

    javascript: `function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };
  for (const char of s) {
    if ('({['.includes(char)) {
      stack.push(char);
    } else {
      if (!stack.length || stack.at(-1) !== pairs[char]) {
        return false;
      }
      stack.pop();
    }
  }
  return stack.length === 0;
}`,

    java: `public boolean isValid(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    Map<Character,Character> pairs = Map.of(
        ')', '(', ']', '[', '}', '{');
    for (char c : s.toCharArray()) {
        if (c == '(' || c == '{' || c == '[') {
            stack.push(c);
        } else {
            if (stack.isEmpty() || stack.peek() != pairs.get(c))
                return false;
            stack.pop();
        }
    }
    return stack.isEmpty();
}`,
  },

  defaultInput: {
    s: '({[]})',
  },

  inputFields: [
    {
      name: 's',
      label: 'Bracket String',
      type: 'string',
      defaultValue: '({[]})',
      placeholder: '({[]})',
      helperText: 'String of brackets: (, ), {, }, [, ]',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const chars = s.split('');
    const steps: AlgorithmStep[] = [];
    const stack: string[] = [];
    const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
    const openBrackets = new Set(['(', '{', '[']);

    const makeViz = (
      currentIndex: number,
      action: StackVisualization['action']
    ): StackVisualization => ({
      type: 'stack',
      items: [...stack],
      inputChars: chars,
      currentIndex,
      action,
    });

    // Step: Initialize empty stack
    steps.push({
      line: 2,
      explanation: 'Initialize an empty stack to track opening brackets.',
      variables: { stack: [], s },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];

      if (openBrackets.has(char)) {
        // Opening bracket: push
        steps.push({
          line: 4,
          explanation: `Character '${char}' at index ${i} is an opening bracket.`,
          variables: { i, char, stack: [...stack] },
          visualization: makeViz(i, 'idle'),
        });

        stack.push(char);

        steps.push({
          line: 5,
          explanation: `Push '${char}' onto the stack.`,
          variables: { i, char, stack: [...stack] },
          visualization: makeViz(i, 'push'),
        });
      } else {
        // Closing bracket
        const expected = pairs[char];

        steps.push({
          line: 6,
          explanation: `Character '${char}' at index ${i} is a closing bracket. Need matching '${expected}' on top of stack.`,
          variables: { i, char, expected, stackTop: stack.length > 0 ? stack[stack.length - 1] : 'empty' },
          visualization: makeViz(i, 'idle'),
        });

        if (stack.length === 0 || stack[stack.length - 1] !== expected) {
          // Mismatch
          const reason =
            stack.length === 0
              ? 'Stack is empty, no matching opening bracket.'
              : `Top of stack is '${stack[stack.length - 1]}', expected '${expected}'.`;

          steps.push({
            line: 8,
            explanation: `Mismatch! ${reason} Return false.`,
            variables: { i, char, expected, stack: [...stack], result: false },
            visualization: makeViz(i, 'mismatch'),
          });

          return steps;
        }

        // Match: pop
        stack.pop();

        steps.push({
          line: 9,
          explanation: `Top of stack matches '${expected}'. Pop it off. Match successful.`,
          variables: { i, char, stack: [...stack] },
          visualization: makeViz(i, 'match'),
        });
      }
    }

    // Final check
    const isValid = stack.length === 0;

    steps.push({
      line: 10,
      explanation: isValid
        ? 'All characters processed. Stack is empty, so the string is valid!'
        : `All characters processed. Stack still has ${stack.length} unmatched bracket(s). Invalid.`,
      variables: { stack: [...stack], result: isValid },
      visualization: makeViz(chars.length, isValid ? 'match' : 'mismatch'),
    });

    return steps;
  },
};

export default validParentheses;

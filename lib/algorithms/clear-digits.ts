import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const clearDigits: AlgorithmDefinition = {
  id: 'clear-digits',
  title: 'Clear Digits',
  leetcodeNumber: 3174,
  difficulty: 'Easy',
  category: 'Stack',
  description:
    'Given a string containing lowercase letters and digits, repeatedly remove the leftmost digit and its closest non-digit character to the left. Use a stack: push letters onto the stack, and when a digit is encountered pop the top letter (removing the pair). Return the remaining characters in the stack.',
  tags: ['stack', 'string', 'simulation'],

  code: {
    pseudocode: `function clearDigits(s):
  stack = []
  for c in s:
    if c is digit:
      if stack not empty:
        stack.pop()  // remove preceding letter
      // digit is also removed (not pushed)
    else:
      stack.push(c)
  return join(stack)`,

    python: `def clearDigits(s: str) -> str:
    stack = []
    for c in s:
        if c.isdigit():
            if stack:
                stack.pop()
        else:
            stack.append(c)
    return ''.join(stack)`,

    javascript: `function clearDigits(s) {
  const stack = [];
  for (const c of s) {
    if (c >= '0' && c <= '9') {
      stack.pop();
    } else {
      stack.push(c);
    }
  }
  return stack.join('');
}`,

    java: `public String clearDigits(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (Character.isDigit(c)) {
            if (!stack.isEmpty()) stack.pop();
        } else {
            stack.push(c);
        }
    }
    StringBuilder sb = new StringBuilder();
    while (!stack.isEmpty()) sb.append(stack.pop());
    return sb.reverse().toString();
}`,
  },

  defaultInput: {
    s: 'cb34',
  },

  inputFields: [
    {
      name: 's',
      label: 'Input String',
      type: 'string',
      defaultValue: 'cb34',
      placeholder: 'cb34',
      helperText: 'String of lowercase letters and digits',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const chars = s.split('');
    const stack: string[] = [];

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: [...stack],
      inputChars: chars,
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Clear digits from "${s}". Each digit removes the closest preceding letter. Use a stack of letters.`,
      variables: { s, stack: [] },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];
      const isDigit = c >= '0' && c <= '9';

      if (isDigit) {
        const removed = stack.length > 0 ? stack[stack.length - 1] : 'none';
        if (stack.length > 0) stack.pop();
        steps.push({
          line: 3,
          explanation: `Digit '${c}' at index ${i}: pop closest preceding letter '${removed}' from stack. Both are removed. Stack: [${stack.join(', ')}].`,
          variables: { i, char: c, removed, stack: [...stack] },
          visualization: makeViz(i, 'pop'),
        });
      } else {
        stack.push(c);
        steps.push({
          line: 7,
          explanation: `Letter '${c}' at index ${i}: push onto stack. Stack: [${stack.join(', ')}].`,
          variables: { i, char: c, stack: [...stack] },
          visualization: makeViz(i, 'push'),
        });
      }
    }

    const result = stack.join('');
    steps.push({
      line: 8,
      explanation: `Done. Remaining letters: "${result}".`,
      variables: { result },
      visualization: makeViz(-1, 'found'),
    });

    return steps;
  },
};

export default clearDigits;

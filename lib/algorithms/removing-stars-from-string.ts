import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const removingStarsFromString: AlgorithmDefinition = {
  id: 'removing-stars-from-string',
  title: 'Removing Stars From a String',
  leetcodeNumber: 2390,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Given a string with letters and stars (*), repeatedly remove the closest non-star character to the left of each star (and the star itself). Return the result after all stars are removed. Use a stack: push letters onto the stack, and when a star is encountered pop the top element (removing the preceding letter).',
  tags: ['stack', 'string', 'simulation'],

  code: {
    pseudocode: `function removeStars(s):
  stack = []
  for c in s:
    if c == '*':
      stack.pop()  // remove preceding letter
    else:
      stack.push(c)
  return join(stack)`,

    python: `def removeStars(s: str) -> str:
    stack = []
    for c in s:
        if c == '*':
            stack.pop()
        else:
            stack.append(c)
    return ''.join(stack)`,

    javascript: `function removeStars(s) {
  const stack = [];
  for (const c of s) {
    if (c === '*') stack.pop();
    else stack.push(c);
  }
  return stack.join('');
}`,

    java: `public String removeStars(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (c == '*') stack.pop();
        else stack.push(c);
    }
    StringBuilder sb = new StringBuilder();
    while (!stack.isEmpty()) sb.append(stack.pop());
    return sb.reverse().toString();
}`,
  },

  defaultInput: {
    s: 'leet**cod*e',
  },

  inputFields: [
    {
      name: 's',
      label: 'Input String',
      type: 'string',
      defaultValue: 'leet**cod*e',
      placeholder: 'leet**cod*e',
      helperText: 'String with lowercase letters and stars',
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
      explanation: `Remove stars from "${s}". Each star removes the closest preceding letter. Use stack to track letters.`,
      variables: { s, stack: [] },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];

      if (c === '*') {
        const removed = stack.length > 0 ? stack[stack.length - 1] : 'none';
        stack.pop();
        steps.push({
          line: 3,
          explanation: `'*' at index ${i}: pop the closest preceding letter '${removed}' from the stack. Stack: [${stack.join(', ')}].`,
          variables: { i, char: c, removed, stack: [...stack] },
          visualization: makeViz(i, 'pop'),
        });
      } else {
        stack.push(c);
        steps.push({
          line: 5,
          explanation: `Letter '${c}' at index ${i}: push onto stack. Stack: [${stack.join(', ')}].`,
          variables: { i, char: c, stack: [...stack] },
          visualization: makeViz(i, 'push'),
        });
      }
    }

    const result = stack.join('');
    steps.push({
      line: 7,
      explanation: `Done. Remaining letters in stack form the result: "${result}".`,
      variables: { result },
      visualization: makeViz(-1, 'found'),
    });

    return steps;
  },
};

export default removingStarsFromString;

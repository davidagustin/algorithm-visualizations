import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const checkIfWordIsValidAfterSubstitutions: AlgorithmDefinition = {
  id: 'check-if-word-is-valid-after-substitutions',
  title: 'Check If Word Is Valid After Substitutions',
  leetcodeNumber: 1003,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'A string is valid if it can be formed by starting with an empty string and repeatedly inserting "abc" anywhere. Given a string, check if it is valid. Use a stack: push each character, and whenever the top three stack characters are "a","b","c" (in order), pop all three. The string is valid if the stack is empty at the end.',
  tags: ['stack', 'string', 'simulation'],

  code: {
    pseudocode: `function isValid(s):
  stack = []
  for each char c in s:
    stack.push(c)
    if stack ends with ['a','b','c']:
      stack.pop()  // pop 'c'
      stack.pop()  // pop 'b'
      stack.pop()  // pop 'a'
  return stack is empty`,

    python: `def isValid(s: str) -> bool:
    stack = []
    for c in s:
        stack.append(c)
        if len(stack) >= 3 and stack[-3:] == ['a', 'b', 'c']:
            stack.pop()
            stack.pop()
            stack.pop()
    return len(stack) == 0`,

    javascript: `function isValid(s) {
  const stack = [];
  for (const c of s) {
    stack.push(c);
    const n = stack.length;
    if (n >= 3 && stack[n-3] === 'a' && stack[n-2] === 'b' && stack[n-1] === 'c') {
      stack.splice(n - 3, 3);
    }
  }
  return stack.length === 0;
}`,

    java: `public boolean isValid(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        stack.push(c);
        if (stack.size() >= 3) {
            char c1 = stack.pop(), c2 = stack.pop(), c3 = stack.pop();
            if (c3 == 'a' && c2 == 'b' && c1 == 'c') continue;
            stack.push(c3); stack.push(c2); stack.push(c1);
        }
    }
    return stack.isEmpty();
}`,
  },

  defaultInput: {
    s: 'aabcbc',
  },

  inputFields: [
    {
      name: 's',
      label: 'Input String',
      type: 'string',
      defaultValue: 'aabcbc',
      placeholder: 'aabcbc',
      helperText: 'String containing only a, b, c characters',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const stack: string[] = [];

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: [...stack],
      inputChars: s.split(''),
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Input = "${s}". Push characters; when top 3 form "abc", remove them.`,
      variables: { s, stack: [] },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      stack.push(c);

      steps.push({
        line: 3,
        explanation: `Push "${c}". Stack = [${stack.join(', ')}].`,
        variables: { i, char: c, stack: [...stack] },
        visualization: makeViz(i, 'push'),
      });

      const n = stack.length;
      if (n >= 3 && stack[n - 3] === 'a' && stack[n - 2] === 'b' && stack[n - 1] === 'c') {
        stack.splice(n - 3, 3);
        steps.push({
          line: 5,
          explanation: `Top 3 = "abc"! Remove them. Stack = [${stack.join(', ')}].`,
          variables: { i, stack: [...stack] },
          visualization: makeViz(i, 'pop'),
        });
      }
    }

    const isValid = stack.length === 0;
    steps.push({
      line: 8,
      explanation: `Done. Stack is ${isValid ? 'empty' : `[${stack.join(', ')}]`}. Valid = ${isValid}.`,
      variables: { result: isValid, remainingStack: [...stack] },
      visualization: makeViz(s.length, isValid ? 'match' : 'mismatch'),
    });

    return steps;
  },
};

export default checkIfWordIsValidAfterSubstitutions;

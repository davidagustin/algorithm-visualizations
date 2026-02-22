import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const makeTheStringGreat: AlgorithmDefinition = {
  id: 'make-the-string-great',
  title: 'Make The String Great',
  leetcodeNumber: 1544,
  difficulty: 'Easy',
  category: 'Stack',
  description:
    'Given a string, repeatedly remove adjacent pairs where one letter is lowercase and the other is the same letter uppercase. Return the resulting string after all such removals. Use a stack: for each character, check if it forms a bad pair with the stack top (same letter, different case), and pop if so, otherwise push.',
  tags: ['stack', 'string', 'greedy'],

  code: {
    pseudocode: `function makeGood(s):
  stack = []
  for each char c in s:
    if stack not empty and c != stack.top
       and c.lower() == stack.top.lower():
      stack.pop()
    else:
      stack.push(c)
  return join(stack)`,

    python: `def makeGood(s: str) -> str:
    stack = []
    for c in s:
        if stack and c != stack[-1] and c.lower() == stack[-1].lower():
            stack.pop()
        else:
            stack.append(c)
    return ''.join(stack)`,

    javascript: `function makeGood(s) {
  const stack = [];
  for (const c of s) {
    if (stack.length && c !== stack.at(-1) && c.toLowerCase() === stack.at(-1).toLowerCase()) {
      stack.pop();
    } else {
      stack.push(c);
    }
  }
  return stack.join('');
}`,

    java: `public String makeGood(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (!stack.isEmpty() && c != stack.peek()
            && Character.toLowerCase(c) == Character.toLowerCase(stack.peek())) {
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
    s: 'leEeetcode',
  },

  inputFields: [
    {
      name: 's',
      label: 'Input String',
      type: 'string',
      defaultValue: 'leEeetcode',
      placeholder: 'leEeetcode',
      helperText: 'A string with upper and lowercase English letters',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const stack: string[] = [];

    const isBadPair = (a: string, b: string) =>
      a !== b && a.toLowerCase() === b.toLowerCase();

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: [...stack],
      inputChars: s.split(''),
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Input = "${s}". Initialize empty stack. Process each character.`,
      variables: { s, stack: [] },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      const top = stack.length > 0 ? stack[stack.length - 1] : null;

      if (top !== null && isBadPair(c, top)) {
        stack.pop();
        steps.push({
          line: 4,
          explanation: `"${c}" and stack top "${top}" are the same letter with different cases. Remove the pair. Stack = [${stack.join(', ')}].`,
          variables: { i, char: c, top, stack: [...stack] },
          visualization: makeViz(i, 'pop'),
        });
      } else {
        stack.push(c);
        steps.push({
          line: 7,
          explanation: `"${c}" does not form a bad pair with top "${top ?? 'empty'}". Push "${c}". Stack = [${stack.join(', ')}].`,
          variables: { i, char: c, top: top ?? 'empty', stack: [...stack] },
          visualization: makeViz(i, 'push'),
        });
      }
    }

    steps.push({
      line: 8,
      explanation: `Done. Result = "${stack.join('')}".`,
      variables: { result: stack.join('') },
      visualization: makeViz(s.length, 'match'),
    });

    return steps;
  },
};

export default makeTheStringGreat;

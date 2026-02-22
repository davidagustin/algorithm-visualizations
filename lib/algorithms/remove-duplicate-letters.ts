import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const removeDuplicateLetters: AlgorithmDefinition = {
  id: 'remove-duplicate-letters',
  title: 'Remove Duplicate Letters',
  leetcodeNumber: 316,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Given a string, remove duplicate letters so that every letter appears exactly once. The result must be the smallest lexicographic order among all possible results. Use a greedy monotonic stack: if the current character is smaller than the stack top and the top appears again later, pop the top.',
  tags: ['stack', 'greedy', 'string', 'monotonic stack', 'lexicographic'],

  code: {
    pseudocode: `function removeDuplicateLetters(s):
  count = frequency of each char in s
  inStack = set of chars currently in stack
  stack = []
  for each char c in s:
    count[c] -= 1
    if c in inStack: continue
    while stack not empty and c < stack.top and count[stack.top] > 0:
      inStack.remove(stack.pop())
    stack.push(c)
    inStack.add(c)
  return join(stack)`,

    python: `def removeDuplicateLetters(s: str) -> str:
    count = collections.Counter(s)
    in_stack = set()
    stack = []
    for c in s:
        count[c] -= 1
        if c in in_stack:
            continue
        while stack and c < stack[-1] and count[stack[-1]] > 0:
            in_stack.discard(stack.pop())
        stack.append(c)
        in_stack.add(c)
    return ''.join(stack)`,

    javascript: `function removeDuplicateLetters(s) {
  const count = {};
  for (const c of s) count[c] = (count[c] || 0) + 1;
  const inStack = new Set();
  const stack = [];
  for (const c of s) {
    count[c]--;
    if (inStack.has(c)) continue;
    while (stack.length && c < stack.at(-1) && count[stack.at(-1)] > 0) {
      inStack.delete(stack.pop());
    }
    stack.push(c);
    inStack.add(c);
  }
  return stack.join('');
}`,

    java: `public String removeDuplicateLetters(String s) {
    int[] count = new int[26];
    for (char c : s.toCharArray()) count[c - 'a']++;
    boolean[] inStack = new boolean[26];
    Deque<Character> stack = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        count[c - 'a']--;
        if (inStack[c - 'a']) continue;
        while (!stack.isEmpty() && c < stack.peek() && count[stack.peek() - 'a'] > 0) {
            inStack[stack.pop() - 'a'] = false;
        }
        stack.push(c);
        inStack[c - 'a'] = true;
    }
    StringBuilder sb = new StringBuilder();
    for (char c : stack) sb.append(c);
    return sb.reverse().toString();
}`,
  },

  defaultInput: {
    s: 'bcabc',
  },

  inputFields: [
    {
      name: 's',
      label: 'Input String',
      type: 'string',
      defaultValue: 'bcabc',
      placeholder: 'bcabc',
      helperText: 'Lowercase English letters only',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const count: Record<string, number> = {};
    for (const c of s) count[c] = (count[c] || 0) + 1;
    const inStack = new Set<string>();
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
      explanation: `Count character frequencies: ${JSON.stringify(count)}. Initialize empty stack.`,
      variables: { count: { ...count }, stack: [], inStack: [] },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      count[c]--;

      if (inStack.has(c)) {
        steps.push({
          line: 6,
          explanation: `char "${c}" already in stack. Skip it. Remaining count[${c}]=${count[c]}.`,
          variables: { i, c, stack: [...stack], inStack: [...inStack], count: { ...count } },
          visualization: makeViz(i, 'idle'),
        });
        continue;
      }

      while (stack.length > 0 && c < stack[stack.length - 1] && count[stack[stack.length - 1]] > 0) {
        const popped = stack.pop()!;
        inStack.delete(popped);
        steps.push({
          line: 8,
          explanation: `"${c}" < "${popped}" and "${popped}" appears later (count=${count[popped]}). Pop "${popped}" from stack for lexicographic improvement.`,
          variables: { c, popped, stack: [...stack], count: { ...count } },
          visualization: makeViz(i, 'pop'),
        });
      }

      stack.push(c);
      inStack.add(c);
      steps.push({
        line: 9,
        explanation: `Push "${c}" onto stack. Stack = [${stack.join(', ')}].`,
        variables: { c, stack: [...stack], inStack: [...inStack] },
        visualization: makeViz(i, 'push'),
      });
    }

    steps.push({
      line: 11,
      explanation: `Done. Result = "${stack.join('')}".`,
      variables: { result: stack.join('') },
      visualization: makeViz(s.length, 'match'),
    });

    return steps;
  },
};

export default removeDuplicateLetters;

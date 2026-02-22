import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const smallestSubsequenceOfDistinctChars: AlgorithmDefinition = {
  id: 'smallest-subsequence-of-distinct-chars',
  title: 'Smallest Subsequence of Distinct Characters',
  leetcodeNumber: 1081,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Return the lexicographically smallest subsequence of a string that contains all its distinct characters exactly once. Use a monotonic stack with a greedy approach: for each character, pop the stack top if it is larger than the current character AND the top character appears again later in the string. Skip characters already in the stack.',
  tags: ['stack', 'monotonic stack', 'greedy', 'string', 'hash map'],

  code: {
    pseudocode: `function smallestSubsequence(s):
  lastIdx = {}  // last index of each character
  for i, c in enumerate(s): lastIdx[c] = i
  stack = []
  inStack = set()
  for i, c in enumerate(s):
    if c in inStack: continue
    while stack and stack.top() > c and lastIdx[stack.top()] > i:
      inStack.remove(stack.pop())
    stack.push(c)
    inStack.add(c)
  return join(stack)`,

    python: `def smallestSubsequence(s: str) -> str:
    last_idx = {c: i for i, c in enumerate(s)}
    stack = []
    in_stack = set()
    for i, c in enumerate(s):
        if c in in_stack:
            continue
        while stack and stack[-1] > c and last_idx[stack[-1]] > i:
            in_stack.discard(stack.pop())
        stack.append(c)
        in_stack.add(c)
    return ''.join(stack)`,

    javascript: `function smallestSubsequence(s) {
  const lastIdx = {};
  for (let i = 0; i < s.length; i++) lastIdx[s[i]] = i;
  const stack = [];
  const inStack = new Set();
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inStack.has(c)) continue;
    while (stack.length && stack[stack.length-1] > c && lastIdx[stack[stack.length-1]] > i) {
      inStack.delete(stack.pop());
    }
    stack.push(c);
    inStack.add(c);
  }
  return stack.join('');
}`,

    java: `public String smallestSubsequence(String s) {
    int[] lastIdx = new int[26];
    for (int i = 0; i < s.length(); i++) lastIdx[s.charAt(i) - 'a'] = i;
    Deque<Character> stack = new ArrayDeque<>();
    boolean[] inStack = new boolean[26];
    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
        if (inStack[c - 'a']) continue;
        while (!stack.isEmpty() && stack.peek() > c && lastIdx[stack.peek() - 'a'] > i) {
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
      helperText: 'Lowercase string to extract smallest distinct subsequence',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const chars = s.split('');
    const stack: string[] = [];
    const inStack = new Set<string>();

    // Compute last index of each character
    const lastIdx: Record<string, number> = {};
    for (let i = 0; i < s.length; i++) lastIdx[s[i]] = i;

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: [...stack],
      inputChars: chars,
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Find smallest subsequence with all distinct chars from "${s}". Last indices: {${Object.entries(lastIdx).map(([k, v]) => k + ':' + v).join(', ')}}.`,
      variables: { s, lastIdx: { ...lastIdx }, stack: [] },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];

      if (inStack.has(c)) {
        steps.push({
          line: 5,
          explanation: `'${c}' at index ${i} is already in stack. Skip it (already included).`,
          variables: { i, char: c, inStack: [...inStack] },
          visualization: makeViz(i, 'idle'),
        });
        continue;
      }

      while (
        stack.length > 0 &&
        stack[stack.length - 1] > c &&
        lastIdx[stack[stack.length - 1]] > i
      ) {
        const top = stack.pop()!;
        inStack.delete(top);
        steps.push({
          line: 7,
          explanation: `Stack top '${top}' > '${c}' and '${top}' appears again later (lastIdx[${top}]=${lastIdx[top]} > ${i}). Pop '${top}' to get smaller result.`,
          variables: { i, char: c, popped: top, lastIdxTop: lastIdx[top] },
          visualization: makeViz(i, 'pop'),
        });
      }

      stack.push(c);
      inStack.add(c);
      steps.push({
        line: 8,
        explanation: `Push '${c}' onto stack. Stack: [${stack.join('')}].`,
        variables: { i, char: c, stack: [...stack] },
        visualization: makeViz(i, 'push'),
      });
    }

    const result = stack.join('');
    steps.push({
      line: 9,
      explanation: `Done. Lexicographically smallest subsequence with all distinct chars: "${result}".`,
      variables: { result },
      visualization: makeViz(-1, 'match'),
    });

    return steps;
  },
};

export default smallestSubsequenceOfDistinctChars;

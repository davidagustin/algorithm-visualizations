import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const usingRobotToPrintSmallest: AlgorithmDefinition = {
  id: 'using-robot-to-print-smallest',
  title: 'Using a Robot to Print the Lexicographically Smallest String',
  leetcodeNumber: 2434,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Given a string s and a robot that can push characters to a stack or pop from the stack to paper, return the lexicographically smallest string achievable. Greedily pop from the stack to paper whenever the top of the stack is less than or equal to the minimum character remaining in s. Otherwise push the next character from s.',
  tags: ['stack', 'greedy', 'string', 'hash map'],

  code: {
    pseudocode: `function robotWithString(s):
  freq = count frequency of each char in s
  stack = []
  result = ""
  minChar = smallest char with freq > 0
  for c in s:
    stack.push(c)
    freq[c] -= 1
    update minChar
    while stack and stack.top() <= minChar:
      result += stack.pop()
  while stack:
    result += stack.pop()
  return result`,

    python: `def robotWithString(s: str) -> str:
    from collections import Counter
    freq = Counter(s)
    stack = []
    result = []
    def min_remaining():
        for c in 'abcdefghijklmnopqrstuvwxyz':
            if freq[c] > 0:
                return c
        return 'z' + 'z'
    for c in s:
        stack.append(c)
        freq[c] -= 1
        m = min_remaining()
        while stack and stack[-1] <= m:
            result.append(stack.pop())
    while stack:
        result.append(stack.pop())
    return ''.join(result)`,

    javascript: `function robotWithString(s) {
  const freq = new Array(26).fill(0);
  for (const c of s) freq[c.charCodeAt(0) - 97]++;
  const stack = [];
  let result = '';
  const minRemaining = () => {
    for (let i = 0; i < 26; i++) if (freq[i] > 0) return String.fromCharCode(97 + i);
    return '{';
  };
  for (const c of s) {
    stack.push(c);
    freq[c.charCodeAt(0) - 97]--;
    let m = minRemaining();
    while (stack.length && stack[stack.length - 1] <= m) result += stack.pop();
  }
  while (stack.length) result += stack.pop();
  return result;
}`,

    java: `public String robotWithString(String s) {
    int[] freq = new int[26];
    for (char c : s.toCharArray()) freq[c - 'a']++;
    Deque<Character> stack = new ArrayDeque<>();
    StringBuilder result = new StringBuilder();
    for (char c : s.toCharArray()) {
        stack.push(c);
        freq[c - 'a']--;
        char m = 'z' + 1;
        for (int i = 0; i < 26; i++) { if (freq[i] > 0) { m = (char)('a' + i); break; } }
        while (!stack.isEmpty() && stack.peek() <= m) result.append(stack.pop());
    }
    while (!stack.isEmpty()) result.append(stack.pop());
    return result.toString();
}`,
  },

  defaultInput: {
    s: 'zza',
  },

  inputFields: [
    {
      name: 's',
      label: 'Input String',
      type: 'string',
      defaultValue: 'zza',
      placeholder: 'zza',
      helperText: 'Lowercase English letters string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const chars = s.split('');
    const stack: string[] = [];
    let result = '';

    // Frequency array
    const freq: number[] = new Array(26).fill(0);
    for (const c of s) freq[c.charCodeAt(0) - 97]++;

    const minRemaining = (): string => {
      for (let i = 0; i < 26; i++) {
        if (freq[i] > 0) return String.fromCharCode(97 + i);
      }
      return '{'; // greater than 'z'
    };

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: [...stack],
      inputChars: chars,
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Build lexicographically smallest string from "${s}". Greedily pop from stack when top <= min remaining character.`,
      variables: { s, result: '', stack: [] },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];
      stack.push(c);
      freq[c.charCodeAt(0) - 97]--;

      steps.push({
        line: 5,
        explanation: `Push '${c}' onto stack. Remaining frequency of '${c}' = ${freq[c.charCodeAt(0) - 97]}.`,
        variables: { i, char: c, stack: [...stack] },
        visualization: makeViz(i, 'push'),
      });

      let m = minRemaining();

      while (stack.length > 0 && stack[stack.length - 1] <= m) {
        const popped = stack.pop()!;
        result += popped;
        m = minRemaining();
        steps.push({
          line: 9,
          explanation: `Stack top '${popped}' <= min remaining '${m}'. Pop and append to result. Result: "${result}".`,
          variables: { popped, minRemaining: m, result },
          visualization: makeViz(i, 'match'),
        });
      }

      if (stack.length > 0) {
        steps.push({
          line: 10,
          explanation: `Stack top '${stack[stack.length-1]}' > min remaining '${m}'. Keep on stack and continue pushing.`,
          variables: { stackTop: stack[stack.length-1], minRemaining: m },
          visualization: makeViz(i, 'idle'),
        });
      }
    }

    while (stack.length > 0) {
      const popped = stack.pop()!;
      result += popped;
      steps.push({
        line: 11,
        explanation: `Input exhausted. Pop remaining '${popped}' from stack. Result: "${result}".`,
        variables: { popped, result },
        visualization: makeViz(chars.length - 1, 'pop'),
      });
    }

    steps.push({
      line: 12,
      explanation: `Done. Lexicographically smallest string: "${result}".`,
      variables: { result },
      visualization: makeViz(-1, 'found'),
    });

    return steps;
  },
};

export default usingRobotToPrintSmallest;

import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const constructSmallestNumberFromDi: AlgorithmDefinition = {
  id: 'construct-smallest-number-from-di',
  title: 'Construct Smallest Number from DI String',
  leetcodeNumber: 2375,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given a pattern string of "I" (increase) and "D" (decrease), construct the lexicographically smallest permutation of digits 1 to n+1 that matches the pattern. When pattern[i] is "I", the digit at position i must be less than position i+1; when "D", it must be greater. Use a stack-based greedy or backtracking approach.',
  tags: ['backtracking', 'stack', 'greedy', 'string'],

  code: {
    pseudocode: `function smallestNumber(pattern):
  n = len(pattern)
  result = []
  stack = []
  for i in 0..n:
    stack.push(i+1)
    if i == n or pattern[i] == 'I':
      while stack: result.append(stack.pop())
  return join(result)`,
    python: `def smallestNumber(pattern: str) -> str:
    n = len(pattern)
    res, stack = [], []
    for i in range(n + 1):
        stack.append(i + 1)
        if i == n or pattern[i] == 'I':
            while stack:
                res.append(stack.pop())
    return ''.join(map(str, res))`,
    javascript: `function smallestNumber(pattern) {
  const n = pattern.length;
  const res = [], stack = [];
  for (let i = 0; i <= n; i++) {
    stack.push(i + 1);
    if (i === n || pattern[i] === 'I') {
      while (stack.length) res.push(stack.pop());
    }
  }
  return res.join('');
}`,
    java: `public String smallestNumber(String pattern) {
    int n = pattern.length();
    StringBuilder res = new StringBuilder();
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = 0; i <= n; i++) {
        stack.push(i + 1);
        if (i == n || pattern.charAt(i) == 'I') {
            while (!stack.isEmpty()) res.append(stack.pop());
        }
    }
    return res.toString();
}`,
  },

  defaultInput: { pattern: 'IIIDIDDD' },

  inputFields: [
    {
      name: 'pattern',
      label: 'Pattern String',
      type: 'string',
      defaultValue: 'IIIDIDDD',
      placeholder: 'IIIDIDDD',
      helperText: 'String of I (increase) and D (decrease) characters',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const pattern = input.pattern as string;
    const steps: AlgorithmStep[] = [];
    const n = pattern.length;

    const result: number[] = [];
    const stack: number[] = [];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...result, ...stack],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Construct smallest number from pattern "${pattern}" (length ${n}). Result will be ${n + 1} digits. Push digits to stack, flush on "I" or end.`,
      variables: { pattern, resultLength: n + 1 },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i <= n; i++) {
      stack.push(i + 1);

      steps.push({
        line: 5,
        explanation: `Push digit ${i + 1} onto stack. Stack: [${stack.join(', ')}]. Pattern[${i}] = "${i < n ? pattern[i] : 'END'}"`,
        variables: { i, pushed: i + 1, stack: [...stack], result: [...result] },
        visualization: makeViz(
          Object.fromEntries(stack.map((_, si) => [result.length + si, 'active'])),
          Object.fromEntries([...result, ...stack].map((v, idx) => [idx, idx < result.length ? `R:${v}` : `S:${v}`]))
        ),
      });

      if (i === n || pattern[i] === 'I') {
        const flushed: number[] = [];
        while (stack.length > 0) {
          const val = stack.pop()!;
          result.push(val);
          flushed.push(val);
        }

        steps.push({
          line: 7,
          explanation: `"I" or end: flush stack to result. Popped [${flushed.join(', ')}]. Result so far: [${result.join(', ')}].`,
          variables: { flushed, result: [...result], reason: i < n ? `pattern[${i}]="I"` : 'end of pattern' },
          visualization: makeViz(
            Object.fromEntries(result.map((_, ri) => [ri, ri >= result.length - flushed.length ? 'found' : 'visited'])),
            Object.fromEntries(result.map((v, ri) => [ri, String(v)]))
          ),
        });
      }
    }

    steps.push({
      line: 9,
      explanation: `Smallest number matching "${pattern}" is "${result.join('')}". Verify: each adjacent pair satisfies I/D constraint.`,
      variables: { pattern, result: result.join('') },
      visualization: makeViz(
        Object.fromEntries(result.map((_, i) => [i, 'found'])),
        Object.fromEntries(result.map((v, i) => [i, String(v)]))
      ),
    });

    return steps;
  },
};

export default constructSmallestNumberFromDi;

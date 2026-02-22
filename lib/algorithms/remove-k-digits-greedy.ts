import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const removeKDigitsGreedy: AlgorithmDefinition = {
  id: 'remove-k-digits-greedy',
  title: 'Remove K Digits (Greedy Monotonic Stack)',
  leetcodeNumber: 402,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Given a non-negative integer as a string and integer k, remove k digits to produce the smallest possible number. Greedy: use a monotone increasing stack. When a digit is greater than the next digit, remove it (use k). Strip leading zeros from result.',
  tags: ['greedy', 'stack', 'monotonic stack', 'string'],

  code: {
    pseudocode: `function removeKdigits(num, k):
  stack = []
  for digit in num:
    while k > 0 and stack not empty and stack.top > digit:
      stack.pop(); k--
    stack.push(digit)
  // Remove remaining k digits from end
  while k > 0: stack.pop(); k--
  // Strip leading zeros
  result = stack joined, strip leading '0'
  return result or "0"`,

    python: `def removeKdigits(num: str, k: int) -> str:
    stack = []
    for d in num:
        while k and stack and stack[-1] > d:
            stack.pop()
            k -= 1
        stack.append(d)
    stack = stack[:-k] if k else stack
    return ''.join(stack).lstrip('0') or '0'`,

    javascript: `function removeKdigits(num, k) {
  const stack = [];
  for (const d of num) {
    while (k > 0 && stack.length > 0 && stack[stack.length - 1] > d) {
      stack.pop();
      k--;
    }
    stack.push(d);
  }
  while (k > 0) { stack.pop(); k--; }
  const result = stack.join('').replace(/^0+/, '');
  return result || '0';
}`,

    java: `public String removeKdigits(String num, int k) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char d : num.toCharArray()) {
        while (k > 0 && !stack.isEmpty() && stack.peek() > d) {
            stack.pop(); k--;
        }
        stack.push(d);
    }
    while (k-- > 0) stack.pop();
    StringBuilder sb = new StringBuilder();
    while (!stack.isEmpty()) sb.append(stack.pollLast());
    String result = sb.toString().replaceAll("^0+", "");
    return result.isEmpty() ? "0" : result;
}`,
  },

  defaultInput: {
    num: '1432219',
    k: 3,
  },

  inputFields: [
    {
      name: 'num',
      label: 'Number String',
      type: 'string',
      defaultValue: '1432219',
      placeholder: '1432219',
      helperText: 'Non-negative integer as string',
    },
    {
      name: 'k',
      label: 'k (digits to remove)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of digits to remove',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const num = input.num as string;
    let k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const stack: string[] = [];

    steps.push({
      line: 1,
      explanation: `Remove ${k} digits from "${num}" to get the smallest number. Use a monotone increasing stack.`,
      variables: { num, k, stack: [] },
      visualization: {
        type: 'array',
        array: num.split('').map(Number),
        highlights: {},
        labels: Object.fromEntries(num.split('').map((c, i) => [i, c])) as Record<number, string>,
      },
    });

    for (let i = 0; i < num.length; i++) {
      const d = num[i];

      while (k > 0 && stack.length > 0 && stack[stack.length - 1] > d) {
        const removed = stack.pop()!;
        k--;
        steps.push({
          line: 3,
          explanation: `Digit "${removed}" in stack > current digit "${d}". Remove "${removed}" to make number smaller. k remaining=${k}.`,
          variables: { current: d, removed, k, stack: [...stack] },
          visualization: {
            type: 'array',
            array: num.split('').map(Number),
            highlights: { [i]: 'active' } as Record<number, string>,
            labels: { [i]: d } as Record<number, string>,
          },
        });
      }

      stack.push(d);
      steps.push({
        line: 5,
        explanation: `Push "${d}" onto stack. Stack: [${stack.join(', ')}]. k=${k}.`,
        variables: { i, d, stack: [...stack], k },
        visualization: {
          type: 'array',
          array: num.split('').map(Number),
          highlights: { [i]: 'found' } as Record<number, string>,
          labels: { [i]: d } as Record<number, string>,
        },
      });
    }

    if (k > 0) {
      steps.push({
        line: 7,
        explanation: `Still have ${k} removals left. Remove from end of stack (largest remaining digits).`,
        variables: { k, stackBefore: [...stack] },
        visualization: {
          type: 'array',
          array: stack.map(Number),
          highlights: Object.fromEntries(Array.from({ length: k }, (_, j) => [stack.length - 1 - j, 'mismatch'])) as Record<number, string>,
          labels: {},
        },
      });
      stack.splice(stack.length - k, k);
    }

    const result = stack.join('').replace(/^0+/, '') || '0';

    steps.push({
      line: 8,
      explanation: `Final stack: [${stack.join(', ')}]. After stripping leading zeros: "${result}".`,
      variables: { result, stack: [...stack] },
      visualization: {
        type: 'array',
        array: stack.map(Number),
        highlights: Object.fromEntries(stack.map((_, i) => [i, 'found'])) as Record<number, string>,
        labels: Object.fromEntries(stack.map((c, i) => [i, c])) as Record<number, string>,
      },
    });

    return steps;
  },
};

export default removeKDigitsGreedy;

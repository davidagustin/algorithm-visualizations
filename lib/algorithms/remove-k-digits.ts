import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const removeKDigits: AlgorithmDefinition = {
  id: 'remove-k-digits',
  title: 'Remove K Digits',
  leetcodeNumber: 402,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Remove k digits from a number string to make the smallest possible number. Use a monotonic increasing stack: for each digit, pop from the stack while the top is larger than the current digit and k > 0. The stack gives the final digits. Handle leading zeros and remaining k removals.',
  tags: ['Stack', 'String', 'Greedy', 'Monotonic Stack'],
  code: {
    pseudocode: `function removeKdigits(num, k):
  stack = []
  for digit in num:
    while stack not empty and k > 0 and stack.top > digit:
      stack.pop()
      k -= 1
    stack.push(digit)
  // Remove remaining k from the end
  stack = stack[0 : len(stack) - k]
  // Remove leading zeros
  result = lstrip('0', stack)
  return result if result else '0'`,
    python: `def removeKdigits(num: str, k: int) -> str:
    stack = []
    for digit in num:
        while stack and k > 0 and stack[-1] > digit:
            stack.pop()
            k -= 1
        stack.append(digit)
    # Remove remaining k from the tail
    stack = stack[:-k] if k else stack
    # Strip leading zeros
    result = ''.join(stack).lstrip('0')
    return result or '0'`,
    javascript: `function removeKdigits(num, k) {
  const stack = [];
  for (const digit of num) {
    while (stack.length && k > 0 && stack[stack.length - 1] > digit) {
      stack.pop();
      k--;
    }
    stack.push(digit);
  }
  if (k > 0) stack.splice(stack.length - k, k);
  const result = stack.join('').replace(/^0+/, '');
  return result || '0';
}`,
    java: `public String removeKdigits(String num, int k) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char c : num.toCharArray()) {
        while (!stack.isEmpty() && k > 0 && stack.peek() > c) {
            stack.pop();
            k--;
        }
        stack.push(c);
    }
    while (k-- > 0) stack.pop();
    StringBuilder sb = new StringBuilder();
    while (!stack.isEmpty()) sb.append(stack.pollLast());
    // Remove leading zeros
    int start = 0;
    while (start < sb.length() - 1 && sb.charAt(start) == '0') start++;
    return sb.substring(start);
}`,
  },
  defaultInput: { num: '1432219', k: 3 },
  inputFields: [
    {
      name: 'num',
      label: 'Number String',
      type: 'string',
      defaultValue: '1432219',
      placeholder: 'e.g. 1432219',
      helperText: 'Non-negative integer as a string',
    },
    {
      name: 'k',
      label: 'k (removals)',
      type: 'number',
      defaultValue: 3,
      placeholder: 'e.g. 3',
      helperText: 'Number of digits to remove',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const num = input.num as string;
    let k = input.k as number;
    const digits = num.split('');
    const steps: AlgorithmStep[] = [];
    const stack: string[] = [];

    const makeViz = (currentIndex: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: [...stack],
      inputChars: digits,
      currentIndex,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Remove k=${k} digits from "${num}" to get the smallest number. Use a monotonic increasing stack.`,
      variables: { num, k, stack: [] },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < digits.length; i++) {
      const digit = digits[i];

      steps.push({
        line: 3,
        explanation: `Digit '${digit}' at index ${i}. k=${k} removals left. Check if stack top is larger.`,
        variables: { i, digit, k, stack: [...stack] },
        visualization: makeViz(i, 'idle'),
      });

      while (stack.length > 0 && k > 0 && stack[stack.length - 1] > digit) {
        const popped = stack.pop()!;
        k--;
        steps.push({
          line: 4,
          explanation: `Stack top '${popped}' > '${digit}'. Pop '${popped}'. k decremented to ${k}. Stack: [${stack.join(', ')}].`,
          variables: { popped, digit, k, stack: [...stack] },
          visualization: makeViz(i, 'pop'),
        });
      }

      stack.push(digit);
      steps.push({
        line: 6,
        explanation: `Push '${digit}' onto stack. Stack: [${stack.join(', ')}].`,
        variables: { digit, k, stack: [...stack] },
        visualization: makeViz(i, 'push'),
      });
    }

    if (k > 0) {
      const before = [...stack];
      stack.splice(stack.length - k, k);
      steps.push({
        line: 8,
        explanation: `k=${k} removals remain. Remove last ${k} digit(s) from stack end (they are the largest remaining). Was: [${before.join(', ')}] → Now: [${stack.join(', ')}].`,
        variables: { removed: k, stack: [...stack] },
        visualization: makeViz(digits.length, 'pop'),
      });
      k = 0;
    }

    const joined = stack.join('').replace(/^0+/, '');
    const result = joined || '0';
    steps.push({
      line: 10,
      explanation: `Strip leading zeros from "${stack.join('')}". Result: "${result}".`,
      variables: { result, stack: [...stack] },
      visualization: makeViz(digits.length, 'match'),
    });

    return steps;
  },
};

export default removeKDigits;

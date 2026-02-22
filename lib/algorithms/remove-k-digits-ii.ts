import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const removeKDigitsII: AlgorithmDefinition = {
  id: 'remove-k-digits-ii',
  title: 'Remove K Digits II',
  leetcodeNumber: 402,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Given a string num and integer k, remove k digits to make the smallest possible number. Uses a monotonic non-decreasing stack: for each digit, while the stack top is greater than current and we still have removals left, pop the stack.',
  tags: ['Stack', 'Monotonic Stack', 'Greedy', 'String'],
  code: {
    pseudocode: `function removeKdigits(num, k):
  stack = []
  for digit in num:
    while stack not empty and k > 0 and stack.top > digit:
      stack.pop()
      k -= 1
    stack.push(digit)
  // Remove remaining k digits from the end
  stack = stack[0 : len(stack) - k]
  // Strip leading zeros
  result = "".join(stack).lstrip("0") or "0"
  return result`,
    python: `def removeKdigits(num: str, k: int) -> str:
    stack = []
    for digit in num:
        while stack and k > 0 and stack[-1] > digit:
            stack.pop()
            k -= 1
        stack.append(digit)
    stack = stack[:-k] if k else stack
    return ''.join(stack).lstrip('0') or '0'`,
    javascript: `function removeKdigits(num, k) {
  const stack = [];
  for (const d of num) {
    while (stack.length && k > 0 && stack[stack.length-1] > d) {
      stack.pop();
      k--;
    }
    stack.push(d);
  }
  if (k > 0) stack.splice(stack.length - k, k);
  const result = stack.join('').replace(/^0+/, '') || '0';
  return result;
}`,
    java: `public String removeKdigits(String num, int k) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char d : num.toCharArray()) {
        while (!stack.isEmpty() && k > 0 && stack.peek() > d) {
            stack.pop(); k--;
        }
        stack.push(d);
    }
    while (k-- > 0) stack.pop();
    StringBuilder sb = new StringBuilder();
    while (!stack.isEmpty()) sb.append(stack.pollLast());
    int i = 0; while (i < sb.length()-1 && sb.charAt(i) == '0') i++;
    return sb.substring(i);
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
      helperText: 'Non-negative integer as string',
    },
    {
      name: 'k',
      label: 'Removals (k)',
      type: 'number',
      defaultValue: 3,
      placeholder: 'e.g. 3',
      helperText: 'Number of digits to remove',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const num = String(input.num ?? '1432219');
    let k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const stack: string[] = [];
    let remaining = k;

    const makeViz = (i: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: [...stack],
      inputChars: num.split(''),
      currentIndex: i,
      action,
    });

    steps.push({
      line: 1,
      explanation: `num="${num}", k=${k}. Remove k digits for smallest result using monotonic stack.`,
      variables: { num, k },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < num.length; i++) {
      const digit = num[i];

      steps.push({
        line: 3,
        explanation: `Digit '${digit}' at i=${i}. k remaining=${remaining}.`,
        variables: { i, digit, remaining },
        visualization: makeViz(i, 'idle'),
      });

      while (stack.length > 0 && remaining > 0 && stack[stack.length - 1] > digit) {
        const popped = stack.pop()!;
        remaining--;
        steps.push({
          line: 4,
          explanation: `Pop '${popped}' > '${digit}'. Removal used. remaining=${remaining}.`,
          variables: { popped, digit, remaining },
          visualization: makeViz(i, 'pop'),
        });
      }

      stack.push(digit);
      steps.push({
        line: 6,
        explanation: `Push '${digit}'. Stack=[${stack.join('')}].`,
        variables: { stack: [...stack] },
        visualization: makeViz(i, 'push'),
      });
    }

    if (remaining > 0) {
      stack.splice(stack.length - remaining, remaining);
      steps.push({
        line: 8,
        explanation: `Still have ${remaining} removals left. Remove from end. Stack=[${stack.join('')}].`,
        variables: { stack: [...stack] },
        visualization: makeViz(num.length - 1, 'pop'),
      });
    }

    const result = stack.join('').replace(/^0+/, '') || '0';
    steps.push({
      line: 9,
      explanation: `Strip leading zeros. Result = "${result}".`,
      variables: { result },
      visualization: makeViz(num.length - 1, 'match'),
    });

    return steps;
  },
};

export default removeKDigitsII;

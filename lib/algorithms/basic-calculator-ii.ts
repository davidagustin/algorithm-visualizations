import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const basicCalculatorII: AlgorithmDefinition = {
  id: 'basic-calculator-ii',
  title: 'Basic Calculator II',
  leetcodeNumber: 227,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Evaluate a string expression with +, -, *, / operators and non-negative integers (no parentheses). Use a stack: push values directly for + and -, apply * and / immediately with the stack top. Sum the stack for the result.',
  tags: ['Stack', 'String', 'Math'],
  code: {
    pseudocode: `function calculate(s):
  stack = []
  num = 0
  op = '+'
  for each char in s + '+':
    if char is digit: num = num*10 + digit
    elif char is operator or end:
      if op == '+': stack.push(num)
      elif op == '-': stack.push(-num)
      elif op == '*': stack.push(stack.pop() * num)
      elif op == '/': stack.push(int(stack.pop() / num))
      op = char
      num = 0
  return sum(stack)`,
    python: `def calculate(s: str) -> int:
    stack = []
    num = 0
    op = '+'
    for char in s + '+':
        if char.isdigit():
            num = num * 10 + int(char)
        elif char in '+-*/':
            if op == '+': stack.append(num)
            elif op == '-': stack.append(-num)
            elif op == '*': stack.append(stack.pop() * num)
            elif op == '/': stack.append(int(stack.pop() / num))
            op = char
            num = 0
    return sum(stack)`,
    javascript: `function calculate(s) {
  const stack = [];
  let num = 0;
  let op = '+';
  for (let i = 0; i <= s.length; i++) {
    const char = i < s.length ? s[i] : '+';
    if (!isNaN(char) && char !== ' ') {
      num = num * 10 + Number(char);
    } else if (char === '+' || char === '-' || char === '*' || char === '/') {
      if (op === '+') stack.push(num);
      else if (op === '-') stack.push(-num);
      else if (op === '*') stack.push(stack.pop() * num);
      else if (op === '/') stack.push(Math.trunc(stack.pop() / num));
      op = char;
      num = 0;
    }
  }
  return stack.reduce((a, b) => a + b, 0);
}`,
    java: `public int calculate(String s) {
    Deque<Integer> stack = new ArrayDeque<>();
    int num = 0;
    char op = '+';
    for (int i = 0; i <= s.length(); i++) {
        char c = i < s.length() ? s.charAt(i) : '+';
        if (Character.isDigit(c)) {
            num = num * 10 + (c - '0');
        } else if (c == '+' || c == '-' || c == '*' || c == '/') {
            if (op == '+') stack.push(num);
            else if (op == '-') stack.push(-num);
            else if (op == '*') stack.push(stack.pop() * num);
            else if (op == '/') stack.push(stack.pop() / num);
            op = c;
            num = 0;
        }
    }
    return stack.stream().mapToInt(x -> x).sum();
}`,
  },
  defaultInput: { s: '3+2*2' },
  inputFields: [
    {
      name: 's',
      label: 'Expression',
      type: 'string',
      defaultValue: '3+2*2',
      placeholder: 'e.g. 3+2*2',
      helperText: 'Expression with +, -, *, / (no parentheses)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const stack: number[] = [];
    let num = 0;
    let op = '+';
    const chars = (s + '+').split('');

    function makeViz(activeIdx: number, lastAction: string): ArrayVisualization {
      const highlights: Record<number, string> = {};
      for (let i = 0; i < stack.length; i++) highlights[i] = 'active';
      return {
        type: 'array',
        array: [...stack],
        highlights,
        labels: {},
        auxData: {
          label: 'Calculator State',
          entries: [
            { key: 'Expression', value: s },
            { key: 'Char', value: chars[activeIdx] || 'end' },
            { key: 'Current num', value: String(num) },
            { key: 'Pending op', value: op },
            { key: 'Stack', value: stack.length > 0 ? `[${stack.join(', ')}]` : '[]' },
            { key: 'Action', value: lastAction },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Initialize: stack=[], num=0, op='+'. Process "${s}+" character by character.`,
      variables: { s, num, op, stack: [] },
      visualization: makeViz(0, 'init'),
    });

    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      if (char === ' ') continue;

      if (!isNaN(Number(char))) {
        num = num * 10 + Number(char);
        steps.push({
          line: 5,
          explanation: `Digit '${char}': accumulate num = ${num}.`,
          variables: { i, char, num, op },
          visualization: makeViz(i, `digit: num=${num}`),
        });
      } else if (['+', '-', '*', '/'].includes(char)) {
        let pushed: number;
        let action: string;

        if (op === '+') {
          pushed = num;
          stack.push(num);
          action = `push(+${num})`;
        } else if (op === '-') {
          pushed = -num;
          stack.push(-num);
          action = `push(-${num})`;
        } else if (op === '*') {
          const top = stack.pop()!;
          pushed = top * num;
          stack.push(pushed);
          action = `pop ${top}, push ${top}*${num}=${pushed}`;
        } else {
          const top = stack.pop()!;
          pushed = Math.trunc(top / num);
          stack.push(pushed);
          action = `pop ${top}, push ${top}/${num}=${pushed}`;
        }

        steps.push({
          line: 8,
          explanation: `Operator '${char}': apply pending op '${op}' with num=${num}. ${action}. Set op='${char}', reset num=0.`,
          variables: { i, char, op, num, pushed, stack: [...stack] },
          visualization: makeViz(i, action),
        });

        op = char;
        num = 0;
      }
    }

    const result = stack.reduce((a, b) => a + b, 0);
    steps.push({
      line: 14,
      explanation: `Sum all stack values: [${stack.join(', ')}] = ${result}.`,
      variables: { result, stack: [...stack] },
      visualization: (() => {
        const h: Record<number, string> = {};
        for (let i = 0; i < stack.length; i++) h[i] = 'found';
        return {
          type: 'array' as const,
          array: [...stack],
          highlights: h,
          labels: {},
          auxData: {
            label: 'Result',
            entries: [
              { key: 'Stack sum', value: `[${stack.join(' + ')}]` },
              { key: 'Result', value: String(result) },
            ],
          },
        };
      })(),
    });

    return steps;
  },
};

export default basicCalculatorII;

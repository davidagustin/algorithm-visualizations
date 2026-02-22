import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const basicCalculatorIii: AlgorithmDefinition = {
  id: 'basic-calculator-iii',
  title: 'Basic Calculator III',
  leetcodeNumber: 772,
  difficulty: 'Hard',
  category: 'Stack',
  description:
    'Implement a basic calculator to evaluate a simple expression string containing digits, spaces, plus (+), minus (-), multiply (*), divide (/), and parentheses. Use a stack to handle operator precedence and nested parentheses. Multiplication and division are applied immediately while addition and subtraction are deferred to the stack.',
  tags: ['stack', 'math', 'string', 'recursion'],

  code: {
    pseudocode: `function calculate(s):
  stack = []
  num = 0
  op = '+'
  i = 0
  while i < len(s):
    c = s[i]
    if c is digit: num = num*10 + c
    if c is '(':
      num = calculate(inner expression)
      i = index after matching ')'
    if c is operator or end:
      if op == '+': stack.push(num)
      if op == '-': stack.push(-num)
      if op == '*': stack.push(stack.pop() * num)
      if op == '/': stack.push(int(stack.pop() / num))
      op = c; num = 0
    i++
  return sum(stack)`,

    python: `def calculate(s: str) -> int:
    def helper(i):
        stack = []
        num = 0
        op = '+'
        while i < len(s):
            c = s[i]
            if c.isdigit():
                num = num * 10 + int(c)
            if c == '(':
                num, i = helper(i + 1)
            if c in '+-*/' or i == len(s) - 1:
                if op == '+': stack.append(num)
                elif op == '-': stack.append(-num)
                elif op == '*': stack.append(stack.pop() * num)
                elif op == '/': stack.append(int(stack.pop() / num))
                op = c
                num = 0
            if c == ')':
                return sum(stack), i
            i += 1
        return sum(stack), i
    return helper(0)[0]`,

    javascript: `function calculate(s) {
  let i = 0;
  function helper() {
    const stack = [];
    let num = 0, op = '+';
    while (i < s.length) {
      const c = s[i++];
      if (c >= '0' && c <= '9') num = num * 10 + +c;
      if (c === '(') num = helper();
      if ('+-*/'.includes(c) || i === s.length) {
        if (op === '+') stack.push(num);
        else if (op === '-') stack.push(-num);
        else if (op === '*') stack.push(stack.pop() * num);
        else if (op === '/') stack.push(Math.trunc(stack.pop() / num));
        op = c; num = 0;
      }
      if (c === ')') break;
    }
    return stack.reduce((a, b) => a + b, 0);
  }
  return helper();
}`,

    java: `public int calculate(String s) {
    int[] idx = {0};
    return helper(s, idx);
}
private int helper(String s, int[] idx) {
    Deque<Integer> stack = new ArrayDeque<>();
    int num = 0; char op = '+';
    while (idx[0] < s.length()) {
        char c = s.charAt(idx[0]++);
        if (Character.isDigit(c)) num = num * 10 + (c - '0');
        if (c == '(') num = helper(s, idx);
        if ("+-*/".indexOf(c) >= 0 || idx[0] == s.length()) {
            if (op == '+') stack.push(num);
            else if (op == '-') stack.push(-num);
            else if (op == '*') stack.push(stack.pop() * num);
            else if (op == '/') stack.push(stack.pop() / num);
            op = c; num = 0;
        }
        if (c == ')') break;
    }
    return stack.stream().mapToInt(Integer::intValue).sum();
}`,
  },

  defaultInput: {
    s: '2*(3+4)-1',
  },

  inputFields: [
    {
      name: 's',
      label: 'Expression',
      type: 'string',
      defaultValue: '2*(3+4)-1',
      placeholder: '2*(3+4)-1',
      helperText: 'Expression with +, -, *, / and parentheses',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const stack: number[] = [];

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map(String),
      inputChars: s.split(''),
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Evaluate expression "${s}" with +, -, *, / and parentheses. Use stack to handle precedence.`,
      variables: { s, stack: [], op: '+', num: 0 },
      visualization: makeViz(-1, 'idle'),
    });

    let num = 0;
    let op = '+';

    // Flatten the expression for visualization (handle simple cases iteratively)
    // We process character by character, simulating the recursive approach iteratively
    const chars = s.replace(/\s/g, '').split('');

    // For visualization, we use a simplified iterative approach
    const opStack: string[] = []; // operator stack
    const valStack: number[] = []; // value stack

    const applyOp = (operator: string, b: number, a: number): number => {
      if (operator === '+') return a + b;
      if (operator === '-') return a - b;
      if (operator === '*') return a * b;
      if (operator === '/') return Math.trunc(a / b);
      return 0;
    };

    const precedence = (o: string): number => {
      if (o === '+' || o === '-') return 1;
      if (o === '*' || o === '/') return 2;
      return 0;
    };

    steps.push({
      line: 2,
      explanation: 'Initialize stack, num=0, op="+" to start processing.',
      variables: { num, op, stack: [] },
      visualization: makeViz(-1, 'idle'),
    });

    // Process using shunting-yard style for visualization
    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];

      if (c >= '0' && c <= '9') {
        num = num * 10 + parseInt(c);
        steps.push({
          line: 7,
          explanation: `Digit '${c}' found. Accumulate num = ${num}.`,
          variables: { char: c, num, op },
          visualization: makeViz(i, 'idle'),
        });
      } else if (c === '(') {
        opStack.push(c);
        stack.push(num);
        num = 0;
        steps.push({
          line: 8,
          explanation: `'(' encountered. Push onto operator stack. Reset num.`,
          variables: { char: c, num, opStack: [...opStack] },
          visualization: makeViz(i, 'push'),
        });
      } else if (c === ')') {
        // Push current num first
        if (num !== 0 || i > 0) {
          valStack.push(num);
          stack.push(num);
        }
        num = 0;
        // Apply ops until matching '('
        while (opStack.length > 0 && opStack[opStack.length - 1] !== '(') {
          const operator = opStack.pop()!;
          const b = valStack.pop()!;
          const a = valStack.pop()!;
          const res = applyOp(operator, b, a);
          valStack.push(res);
          stack.pop();
          if (stack.length > 0) stack.pop();
          stack.push(res);
        }
        opStack.pop(); // remove '('
        steps.push({
          line: 9,
          explanation: `')' found. Apply operators inside parentheses. Inner result = ${valStack[valStack.length - 1]}.`,
          variables: { char: c, innerResult: valStack[valStack.length - 1] },
          visualization: makeViz(i, 'pop'),
        });
      } else if ('+-*/'.includes(c)) {
        // Push current num to valStack
        valStack.push(num);
        stack.push(num);
        num = 0;

        // Apply higher or equal precedence ops
        while (
          opStack.length > 0 &&
          opStack[opStack.length - 1] !== '(' &&
          precedence(opStack[opStack.length - 1]) >= precedence(c)
        ) {
          const operator = opStack.pop()!;
          const b = valStack.pop()!;
          const a = valStack.pop()!;
          const res = applyOp(operator, b, a);
          valStack.push(res);
          if (stack.length > 0) stack.pop();
          if (stack.length > 0) stack.pop();
          stack.push(res);
        }
        opStack.push(c);
        op = c;
        steps.push({
          line: 11,
          explanation: `Operator '${c}' found. Applied pending higher-precedence ops. Stack state updated.`,
          variables: { char: c, op, valStack: [...valStack], opStack: [...opStack] },
          visualization: makeViz(i, 'idle'),
        });
      }
    }

    // Push last num
    valStack.push(num);
    stack.push(num);

    // Apply remaining ops
    while (opStack.length > 0) {
      const operator = opStack.pop()!;
      const b = valStack.pop()!;
      const a = valStack.pop()!;
      const res = applyOp(operator, b, a);
      valStack.push(res);
      if (stack.length > 0) stack.pop();
      if (stack.length > 0) stack.pop();
      stack.push(res);
    }

    const finalResult = valStack[0] ?? 0;
    steps.push({
      line: 16,
      explanation: `All characters processed. Final result = ${finalResult}.`,
      variables: { result: finalResult },
      visualization: makeViz(chars.length - 1, 'match'),
    });

    return steps;
  },
};

export default basicCalculatorIii;

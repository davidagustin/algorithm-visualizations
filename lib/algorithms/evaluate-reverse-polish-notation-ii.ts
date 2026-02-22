import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const evaluateReversePolishNotationIi: AlgorithmDefinition = {
  id: 'evaluate-reverse-polish-notation-ii',
  title: 'Evaluate Reverse Polish Notation II',
  leetcodeNumber: 150,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Evaluate an expression given in Reverse Polish Notation (postfix). This variant supports additional operators including modulo and power. Operands are pushed onto a stack; when an operator is encountered, pop two operands, apply the operator, and push the result.',
  tags: ['stack', 'math', 'postfix', 'expression evaluation'],

  code: {
    pseudocode: `function evalRPN(tokens):
  stack = []
  for each token in tokens:
    if token is operator:
      b = stack.pop()
      a = stack.pop()
      if token == "+": stack.push(a + b)
      if token == "-": stack.push(a - b)
      if token == "*": stack.push(a * b)
      if token == "/": stack.push(trunc(a / b))
      if token == "%": stack.push(a % b)
      if token == "^": stack.push(a ^ b)
    else:
      stack.push(int(token))
  return stack[0]`,

    python: `def evalRPN(tokens: list[str]) -> int:
    stack = []
    ops = {'+', '-', '*', '/', '%', '^'}
    for token in tokens:
        if token in ops:
            b, a = stack.pop(), stack.pop()
            if token == '+': stack.append(a + b)
            elif token == '-': stack.append(a - b)
            elif token == '*': stack.append(a * b)
            elif token == '/': stack.append(int(a / b))
            elif token == '%': stack.append(a % b)
            elif token == '^': stack.append(a ** b)
        else:
            stack.append(int(token))
    return stack[0]`,

    javascript: `function evalRPN(tokens) {
  const stack = [];
  const ops = new Set(['+', '-', '*', '/', '%', '^']);
  for (const token of tokens) {
    if (ops.has(token)) {
      const b = stack.pop(), a = stack.pop();
      if (token === '+') stack.push(a + b);
      else if (token === '-') stack.push(a - b);
      else if (token === '*') stack.push(a * b);
      else if (token === '/') stack.push(Math.trunc(a / b));
      else if (token === '%') stack.push(a % b);
      else if (token === '^') stack.push(Math.pow(a, b));
    } else {
      stack.push(Number(token));
    }
  }
  return stack[0];
}`,

    java: `public int evalRPN(String[] tokens) {
    Deque<Integer> stack = new ArrayDeque<>();
    Set<String> ops = Set.of("+", "-", "*", "/", "%", "^");
    for (String token : tokens) {
        if (ops.contains(token)) {
            int b = stack.pop(), a = stack.pop();
            switch (token) {
                case "+": stack.push(a + b); break;
                case "-": stack.push(a - b); break;
                case "*": stack.push(a * b); break;
                case "/": stack.push(a / b); break;
                case "%": stack.push(a % b); break;
                case "^": stack.push((int)Math.pow(a, b)); break;
            }
        } else {
            stack.push(Integer.parseInt(token));
        }
    }
    return stack.pop();
}`,
  },

  defaultInput: {
    tokens: '2,3,^,1,4,%,-',
  },

  inputFields: [
    {
      name: 'tokens',
      label: 'RPN Tokens',
      type: 'string',
      defaultValue: '2,3,^,1,4,%,-',
      placeholder: '2,3,^,1,4,%,-',
      helperText: 'Comma-separated RPN tokens. Operators: +, -, *, /, %, ^',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tokensStr = input.tokens as string;
    const tokens = tokensStr.split(',').map(t => t.trim());
    const steps: AlgorithmStep[] = [];
    const stack: number[] = [];
    const ops = new Set(['+', '-', '*', '/', '%', '^']);

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map(v => String(v)),
      inputChars: tokens,
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: 'Initialize empty stack for operands.',
      variables: { stack: [], tokens },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (ops.has(token)) {
        const b = stack.pop()!;
        const a = stack.pop()!;
        let result = 0;
        if (token === '+') result = a + b;
        else if (token === '-') result = a - b;
        else if (token === '*') result = a * b;
        else if (token === '/') result = Math.trunc(a / b);
        else if (token === '%') result = a % b;
        else if (token === '^') result = Math.pow(a, b);

        steps.push({
          line: 4,
          explanation: `Operator "${token}": pop ${b} (b) and ${a} (a), compute ${a} ${token} ${b} = ${result}, push ${result}.`,
          variables: { token, a, b, result, stack: [...stack] },
          visualization: makeViz(i, 'pop'),
        });

        stack.push(result);

        steps.push({
          line: 11,
          explanation: `Pushed result ${result} onto stack.`,
          variables: { stack: [...stack] },
          visualization: makeViz(i, 'push'),
        });
      } else {
        const val = Number(token);
        stack.push(val);
        steps.push({
          line: 13,
          explanation: `Operand "${token}": push ${val} onto stack.`,
          variables: { token, val, stack: [...stack] },
          visualization: makeViz(i, 'push'),
        });
      }
    }

    steps.push({
      line: 14,
      explanation: `Evaluation complete. Result = ${stack[0]}.`,
      variables: { result: stack[0] },
      visualization: makeViz(tokens.length, 'match'),
    });

    return steps;
  },
};

export default evaluateReversePolishNotationIi;

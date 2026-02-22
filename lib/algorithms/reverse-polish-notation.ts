import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const reversePolishNotation: AlgorithmDefinition = {
  id: 'reverse-polish-notation',
  title: 'Evaluate Reverse Polish Notation',
  leetcodeNumber: 150,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Evaluate an expression in Reverse Polish Notation (postfix). Numbers are pushed onto the stack. When an operator is encountered, pop two operands, apply the operator, and push the result. The final stack value is the answer.',
  tags: ['Stack', 'Array', 'Math'],
  code: {
    pseudocode: `function evalRPN(tokens):
  stack = []
  for token in tokens:
    if token is number:
      stack.push(token)
    else:
      b = stack.pop()
      a = stack.pop()
      if token == '+': stack.push(a + b)
      elif token == '-': stack.push(a - b)
      elif token == '*': stack.push(a * b)
      elif token == '/': stack.push(trunc(a / b))
  return stack.pop()`,
    python: `def evalRPN(tokens):
    stack = []
    for token in tokens:
        if token not in '+-*/':
            stack.append(int(token))
        else:
            b, a = stack.pop(), stack.pop()
            if token == '+': stack.append(a + b)
            elif token == '-': stack.append(a - b)
            elif token == '*': stack.append(a * b)
            elif token == '/': stack.append(int(a / b))
    return stack[0]`,
    javascript: `function evalRPN(tokens) {
  const stack = [];
  for (const token of tokens) {
    if (!['+', '-', '*', '/'].includes(token)) {
      stack.push(Number(token));
    } else {
      const b = stack.pop(), a = stack.pop();
      if (token === '+') stack.push(a + b);
      else if (token === '-') stack.push(a - b);
      else if (token === '*') stack.push(a * b);
      else stack.push(Math.trunc(a / b));
    }
  }
  return stack[0];
}`,
    java: `public int evalRPN(String[] tokens) {
    Deque<Integer> stack = new ArrayDeque<>();
    for (String t : tokens) {
        if (!"+-.*/".contains(t) || t.length() > 1) {
            stack.push(Integer.parseInt(t));
        } else {
            int b = stack.pop(), a = stack.pop();
            switch (t) {
                case "+": stack.push(a + b); break;
                case "-": stack.push(a - b); break;
                case "*": stack.push(a * b); break;
                case "/": stack.push(a / b); break;
            }
        }
    }
    return stack.pop();
}`,
  },
  defaultInput: { tokens: ['2', '1', '+', '3', '*'] },
  inputFields: [
    {
      name: 'tokens',
      label: 'RPN Tokens',
      type: 'string',
      defaultValue: '2 1 + 3 *',
      placeholder: 'e.g. 2 1 + 3 *',
      helperText: 'Space-separated RPN tokens',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const raw = (input.tokens as unknown);
    const tokens: string[] = Array.isArray(raw)
      ? (raw as string[])
      : String(raw).trim().split(/\s+/);
    const steps: AlgorithmStep[] = [];
    const stack: number[] = [];
    const operators = new Set(['+', '-', '*', '/']);

    const makeViz = (currentIndex: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map(String),
      inputChars: tokens,
      currentIndex,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Initialize empty stack. Process each token of [${tokens.join(', ')}].`,
      variables: { tokens, stack: [] },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (!operators.has(token)) {
        const val = Number(token);
        stack.push(val);
        steps.push({
          line: 3,
          explanation: `Token "${token}" is a number. Push ${val} onto stack.`,
          variables: { i, token, val, stack: [...stack] },
          visualization: makeViz(i, 'push'),
        });
      } else {
        const b = stack.pop()!;
        const a = stack.pop()!;
        let result: number;
        let expr: string;

        if (token === '+') { result = a + b; expr = `${a} + ${b} = ${result}`; }
        else if (token === '-') { result = a - b; expr = `${a} - ${b} = ${result}`; }
        else if (token === '*') { result = a * b; expr = `${a} * ${b} = ${result}`; }
        else { result = Math.trunc(a / b); expr = `${a} / ${b} = ${result}`; }

        stack.push(result);
        steps.push({
          line: 7,
          explanation: `Token "${token}": Pop b=${b}, pop a=${a}. Compute ${expr}. Push result ${result}.`,
          variables: { i, token, a, b, result, stack: [...stack] },
          visualization: makeViz(i, 'match'),
        });
      }
    }

    const result = stack[0];
    steps.push({
      line: 12,
      explanation: `All tokens processed. Final answer = ${result} (top of stack).`,
      variables: { result },
      visualization: makeViz(tokens.length, 'match'),
    });

    return steps;
  },
};

export default reversePolishNotation;

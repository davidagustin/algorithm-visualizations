import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const basicStringCalculator: AlgorithmDefinition = {
  id: 'basic-string-calculator',
  title: 'Basic Calculator',
  leetcodeNumber: 224,
  difficulty: 'Hard',
  category: 'String',
  description:
    'Evaluate a basic mathematical expression string with +, -, (, ) and spaces. Use a stack to handle parentheses: when seeing \'(\', push current result and sign onto stack. When seeing \')\', pop sign and previous result.',
  tags: ['string', 'stack', 'math', 'expression evaluation'],
  code: {
    pseudocode: `function calculate(s):
  stack = [], result = 0, sign = 1, num = 0
  for c in s:
    if c.isdigit(): num = num*10 + int(c)
    elif c == '+': result += sign*num; sign=1; num=0
    elif c == '-': result += sign*num; sign=-1; num=0
    elif c == '(':
      stack.push(result); stack.push(sign)
      result=0; sign=1
    elif c == ')':
      result += sign*num; num=0
      result *= stack.pop()  // sign before (
      result += stack.pop()  // result before (
  result += sign*num
  return result`,
    python: `def calculate(s: str) -> int:
    stack, result, sign, num = [], 0, 1, 0
    for c in s:
        if c.isdigit():
            num = num * 10 + int(c)
        elif c == '+':
            result += sign * num; sign = 1; num = 0
        elif c == '-':
            result += sign * num; sign = -1; num = 0
        elif c == '(':
            stack.append(result); stack.append(sign)
            result = 0; sign = 1
        elif c == ')':
            result += sign * num; num = 0
            result *= stack.pop()
            result += stack.pop()
    return result + sign * num`,
    javascript: `function calculate(s) {
  let stack = [], result = 0, sign = 1, num = 0;
  for (const c of s) {
    if (c >= '0' && c <= '9') num = num * 10 + +c;
    else if (c === '+') { result += sign * num; sign = 1; num = 0; }
    else if (c === '-') { result += sign * num; sign = -1; num = 0; }
    else if (c === '(') { stack.push(result, sign); result = 0; sign = 1; }
    else if (c === ')') {
      result += sign * num; num = 0;
      result *= stack.pop();
      result += stack.pop();
    }
  }
  return result + sign * num;
}`,
    java: `public int calculate(String s) {
    Deque<Integer> stack = new ArrayDeque<>();
    int result = 0, sign = 1, num = 0;
    for (char c : s.toCharArray()) {
        if (Character.isDigit(c)) num = num * 10 + (c - '0');
        else if (c == '+') { result += sign * num; sign = 1; num = 0; }
        else if (c == '-') { result += sign * num; sign = -1; num = 0; }
        else if (c == '(') { stack.push(result); stack.push(sign); result = 0; sign = 1; }
        else if (c == ')') { result += sign * num; num = 0; result *= stack.pop(); result += stack.pop(); }
    }
    return result + sign * num;
}`,
  },
  defaultInput: { s: '(1+(4+5+2)-3)+(6+8)' },
  inputFields: [
    { name: 's', label: 'Expression', type: 'string', defaultValue: '(1+(4+5+2)-3)+(6+8)', placeholder: '(1+(4+5+2)-3)+(6+8)', helperText: 'Mathematical expression with +, -, (, )' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const stack: number[] = [];
    let result = 0, sign = 1, num = 0;

    const makeViz = (pos: number, result: number, num: number, sign: number, stack: number[]): ArrayVisualization => {
      const highlights: Record<number, string> = {};
      if (pos < s.length) highlights[pos] = 'active';
      const labels: Record<number, string> = {};
      for (let x = 0; x < s.length; x++) labels[x] = s[x];
      return {
        type: 'array',
        array: Array.from({ length: s.length }, (_, x) => x),
        highlights,
        labels,
        auxData: {
          label: 'Basic Calculator',
          entries: [
            { key: 'char', value: pos < s.length ? `'${s[pos]}'` : '-' },
            { key: 'result', value: String(result) },
            { key: 'num', value: String(num) },
            { key: 'sign', value: sign === 1 ? '+' : '-' },
            { key: 'stack', value: `[${stack.join(', ')}]` },
          ],
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `Evaluate "${s}". Stack handles parentheses, sign tracks +/- context.`,
      variables: { s },
      visualization: makeViz(-1, 0, 0, 1, []),
    });

    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c >= '0' && c <= '9') {
        num = num * 10 + parseInt(c);
        steps.push({
          line: 4,
          explanation: `Digit '${c}': num = ${num}.`,
          variables: { char: c, num, result, sign, stack: [...stack] },
          visualization: makeViz(i, result, num, sign, [...stack]),
        });
      } else if (c === '+') {
        result += sign * num;
        sign = 1; num = 0;
        steps.push({
          line: 5,
          explanation: `'+': apply pending num. result = ${result}. sign = +1.`,
          variables: { result, sign, num },
          visualization: makeViz(i, result, num, sign, [...stack]),
        });
      } else if (c === '-') {
        result += sign * num;
        sign = -1; num = 0;
        steps.push({
          line: 6,
          explanation: `'-': apply pending num. result = ${result}. sign = -1.`,
          variables: { result, sign, num },
          visualization: makeViz(i, result, num, sign, [...stack]),
        });
      } else if (c === '(') {
        stack.push(result); stack.push(sign);
        result = 0; sign = 1;
        steps.push({
          line: 7,
          explanation: `'(': push result=${result === 0 ? stack[stack.length - 2] : result} and sign to stack. Reset for sub-expression.`,
          variables: { stack: [...stack], result, sign },
          visualization: makeViz(i, result, num, sign, [...stack]),
        });
      } else if (c === ')') {
        result += sign * num; num = 0;
        result *= stack.pop()!;
        result += stack.pop()!;
        steps.push({
          line: 11,
          explanation: `')': close sub-expression. Apply sign and previous result from stack. result = ${result}.`,
          variables: { result, stack: [...stack] },
          visualization: makeViz(i, result, num, sign, [...stack]),
        });
      }
    }

    result += sign * num;
    steps.push({
      line: 13,
      explanation: `Final: apply last num (${num}). Result = ${result}.`,
      variables: { result },
      visualization: makeViz(s.length, result, 0, sign, [...stack]),
    });

    return steps;
  },
};

export default basicStringCalculator;

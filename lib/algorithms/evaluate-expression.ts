import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const evaluateExpression: AlgorithmDefinition = {
  id: 'evaluate-expression',
  title: 'Evaluate Expression',
  leetcodeNumber: 224,
  difficulty: 'Hard',
  category: 'Stack',
  description:
    'Evaluate a mathematical expression string containing +, -, parentheses, and non-negative integers. Use a stack to handle nested parentheses by saving and restoring state.',
  tags: ['Stack', 'String', 'Math'],
  code: {
    pseudocode: `function calculate(s):
  stack = []
  num = 0
  result = 0
  sign = 1
  for each char in s:
    if char is digit:
      num = num * 10 + int(char)
    else if char is '+':
      result += sign * num
      num = 0, sign = 1
    else if char is '-':
      result += sign * num
      num = 0, sign = -1
    else if char is '(':
      push result and sign onto stack
      result = 0, sign = 1
    else if char is ')':
      result += sign * num
      num = 0
      result = result * stack.pop() + stack.pop()
  result += sign * num
  return result`,
    python: `def calculate(s):
    stack = []
    num = 0
    result = 0
    sign = 1
    for char in s:
        if char.isdigit():
            num = num * 10 + int(char)
        elif char == '+':
            result += sign * num
            num, sign = 0, 1
        elif char == '-':
            result += sign * num
            num, sign = 0, -1
        elif char == '(':
            stack.append(result)
            stack.append(sign)
            result, sign = 0, 1
        elif char == ')':
            result += sign * num
            num = 0
            result = result * stack.pop() + stack.pop()
    result += sign * num
    return result`,
    javascript: `function calculate(s) {
  const stack = [];
  let num = 0, result = 0, sign = 1;
  for (const char of s) {
    if (char >= '0' && char <= '9') {
      num = num * 10 + Number(char);
    } else if (char === '+') {
      result += sign * num;
      num = 0; sign = 1;
    } else if (char === '-') {
      result += sign * num;
      num = 0; sign = -1;
    } else if (char === '(') {
      stack.push(result);
      stack.push(sign);
      result = 0; sign = 1;
    } else if (char === ')') {
      result += sign * num;
      num = 0;
      result = result * stack.pop() + stack.pop();
    }
  }
  return result + sign * num;
}`,
    java: `public int calculate(String s) {
    Deque<Integer> stack = new ArrayDeque<>();
    int num = 0, result = 0, sign = 1;
    for (char c : s.toCharArray()) {
        if (Character.isDigit(c)) {
            num = num * 10 + (c - '0');
        } else if (c == '+') {
            result += sign * num;
            num = 0; sign = 1;
        } else if (c == '-') {
            result += sign * num;
            num = 0; sign = -1;
        } else if (c == '(') {
            stack.push(result);
            stack.push(sign);
            result = 0; sign = 1;
        } else if (c == ')') {
            result += sign * num;
            num = 0;
            result = result * stack.pop() + stack.pop();
        }
    }
    return result + sign * num;
}`,
  },
  defaultInput: { s: '(1+(4+5+2)-3)+(6+8)' },
  inputFields: [
    {
      name: 's',
      label: 'Expression',
      type: 'string',
      defaultValue: '(1+(4+5+2)-3)+(6+8)',
      placeholder: 'e.g. (1+(4+5+2)-3)+(6+8)',
      helperText: 'Math expression with +, -, and parentheses',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const chars = s.split('');
    const steps: AlgorithmStep[] = [];
    const stack: number[] = [];
    let num = 0;
    let result = 0;
    let sign = 1;

    const makeViz = (
      currentIndex: number,
      action: StackVisualization['action']
    ): StackVisualization => ({
      type: 'stack',
      items: stack.map(String),
      inputChars: chars,
      currentIndex,
      action,
    });

    // Initialize
    steps.push({
      line: 1,
      explanation: 'Initialize: result=0, sign=+1, num=0, empty stack.',
      variables: { result: 0, sign: 1, num: 0, stack: [] },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];

      if (char === ' ') continue;

      if (char >= '0' && char <= '9') {
        num = num * 10 + Number(char);
        steps.push({
          line: 7,
          explanation: `Digit '${char}': building number = ${num}.`,
          variables: { i, char, num, result, sign },
          visualization: makeViz(i, 'idle'),
        });
      } else if (char === '+') {
        result += sign * num;
        steps.push({
          line: 9,
          explanation: `'+': Apply pending: result += ${sign > 0 ? '+' : '-'}${num} = ${result}. Reset num=0, sign=+1.`,
          variables: { result, num, sign: 1 },
          visualization: makeViz(i, 'idle'),
        });
        num = 0;
        sign = 1;
      } else if (char === '-') {
        result += sign * num;
        steps.push({
          line: 11,
          explanation: `'-': Apply pending: result += ${sign > 0 ? '+' : '-'}${num} = ${result}. Reset num=0, sign=-1.`,
          variables: { result, num, sign: -1 },
          visualization: makeViz(i, 'idle'),
        });
        num = 0;
        sign = -1;
      } else if (char === '(') {
        stack.push(result);
        stack.push(sign);
        steps.push({
          line: 14,
          explanation: `'(': Push current result=${result} and sign=${sign > 0 ? '+1' : '-1'} onto stack. Reset result=0, sign=+1 for sub-expression.`,
          variables: { result: 0, sign: 1, stack: [...stack] },
          visualization: makeViz(i, 'push'),
        });
        result = 0;
        sign = 1;
      } else if (char === ')') {
        result += sign * num;
        num = 0;
        const prevSign = stack.pop()!;
        const prevResult = stack.pop()!;
        result = result * prevSign + prevResult;
        steps.push({
          line: 17,
          explanation: `')': Finalize sub-expression. Pop sign=${prevSign > 0 ? '+1' : '-1'} and prev result=${prevResult}. Combined result = ${result}.`,
          variables: { result, prevSign, prevResult, stack: [...stack] },
          visualization: makeViz(i, 'pop'),
        });
      }
    }

    // Final
    result += sign * num;
    steps.push({
      line: 19,
      explanation: `End of expression. Apply final pending: result += ${sign > 0 ? '+' : '-'}${num} = ${result}.`,
      variables: { result, finalAnswer: result },
      visualization: makeViz(chars.length, 'match'),
    });

    return steps;
  },
};

export default evaluateExpression;

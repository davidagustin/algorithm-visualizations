import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const basicCalculatorI: AlgorithmDefinition = {
  id: 'basic-calculator-i',
  title: 'Basic Calculator',
  leetcodeNumber: 224,
  difficulty: 'Hard',
  category: 'Math',
  description:
    'Implement a basic calculator to evaluate a simple expression string containing digits, spaces, plus (+), minus (-), and parentheses. Use a stack to save the running result and sign when entering parentheses. Process each character, applying the current sign to build up the result.',
  tags: ['math', 'stack', 'string'],

  code: {
    pseudocode: `function calculate(s):
  stack = []
  result = 0
  sign = 1
  num = 0
  for c in s:
    if c is digit: num = num*10 + digit
    elif c is + or -: result += sign * num; num = 0; sign = (+1 or -1)
    elif c is (: stack.push(result, sign); result = 0; sign = 1
    elif c is ): result += sign * num; num = 0
                result = stack.pop() * result + stack.pop()
  return result + sign * num`,

    python: `def calculate(s):
    stack = []
    result = 0
    sign = 1
    num = 0
    for c in s:
        if c.isdigit():
            num = num * 10 + int(c)
        elif c in '+-':
            result += sign * num
            num = 0
            sign = 1 if c == '+' else -1
        elif c == '(':
            stack.append(result)
            stack.append(sign)
            result = 0
            sign = 1
        elif c == ')':
            result += sign * num
            num = 0
            result = stack.pop() * result + stack.pop()
    return result + sign * num`,

    javascript: `function calculate(s) {
  const stack = [];
  let result = 0, sign = 1, num = 0;
  for (const c of s) {
    if (c >= '0' && c <= '9') {
      num = num * 10 + +c;
    } else if (c === '+' || c === '-') {
      result += sign * num; num = 0;
      sign = c === '+' ? 1 : -1;
    } else if (c === '(') {
      stack.push(result, sign); result = 0; sign = 1;
    } else if (c === ')') {
      result += sign * num; num = 0;
      result = stack.pop() * result + stack.pop();
    }
  }
  return result + sign * num;
}`,

    java: `public int calculate(String s) {
    Deque<Integer> stack = new ArrayDeque<>();
    int result = 0, sign = 1, num = 0;
    for (char c : s.toCharArray()) {
        if (Character.isDigit(c)) num = num * 10 + (c - '0');
        else if (c == '+' || c == '-') { result += sign * num; num = 0; sign = c == '+' ? 1 : -1; }
        else if (c == '(') { stack.push(result); stack.push(sign); result = 0; sign = 1; }
        else if (c == ')') { result += sign * num; num = 0; result = stack.pop() * result + stack.pop(); }
    }
    return result + sign * num;
}`,
  },

  defaultInput: {
    s: '1 + (2 - 3)',
  },

  inputFields: [
    {
      name: 's',
      label: 'Expression',
      type: 'string',
      defaultValue: '1 + (2 - 3)',
      placeholder: '1 + (2 - 3)',
      helperText: 'Mathematical expression with +, -, and parentheses',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const stack: number[] = [];
    let result = 0;
    let sign = 1;
    let num = 0;

    const makeViz = (currentIdx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map(String),
      inputChars: s.split(''),
      currentIndex: currentIdx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Evaluate expression "${s}". Use a stack to handle parentheses. Track current number, sign, and running result.`,
      variables: { result, sign, num, stack: [] },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < s.length; i++) {
      const c = s[i];

      if (c >= '0' && c <= '9') {
        num = num * 10 + parseInt(c);
        steps.push({
          line: 6,
          explanation: `Character '${c}' is a digit. Accumulate num = ${num}.`,
          variables: { char: c, num, result, sign },
          visualization: makeViz(i, 'idle'),
        });
      } else if (c === '+' || c === '-') {
        result += sign * num;
        num = 0;
        sign = c === '+' ? 1 : -1;
        steps.push({
          line: 7,
          explanation: `Character '${c}'. Apply previous num: result = ${result}. Reset num = 0. New sign = ${sign}.`,
          variables: { char: c, result, num, sign },
          visualization: makeViz(i, 'idle'),
        });
      } else if (c === '(') {
        stack.push(result);
        stack.push(sign);
        result = 0;
        sign = 1;
        steps.push({
          line: 8,
          explanation: `'(' encountered. Push result=${stack[stack.length - 2]} and sign=${stack[stack.length - 1]} onto stack. Reset result=0, sign=1.`,
          variables: { char: c, result, sign, stackSize: stack.length },
          visualization: makeViz(i, 'push'),
        });
      } else if (c === ')') {
        result += sign * num;
        num = 0;
        const popSign = stack.pop()!;
        const popResult = stack.pop()!;
        result = popSign * result + popResult;
        steps.push({
          line: 10,
          explanation: `')' encountered. Finalize inner expression: result = ${result}. Restored outer context.`,
          variables: { char: c, result, num, stack: [...stack] },
          visualization: makeViz(i, 'pop'),
        });
      } else {
        steps.push({
          line: 6,
          explanation: `Character '${c}' is a space. Skip.`,
          variables: { char: c },
          visualization: makeViz(i, 'idle'),
        });
      }
    }

    const finalResult = result + sign * num;
    steps.push({
      line: 11,
      explanation: `End of expression. Final: result + sign * num = ${result} + ${sign} * ${num} = ${finalResult}.`,
      variables: { result: finalResult },
      visualization: makeViz(s.length - 1, 'match'),
    });

    return steps;
  },
};

export default basicCalculatorI;

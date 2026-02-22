import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const parsingABooleanExpression: AlgorithmDefinition = {
  id: 'parsing-a-boolean-expression',
  title: 'Parsing A Boolean Expression',
  leetcodeNumber: 1106,
  difficulty: 'Hard',
  category: 'Stack',
  description:
    'Given a string expression representing a boolean expression, return the value. Expressions include t (true), f (false), !(expr) (NOT), &(expr1,expr2,...) (AND), |(expr1,expr2,...) (OR). Use a stack to evaluate: push operators and values, and when a closing paren is encountered, pop all values until the operator, evaluate, and push the result.',
  tags: ['stack', 'string', 'recursion', 'parsing'],

  code: {
    pseudocode: `function parseBoolExpr(expression):
  stack = []
  for c in expression:
    if c == ',': continue
    if c != ')':
      stack.push(c)
    else:  // c == ')'
      values = []
      while stack.top() != '(':
        values.append(stack.pop())
      stack.pop()  // pop '('
      op = stack.pop()  // pop operator !, &, |
      if op == '!': result = not values[0]
      elif op == '&': result = all(v == 't' for v in values)
      elif op == '|': result = any(v == 't' for v in values)
      stack.push('t' if result else 'f')
  return stack[0] == 't'`,

    python: `def parseBoolExpr(expression: str) -> bool:
    stack = []
    for c in expression:
        if c == ',':
            continue
        elif c != ')':
            stack.append(c)
        else:
            values = []
            while stack[-1] != '(':
                values.append(stack.pop())
            stack.pop()  # pop '('
            op = stack.pop()
            if op == '!':
                result = values[0] != 't'
            elif op == '&':
                result = all(v == 't' for v in values)
            else:
                result = any(v == 't' for v in values)
            stack.append('t' if result else 'f')
    return stack[0] == 't'`,

    javascript: `function parseBoolExpr(expression) {
  const stack = [];
  for (const c of expression) {
    if (c === ',') continue;
    if (c !== ')') {
      stack.push(c);
    } else {
      const values = [];
      while (stack[stack.length - 1] !== '(') values.push(stack.pop());
      stack.pop(); // '('
      const op = stack.pop();
      const result = op === '!' ? values[0] !== 't'
                   : op === '&' ? values.every(v => v === 't')
                   : values.some(v => v === 't');
      stack.push(result ? 't' : 'f');
    }
  }
  return stack[0] === 't';
}`,

    java: `public boolean parseBoolExpr(String expression) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char c : expression.toCharArray()) {
        if (c == ',') continue;
        if (c != ')') { stack.push(c); continue; }
        List<Character> values = new ArrayList<>();
        while (stack.peek() != '(') values.add(stack.pop());
        stack.pop(); // '('
        char op = stack.pop();
        boolean result = op == '&';
        if (op == '!') result = values.get(0) != 't';
        else if (op == '&') result = values.stream().allMatch(v -> v == 't');
        else result = values.stream().anyMatch(v -> v == 't');
        stack.push(result ? 't' : 'f');
    }
    return stack.pop() == 't';
}`,
  },

  defaultInput: {
    expression: '|(f,t)',
  },

  inputFields: [
    {
      name: 'expression',
      label: 'Boolean Expression',
      type: 'string',
      defaultValue: '|(f,t)',
      placeholder: '|(f,t)',
      helperText: 'Boolean expression with t, f, !, &, |',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const expression = input.expression as string;
    const steps: AlgorithmStep[] = [];
    const chars = expression.split('');
    const stack: string[] = [];

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: [...stack],
      inputChars: chars,
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Parse boolean expression "${expression}". Use stack: push chars, on ')' evaluate innermost group.`,
      variables: { expression, stack: [] },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];

      if (c === ',') {
        steps.push({
          line: 2,
          explanation: `Comma at index ${i}: separator, skip it.`,
          variables: { i, char: c },
          visualization: makeViz(i, 'idle'),
        });
        continue;
      }

      if (c !== ')') {
        stack.push(c);
        steps.push({
          line: 4,
          explanation: `Push '${c}' onto stack.`,
          variables: { i, char: c, stack: [...stack] },
          visualization: makeViz(i, 'push'),
        });
      } else {
        // Collect values until '('
        const values: string[] = [];
        while (stack.length > 0 && stack[stack.length - 1] !== '(') {
          values.push(stack.pop()!);
        }
        stack.pop(); // remove '('
        const op = stack.pop()!; // remove operator

        steps.push({
          line: 9,
          explanation: `')' found. Collected values: [${values.join(', ')}]. Operator: '${op}'. Evaluating...`,
          variables: { i, op, values: [...values] },
          visualization: makeViz(i, 'pop'),
        });

        let result: boolean;
        if (op === '!') {
          result = values[0] !== 't';
        } else if (op === '&') {
          result = values.every(v => v === 't');
        } else {
          result = values.some(v => v === 't');
        }

        const resultChar = result ? 't' : 'f';
        stack.push(resultChar);

        steps.push({
          line: 13,
          explanation: `'${op}'([${values.join(',')}]) = ${result}. Push '${resultChar}' onto stack.`,
          variables: { op, values: [...values], result, stackTop: resultChar },
          visualization: makeViz(i, 'match'),
        });
      }
    }

    const finalResult = stack[0] === 't';
    steps.push({
      line: 16,
      explanation: `Evaluation complete. Final result: ${finalResult}.`,
      variables: { result: finalResult },
      visualization: makeViz(-1, 'found'),
    });

    return steps;
  },
};

export default parsingABooleanExpression;

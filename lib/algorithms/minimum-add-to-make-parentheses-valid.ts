import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const minimumAddToMakeParenthesesValid: AlgorithmDefinition = {
  id: 'minimum-add-to-make-parentheses-valid',
  title: 'Minimum Add to Make Parentheses Valid',
  leetcodeNumber: 921,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Given a parentheses string, return the minimum number of parentheses additions needed to make the string valid. Use a stack: push unmatched open parentheses, and for each close paren either pop a matching open or count an unmatched close. The answer is the number of unmatched closes plus the remaining unmatched opens in the stack.',
  tags: ['stack', 'string', 'greedy', 'parentheses'],

  code: {
    pseudocode: `function minAddToMakeValid(s):
  stack = []
  unmatched_close = 0
  for c in s:
    if c == '(':
      stack.push(c)
    else:  // c == ')'
      if stack not empty:
        stack.pop()  // match found
      else:
        unmatched_close += 1
  return len(stack) + unmatched_close`,

    python: `def minAddToMakeValid(s: str) -> int:
    stack = []
    unmatched_close = 0
    for c in s:
        if c == '(':
            stack.append(c)
        else:
            if stack:
                stack.pop()
            else:
                unmatched_close += 1
    return len(stack) + unmatched_close`,

    javascript: `function minAddToMakeValid(s) {
  const stack = [];
  let unmatchedClose = 0;
  for (const c of s) {
    if (c === '(') {
      stack.push(c);
    } else {
      if (stack.length) {
        stack.pop();
      } else {
        unmatchedClose++;
      }
    }
  }
  return stack.length + unmatchedClose;
}`,

    java: `public int minAddToMakeValid(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    int unmatchedClose = 0;
    for (char c : s.toCharArray()) {
        if (c == '(') {
            stack.push(c);
        } else {
            if (!stack.isEmpty()) {
                stack.pop();
            } else {
                unmatchedClose++;
            }
        }
    }
    return stack.size() + unmatchedClose;
}`,
  },

  defaultInput: {
    s: '())',
  },

  inputFields: [
    {
      name: 's',
      label: 'Parentheses String',
      type: 'string',
      defaultValue: '())',
      placeholder: '())',
      helperText: 'String of parentheses characters',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const chars = s.split('');
    const stack: string[] = [];
    let unmatchedClose = 0;

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: [...stack],
      inputChars: chars,
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Find minimum additions to make "${s}" valid. Stack holds unmatched open parens. Count unmatched close parens separately.`,
      variables: { s, stack: [], unmatchedClose: 0 },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];

      if (c === '(') {
        stack.push(c);
        steps.push({
          line: 4,
          explanation: `'(' at index ${i}: push onto stack. Stack size = ${stack.length}.`,
          variables: { i, char: c, stackSize: stack.length, unmatchedClose },
          visualization: makeViz(i, 'push'),
        });
      } else {
        if (stack.length > 0) {
          stack.pop();
          steps.push({
            line: 7,
            explanation: `')' at index ${i}: matched with top of stack. Pop '('. Stack size = ${stack.length}.`,
            variables: { i, char: c, stackSize: stack.length, unmatchedClose },
            visualization: makeViz(i, 'match'),
          });
        } else {
          unmatchedClose++;
          steps.push({
            line: 9,
            explanation: `')' at index ${i}: stack is empty, no matching '('. Unmatched close count = ${unmatchedClose}. Need one more '(' insertion.`,
            variables: { i, char: c, unmatchedClose, stackSize: 0 },
            visualization: makeViz(i, 'mismatch'),
          });
        }
      }
    }

    const answer = stack.length + unmatchedClose;
    steps.push({
      line: 10,
      explanation: `Done. Unmatched opens in stack = ${stack.length}, unmatched closes = ${unmatchedClose}. Minimum additions = ${stack.length} + ${unmatchedClose} = ${answer}.`,
      variables: { unmatchedOpen: stack.length, unmatchedClose, result: answer },
      visualization: makeViz(-1, 'found'),
    });

    return steps;
  },
};

export default minimumAddToMakeParenthesesValid;

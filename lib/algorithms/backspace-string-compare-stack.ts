import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const backspaceStringCompareStack: AlgorithmDefinition = {
  id: 'backspace-string-compare-stack',
  title: 'Backspace String Compare (Stack)',
  leetcodeNumber: 844,
  difficulty: 'Easy',
  category: 'Stack',
  description:
    'Given two strings s and t, return true if they are equal when both are typed into empty text editors. The hash character represents a backspace. Use a stack to process each string: push regular characters, pop on backspace. Then compare the resulting stacks.',
  tags: ['stack', 'string', 'two pointers', 'simulation'],

  code: {
    pseudocode: `function backspaceCompare(s, t):
  function process(str):
    stack = []
    for each char c in str:
      if c != '#':
        stack.push(c)
      elif stack not empty:
        stack.pop()
    return stack
  return process(s) == process(t)`,

    python: `def backspaceCompare(s: str, t: str) -> bool:
    def process(string):
        stack = []
        for c in string:
            if c != '#':
                stack.append(c)
            elif stack:
                stack.pop()
        return stack
    return process(s) == process(t)`,

    javascript: `function backspaceCompare(s, t) {
  function process(str) {
    const stack = [];
    for (const c of str) {
      if (c !== '#') stack.push(c);
      else if (stack.length) stack.pop();
    }
    return stack.join('');
  }
  return process(s) === process(t);
}`,

    java: `public boolean backspaceCompare(String s, String t) {
    return process(s).equals(process(t));
}
private String process(String str) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char c : str.toCharArray()) {
        if (c != '#') stack.push(c);
        else if (!stack.isEmpty()) stack.pop();
    }
    StringBuilder sb = new StringBuilder();
    while (!stack.isEmpty()) sb.append(stack.pop());
    return sb.reverse().toString();
}`,
  },

  defaultInput: {
    s: 'ab#c',
    t: 'ad#c',
  },

  inputFields: [
    {
      name: 's',
      label: 'String S',
      type: 'string',
      defaultValue: 'ab#c',
      placeholder: 'ab#c',
      helperText: 'String where # is backspace',
    },
    {
      name: 't',
      label: 'String T',
      type: 'string',
      defaultValue: 'ad#c',
      placeholder: 'ad#c',
      helperText: 'String where # is backspace',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const t = input.t as string;
    const steps: AlgorithmStep[] = [];
    const stackS: string[] = [];
    const stackT: string[] = [];

    const makeViz = (stack: string[], chars: string, idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: [...stack],
      inputChars: chars.split(''),
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Process string s="${s}" using a stack. # means backspace.`,
      variables: { s, t, stackS: [], stackT: [] },
      visualization: makeViz(stackS, s, -1, 'idle'),
    });

    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c !== '#') {
        stackS.push(c);
        steps.push({
          line: 4,
          explanation: `s[${i}]="${c}": Push "${c}" onto stack S. Stack = [${stackS.join(', ')}].`,
          variables: { i, char: c, stackS: [...stackS] },
          visualization: makeViz(stackS, s, i, 'push'),
        });
      } else {
        if (stackS.length > 0) {
          const popped = stackS.pop()!;
          steps.push({
            line: 6,
            explanation: `s[${i}]="#" (backspace): Pop "${popped}" from stack S. Stack = [${stackS.join(', ')}].`,
            variables: { i, popped, stackS: [...stackS] },
            visualization: makeViz(stackS, s, i, 'pop'),
          });
        } else {
          steps.push({
            line: 6,
            explanation: `s[${i}]="#" (backspace): Stack S is empty. Nothing to delete.`,
            variables: { i, stackS: [] },
            visualization: makeViz(stackS, s, i, 'idle'),
          });
        }
      }
    }

    steps.push({
      line: 7,
      explanation: `s processed. Result = "${stackS.join('')}". Now process t="${t}".`,
      variables: { resultS: stackS.join(''), stackS: [...stackS] },
      visualization: makeViz(stackT, t, -1, 'idle'),
    });

    for (let i = 0; i < t.length; i++) {
      const c = t[i];
      if (c !== '#') {
        stackT.push(c);
        steps.push({
          line: 4,
          explanation: `t[${i}]="${c}": Push "${c}" onto stack T. Stack = [${stackT.join(', ')}].`,
          variables: { i, char: c, stackT: [...stackT] },
          visualization: makeViz(stackT, t, i, 'push'),
        });
      } else {
        if (stackT.length > 0) {
          const popped = stackT.pop()!;
          steps.push({
            line: 6,
            explanation: `t[${i}]="#" (backspace): Pop "${popped}" from stack T. Stack = [${stackT.join(', ')}].`,
            variables: { i, popped, stackT: [...stackT] },
            visualization: makeViz(stackT, t, i, 'pop'),
          });
        }
      }
    }

    const resultS = stackS.join('');
    const resultT = stackT.join('');
    const equal = resultS === resultT;

    steps.push({
      line: 8,
      explanation: `Compare: "${resultS}" vs "${resultT}". Result = ${equal}.`,
      variables: { resultS, resultT, equal },
      visualization: makeViz(stackT, t, t.length, equal ? 'match' : 'mismatch'),
    });

    return steps;
  },
};

export default backspaceStringCompareStack;

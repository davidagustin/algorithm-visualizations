import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const maxNestingDepthOfParentheses: AlgorithmDefinition = {
  id: 'max-nesting-depth-of-parentheses',
  title: 'Maximum Nesting Depth of Parentheses',
  leetcodeNumber: 1614,
  difficulty: 'Easy',
  category: 'Stack',
  description:
    'Given a valid parenthesized string, find the maximum nesting depth. Track the current depth with a counter: increment on "(", decrement on ")", and record the maximum depth seen. Equivalently, use a stack and track its maximum size.',
  tags: ['stack', 'string', 'depth', 'parentheses'],

  code: {
    pseudocode: `function maxDepth(s):
  depth = 0
  maxD = 0
  for each char c in s:
    if c == '(':
      depth += 1
      maxD = max(maxD, depth)
    elif c == ')':
      depth -= 1
  return maxD`,

    python: `def maxDepth(s: str) -> int:
    depth = 0
    max_d = 0
    for c in s:
        if c == '(':
            depth += 1
            max_d = max(max_d, depth)
        elif c == ')':
            depth -= 1
    return max_d`,

    javascript: `function maxDepth(s) {
  let depth = 0, maxD = 0;
  for (const c of s) {
    if (c === '(') { depth++; maxD = Math.max(maxD, depth); }
    else if (c === ')') { depth--; }
  }
  return maxD;
}`,

    java: `public int maxDepth(String s) {
    int depth = 0, maxD = 0;
    for (char c : s.toCharArray()) {
        if (c == '(') { maxD = Math.max(maxD, ++depth); }
        else if (c == ')') { depth--; }
    }
    return maxD;
}`,
  },

  defaultInput: {
    s: '(1+(2*3)+((8)/4))+1',
  },

  inputFields: [
    {
      name: 's',
      label: 'Parentheses String',
      type: 'string',
      defaultValue: '(1+(2*3)+((8)/4))+1',
      placeholder: '(1+(2*3)+((8)/4))+1',
      helperText: 'A valid parenthesized string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const stack: string[] = [];
    let depth = 0;
    let maxD = 0;

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: [...stack],
      inputChars: s.split(''),
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Initialize depth=0, maxDepth=0. Scan string "${s}".`,
      variables: { depth: 0, maxD: 0 },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < s.length; i++) {
      const c = s[i];

      if (c === '(') {
        depth++;
        maxD = Math.max(maxD, depth);
        stack.push('(');
        steps.push({
          line: 4,
          explanation: `s[${i}]="(": Open paren. depth = ${depth}. maxDepth = ${maxD}. Stack size = ${stack.length}.`,
          variables: { i, char: c, depth, maxD },
          visualization: makeViz(i, 'push'),
        });
      } else if (c === ')') {
        depth--;
        stack.pop();
        steps.push({
          line: 7,
          explanation: `s[${i}]=")": Close paren. depth = ${depth}. maxDepth = ${maxD}.`,
          variables: { i, char: c, depth, maxD },
          visualization: makeViz(i, 'pop'),
        });
      } else {
        steps.push({
          line: 4,
          explanation: `s[${i}]="${c}": Not a parenthesis. depth stays ${depth}.`,
          variables: { i, char: c, depth, maxD },
          visualization: makeViz(i, 'idle'),
        });
      }
    }

    steps.push({
      line: 9,
      explanation: `Done. Maximum nesting depth = ${maxD}.`,
      variables: { result: maxD },
      visualization: makeViz(s.length, 'match'),
    });

    return steps;
  },
};

export default maxNestingDepthOfParentheses;

import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const maximumNestingDepth: AlgorithmDefinition = {
  id: 'maximum-nesting-depth',
  title: 'Maximum Nesting Depth of the Parentheses',
  leetcodeNumber: 1614,
  difficulty: 'Easy',
  category: 'Stack',
  description:
    'Given a valid parentheses string (VPS), return the nesting depth - the maximum number of open parentheses at any point. Track depth with a counter: increment on open paren, decrement on close paren, and record the maximum depth seen. This can also be visualized with a stack showing open parens.',
  tags: ['stack', 'string', 'parentheses'],

  code: {
    pseudocode: `function maxDepth(s):
  depth = 0
  maxDepth = 0
  for c in s:
    if c == '(':
      depth += 1
      maxDepth = max(maxDepth, depth)
    elif c == ')':
      depth -= 1
  return maxDepth`,

    python: `def maxDepth(s: str) -> int:
    depth = 0
    max_depth = 0
    for c in s:
        if c == '(':
            depth += 1
            max_depth = max(max_depth, depth)
        elif c == ')':
            depth -= 1
    return max_depth`,

    javascript: `function maxDepth(s) {
  let depth = 0, maxD = 0;
  for (const c of s) {
    if (c === '(') { depth++; maxD = Math.max(maxD, depth); }
    else if (c === ')') depth--;
  }
  return maxD;
}`,

    java: `public int maxDepth(String s) {
    int depth = 0, maxD = 0;
    for (char c : s.toCharArray()) {
        if (c == '(') { depth++; maxD = Math.max(maxD, depth); }
        else if (c == ')') depth--;
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
      label: 'VPS String',
      type: 'string',
      defaultValue: '(1+(2*3)+((8)/4))+1',
      placeholder: '(1+(2*3)+((8)/4))+1',
      helperText: 'Valid parentheses string (can contain digits and operators)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const chars = s.split('');
    const stack: string[] = [];
    let depth = 0;
    let maxDepth = 0;

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: [...stack],
      inputChars: chars,
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Find maximum nesting depth of parentheses in "${s}". Track open paren depth.`,
      variables: { s, depth: 0, maxDepth: 0 },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];

      if (c === '(') {
        depth++;
        stack.push('(');
        if (depth > maxDepth) maxDepth = depth;
        steps.push({
          line: 4,
          explanation: `'(' at index ${i}: depth increases to ${depth}. MaxDepth = ${maxDepth}.`,
          variables: { i, char: c, depth, maxDepth },
          visualization: makeViz(i, 'push'),
        });
      } else if (c === ')') {
        depth--;
        stack.pop();
        steps.push({
          line: 7,
          explanation: `')' at index ${i}: depth decreases to ${depth}.`,
          variables: { i, char: c, depth, maxDepth },
          visualization: makeViz(i, 'pop'),
        });
      } else {
        steps.push({
          line: 3,
          explanation: `'${c}' at index ${i}: not a paren, skip. Depth stays at ${depth}.`,
          variables: { i, char: c, depth },
          visualization: makeViz(i, 'idle'),
        });
      }
    }

    steps.push({
      line: 8,
      explanation: `Done. Maximum nesting depth = ${maxDepth}.`,
      variables: { result: maxDepth },
      visualization: makeViz(-1, 'found'),
    });

    return steps;
  },
};

export default maximumNestingDepth;

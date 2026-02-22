import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const removeOutermostParentheses: AlgorithmDefinition = {
  id: 'remove-outermost-parentheses',
  title: 'Remove Outermost Parentheses',
  leetcodeNumber: 1021,
  difficulty: 'Easy',
  category: 'Stack',
  description:
    'A valid parentheses string is primitive if it is non-empty and cannot be split into two non-empty valid parentheses strings. Given a valid parentheses string, remove the outermost parentheses of every primitive part and return the result. Track depth with a counter: the outermost open paren has depth 0 before incrementing, and the outermost close paren reduces depth to 0.',
  tags: ['stack', 'string', 'parentheses'],

  code: {
    pseudocode: `function removeOuterParentheses(s):
  result = ""
  depth = 0
  for c in s:
    if c == '(':
      if depth > 0: result += c  // not outermost open
      depth += 1
    else:  // c == ')'
      depth -= 1
      if depth > 0: result += c  // not outermost close
  return result`,

    python: `def removeOuterParentheses(s: str) -> str:
    result = []
    depth = 0
    for c in s:
        if c == '(':
            if depth > 0:
                result.append(c)
            depth += 1
        else:
            depth -= 1
            if depth > 0:
                result.append(c)
    return ''.join(result)`,

    javascript: `function removeOuterParentheses(s) {
  let result = '';
  let depth = 0;
  for (const c of s) {
    if (c === '(') {
      if (depth > 0) result += c;
      depth++;
    } else {
      depth--;
      if (depth > 0) result += c;
    }
  }
  return result;
}`,

    java: `public String removeOuterParentheses(String s) {
    StringBuilder result = new StringBuilder();
    int depth = 0;
    for (char c : s.toCharArray()) {
        if (c == '(') {
            if (depth > 0) result.append(c);
            depth++;
        } else {
            depth--;
            if (depth > 0) result.append(c);
        }
    }
    return result.toString();
}`,
  },

  defaultInput: {
    s: '(()())(())',
  },

  inputFields: [
    {
      name: 's',
      label: 'Parentheses String',
      type: 'string',
      defaultValue: '(()())(())',
      placeholder: '(()())(())',
      helperText: 'Valid parentheses string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const chars = s.split('');
    const stack: string[] = [];
    let depth = 0;
    let result = '';

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: [...stack],
      inputChars: chars,
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Remove outermost parentheses from "${s}". Track depth: skip characters when depth is 0 (outermost).`,
      variables: { s, depth, result: '' },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];

      if (c === '(') {
        if (depth > 0) {
          result += c;
          stack.push(c);
          steps.push({
            line: 4,
            explanation: `'(' at index ${i}: depth=${depth} > 0, so this is NOT the outermost. Add to result. Push to stack.`,
            variables: { i, char: c, depth, result },
            visualization: makeViz(i, 'push'),
          });
        } else {
          steps.push({
            line: 4,
            explanation: `'(' at index ${i}: depth=${depth} == 0, this is the outermost open paren. Skip it (do not add to result).`,
            variables: { i, char: c, depth, result },
            visualization: makeViz(i, 'mismatch'),
          });
        }
        depth++;
        steps.push({
          line: 5,
          explanation: `Increment depth to ${depth}.`,
          variables: { depth, result },
          visualization: makeViz(i, 'idle'),
        });
      } else {
        depth--;
        steps.push({
          line: 7,
          explanation: `')' at index ${i}: decrement depth to ${depth}.`,
          variables: { i, char: c, depth, result },
          visualization: makeViz(i, 'idle'),
        });

        if (depth > 0) {
          result += c;
          if (stack.length > 0) stack.pop();
          steps.push({
            line: 8,
            explanation: `depth=${depth} > 0, so this is NOT the outermost close paren. Add ')' to result.`,
            variables: { i, depth, result },
            visualization: makeViz(i, 'pop'),
          });
        } else {
          steps.push({
            line: 8,
            explanation: `depth=${depth} == 0, this is the outermost close paren. Skip it (end of primitive part).`,
            variables: { i, depth, result },
            visualization: makeViz(i, 'match'),
          });
        }
      }
    }

    steps.push({
      line: 9,
      explanation: `Done. Outermost parentheses removed. Result: "${result}".`,
      variables: { result },
      visualization: makeViz(-1, 'found'),
    });

    return steps;
  },
};

export default removeOutermostParentheses;

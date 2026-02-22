import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const generateParentheses: AlgorithmDefinition = {
  id: 'generate-parentheses',
  title: 'Generate Parentheses',
  leetcodeNumber: 22,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Generate all combinations of well-formed parentheses for n pairs. Use a stack-based backtracking approach: maintain a current string (stack), adding "(" when open < n and ")" when close < open. When the string length equals 2n, record it as a valid combination.',
  tags: ['Stack', 'String', 'Backtracking', 'Recursion'],
  code: {
    pseudocode: `function generateParenthesis(n):
  result = []
  stack = []
  function backtrack(open, close):
    if len(stack) == 2*n:
      result.append(join(stack))
      return
    if open < n:
      stack.push('(')
      backtrack(open+1, close)
      stack.pop()
    if close < open:
      stack.push(')')
      backtrack(open, close+1)
      stack.pop()
  backtrack(0, 0)
  return result`,
    python: `def generateParenthesis(n: int):
    result = []
    stack = []
    def backtrack(open_count, close_count):
        if len(stack) == 2 * n:
            result.append(''.join(stack))
            return
        if open_count < n:
            stack.append('(')
            backtrack(open_count + 1, close_count)
            stack.pop()
        if close_count < open_count:
            stack.append(')')
            backtrack(open_count, close_count + 1)
            stack.pop()
    backtrack(0, 0)
    return result`,
    javascript: `function generateParenthesis(n) {
  const result = [];
  const stack = [];
  function backtrack(open, close) {
    if (stack.length === 2 * n) {
      result.push(stack.join(''));
      return;
    }
    if (open < n) {
      stack.push('(');
      backtrack(open + 1, close);
      stack.pop();
    }
    if (close < open) {
      stack.push(')');
      backtrack(open, close + 1);
      stack.pop();
    }
  }
  backtrack(0, 0);
  return result;
}`,
    java: `public List<String> generateParenthesis(int n) {
    List<String> result = new ArrayList<>();
    backtrack(result, new StringBuilder(), 0, 0, n);
    return result;
}
private void backtrack(List<String> result, StringBuilder cur, int open, int close, int n) {
    if (cur.length() == 2 * n) { result.add(cur.toString()); return; }
    if (open < n) { cur.append('('); backtrack(result, cur, open+1, close, n); cur.deleteCharAt(cur.length()-1); }
    if (close < open) { cur.append(')'); backtrack(result, cur, open, close+1, n); cur.deleteCharAt(cur.length()-1); }
}`,
  },
  defaultInput: { n: 3 },
  inputFields: [
    {
      name: 'n',
      label: 'n (pairs)',
      type: 'number',
      defaultValue: 3,
      placeholder: 'e.g. 3',
      helperText: 'Number of parenthesis pairs (1-4 recommended)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = Math.min(input.n as number, 4); // cap for visualization
    const steps: AlgorithmStep[] = [];
    const result: string[] = [];
    const stack: string[] = [];

    const makeViz = (currentIndex: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: [...stack],
      inputChars: result.length > 0 ? result : ['(building...)'],
      currentIndex: result.length > 0 ? result.length - 1 : 0,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Generate all valid parentheses for n=${n}. Use backtracking with a stack. Add "(" when open<${n}, add ")" when close<open.`,
      variables: { n, result: [], stack: [] },
      visualization: makeViz(-1, 'idle'),
    });

    function backtrack(open: number, close: number) {
      if (stack.length === 2 * n) {
        const combo = stack.join('');
        result.push(combo);
        steps.push({
          line: 4,
          explanation: `Complete combination found: "${combo}". Add to results. (${result.length} found so far).`,
          variables: { combo, open, close, resultCount: result.length },
          visualization: makeViz(result.length - 1, 'match'),
        });
        return;
      }

      if (open < n) {
        stack.push('(');
        steps.push({
          line: 8,
          explanation: `Push "(": open=${open + 1}/${n}, close=${close}/${n}. Current: "${stack.join('')}".`,
          variables: { open: open + 1, close, current: stack.join('') },
          visualization: makeViz(-1, 'push'),
        });
        backtrack(open + 1, close);
        stack.pop();
        steps.push({
          line: 10,
          explanation: `Backtrack: Pop "(". Back to "${stack.join('')}".`,
          variables: { open, close, current: stack.join('') },
          visualization: makeViz(-1, 'pop'),
        });
      }

      if (close < open) {
        stack.push(')');
        steps.push({
          line: 12,
          explanation: `Push ")": open=${open}/${n}, close=${close + 1}/${n}. Current: "${stack.join('')}".`,
          variables: { open, close: close + 1, current: stack.join('') },
          visualization: makeViz(-1, 'push'),
        });
        backtrack(open, close + 1);
        stack.pop();
        steps.push({
          line: 14,
          explanation: `Backtrack: Pop ")". Back to "${stack.join('')}".`,
          variables: { open, close, current: stack.join('') },
          visualization: makeViz(-1, 'pop'),
        });
      }
    }

    backtrack(0, 0);

    steps.push({
      line: 15,
      explanation: `All combinations generated: [${result.map(r => `"${r}"`).join(', ')}]. Total: ${result.length} valid combinations.`,
      variables: { result: [...result] },
      visualization: {
        type: 'stack',
        items: result,
        inputChars: result,
        currentIndex: result.length - 1,
        action: 'match',
      },
    });

    return steps;
  },
};

export default generateParentheses;

import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const generateParenthesesIi: AlgorithmDefinition = {
  id: 'generate-parentheses-ii',
  title: 'Generate Parentheses II (Pruning Variant)',
  leetcodeNumber: 22,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given n pairs of parentheses, generate all combinations of well-formed parentheses using backtracking with aggressive pruning. This variant tracks open and close counts explicitly, pruning branches where close count exceeds open or either count exceeds n.',
  tags: ['backtracking', 'string', 'recursion', 'pruning', 'parentheses'],

  code: {
    pseudocode: `function generateParentheses(n):
  result = []
  backtrack("", 0, 0, n, result)
  return result

function backtrack(current, open, close, n, result):
  if close > open or open > n or close > n: return (prune)
  if length(current) == 2*n:
    result.push(current)
    return
  backtrack(current + "(", open+1, close, n, result)
  backtrack(current + ")", open, close+1, n, result)`,

    python: `def generateParenthesis(n: int) -> list[str]:
    result = []
    def backtrack(current, open_count, close_count):
        if close_count > open_count or open_count > n or close_count > n:
            return
        if len(current) == 2 * n:
            result.append(current)
            return
        backtrack(current + '(', open_count + 1, close_count)
        backtrack(current + ')', open_count, close_count + 1)
    backtrack('', 0, 0)
    return result`,

    javascript: `function generateParenthesis(n) {
  const result = [];
  function backtrack(current, open, close) {
    if (close > open || open > n || close > n) return;
    if (current.length === 2 * n) {
      result.push(current);
      return;
    }
    backtrack(current + '(', open + 1, close);
    backtrack(current + ')', open, close + 1);
  }
  backtrack('', 0, 0);
  return result;
}`,

    java: `public List<String> generateParenthesis(int n) {
    List<String> result = new ArrayList<>();
    backtrack(result, "", 0, 0, n);
    return result;
}
private void backtrack(List<String> result, String current, int open, int close, int n) {
    if (close > open || open > n || close > n) return;
    if (current.length() == 2 * n) { result.add(current); return; }
    backtrack(result, current + "(", open + 1, close, n);
    backtrack(result, current + ")", open, close + 1, n);
}`,
  },

  defaultInput: {
    n: 3,
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Pairs (n)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of parenthesis pairs to generate',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const result: string[] = [];

    steps.push({
      line: 1,
      explanation: `Starting generate parentheses with n=${n}. Will use backtracking with pruning.`,
      variables: { n, result: [] },
      visualization: {
        type: 'array',
        array: [n],
        highlights: { 0: 'active' },
        labels: { 0: 'n' },
      },
    });

    function backtrack(current: string, open: number, close: number) {
      if (close > open || open > n || close > n) {
        steps.push({
          line: 6,
          explanation: `PRUNED: "${current}" - close(${close}) > open(${open}) or counts exceed n(${n}). Backtrack.`,
          variables: { current, open, close, pruned: true },
          visualization: {
            type: 'array',
            array: [open, close, n],
            highlights: { 0: 'mismatch', 1: 'mismatch', 2: 'default' },
            labels: { 0: 'open', 1: 'close', 2: 'n' },
          },
        });
        return;
      }

      if (current.length === 2 * n) {
        result.push(current);
        steps.push({
          line: 8,
          explanation: `Found valid combination: "${current}". Added to result (total: ${result.length}).`,
          variables: { current, open, close, totalFound: result.length },
          visualization: {
            type: 'array',
            array: [open, close, n],
            highlights: { 0: 'found', 1: 'found', 2: 'found' },
            labels: { 0: 'open', 1: 'close', 2: 'n' },
          },
        });
        return;
      }

      steps.push({
        line: 10,
        explanation: `Exploring from "${current || '(empty)'}" (open=${open}, close=${close}). Trying to add "(".`,
        variables: { current: current || '(empty)', open, close, length: current.length },
        visualization: {
          type: 'array',
          array: [open, close, n],
          highlights: { 0: 'active', 1: 'pointer', 2: 'default' },
          labels: { 0: 'open', 1: 'close', 2: 'n' },
        },
      });

      backtrack(current + '(', open + 1, close);
      backtrack(current + ')', open, close + 1);
    }

    backtrack('', 0, 0);

    steps.push({
      line: 3,
      explanation: `Backtracking complete. Generated ${result.length} valid parentheses combinations: [${result.map(s => `"${s}"`).join(', ')}]`,
      variables: { n, totalCombinations: result.length, result },
      visualization: {
        type: 'array',
        array: result.map((_, i) => i + 1),
        highlights: result.reduce((acc, _, i) => ({ ...acc, [i]: 'found' }), {}),
        labels: result.reduce((acc, s, i) => ({ ...acc, [i]: s }), {} as Record<number, string>),
      },
    });

    return steps;
  },
};

export default generateParenthesesIi;

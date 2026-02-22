import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const theKThLexicographicalString: AlgorithmDefinition = {
  id: 'the-k-th-lexicographical-string',
  title: 'The k-th Lexicographical String of All Happy Strings',
  leetcodeNumber: 1415,
  difficulty: 'Hard',
  category: 'Backtracking',
  description:
    'A happy string only uses characters a, b, c and no two consecutive characters are the same. Given n and k, find the k-th lexicographically smallest happy string of length n. Uses backtracking to generate happy strings in lexicographic order, stopping at the k-th one.',
  tags: ['backtracking', 'string', 'recursion', 'lexicographic order', 'counting'],

  code: {
    pseudocode: `function getHappyString(n, k):
  result = []
  backtrack("", n, k, result)
  return result[k-1] if exists else ""

function backtrack(current, n, k, result):
  if length(current) == n:
    result.push(current)
    return
  if length(result) >= k: return (early exit)
  for char in ['a', 'b', 'c']:
    if current is empty or current[-1] != char:
      backtrack(current + char, n, k, result)`,

    python: `def getHappyString(n: int, k: int) -> str:
    result = []
    def backtrack(current):
        if len(current) == n:
            result.append(current)
            return
        if len(result) >= k:
            return
        for ch in 'abc':
            if not current or current[-1] != ch:
                backtrack(current + ch)
    backtrack('')
    return result[k - 1] if len(result) >= k else ''`,

    javascript: `function getHappyString(n, k) {
  const result = [];
  function backtrack(current) {
    if (current.length === n) {
      result.push(current);
      return;
    }
    if (result.length >= k) return;
    for (const ch of 'abc') {
      if (!current || current[current.length - 1] !== ch) {
        backtrack(current + ch);
      }
    }
  }
  backtrack('');
  return result.length >= k ? result[k - 1] : '';
}`,

    java: `public String getHappyString(int n, int k) {
    List<String> result = new ArrayList<>();
    backtrack(result, new StringBuilder(), n, k);
    return result.size() >= k ? result.get(k - 1) : "";
}
private void backtrack(List<String> result, StringBuilder sb, int n, int k) {
    if (sb.length() == n) { result.add(sb.toString()); return; }
    if (result.size() >= k) return;
    for (char ch : new char[]{'a', 'b', 'c'}) {
        if (sb.length() == 0 || sb.charAt(sb.length() - 1) != ch) {
            sb.append(ch);
            backtrack(result, sb, n, k);
            sb.deleteCharAt(sb.length() - 1);
        }
    }
}`,
  },

  defaultInput: {
    n: 3,
    k: 9,
  },

  inputFields: [
    {
      name: 'n',
      label: 'String Length (n)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Length of each happy string',
    },
    {
      name: 'k',
      label: 'k-th String',
      type: 'number',
      defaultValue: 9,
      placeholder: '9',
      helperText: 'Find the k-th lexicographic happy string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const result: string[] = [];

    steps.push({
      line: 1,
      explanation: `Finding k=${k}th happy string of length n=${n}. Happy strings use only a,b,c with no consecutive duplicates.`,
      variables: { n, k },
      visualization: {
        type: 'array',
        array: [n, k],
        highlights: { 0: 'active', 1: 'active' },
        labels: { 0: 'n', 1: 'k' },
      },
    });

    function backtrack(current: string) {
      if (result.length >= k) return;

      if (current.length === n) {
        result.push(current);
        const isTarget = result.length === k;
        steps.push({
          line: 6,
          explanation: `Generated happy string #${result.length}: "${current}"${isTarget ? ' <- THIS IS THE ANSWER!' : ''}`,
          variables: { string: current, rank: result.length, isTarget },
          visualization: {
            type: 'array',
            array: current.split('').map((_, i) => i),
            highlights: current.split('').reduce((acc, _, i) => ({ ...acc, [i]: isTarget ? 'found' : 'sorted' }), {}),
            labels: current.split('').reduce((acc, c, i) => ({ ...acc, [i]: c }), {} as Record<number, string>),
          },
        });
        return;
      }

      for (const ch of ['a', 'b', 'c']) {
        if (result.length >= k) break;
        if (!current || current[current.length - 1] !== ch) {
          steps.push({
            line: 10,
            explanation: `Extend "${current || '(empty)'}" with "${ch}" -> "${current + ch}". Last char check: ok.`,
            variables: { current: current || '(empty)', adding: ch, depth: current.length + 1 },
            visualization: {
              type: 'array',
              array: (current + ch).split('').map((_, i) => i),
              highlights: { [current.length]: 'active' },
              labels: (current + ch).split('').reduce((acc, c, i) => ({ ...acc, [i]: c }), {} as Record<number, string>),
            },
          });
          backtrack(current + ch);
        } else {
          steps.push({
            line: 10,
            explanation: `Skip "${ch}" at position ${current.length}: same as last char "${current[current.length - 1]}". Would create consecutive duplicate.`,
            variables: { current, skipped: ch, reason: 'consecutive duplicate' },
            visualization: {
              type: 'array',
              array: current.split('').map((_, i) => i),
              highlights: { [current.length - 1]: 'mismatch' },
              labels: current.split('').reduce((acc, c, i) => ({ ...acc, [i]: c }), {} as Record<number, string>),
            },
          });
        }
      }
    }

    backtrack('');

    const answer = result.length >= k ? result[k - 1] : '';
    steps.push({
      line: 4,
      explanation: `Search complete. Generated ${result.length} happy strings. The ${k}th is: "${answer || 'NOT FOUND (k too large)'}"`,
      variables: { n, k, answer, totalGenerated: result.length },
      visualization: {
        type: 'array',
        array: result.map((_, i) => i + 1),
        highlights: result.reduce((acc, _, i) => ({ ...acc, [i]: i === k - 1 ? 'found' : 'sorted' }), {}),
        labels: result.reduce((acc, s, i) => ({ ...acc, [i]: s }), {} as Record<number, string>),
      },
    });

    return steps;
  },
};

export default theKThLexicographicalString;

import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const generateAllBinaryStrings: AlgorithmDefinition = {
  id: 'generate-all-binary-strings',
  title: 'Generate All Binary Strings of Length N',
  difficulty: 'Easy',
  category: 'Backtracking',
  description:
    'Generate all possible binary strings of length n using backtracking. At each position, try placing 0 or 1, then recurse. The total number of strings is 2^n. This is a foundational backtracking example showing how the technique works: choose, explore, unchoose.',
  tags: ['backtracking', 'string', 'recursion', 'binary', 'enumeration'],

  code: {
    pseudocode: `function generateBinaryStrings(n):
  result = []
  backtrack([], n, result)
  return result

function backtrack(current, n, result):
  if length(current) == n:
    result.push(join(current))
    return
  for bit in [0, 1]:
    current.push(bit)
    backtrack(current, n, result)
    current.pop()`,

    python: `def generateBinaryStrings(n: int) -> list[str]:
    result = []
    def backtrack(current):
        if len(current) == n:
            result.append(''.join(map(str, current)))
            return
        for bit in [0, 1]:
            current.append(bit)
            backtrack(current)
            current.pop()
    backtrack([])
    return result`,

    javascript: `function generateBinaryStrings(n) {
  const result = [];
  function backtrack(current) {
    if (current.length === n) {
      result.push(current.join(''));
      return;
    }
    for (const bit of [0, 1]) {
      current.push(bit);
      backtrack(current);
      current.pop();
    }
  }
  backtrack([]);
  return result;
}`,

    java: `public List<String> generateBinaryStrings(int n) {
    List<String> result = new ArrayList<>();
    backtrack(new int[n], 0, n, result);
    return result;
}
private void backtrack(int[] current, int pos, int n, List<String> result) {
    if (pos == n) {
        StringBuilder sb = new StringBuilder();
        for (int b : current) sb.append(b);
        result.add(sb.toString());
        return;
    }
    for (int bit = 0; bit <= 1; bit++) {
        current[pos] = bit;
        backtrack(current, pos + 1, n, result);
    }
}`,
  },

  defaultInput: {
    n: 3,
  },

  inputFields: [
    {
      name: 'n',
      label: 'String Length (n)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Length of each binary string (generates 2^n strings)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = Math.min(input.n as number, 4);
    const steps: AlgorithmStep[] = [];
    const result: string[] = [];
    const current: number[] = [];

    steps.push({
      line: 1,
      explanation: `Generating all binary strings of length ${n}. Total count will be 2^${n} = ${Math.pow(2, n)} strings. Starting backtracking.`,
      variables: { n, totalStrings: Math.pow(2, n) },
      visualization: {
        type: 'array',
        array: new Array(n).fill(-1),
        highlights: {},
        labels: new Array(n).fill(0).reduce((acc, _, i) => ({ ...acc, [i]: `pos${i}` }), {} as Record<number, string>),
      },
    });

    function backtrack() {
      if (current.length === n) {
        const str = current.join('');
        result.push(str);

        steps.push({
          line: 7,
          explanation: `Complete string: "${str}". Total generated: ${result.length} of ${Math.pow(2, n)}.`,
          variables: { string: str, total: result.length, remaining: Math.pow(2, n) - result.length },
          visualization: {
            type: 'array',
            array: [...current],
            highlights: current.reduce((acc, _, i) => ({ ...acc, [i]: 'found' }), {}),
            labels: current.reduce((acc, v, i) => ({ ...acc, [i]: `${v}` }), {} as Record<number, string>),
          },
        });
        return;
      }

      const pos = current.length;

      for (const bit of [0, 1]) {
        current.push(bit);

        steps.push({
          line: 10,
          explanation: `Position ${pos}: place bit ${bit}. Current prefix: "${current.join('')}"`,
          variables: { position: pos, bit, prefix: current.join(''), depth: current.length },
          visualization: {
            type: 'array',
            array: [...current, ...new Array(n - current.length).fill(-1)],
            highlights: { [pos]: 'active' },
            labels: current.reduce((acc, v, i) => ({ ...acc, [i]: `${v}` }), {
              ...new Array(n - current.length).fill(0).reduce((acc, _, i) => ({
                ...acc, [current.length + i]: '?',
              }), {}),
            } as Record<number, string>),
          },
        });

        backtrack();
        current.pop();

        steps.push({
          line: 12,
          explanation: `Backtrack at position ${pos}: remove bit ${bit}. Try ${bit === 0 ? '1' : 'done at this level'}.`,
          variables: { position: pos, removedBit: bit, currentLength: current.length },
          visualization: {
            type: 'array',
            array: [...current, ...new Array(n - current.length).fill(-1)],
            highlights: current.length > 0 ? { [current.length - 1]: 'comparing' } : {},
            labels: current.reduce((acc, v, i) => ({ ...acc, [i]: `${v}` }), {} as Record<number, string>),
          },
        });
      }
    }

    backtrack();

    steps.push({
      line: 4,
      explanation: `All ${result.length} binary strings generated: [${result.map(s => `"${s}"`).join(', ')}]`,
      variables: { total: result.length, strings: result },
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

export default generateAllBinaryStrings;

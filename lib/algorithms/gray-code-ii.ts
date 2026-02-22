import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const grayCodeII: AlgorithmDefinition = {
  id: 'gray-code-ii',
  title: 'Gray Code',
  leetcodeNumber: 89,
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  description:
    'Given n, return the n-bit Gray code sequence: a list of 2^n integers where each consecutive pair differs by exactly one bit. Formula: gray(i) = i XOR (i >> 1). This directly converts a binary index to its Gray code without iterative construction.',
  tags: ['bit manipulation', 'math'],

  code: {
    pseudocode: `function grayCode(n):
  result = []
  for i in 0..2^n - 1:
    result.append(i XOR (i >> 1))
  return result`,

    python: `def grayCode(n: int) -> list[int]:
    return [i ^ (i >> 1) for i in range(1 << n)]`,

    javascript: `function grayCode(n) {
  const result = [];
  for (let i = 0; i < (1 << n); i++) result.push(i ^ (i >> 1));
  return result;
}`,

    java: `public List<Integer> grayCode(int n) {
    List<Integer> result = new ArrayList<>();
    for (int i = 0; i < (1 << n); i++) result.add(i ^ (i >> 1));
    return result;
}`,
  },

  defaultInput: { n: 3 },
  inputFields: [
    {
      name: 'n',
      label: 'n',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Generate n-bit Gray code sequence (2^n numbers)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const total = 1 << n;
    const result: number[] = [];

    const makeViz = (
      arr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>,
      extra: { key: string; value: string }[]
    ): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
      auxData: { label: 'Gray Code', entries: extra },
    });

    steps.push({
      line: 1,
      explanation: `n=${n}: generate ${total} Gray codes. Formula: gray(i) = i XOR (i >> 1). Consecutive codes differ by exactly one bit.`,
      variables: { n, total },
      visualization: makeViz(
        Array.from({ length: Math.min(total, 8) }, (_, i) => i),
        Object.fromEntries(Array.from({ length: Math.min(total, 8) }, (_, i) => [i, 'active'])),
        Object.fromEntries(Array.from({ length: Math.min(total, 8) }, (_, i) => [i, `i=${i}`])),
        [{ key: 'total codes', value: String(total) }]
      ),
    });

    for (let i = 0; i < Math.min(total, 8); i++) {
      const gray = i ^ (i >> 1);
      result.push(gray);
      const prevGray = i > 0 ? result[i - 1] : -1;
      const diff = i > 0 ? (prevGray ^ gray).toString(2) : 'N/A';
      steps.push({
        line: 3,
        explanation: `i=${i}: gray(${i}) = ${i} XOR ${i >> 1} = ${gray} (${gray.toString(2).padStart(n, '0')}). ${i > 0 ? `Differs from previous ${prevGray} by bit: ${diff}` : 'First code.'}`,
        variables: { i, 'i>>1': i >> 1, gray, grayBin: gray.toString(2).padStart(n, '0') },
        visualization: makeViz(
          [...result],
          Object.fromEntries(result.map((_, j) => [j, j === i ? 'active' : 'found'])),
          Object.fromEntries(result.map((v, j) => [j, v.toString(2).padStart(n, '0')])),
          [
            { key: `gray(${i})`, value: `${gray} (${gray.toString(2).padStart(n, '0')})` },
            { key: 'bits different', value: i > 0 ? diff : 'start' },
          ]
        ),
      });
    }

    if (total > 8) {
      // Show full result
      const fullResult = Array.from({ length: total }, (_, i) => i ^ (i >> 1));
      steps.push({
        line: 4,
        explanation: `Full Gray code sequence for n=${n}: [${fullResult.join(', ')}].`,
        variables: { result: fullResult },
        visualization: makeViz(
          fullResult.slice(0, 8),
          Object.fromEntries(fullResult.slice(0, 8).map((_, i) => [i, 'found'])),
          Object.fromEntries(fullResult.slice(0, 8).map((v, i) => [i, v.toString(2).padStart(n, '0')])),
          [{ key: 'full result', value: `[${fullResult.join(', ')}]` }]
        ),
      });
    }

    return steps;
  },
};

export default grayCodeII;

import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOf1BitsII: AlgorithmDefinition = {
  id: 'number-of-1-bits-ii',
  title: 'Number of 1 Bits (Hamming Weight)',
  leetcodeNumber: 191,
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  description:
    'Count the number of set bits (1s) in the binary representation of a positive integer (Hamming weight). Use Brian Kernighan\'s algorithm: n & (n-1) clears the lowest set bit. Count how many times we can do this before n becomes 0.',
  tags: ['bit manipulation'],

  code: {
    pseudocode: `function hammingWeight(n):
  count = 0
  while n != 0:
    n = n AND (n - 1)  // clear lowest set bit
    count++
  return count`,

    python: `def hammingWeight(n: int) -> int:
    count = 0
    while n:
        n &= n - 1
        count += 1
    return count`,

    javascript: `function hammingWeight(n) {
  let count = 0;
  while (n) { n &= n - 1; count++; }
  return count;
}`,

    java: `public int hammingWeight(int n) {
    int count = 0;
    while (n != 0) { n &= n - 1; count++; }
    return count;
}`,
  },

  defaultInput: { n: 11 },
  inputFields: [
    {
      name: 'n',
      label: 'Number n',
      type: 'number',
      defaultValue: 11,
      placeholder: '11',
      helperText: 'Positive integer whose Hamming weight (number of 1 bits) to count',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const origN = input.n as number;
    const steps: AlgorithmStep[] = [];
    const bitLen = Math.max(origN.toString(2).length, 4);
    const toBits = (v: number) => v.toString(2).padStart(bitLen, '0').split('').map(Number);

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
      auxData: { label: 'Hamming Weight', entries: extra },
    });

    steps.push({
      line: 1,
      explanation: `n=${origN} in binary: ${origN.toString(2).padStart(bitLen, '0')}. Brian Kernighan's algorithm: n & (n-1) removes the lowest set bit each iteration.`,
      variables: { n: origN, binary: origN.toString(2) },
      visualization: makeViz(
        toBits(origN),
        Object.fromEntries(toBits(origN).map((b, i) => [i, b === 1 ? 'active' : 'visited'])),
        Object.fromEntries(toBits(origN).map((b, i) => [i, String(b)])),
        [{ key: 'n', value: `${origN} (${origN.toString(2).padStart(bitLen, '0')})` }]
      ),
    });

    let n = origN;
    let count = 0;

    while (n !== 0) {
      const lowestBit = n & (-n);
      const prev = n;
      n &= n - 1;
      count++;

      steps.push({
        line: 3,
        explanation: `n & (n-1) = ${prev} & ${prev - 1} = ${n}. Cleared lowest set bit (was ${lowestBit.toString(2)}). count=${count}.`,
        variables: { prev, 'n&(n-1)': n, lowestBitCleared: lowestBit, count },
        visualization: makeViz(
          toBits(n),
          Object.fromEntries(toBits(n).map((b, i) => [i, b === 1 ? 'active' : 'visited'])),
          Object.fromEntries(toBits(n).map((b, i) => [i, String(b)])),
          [
            { key: 'after n&(n-1)', value: `${n} (${n.toString(2).padStart(bitLen, '0')})` },
            { key: 'count', value: String(count) },
          ]
        ),
      });
    }

    steps.push({
      line: 5,
      explanation: `n=0, done. Hamming weight of ${origN} (${origN.toString(2)}) is ${count}.`,
      variables: { result: count },
      visualization: makeViz(
        [count],
        { 0: 'found' },
        { 0: 'count' },
        [{ key: 'hammingWeight', value: String(count) }]
      ),
    });

    return steps;
  },
};

export default numberOf1BitsII;

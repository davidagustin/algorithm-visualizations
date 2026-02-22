import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const binaryNumberWithAlternatingBits: AlgorithmDefinition = {
  id: 'binary-number-with-alternating-bits',
  title: 'Binary Number with Alternating Bits',
  leetcodeNumber: 693,
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  description:
    'Given a positive integer n, check if it has alternating bits (adjacent bits are always different). XOR n with (n >> 1): the result should be all 1s. Check that result & (result + 1) == 0, which is true only when result is a sequence of all 1s (like 0111...1).',
  tags: ['bit manipulation'],

  code: {
    pseudocode: `function hasAlternatingBits(n):
  m = n XOR (n >> 1)
  // m should be all 1s (like 0111)
  return (m & (m + 1)) == 0`,

    python: `def hasAlternatingBits(n: int) -> bool:
    m = n ^ (n >> 1)
    return (m & (m + 1)) == 0`,

    javascript: `function hasAlternatingBits(n) {
  const m = n ^ (n >> 1);
  return (m & (m + 1)) === 0;
}`,

    java: `public boolean hasAlternatingBits(int n) {
    int m = n ^ (n >> 1);
    return (m & (m + 1)) == 0;
}`,
  },

  defaultInput: { n: 5 },
  inputFields: [
    {
      name: 'n',
      label: 'Number n',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Check if n has alternating bits (e.g., 5=101, 10=1010)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const bitLen = Math.max(n.toString(2).length + 1, 4);
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
      auxData: { label: 'Alternating Bits', entries: extra },
    });

    const nBits = toBits(n);
    steps.push({
      line: 1,
      explanation: `n=${n} in binary: ${n.toString(2).padStart(bitLen, '0')}. Alternating bits means adjacent bits always differ (like 101, 1010, etc.).`,
      variables: { n, binary: n.toString(2) },
      visualization: makeViz(
        nBits,
        Object.fromEntries(nBits.map((b, i) => [i, b === 1 ? 'active' : 'visited'])),
        Object.fromEntries(nBits.map((b, i) => [i, String(b)])),
        [{ key: 'n', value: `${n} (${n.toString(2)})` }]
      ),
    });

    const m = n ^ (n >> 1);
    const mBits = toBits(m);
    steps.push({
      line: 2,
      explanation: `m = n XOR (n >> 1) = ${n} XOR ${n >> 1} = ${m} (${m.toString(2).padStart(bitLen, '0')}). If n has alternating bits, adjacent XOR is always 1, so m = all 1s.`,
      variables: { n, 'n>>1': n >> 1, m, mBin: m.toString(2) },
      visualization: makeViz(
        mBits,
        Object.fromEntries(mBits.map((b, i) => [i, b === 1 ? 'comparing' : 'mismatch'])),
        Object.fromEntries(mBits.map((b, i) => [i, String(b)])),
        [
          { key: 'n >> 1', value: `${n >> 1} (${(n >> 1).toString(2).padStart(bitLen, '0')})` },
          { key: 'm = n^(n>>1)', value: `${m} (${m.toString(2).padStart(bitLen, '0')})` },
        ]
      ),
    });

    const check = (m & (m + 1)) === 0;
    const mAndMp1 = m & (m + 1);
    steps.push({
      line: 4,
      explanation: `m & (m+1) = ${m} & ${m + 1} = ${mAndMp1}. ${check ? 'm is all 1s, so n HAS alternating bits!' : 'm is not all 1s, so n does NOT have alternating bits.'}`,
      variables: { m, 'm+1': m + 1, 'm&(m+1)': mAndMp1, result: check },
      visualization: makeViz(
        mBits,
        Object.fromEntries(mBits.map((_, i) => [i, check ? 'found' : 'mismatch'])),
        Object.fromEntries(mBits.map((b, i) => [i, String(b)])),
        [
          { key: 'm & (m+1)', value: `${mAndMp1} (${mAndMp1.toString(2)})` },
          { key: 'hasAlternatingBits', value: String(check) },
        ]
      ),
    });

    return steps;
  },
};

export default binaryNumberWithAlternatingBits;

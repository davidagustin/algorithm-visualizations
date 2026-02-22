import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const powerOfTwo: AlgorithmDefinition = {
  id: 'power-of-two',
  title: 'Power of Two',
  leetcodeNumber: 231,
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  description:
    'Check if an integer n is a power of 2 using bit manipulation. A power of 2 has exactly one 1-bit. The trick: n & (n-1) clears the lowest set bit. If n > 0 and n & (n-1) == 0, then n has exactly one set bit, so it is a power of 2.',
  tags: ['Bit Manipulation', 'Math'],
  code: {
    pseudocode: `function isPowerOfTwo(n):
  if n <= 0: return false
  return (n AND (n - 1)) == 0
  // Powers of 2: 1(001), 2(010), 4(100), 8(1000)
  // n & n-1 clears lowest bit:
  // 4(100) & 3(011) = 0 → power of 2
  // 6(110) & 5(101) = 4 → not power of 2`,
    python: `def isPowerOfTwo(n: int) -> bool:
    return n > 0 and (n & (n - 1)) == 0`,
    javascript: `function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}`,
    java: `public boolean isPowerOfTwo(int n) {
    return n > 0 && (n & (n - 1)) == 0;
}`,
  },
  defaultInput: { n: 16 },
  inputFields: [
    {
      name: 'n',
      label: 'Integer n',
      type: 'number',
      defaultValue: 16,
      placeholder: '16',
      helperText: 'Integer to check (try 16, 6, 0, -1)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const NUM_BITS = 16;

    const toBitArray = (val: number): number[] => {
      const bits: number[] = [];
      for (let i = NUM_BITS - 1; i >= 0; i--) bits.push((val >> i) & 1);
      return bits;
    };

    const makeLabels = (): Record<number, string> => {
      const labels: Record<number, string> = {};
      for (let i = 0; i < NUM_BITS; i++) labels[i] = String(NUM_BITS - 1 - i);
      return labels;
    };

    const makeViz = (
      val: number,
      highlights: Record<number, string>,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: toBitArray(val),
      highlights,
      labels: makeLabels(),
      auxData: { label: 'Power of 2 Check', entries: auxEntries },
    });

    const nBits = toBitArray(n);
    const nHl: Record<number, string> = {};
    nBits.forEach((b, i) => { nHl[i] = b ? 'active' : 'default'; });
    const oneBitsCount = nBits.filter(b => b === 1).length;

    steps.push({
      line: 1,
      explanation: `Check if n = ${n} is a power of 2. Binary: ${n.toString(2).padStart(NUM_BITS, '0')}. Powers of 2 have exactly ONE 1-bit. n has ${oneBitsCount} one-bit(s).`,
      variables: { n, binary: n.toString(2).padStart(NUM_BITS, '0') },
      visualization: makeViz(n, nHl, [
        { key: 'n', value: `${n} (${n.toString(2).padStart(NUM_BITS, '0')})` },
        { key: '1-bits count', value: String(oneBitsCount) },
      ]),
    });

    if (n <= 0) {
      const falseHl: Record<number, string> = {};
      nBits.forEach((_, i) => { falseHl[i] = 'mismatch'; });
      steps.push({
        line: 2,
        explanation: `n = ${n} <= 0. Powers of 2 are strictly positive. Return false.`,
        variables: { result: false },
        visualization: makeViz(n, falseHl, [
          { key: 'n <= 0', value: 'true' },
          { key: 'isPowerOfTwo', value: 'false' },
        ]),
      });
      return steps;
    }

    const nMinus1 = n - 1;
    const andResult = n & nMinus1;
    const nMinus1Bits = toBitArray(nMinus1);
    const andBits = toBitArray(andResult);

    const nMinus1Hl: Record<number, string> = {};
    nMinus1Bits.forEach((b, i) => { nMinus1Hl[i] = b ? 'comparing' : 'default'; });

    steps.push({
      line: 3,
      explanation: `Compute n-1 = ${nMinus1} (binary: ${nMinus1.toString(2).padStart(NUM_BITS, '0')}). For powers of 2: n and n-1 have no overlapping bits. n-1 flips the single 1-bit and sets all lower bits.`,
      variables: { nMinus1, binary: nMinus1.toString(2).padStart(NUM_BITS, '0') },
      visualization: makeViz(nMinus1, nMinus1Hl, [
        { key: 'n', value: `${n} (${n.toString(2).padStart(NUM_BITS, '0')})` },
        { key: 'n - 1', value: `${nMinus1} (${nMinus1.toString(2).padStart(NUM_BITS, '0')})` },
      ]),
    });

    const andHl: Record<number, string> = {};
    andBits.forEach((b, i) => { andHl[i] = b ? 'swapping' : 'found'; });
    const isPower = andResult === 0;

    steps.push({
      line: 3,
      explanation: `n & (n-1) = ${n} & ${nMinus1} = ${andResult} (binary: ${andResult.toString(2).padStart(NUM_BITS, '0')}). ${isPower ? 'Result is 0 → exactly one 1-bit → IS a power of 2!' : 'Result is nonzero → multiple 1-bits → NOT a power of 2.'}`,
      variables: { andResult, isPower },
      visualization: makeViz(andResult, andHl, [
        { key: 'n', value: `${n} (${n.toString(2).padStart(NUM_BITS, '0')})` },
        { key: 'n & (n-1)', value: `${andResult} (${andResult.toString(2).padStart(NUM_BITS, '0')})` },
        { key: 'isPowerOfTwo', value: String(isPower) },
      ]),
    });

    const finalHl: Record<number, string> = {};
    andBits.forEach((_, i) => { finalHl[i] = isPower ? 'found' : 'mismatch'; });

    steps.push({
      line: 3,
      explanation: `Done! n = ${n} ${isPower ? 'IS' : 'is NOT'} a power of 2. Return ${isPower}.`,
      variables: { result: isPower },
      visualization: makeViz(andResult, finalHl, [
        { key: 'isPowerOfTwo(n)', value: String(isPower) },
        { key: 'n & (n-1) == 0', value: String(isPower) },
      ]),
    });

    return steps;
  },
};

export default powerOfTwo;

import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const powerOfFourII: AlgorithmDefinition = {
  id: 'power-of-four-ii',
  title: 'Power of Four',
  leetcodeNumber: 342,
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  description:
    'Given an integer n, return true if it is a power of four. Powers of four are powers of two whose single set bit is at an even position (0, 2, 4, ...). Use the mask 0x55555555 which has 1s at even bit positions. Check: n > 0, n & (n-1) == 0 (power of two), and n & 0x55555555 != 0 (bit at even position).',
  tags: ['bit manipulation', 'math'],

  code: {
    pseudocode: `function isPowerOfFour(n):
  mask = 0x55555555  // bits at even positions
  return n > 0 and (n & (n-1)) == 0 and (n & mask) != 0`,

    python: `def isPowerOfFour(n: int) -> bool:
    mask = 0x55555555
    return n > 0 and (n & (n - 1)) == 0 and (n & mask) != 0`,

    javascript: `function isPowerOfFour(n) {
  const mask = 0x55555555;
  return n > 0 && (n & (n - 1)) === 0 && (n & mask) !== 0;
}`,

    java: `public boolean isPowerOfFour(int n) {
    int mask = 0x55555555;
    return n > 0 && (n & (n - 1)) == 0 && (n & mask) != 0;
}`,
  },

  defaultInput: { n: 16 },
  inputFields: [
    {
      name: 'n',
      label: 'Number n',
      type: 'number',
      defaultValue: 16,
      placeholder: '16',
      helperText: 'Integer to check if it is a power of four',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const mask = 0x55555555;

    const bits8 = (v: number) => v.toString(2).padStart(8, '0').split('').map(Number);
    const nBits = bits8(n > 0 ? n : 0);

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
      auxData: { label: 'Power of Four Check', entries: extra },
    });

    steps.push({
      line: 1,
      explanation: `n=${n} in binary: ${n.toString(2)}. Powers of four: 1,4,16,64,... have exactly one set bit at an even position (bit 0, 2, 4, ...).`,
      variables: { n, binary: n.toString(2) },
      visualization: makeViz(
        nBits,
        Object.fromEntries(nBits.map((b, i) => [i, b === 1 ? 'active' : 'visited'])),
        Object.fromEntries(nBits.map((_, i) => [i, `b${7 - i}`])),
        [{ key: 'n', value: `${n} (${n.toString(2)})` }]
      ),
    });

    const check1 = n > 0;
    steps.push({
      line: 2,
      explanation: `Check 1: n > 0? ${check1}. ${check1 ? 'Pass.' : 'Fail - return false.'}`,
      variables: { n, 'n > 0': check1 },
      visualization: makeViz(
        [n],
        { 0: check1 ? 'found' : 'mismatch' },
        { 0: check1 ? '>0' : '<=0' },
        [{ key: 'n > 0', value: String(check1) }]
      ),
    });

    if (!check1) return steps;

    const check2 = (n & (n - 1)) === 0;
    steps.push({
      line: 3,
      explanation: `Check 2: power of two? n & (n-1) = ${n} & ${n - 1} = ${n & (n - 1)}. ${check2 ? 'Is a power of two.' : 'Not a power of two - return false.'}`,
      variables: { 'n&(n-1)': n & (n - 1), isPowerOfTwo: check2 },
      visualization: makeViz(
        bits8(n & (n - 1)),
        Object.fromEntries(bits8(n & (n - 1)).map((_, i) => [i, check2 ? 'found' : 'mismatch'])),
        Object.fromEntries(bits8(n & (n - 1)).map((_, i) => [i, `b${7 - i}`])),
        [
          { key: 'n & (n-1)', value: `${n & (n - 1)} (${(n & (n - 1)).toString(2)})` },
          { key: 'isPowerOfTwo', value: String(check2) },
        ]
      ),
    });

    if (!check2) return steps;

    const maskedVal = n & mask;
    const check3 = maskedVal !== 0;
    steps.push({
      line: 4,
      explanation: `Check 3: bit at even position? mask=0x55555555 (${(mask & 0xff).toString(2)}...). n & mask = ${maskedVal}. ${check3 ? 'Set bit is at even position - IS power of four!' : 'Set bit at odd position - NOT power of four.'}`,
      variables: { mask: `0x55555555`, 'n&mask': maskedVal, isPowerOfFour: check3 },
      visualization: makeViz(
        bits8(maskedVal),
        Object.fromEntries(bits8(maskedVal).map((_, i) => [i, check3 ? 'found' : 'mismatch'])),
        Object.fromEntries(bits8(maskedVal).map((_, i) => [i, `b${7 - i}`])),
        [
          { key: 'mask', value: '0x55555555 (even bits)' },
          { key: 'n & mask', value: `${maskedVal} (${maskedVal.toString(2)})` },
          { key: 'isPowerOfFour', value: String(check3) },
        ]
      ),
    });

    return steps;
  },
};

export default powerOfFourII;

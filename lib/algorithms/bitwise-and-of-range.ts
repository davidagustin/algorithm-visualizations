import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const bitwiseAndOfRange: AlgorithmDefinition = {
  id: 'bitwise-and-of-range',
  title: 'Bitwise AND of Numbers Range',
  leetcodeNumber: 201,
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  description:
    'Find the bitwise AND of all numbers in the range [m, n]. Key insight: any bit that differs between m and n will become 0 in the AND result (because some number in the range will have it as 0). Find the common prefix of m and n in binary by right-shifting both until they are equal, then shift back left.',
  tags: ['Bit Manipulation', 'Math'],
  code: {
    pseudocode: `function rangeBitwiseAnd(m, n):
  shift = 0
  while m != n:
    m = m >> 1
    n = n >> 1
    shift++
  return m << shift
  // Common prefix of m and n is preserved
  // All differing suffix bits become 0`,
    python: `def rangeBitwiseAnd(m: int, n: int) -> int:
    shift = 0
    while m != n:
        m >>= 1
        n >>= 1
        shift += 1
    return m << shift`,
    javascript: `function rangeBitwiseAnd(m, n) {
  let shift = 0;
  while (m !== n) {
    m >>= 1;
    n >>= 1;
    shift++;
  }
  return m << shift;
}`,
    java: `public int rangeBitwiseAnd(int m, int n) {
    int shift = 0;
    while (m != n) {
        m >>= 1;
        n >>= 1;
        shift++;
    }
    return m << shift;
}`,
  },
  defaultInput: { m: 5, n: 7 },
  inputFields: [
    {
      name: 'm',
      label: 'Range Start m',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Start of range (0 <= m <= n)',
    },
    {
      name: 'n',
      label: 'Range End n',
      type: 'number',
      defaultValue: 7,
      placeholder: '7',
      helperText: 'End of range',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const m = input.m as number;
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const NUM_BITS = 16;

    const toBitArray = (val: number): number[] => {
      const bits: number[] = [];
      for (let i = NUM_BITS - 1; i >= 0; i--) bits.push((val >> i) & 1);
      return bits;
    };

    const makeViz = (
      mVal: number,
      nVal: number,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization => {
      // Show m bits, highlight differences with n
      const mBits = toBitArray(mVal);
      const nBits = toBitArray(nVal);
      const hl: Record<number, string> = {};
      mBits.forEach((b, i) => {
        if (mBits[i] === nBits[i]) {
          hl[i] = b ? 'found' : 'visited';
        } else {
          hl[i] = 'swapping';
        }
      });
      return {
        type: 'array',
        array: mBits,
        highlights: hl,
        auxData: { label: 'Range AND State', entries: auxEntries },
      };
    };

    steps.push({
      line: 1,
      explanation: `Compute bitwise AND of all numbers in [${m}, ${n}]. m=${m} (${m.toString(2).padStart(NUM_BITS,'0')}), n=${n} (${n.toString(2).padStart(NUM_BITS,'0')}). Find common binary prefix.`,
      variables: { m, n },
      visualization: makeViz(m, n, [
        { key: 'm', value: `${m} (${m.toString(2).padStart(NUM_BITS,'0')})` },
        { key: 'n', value: `${n} (${n.toString(2).padStart(NUM_BITS,'0')})` },
        { key: 'shift', value: '0' },
      ]),
    });

    let cm = m;
    let cn = n;
    let shift = 0;

    while (cm !== cn) {
      const prevM = cm;
      const prevN = cn;
      cm >>= 1;
      cn >>= 1;
      shift++;

      steps.push({
        line: 3,
        explanation: `m(${prevM}) != n(${prevN}). Right shift both: m=${cm} (${cm.toString(2).padStart(NUM_BITS,'0')}), n=${cn} (${cn.toString(2).padStart(NUM_BITS,'0')}). shift=${shift}. Eliminated differing suffix bits.`,
        variables: { m: cm, n: cn, shift },
        visualization: makeViz(cm, cn, [
          { key: 'm (shifted)', value: `${cm} (${cm.toString(2).padStart(NUM_BITS,'0')})` },
          { key: 'n (shifted)', value: `${cn} (${cn.toString(2).padStart(NUM_BITS,'0')})` },
          { key: 'shift count', value: String(shift) },
        ]),
      });
    }

    const result = cm << shift;
    const resultBits = toBitArray(result);
    const resultHl: Record<number, string> = {};
    resultBits.forEach((b, i) => { resultHl[i] = b ? 'found' : 'visited'; });

    steps.push({
      line: 5,
      explanation: `m == n == ${cm}. Common prefix found. Shift back left by ${shift}: result = ${cm} << ${shift} = ${result} (${result.toString(2).padStart(NUM_BITS,'0')}).`,
      variables: { commonPrefix: cm, shift, result },
      visualization: {
        type: 'array',
        array: resultBits,
        highlights: resultHl,
        auxData: {
          label: 'Result',
          entries: [
            { key: 'common prefix', value: `${cm} (${cm.toString(2).padStart(NUM_BITS,'0')})` },
            { key: 'shift back', value: String(shift) },
            { key: 'result', value: `${result} (${result.toString(2).padStart(NUM_BITS,'0')})` },
            { key: 'range AND([m..n])', value: String(result) },
          ],
        },
      },
    });

    return steps;
  },
};

export default bitwiseAndOfRange;

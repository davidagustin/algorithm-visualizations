import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const reverseBitsII: AlgorithmDefinition = {
  id: 'reverse-bits-ii',
  title: 'Reverse Bits',
  leetcodeNumber: 190,
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  description:
    'Reverse the bits of a 32-bit unsigned integer. Process each bit from LSB to MSB: extract the lowest bit of n (n & 1), shift it into the result from the MSB side (result |= bit << (31 - i)), then shift n right.',
  tags: ['bit manipulation'],

  code: {
    pseudocode: `function reverseBits(n):
  result = 0
  for i in 0..31:
    result = (result << 1) | (n & 1)
    n >>= 1
  return result`,

    python: `def reverseBits(n: int) -> int:
    result = 0
    for _ in range(32):
        result = (result << 1) | (n & 1)
        n >>= 1
    return result`,

    javascript: `function reverseBits(n) {
  let result = 0;
  for (let i = 0; i < 32; i++) {
    result = (result * 2) | (n & 1);
    n >>>= 1;
  }
  return result >>> 0;
}`,

    java: `public int reverseBits(int n) {
    int result = 0;
    for (int i = 0; i < 32; i++) {
        result = (result << 1) | (n & 1);
        n >>>= 1;
    }
    return result;
}`,
  },

  defaultInput: { n: 43261596 },
  inputFields: [
    {
      name: 'n',
      label: 'Number n',
      type: 'number',
      defaultValue: 43261596,
      placeholder: '43261596',
      helperText: '32-bit unsigned integer to reverse bits of (e.g. 43261596 = 00000010100101000001111010011100)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const origN = input.n as number;
    const steps: AlgorithmStep[] = [];

    // Show only 8 bits for visualization
    const SHOW_BITS = 8;
    const toBits8 = (v: number) => ((v >>> 0).toString(2).padStart(SHOW_BITS, '0')).slice(-SHOW_BITS).split('').map(Number);

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
      auxData: { label: 'Reverse Bits', entries: extra },
    });

    steps.push({
      line: 1,
      explanation: `n=${origN} (binary 32-bit: ${(origN >>> 0).toString(2).padStart(32, '0')}). We reverse all 32 bits.`,
      variables: { n: origN, binary32: (origN >>> 0).toString(2).padStart(32, '0') },
      visualization: makeViz(
        toBits8(origN),
        Object.fromEntries(toBits8(origN).map((b, i) => [i, b === 1 ? 'active' : 'visited'])),
        Object.fromEntries(Array.from({ length: SHOW_BITS }, (_, i) => [i, `b${SHOW_BITS - 1 - i}`])),
        [
          { key: 'n (lower 8)', value: `${(origN & 0xff).toString(2).padStart(8, '0')}` },
          { key: 'n (full 32)', value: `${(origN >>> 0).toString(2).padStart(32, '0')}` },
        ]
      ),
    });

    let n = origN;
    let result = 0;
    // Show first 8 iterations
    for (let i = 0; i < Math.min(8, 32); i++) {
      const bit = n & 1;
      result = ((result << 1) | bit) >>> 0;
      n >>>= 1;
      steps.push({
        line: 3,
        explanation: `Iteration ${i}: extracted bit=${bit}. result = (result<<1)|${bit} = ${result} (${(result >>> 0).toString(2).padStart(SHOW_BITS, '0')} lower 8 bits).`,
        variables: { iteration: i, bit, 'result (lower 8)': (result & 0xff).toString(2).padStart(8, '0') },
        visualization: makeViz(
          toBits8(result),
          Object.fromEntries(toBits8(result).map((b, j) => [j, j === 0 ? 'active' : b === 1 ? 'comparing' : 'visited'])),
          Object.fromEntries(Array.from({ length: SHOW_BITS }, (_, j) => [j, `b${SHOW_BITS - 1 - j}`])),
          [
            { key: 'bit extracted', value: String(bit) },
            { key: 'result so far', value: `...${(result >>> 0).toString(2).padStart(SHOW_BITS, '0')}` },
          ]
        ),
      });
    }

    // Compute full result
    let fullResult = origN;
    let res32 = 0;
    for (let i = 0; i < 32; i++) {
      res32 = ((res32 << 1) | (fullResult & 1)) >>> 0;
      fullResult >>>= 1;
    }

    steps.push({
      line: 5,
      explanation: `After processing all 32 bits: result = ${res32} (binary: ${(res32 >>> 0).toString(2).padStart(32, '0')}).`,
      variables: { result: res32, binary32: (res32 >>> 0).toString(2).padStart(32, '0') },
      visualization: makeViz(
        toBits8(res32),
        Object.fromEntries(toBits8(res32).map((b, i) => [i, b === 1 ? 'found' : 'visited'])),
        Object.fromEntries(Array.from({ length: SHOW_BITS }, (_, i) => [i, `b${SHOW_BITS - 1 - i}`])),
        [
          { key: 'reversed result', value: `${res32}` },
          { key: 'binary (32)', value: `${(res32 >>> 0).toString(2).padStart(32, '0')}` },
        ]
      ),
    });

    return steps;
  },
};

export default reverseBitsII;

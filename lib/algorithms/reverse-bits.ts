import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const reverseBits: AlgorithmDefinition = {
  id: 'reverse-bits',
  title: 'Reverse Bits',
  leetcodeNumber: 190,
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  description:
    'Reverse the bits of a 32-bit unsigned integer. Iterate 32 times: shift result left by 1, take the LSB of n with n & 1, add it to result, then shift n right by 1. After 32 iterations the bits are fully reversed.',
  tags: ['Bit Manipulation', 'Math'],
  code: {
    pseudocode: `function reverseBits(n):
  result = 0
  for i from 0 to 31:
    result = result << 1
    result = result OR (n AND 1)
    n = n >> 1
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
    result = (result << 1) | (n & 1);
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
      label: '32-bit Integer n',
      type: 'number',
      defaultValue: 43261596,
      placeholder: '43261596',
      helperText: 'Non-negative 32-bit integer',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const NUM_BITS = 32;

    const toBitArray = (val: number): number[] => {
      const bits: number[] = [];
      for (let i = NUM_BITS - 1; i >= 0; i--) bits.push((val >>> i) & 1);
      return bits;
    };

    const makeViz = (
      arr: number[],
      highlights: Record<number, string>,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      auxData: { label: 'Reverse Bits State', entries: auxEntries },
    });

    const originalBits = toBitArray(n);
    const originalHl: Record<number, string> = {};
    originalBits.forEach((b, i) => { originalHl[i] = b ? 'active' : 'default'; });

    steps.push({
      line: 1,
      explanation: `Reverse bits of n = ${n}. Binary (32-bit): ${n.toString(2).padStart(NUM_BITS, '0')}. Each iteration: shift result left, add LSB of n, shift n right.`,
      variables: { n, binary: n.toString(2).padStart(NUM_BITS, '0') },
      visualization: makeViz(originalBits, originalHl, [
        { key: 'n', value: `${n}` },
        { key: 'n binary', value: n.toString(2).padStart(NUM_BITS, '0') },
        { key: 'result', value: '0' },
        { key: 'iteration', value: '0 / 32' },
      ]),
    });

    let current = n >>> 0;
    let result = 0;

    // Show every 8 iterations to keep steps manageable
    for (let i = 0; i < NUM_BITS; i++) {
      const lsb = current & 1;
      result = ((result << 1) | lsb) >>> 0;
      current = (current >>> 1) >>> 0;

      if (i % 8 === 7 || i === 0 || i === NUM_BITS - 1) {
        const resultBits = toBitArray(result);
        const currentBits = toBitArray(current);
        const resultHl: Record<number, string> = {};
        const currentHl: Record<number, string> = {};
        resultBits.forEach((b, idx) => { resultHl[idx] = b ? 'found' : 'visited'; });
        currentBits.forEach((b, idx) => { currentHl[idx] = b ? 'active' : 'default'; });

        steps.push({
          line: 5,
          explanation: `After iteration ${i + 1}: LSB was ${lsb}. result = ${result} (${result.toString(2).padStart(NUM_BITS, '0')}). Remaining n = ${current} (${current.toString(2).padStart(NUM_BITS, '0')}).`,
          variables: { iteration: i + 1, lsb, result, current },
          visualization: makeViz(resultBits, resultHl, [
            { key: `iteration`, value: `${i + 1} / 32` },
            { key: 'LSB extracted', value: String(lsb) },
            { key: 'result (decimal)', value: String(result) },
            { key: 'result (binary)', value: result.toString(2).padStart(NUM_BITS, '0') },
            { key: 'remaining n', value: current.toString(2).padStart(NUM_BITS, '0') },
          ]),
        });
      }
    }

    const finalBits = toBitArray(result);
    const finalHl: Record<number, string> = {};
    finalBits.forEach((b, i) => { finalHl[i] = b ? 'found' : 'visited'; });

    steps.push({
      line: 7,
      explanation: `Done! reverseBits(${n}) = ${result >>> 0}. Original: ${n.toString(2).padStart(NUM_BITS, '0')}, Reversed: ${result.toString(2).padStart(NUM_BITS, '0')}.`,
      variables: { result: result >>> 0 },
      visualization: makeViz(finalBits, finalHl, [
        { key: 'original', value: n.toString(2).padStart(NUM_BITS, '0') },
        { key: 'reversed', value: result.toString(2).padStart(NUM_BITS, '0') },
        { key: 'result (decimal)', value: String(result >>> 0) },
      ]),
    });

    return steps;
  },
};

export default reverseBits;

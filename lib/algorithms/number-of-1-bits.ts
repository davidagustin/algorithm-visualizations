import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfOneBits: AlgorithmDefinition = {
  id: 'number-of-1-bits',
  title: 'Number of 1 Bits',
  leetcodeNumber: 191,
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  description:
    'Count the number of 1 bits (Hamming weight) in an unsigned integer. Use Brian Kernighan\'s trick: n & (n-1) clears the lowest set bit. Count how many times we can do this until n becomes 0. Alternatively, check each bit with n & 1 and right-shift.',
  tags: ['Bit Manipulation', 'Math'],
  code: {
    pseudocode: `function hammingWeight(n):
  count = 0
  while n != 0:
    n = n AND (n - 1)  // clears lowest set bit
    count++
  return count`,
    python: `def hammingWeight(n: int) -> int:
    count = 0
    while n:
        n &= n - 1  # clears lowest set bit
        count += 1
    return count`,
    javascript: `function hammingWeight(n) {
  let count = 0;
  while (n !== 0) {
    n &= n - 1;  // clears lowest set bit
    count++;
  }
  return count;
}`,
    java: `public int hammingWeight(int n) {
    int count = 0;
    while (n != 0) {
        n &= n - 1;
        count++;
    }
    return count;
}`,
  },
  defaultInput: { n: 11 },
  inputFields: [
    {
      name: 'n',
      label: 'Integer n',
      type: 'number',
      defaultValue: 11,
      placeholder: '11',
      helperText: 'Non-negative integer (e.g. 11 = 0b1011)',
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

    const makeBitLabels = (val: number): Record<number, string> => {
      const labels: Record<number, string> = {};
      for (let i = 0; i < NUM_BITS; i++) {
        labels[i] = String(NUM_BITS - 1 - i);
      }
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
      labels: makeBitLabels(val),
      auxData: { label: 'Bit State', entries: auxEntries },
    });

    const bits = toBitArray(n);
    const allHl: Record<number, string> = {};
    bits.forEach((b, i) => { allHl[i] = b ? 'active' : 'default'; });

    steps.push({
      line: 1,
      explanation: `n = ${n}, binary = ${n.toString(2).padStart(NUM_BITS, '0')}. Count the 1-bits using n &= n-1 trick: each operation clears the lowest set bit.`,
      variables: { n, binary: n.toString(2).padStart(NUM_BITS, '0') },
      visualization: makeViz(n, allHl, [
        { key: 'n (decimal)', value: String(n) },
        { key: 'n (binary)', value: n.toString(2).padStart(NUM_BITS, '0') },
        { key: 'count', value: '0' },
      ]),
    });

    let current = n;
    let count = 0;

    while (current !== 0) {
      const nMinus1 = current - 1;
      const cleared = current & nMinus1;
      const lowestBitPos = Math.log2(current & -current);

      const beforeBits = toBitArray(current);
      const afterBits = toBitArray(cleared);
      const beforeHl: Record<number, string> = {};
      const afterHl: Record<number, string> = {};

      beforeBits.forEach((b, i) => { beforeHl[i] = b ? 'active' : 'default'; });
      // Highlight the bit being cleared
      const clearIdx = NUM_BITS - 1 - Math.floor(lowestBitPos);
      if (clearIdx >= 0 && clearIdx < NUM_BITS) beforeHl[clearIdx] = 'swapping';

      afterBits.forEach((b, i) => { afterHl[i] = b ? 'found' : 'default'; });

      steps.push({
        line: 3,
        explanation: `n=${current} (${current.toString(2).padStart(NUM_BITS,'0')}), n-1=${nMinus1} (${nMinus1.toString(2).padStart(NUM_BITS,'0')}). n &= n-1 clears lowest set bit at position ${Math.floor(lowestBitPos)}.`,
        variables: { n: current, nMinus1, afterAnd: cleared, lowestBitPos: Math.floor(lowestBitPos) },
        visualization: makeViz(current, beforeHl, [
          { key: 'n', value: `${current} (${current.toString(2).padStart(NUM_BITS,'0')})` },
          { key: 'n - 1', value: `${nMinus1} (${nMinus1.toString(2).padStart(NUM_BITS,'0')})` },
          { key: 'n & (n-1)', value: `${cleared} (${cleared.toString(2).padStart(NUM_BITS,'0')})` },
          { key: 'count', value: String(count) },
        ]),
      });

      current = cleared;
      count++;

      const updatedBits = toBitArray(current);
      const updatedHl: Record<number, string> = {};
      updatedBits.forEach((b, i) => { updatedHl[i] = b ? 'active' : 'visited'; });

      steps.push({
        line: 4,
        explanation: `After clearing: n = ${current} (${current.toString(2).padStart(NUM_BITS,'0')}). count = ${count}.`,
        variables: { n: current, count },
        visualization: makeViz(current, updatedHl, [
          { key: 'n (updated)', value: `${current} (${current.toString(2).padStart(NUM_BITS,'0')})` },
          { key: 'count', value: String(count) },
        ]),
      });
    }

    const finalHl: Record<number, string> = {};
    toBitArray(0).forEach((_, i) => { finalHl[i] = 'found'; });

    steps.push({
      line: 5,
      explanation: `Done! n is now 0. Number of 1-bits in ${n} = ${count} (Hamming weight).`,
      variables: { result: count },
      visualization: makeViz(0, finalHl, [
        { key: 'original n', value: String(n) },
        { key: 'Hamming weight', value: String(count) },
      ]),
    });

    return steps;
  },
};

export default numberOfOneBits;

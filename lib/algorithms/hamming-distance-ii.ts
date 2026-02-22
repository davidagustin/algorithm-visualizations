import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const hammingDistanceII: AlgorithmDefinition = {
  id: 'hamming-distance-ii',
  title: 'Hamming Distance',
  leetcodeNumber: 461,
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  description:
    'The Hamming distance between two integers is the number of bit positions where they differ. Compute x XOR y (which has 1s exactly where x and y differ), then count the number of 1 bits (popcount) in the result.',
  tags: ['bit manipulation'],

  code: {
    pseudocode: `function hammingDistance(x, y):
  xorVal = x XOR y
  count = 0
  while xorVal != 0:
    count += xorVal & 1
    xorVal >>= 1
  return count`,

    python: `def hammingDistance(x: int, y: int) -> int:
    return bin(x ^ y).count('1')`,

    javascript: `function hammingDistance(x, y) {
  let xor = x ^ y, count = 0;
  while (xor) { count += xor & 1; xor >>= 1; }
  return count;
}`,

    java: `public int hammingDistance(int x, int y) {
    return Integer.bitCount(x ^ y);
}`,
  },

  defaultInput: { x: 1, y: 4 },
  inputFields: [
    {
      name: 'x',
      label: 'x',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
    },
    {
      name: 'y',
      label: 'y',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const x = input.x as number;
    const y = input.y as number;
    const steps: AlgorithmStep[] = [];
    const bitLen = Math.max(x.toString(2).length, y.toString(2).length, 4);

    const toBits = (v: number) => v.toString(2).padStart(bitLen, '0').split('').map(Number);
    const xBits = toBits(x);
    const yBits = toBits(y);
    const xorVal = x ^ y;
    const xorBits = toBits(xorVal);

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
      auxData: { label: 'Hamming Distance', entries: extra },
    });

    steps.push({
      line: 1,
      explanation: `x=${x} (${x.toString(2).padStart(bitLen, '0')}), y=${y} (${y.toString(2).padStart(bitLen, '0')}). XOR gives 1 where bits differ.`,
      variables: { x, y, xBin: x.toString(2), yBin: y.toString(2) },
      visualization: makeViz(
        xBits,
        Object.fromEntries(xBits.map((_, i) => [i, 'active'])),
        Object.fromEntries(xBits.map((b, i) => [i, `x:${b}`])),
        [
          { key: 'x', value: `${x} (${x.toString(2).padStart(bitLen, '0')})` },
          { key: 'y', value: `${y} (${y.toString(2).padStart(bitLen, '0')})` },
        ]
      ),
    });

    steps.push({
      line: 2,
      explanation: `x XOR y = ${x} ^ ${y} = ${xorVal} (binary: ${xorVal.toString(2).padStart(bitLen, '0')}). 1-bits mark positions where x and y differ.`,
      variables: { 'x^y': xorVal, binary: xorVal.toString(2).padStart(bitLen, '0') },
      visualization: makeViz(
        xorBits,
        Object.fromEntries(xorBits.map((b, i) => [i, b === 1 ? 'mismatch' : 'visited'])),
        Object.fromEntries(xorBits.map((b, i) => [i, b === 1 ? 'diff' : '='])),
        [{ key: 'x XOR y', value: `${xorVal} (${xorVal.toString(2).padStart(bitLen, '0')})` }]
      ),
    });

    let val = xorVal;
    let count = 0;
    let bitPos = bitLen - 1;
    while (val > 0) {
      const bit = val & 1;
      count += bit;
      steps.push({
        line: 4,
        explanation: `Bit at position ${bitPos}: ${bit}. count += ${bit} → count=${count}. Shift right.`,
        variables: { 'current bit': bit, count, remaining: val },
        visualization: makeViz(
          xorBits,
          Object.fromEntries(xorBits.map((b, i) => [i, i === bitLen - 1 - bitPos ? 'active' : (b === 1 ? 'mismatch' : 'visited')])),
          Object.fromEntries(xorBits.map((b, i) => [i, b === 1 ? '1' : '0'])),
          [
            { key: 'current bit', value: String(bit) },
            { key: 'count', value: String(count) },
          ]
        ),
      });
      val >>= 1;
      bitPos--;
    }

    steps.push({
      line: 6,
      explanation: `Hamming distance between ${x} and ${y} is ${count}. They differ in ${count} bit position${count !== 1 ? 's' : ''}.`,
      variables: { x, y, hammingDistance: count },
      visualization: makeViz(
        xorBits,
        Object.fromEntries(xorBits.map((b, i) => [i, b === 1 ? 'found' : 'visited'])),
        Object.fromEntries(xorBits.map((b, i) => [i, b === 1 ? 'diff' : '='])),
        [{ key: 'hammingDistance', value: String(count) }]
      ),
    });

    return steps;
  },
};

export default hammingDistanceII;

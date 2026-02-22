import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const powerOfTwoII: AlgorithmDefinition = {
  id: 'power-of-two-ii',
  title: 'Power of Two',
  leetcodeNumber: 231,
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  description:
    'Given an integer n, return true if it is a power of two. A power of two has exactly one bit set in its binary representation. Use the trick: n > 0 && (n & (n-1)) === 0. n-1 flips the trailing bits, so n & (n-1) clears the lowest set bit. If n is a power of two, this gives 0.',
  tags: ['bit manipulation', 'math'],

  code: {
    pseudocode: `function isPowerOfTwo(n):
  return n > 0 and (n & (n - 1)) == 0`,

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
      label: 'Number n',
      type: 'number',
      defaultValue: 16,
      placeholder: '16',
      helperText: 'Integer to check if it is a power of two',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];

    // Show bits of n as array
    const bits = n >= 0 ? n.toString(2).padStart(8, '0').split('').map(Number) : [0];
    const bitsNm1 = n > 0 ? (n - 1).toString(2).padStart(8, '0').split('').map(Number) : [0];
    const andResult = n > 0 ? (n & (n - 1)).toString(2).padStart(8, '0').split('').map(Number) : [0];

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
      auxData: { label: 'Bit Analysis', entries: extra },
    });

    steps.push({
      line: 1,
      explanation: `Check if n=${n} is a power of two. In binary: ${n.toString(2)}. A power of two has exactly one '1' bit.`,
      variables: { n, binary: n.toString(2) },
      visualization: makeViz(
        bits,
        Object.fromEntries(bits.map((b, i) => [i, b === 1 ? 'active' : 'visited'])),
        Object.fromEntries(bits.map((_, i) => [i, `b${7 - i}`])),
        [{ key: 'n', value: `${n} (${n.toString(2)})` }]
      ),
    });

    if (n <= 0) {
      steps.push({
        line: 2,
        explanation: `n=${n} is not positive. Return false immediately.`,
        variables: { n, result: false },
        visualization: makeViz([n], { 0: 'mismatch' }, {}, [{ key: 'result', value: 'false' }]),
      });
      return steps;
    }

    steps.push({
      line: 2,
      explanation: `n=${n} > 0. Now check n & (n-1). n-1=${n - 1} (binary: ${(n - 1).toString(2)}). Subtracting 1 flips all bits from the lowest set bit downward.`,
      variables: { n, 'n-1': n - 1, 'n-1 binary': (n - 1).toString(2) },
      visualization: makeViz(
        bitsNm1,
        Object.fromEntries(bitsNm1.map((b, i) => [i, b === 1 ? 'comparing' : 'visited'])),
        Object.fromEntries(bitsNm1.map((_, i) => [i, `b${7 - i}`])),
        [
          { key: 'n', value: `${n} (${n.toString(2)})` },
          { key: 'n-1', value: `${n - 1} (${(n - 1).toString(2)})` },
        ]
      ),
    });

    const andVal = n & (n - 1);
    steps.push({
      line: 2,
      explanation: `n & (n-1) = ${n} & ${n - 1} = ${andVal} (binary: ${andVal.toString(2)}). ${andVal === 0 ? 'Result is 0, so n IS a power of two!' : 'Result is not 0, so n is NOT a power of two.'}`,
      variables: { n, 'n-1': n - 1, 'n&(n-1)': andVal, result: andVal === 0 },
      visualization: makeViz(
        andResult,
        Object.fromEntries(andResult.map((b, i) => [i, andVal === 0 ? 'found' : 'mismatch'])),
        Object.fromEntries(andResult.map((_, i) => [i, `b${7 - i}`])),
        [
          { key: 'n & (n-1)', value: `${andVal} (${andVal.toString(2)})` },
          { key: 'isPowerOfTwo', value: String(andVal === 0) },
        ]
      ),
    });

    return steps;
  },
};

export default powerOfTwoII;

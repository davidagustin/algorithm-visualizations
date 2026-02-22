import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const complementOfBase10Integer: AlgorithmDefinition = {
  id: 'complement-of-base-10-integer',
  title: 'Complement of Base 10 Integer',
  leetcodeNumber: 1009,
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  description:
    'The complement of an integer flips all bits in its binary representation. Given a positive integer n, return its complement. Create a bitmask with all 1s of the same bit length as n, then XOR n with the mask to flip all bits.',
  tags: ['bit manipulation', 'math'],

  code: {
    pseudocode: `function bitwiseComplement(n):
  if n == 0: return 1
  bits = floor(log2(n)) + 1
  mask = (1 << bits) - 1
  return n XOR mask`,

    python: `def bitwiseComplement(n):
    if n == 0:
        return 1
    bits = n.bit_length()
    mask = (1 << bits) - 1
    return n ^ mask`,

    javascript: `function bitwiseComplement(n) {
  if (n === 0) return 1;
  const bits = Math.floor(Math.log2(n)) + 1;
  const mask = (1 << bits) - 1;
  return n ^ mask;
}`,

    java: `public int bitwiseComplement(int n) {
    if (n == 0) return 1;
    int bits = (int)(Math.log(n) / Math.log(2)) + 1;
    int mask = (1 << bits) - 1;
    return n ^ mask;
}`,
  },

  defaultInput: {
    n: 5,
  },

  inputFields: [
    {
      name: 'n',
      label: 'Integer n',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Non-negative integer',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];

    if (n === 0) {
      steps.push({
        line: 1,
        explanation: 'n = 0 is a special case. Complement of 0 is 1.',
        variables: { n, result: 1 },
        visualization: { type: 'array', array: [0], highlights: { 0: 'found' }, labels: { 0: '0->1' } } as ArrayVisualization,
      });
      return steps;
    }

    const bits = n.toString(2).length;
    const binaryN = n.toString(2);

    steps.push({
      line: 1,
      explanation: `n = ${n} in binary is ${binaryN}. It has ${bits} bits.`,
      variables: { n, binary: binaryN, bits },
      visualization: {
        type: 'array',
        array: binaryN.split('').map(Number),
        highlights: Object.fromEntries(binaryN.split('').map((_, i) => [i, 'active'])),
        labels: Object.fromEntries(binaryN.split('').map((_, i) => [i, `bit${bits - 1 - i}`])),
      } as ArrayVisualization,
    });

    const mask = (1 << bits) - 1;
    const binaryMask = mask.toString(2);

    steps.push({
      line: 3,
      explanation: `Create mask: (1 << ${bits}) - 1 = ${mask} (binary: ${'1'.repeat(bits)}). This is all 1s with ${bits} bits.`,
      variables: { bits, mask, binaryMask },
      visualization: {
        type: 'array',
        array: binaryMask.split('').map(Number),
        highlights: Object.fromEntries(binaryMask.split('').map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(binaryMask.split('').map((_, i) => [i, '1'])),
      } as ArrayVisualization,
    });

    const result = n ^ mask;
    const binaryResult = result.toString(2).padStart(bits, '0');

    steps.push({
      line: 4,
      explanation: `XOR: ${binaryN} XOR ${'1'.repeat(bits)} = ${binaryResult}. Flips every bit. Result = ${result}.`,
      variables: { n, mask, result, binary: binaryResult },
      visualization: {
        type: 'array',
        array: binaryResult.split('').map(Number),
        highlights: Object.fromEntries(binaryResult.split('').map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(binaryResult.split('').map((b, i) => [i, b === '0' ? '0' : '1'])),
      } as ArrayVisualization,
    });

    steps.push({
      line: 5,
      explanation: `The complement of ${n} is ${result}.`,
      variables: { result },
      visualization: {
        type: 'array',
        array: [n, result],
        highlights: { 0: 'active', 1: 'found' },
        labels: { 0: 'input', 1: 'complement' },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default complementOfBase10Integer;

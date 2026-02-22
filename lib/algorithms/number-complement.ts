import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberComplement: AlgorithmDefinition = {
  id: 'number-complement',
  title: 'Number Complement',
  leetcodeNumber: 476,
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  description:
    'Given a positive integer num, return its complement. The complement flips all bits in its binary representation. Find the mask with all 1s of the same length as num (e.g., 5=101 → mask=111=7), then complement = mask XOR num.',
  tags: ['bit manipulation'],

  code: {
    pseudocode: `function findComplement(num):
  mask = 1
  while mask <= num:
    mask <<= 1
  return (mask - 1) XOR num`,

    python: `def findComplement(num: int) -> int:
    mask = 1
    while mask <= num:
        mask <<= 1
    return (mask - 1) ^ num`,

    javascript: `function findComplement(num) {
  let mask = 1;
  while (mask <= num) mask <<= 1;
  return (mask - 1) ^ num;
}`,

    java: `public int findComplement(int num) {
    int mask = 1;
    while (mask <= num) mask <<= 1;
    return (mask - 1) ^ num;
}`,
  },

  defaultInput: { num: 5 },
  inputFields: [
    {
      name: 'num',
      label: 'Number',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Positive integer whose complement to compute',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const num = input.num as number;
    const steps: AlgorithmStep[] = [];
    const bitLen = num.toString(2).length;
    const numBits = num.toString(2).split('').map(Number);

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
      auxData: { label: 'Complement', entries: extra },
    });

    steps.push({
      line: 1,
      explanation: `num=${num} in binary: ${num.toString(2)} (${bitLen} bits). We need to flip all ${bitLen} bits.`,
      variables: { num, binary: num.toString(2), bitLen },
      visualization: makeViz(
        numBits,
        Object.fromEntries(numBits.map((b, i) => [i, b === 1 ? 'active' : 'visited'])),
        Object.fromEntries(numBits.map((b, i) => [i, String(b)])),
        [{ key: 'num', value: `${num} (${num.toString(2)})` }]
      ),
    });

    let mask = 1;
    steps.push({
      line: 2,
      explanation: `Initialize mask=1. We will shift it left until mask > num, building all-1s mask of same bit length.`,
      variables: { mask: 1 },
      visualization: makeViz(numBits, {}, {}, [{ key: 'mask', value: '1' }]),
    });

    while (mask <= num) {
      mask <<= 1;
      steps.push({
        line: 3,
        explanation: `mask <<= 1 → mask=${mask} (${mask.toString(2)}). ${mask <= num ? 'Still <= num, continue.' : 'mask > num, stop.'}`,
        variables: { mask, 'mask > num': mask > num },
        visualization: makeViz(
          numBits,
          {},
          {},
          [
            { key: 'mask', value: `${mask} (${mask.toString(2)})` },
            { key: 'num', value: `${num} (${num.toString(2)})` },
          ]
        ),
      });
    }

    const complement = (mask - 1) ^ num;
    const complementBits = complement.toString(2).padStart(bitLen, '0').split('').map(Number);
    steps.push({
      line: 5,
      explanation: `mask-1=${mask - 1} (all 1s: ${(mask - 1).toString(2)}). complement = ${mask - 1} XOR ${num} = ${complement} (binary: ${complement.toString(2)}).`,
      variables: { mask, 'mask-1': mask - 1, complement, binary: complement.toString(2) },
      visualization: makeViz(
        complementBits,
        Object.fromEntries(complementBits.map((b, i) => [i, b === 1 ? 'found' : 'visited'])),
        Object.fromEntries(complementBits.map((b, i) => [i, String(b)])),
        [
          { key: 'mask-1', value: `${mask - 1} (${(mask - 1).toString(2)})` },
          { key: 'complement', value: `${complement} (${complement.toString(2)})` },
        ]
      ),
    });

    return steps;
  },
};

export default numberComplement;

import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const sumOfTwoIntegers: AlgorithmDefinition = {
  id: 'sum-of-two-integers',
  title: 'Sum of Two Integers',
  leetcodeNumber: 371,
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  description:
    'Add two integers without using + or - operators. XOR gives the sum without carries. AND shifted left gives the carry bits. Repeat until no carry remains. This simulates binary addition: XOR adds bit pairs, AND+shift propagates carries.',
  tags: ['Bit Manipulation', 'Math'],
  code: {
    pseudocode: `function getSum(a, b):
  while b != 0:
    carry = (a AND b) << 1
    a = a XOR b    // sum without carry
    b = carry      // carry becomes new b
  return a
  // XOR: sum of bits without carry
  // AND: bits where both are 1 (generate carry)
  // <<1: shift carry to next position`,
    python: `def getSum(a: int, b: int) -> int:
    mask = 0xFFFFFFFF
    while b & mask:
        carry = ((a & b) << 1) & mask
        a = (a ^ b) & mask
        b = carry
    return a if b == 0 else ~(a ^ mask)`,
    javascript: `function getSum(a, b) {
  while (b !== 0) {
    const carry = (a & b) << 1;
    a = a ^ b;
    b = carry;
  }
  return a;
}`,
    java: `public int getSum(int a, int b) {
    while (b != 0) {
        int carry = (a & b) << 1;
        a = a ^ b;
        b = carry;
    }
    return a;
}`,
  },
  defaultInput: { a: 5, b: 3 },
  inputFields: [
    {
      name: 'a',
      label: 'Integer a',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'First integer',
    },
    {
      name: 'b',
      label: 'Integer b',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Second integer',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const initA = input.a as number;
    const initB = input.b as number;
    const steps: AlgorithmStep[] = [];
    const NUM_BITS = 8;

    const toBitArray = (val: number): number[] => {
      const bits: number[] = [];
      for (let i = NUM_BITS - 1; i >= 0; i--) bits.push((val >> i) & 1);
      return bits;
    };

    const makeViz = (
      aVal: number,
      bVal: number,
      carryVal: number,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization => {
      const aBits = toBitArray(aVal);
      const hl: Record<number, string> = {};
      const bBits = toBitArray(bVal);
      aBits.forEach((bit, i) => {
        if (bBits[i]) {
          hl[i] = bit ? 'swapping' : 'comparing'; // both set → carry
        } else {
          hl[i] = bit ? 'active' : 'default';
        }
      });
      return {
        type: 'array',
        array: aBits,
        highlights: hl,
        auxData: {
          label: 'Addition via XOR/AND',
          entries: [
            { key: 'a (binary)', value: aVal.toString(2).padStart(NUM_BITS, '0') },
            { key: 'a (decimal)', value: String(aVal) },
            { key: 'b (binary)', value: bVal.toString(2).padStart(NUM_BITS, '0') },
            { key: 'b (decimal)', value: String(bVal) },
            { key: 'carry (binary)', value: carryVal.toString(2).padStart(NUM_BITS, '0') },
            ...auxEntries,
          ],
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `Add a=${initA} + b=${initB} without + operator. Binary: a=${initA.toString(2).padStart(NUM_BITS,'0')}, b=${initB.toString(2).padStart(NUM_BITS,'0')}. XOR gives sum bits, AND+shift gives carry bits.`,
      variables: { a: initA, b: initB },
      visualization: makeViz(initA, initB, 0, [{ key: 'iteration', value: '0' }]),
    });

    let a = initA;
    let b = initB;
    let iteration = 0;

    while (b !== 0) {
      const carry = (a & b) << 1;
      const newA = a ^ b;
      iteration++;

      steps.push({
        line: 3,
        explanation: `Iteration ${iteration}: carry = (${a} & ${b}) << 1 = ${carry} (${carry.toString(2).padStart(NUM_BITS,'0')}). sum_bits = ${a} ^ ${b} = ${newA} (${newA.toString(2).padStart(NUM_BITS,'0')}).`,
        variables: { a, b, carry, newA, iteration },
        visualization: makeViz(a, b, carry, [
          { key: 'a XOR b (partial sum)', value: `${newA} (${newA.toString(2).padStart(NUM_BITS,'0')})` },
          { key: '(a AND b)<<1 (carry)', value: `${carry} (${carry.toString(2).padStart(NUM_BITS,'0')})` },
          { key: 'iteration', value: String(iteration) },
        ]),
      });

      a = newA;
      b = carry;

      const aBits = toBitArray(a);
      const aHl: Record<number, string> = {};
      aBits.forEach((bit, i) => { aHl[i] = bit ? 'found' : 'visited'; });

      steps.push({
        line: 5,
        explanation: `Update: a = ${a} (${a.toString(2).padStart(NUM_BITS,'0')}), b (carry) = ${b} (${b.toString(2).padStart(NUM_BITS,'0')}). ${b !== 0 ? 'Carry exists, continue.' : 'No more carry, done!'}`,
        variables: { a, b },
        visualization: {
          type: 'array',
          array: aBits,
          highlights: aHl,
          auxData: {
            label: 'After Iteration ' + iteration,
            entries: [
              { key: 'a (partial result)', value: `${a} (${a.toString(2).padStart(NUM_BITS,'0')})` },
              { key: 'b (remaining carry)', value: `${b} (${b.toString(2).padStart(NUM_BITS,'0')})` },
              { key: 'carry remaining?', value: b !== 0 ? 'yes' : 'no' },
            ],
          },
        },
      });
    }

    const finalBits = toBitArray(a);
    const finalHl: Record<number, string> = {};
    finalBits.forEach((bit, i) => { finalHl[i] = bit ? 'found' : 'visited'; });

    steps.push({
      line: 6,
      explanation: `Done! b = 0, no more carry. Result a = ${a} = ${initA} + ${initB}. Verified: ${initA} + ${initB} = ${initA + initB}.`,
      variables: { result: a },
      visualization: {
        type: 'array',
        array: finalBits,
        highlights: finalHl,
        auxData: {
          label: 'Final Result',
          entries: [
            { key: 'a + b', value: `${initA} + ${initB} = ${a}` },
            { key: 'result (binary)', value: a.toString(2).padStart(NUM_BITS, '0') },
            { key: 'iterations', value: String(iteration) },
          ],
        },
      },
    });

    return steps;
  },
};

export default sumOfTwoIntegers;

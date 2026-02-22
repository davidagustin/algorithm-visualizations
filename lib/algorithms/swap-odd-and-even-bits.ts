import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const swapOddAndEvenBits: AlgorithmDefinition = {
  id: 'swap-odd-and-even-bits',
  title: 'Swap Odd and Even Bits',
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  description:
    'Swap all odd-positioned bits with even-positioned bits in an integer. Extract even bits with mask 0xAAAAAAAA, extract odd bits with mask 0x55555555, shift even bits right and odd bits left, then combine with OR.',
  tags: ['bit manipulation'],

  code: {
    pseudocode: `function swapBits(n):
  evenBits = n AND 0xAAAAAAAA
  oddBits = n AND 0x55555555
  evenBits = evenBits >> 1
  oddBits = oddBits << 1
  return evenBits OR oddBits`,

    python: `def swapBits(n: int) -> int:
    even_bits = n & 0xAAAAAAAA
    odd_bits = n & 0x55555555
    even_bits >>= 1
    odd_bits <<= 1
    return even_bits | odd_bits`,

    javascript: `function swapBits(n) {
  let evenBits = n & 0xAAAAAAAA;
  let oddBits = n & 0x55555555;
  evenBits >>= 1;
  oddBits <<= 1;
  return (evenBits | oddBits) >>> 0;
}`,

    java: `public int swapBits(int n) {
    int evenBits = n & 0xAAAAAAAA;
    int oddBits = n & 0x55555555;
    evenBits >>= 1;
    oddBits <<= 1;
    return evenBits | oddBits;
}`,
  },

  defaultInput: {
    n: 23,
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number',
      type: 'number',
      defaultValue: 23,
      placeholder: '23',
      helperText: 'Non-negative integer to swap bits',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];

    // Show binary representation as an array of bits (8 bits for simplicity)
    const numBits = 8;
    const toBitArray = (val: number): number[] => {
      const bits: number[] = [];
      for (let i = numBits - 1; i >= 0; i--) {
        bits.push((val >> i) & 1);
      }
      return bits;
    };

    const makeBitLabels = (): Record<number, string> => {
      const labels: Record<number, string> = {};
      for (let i = 0; i < numBits; i++) {
        const bitPos = numBits - 1 - i;
        labels[i] = `b${bitPos}`;
      }
      return labels;
    };

    const makeViz = (
      bits: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...bits],
      highlights,
      labels: { ...makeBitLabels(), ...labels },
    });

    const bits = toBitArray(n);

    // Step: Show input
    steps.push({
      line: 1,
      explanation: `Input n = ${n}. Binary: ${n.toString(2).padStart(numBits, '0')}. We will swap even-position bits with odd-position bits.`,
      variables: { n, binary: n.toString(2).padStart(numBits, '0') },
      visualization: makeViz(bits, {}, {}),
    });

    // Step: Extract even bits (positions 1, 3, 5, 7 in our 0-indexed from MSB)
    const evenMask = 0xAAAAAAAA;
    const evenBits = n & evenMask;
    const evenBitArray = toBitArray(evenBits);

    const evenHighlights: Record<number, string> = {};
    for (let i = 0; i < numBits; i++) {
      const bitPos = numBits - 1 - i;
      evenHighlights[i] = bitPos % 2 === 1 ? 'active' : 'visited';
    }

    steps.push({
      line: 2,
      explanation: `Extract even-position bits: ${n} AND 0xAA = ${evenBits} (binary: ${evenBits.toString(2).padStart(numBits, '0')}). Mask keeps bits at positions 1, 3, 5, 7.`,
      variables: { evenBits, binary: evenBits.toString(2).padStart(numBits, '0') },
      visualization: makeViz(evenBitArray, evenHighlights, {}),
    });

    // Step: Extract odd bits
    const oddMask = 0x55555555;
    const oddBits = n & oddMask;
    const oddBitArray = toBitArray(oddBits);

    const oddHighlights: Record<number, string> = {};
    for (let i = 0; i < numBits; i++) {
      const bitPos = numBits - 1 - i;
      oddHighlights[i] = bitPos % 2 === 0 ? 'pointer' : 'visited';
    }

    steps.push({
      line: 3,
      explanation: `Extract odd-position bits: ${n} AND 0x55 = ${oddBits} (binary: ${oddBits.toString(2).padStart(numBits, '0')}). Mask keeps bits at positions 0, 2, 4, 6.`,
      variables: { oddBits, binary: oddBits.toString(2).padStart(numBits, '0') },
      visualization: makeViz(oddBitArray, oddHighlights, {}),
    });

    // Step: Shift even bits right
    const evenShifted = evenBits >> 1;
    const evenShiftedArray = toBitArray(evenShifted);

    steps.push({
      line: 4,
      explanation: `Shift even bits right by 1: ${evenBits} >> 1 = ${evenShifted} (binary: ${evenShifted.toString(2).padStart(numBits, '0')}). Even bits move to odd positions.`,
      variables: { evenShifted, binary: evenShifted.toString(2).padStart(numBits, '0') },
      visualization: makeViz(
        evenShiftedArray,
        Object.fromEntries(evenShiftedArray.map((b, i) => [i, b ? 'active' : 'default'])),
        {}
      ),
    });

    // Step: Shift odd bits left
    const oddShifted = (oddBits << 1) & 0xFF;
    const oddShiftedArray = toBitArray(oddShifted);

    steps.push({
      line: 5,
      explanation: `Shift odd bits left by 1: ${oddBits} << 1 = ${oddShifted} (binary: ${oddShifted.toString(2).padStart(numBits, '0')}). Odd bits move to even positions.`,
      variables: { oddShifted, binary: oddShifted.toString(2).padStart(numBits, '0') },
      visualization: makeViz(
        oddShiftedArray,
        Object.fromEntries(oddShiftedArray.map((b, i) => [i, b ? 'pointer' : 'default'])),
        {}
      ),
    });

    // Step: Combine with OR
    const result = evenShifted | oddShifted;
    const resultArray = toBitArray(result);

    // Show which bits swapped
    const resultHighlights: Record<number, string> = {};
    for (let i = 0; i < numBits; i++) {
      resultHighlights[i] = resultArray[i] ? 'found' : 'default';
    }

    steps.push({
      line: 6,
      explanation: `Combine: ${evenShifted} OR ${oddShifted} = ${result} (binary: ${result.toString(2).padStart(numBits, '0')}). Original was ${n} (${n.toString(2).padStart(numBits, '0')}).`,
      variables: { result, originalBinary: n.toString(2).padStart(numBits, '0'), resultBinary: result.toString(2).padStart(numBits, '0') },
      visualization: makeViz(resultArray, resultHighlights, {}),
    });

    // Final summary
    steps.push({
      line: 6,
      explanation: `Done! Swapping odd and even bits of ${n} (${n.toString(2).padStart(numBits, '0')}) gives ${result} (${result.toString(2).padStart(numBits, '0')}).`,
      variables: { input: n, result },
      visualization: makeViz(
        resultArray,
        Object.fromEntries(resultArray.map((_, i) => [i, 'found'])),
        {}
      ),
    });

    return steps;
  },
};

export default swapOddAndEvenBits;

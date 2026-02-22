import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const singleNumberII: AlgorithmDefinition = {
  id: 'single-number-ii',
  title: 'Single Number II',
  leetcodeNumber: 137,
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  description:
    'Find the element that appears exactly once when all others appear exactly three times. For each bit position, count how many numbers have that bit set. The count mod 3 gives the bit of the unique number. We use two bitmasks (ones and twos) to track counts mod 3: ones = bits seen once, twos = bits seen twice.',
  tags: ['Bit Manipulation', 'Array'],
  code: {
    pseudocode: `function singleNumber(nums):
  ones = 0, twos = 0
  for num in nums:
    ones = (ones XOR num) AND NOT twos
    twos = (twos XOR num) AND NOT ones
  return ones
  // ones holds bits appearing 1 (mod 3) times
  // twos holds bits appearing 2 (mod 3) times`,
    python: `def singleNumber(nums):
    ones, twos = 0, 0
    for num in nums:
        ones = (ones ^ num) & ~twos
        twos = (twos ^ num) & ~ones
    return ones`,
    javascript: `function singleNumber(nums) {
  let ones = 0, twos = 0;
  for (const num of nums) {
    ones = (ones ^ num) & ~twos;
    twos = (twos ^ num) & ~ones;
  }
  return ones;
}`,
    java: `public int singleNumber(int[] nums) {
    int ones = 0, twos = 0;
    for (int num : nums) {
        ones = (ones ^ num) & ~twos;
        twos = (twos ^ num) & ~ones;
    }
    return ones;
}`,
  },
  defaultInput: { nums: [2, 2, 3, 2] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [2, 2, 3, 2],
      placeholder: '[2,2,3,2]',
      helperText: 'Every element appears 3 times except one',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const NUM_BITS = 8;

    const toBitArray = (val: number): number[] => {
      const bits: number[] = [];
      for (let i = NUM_BITS - 1; i >= 0; i--) bits.push((val >> i) & 1);
      return bits;
    };

    const makeViz = (
      onesVal: number,
      twosVal: number,
      curIdx: number,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization => {
      const hl: Record<number, string> = {};
      for (let j = 0; j < nums.length; j++) {
        if (j < curIdx) hl[j] = 'visited';
        else if (j === curIdx) hl[j] = 'active';
      }
      return {
        type: 'array',
        array: [...nums],
        highlights: hl,
        auxData: {
          label: 'Bitmask State',
          entries: [
            { key: 'ones (binary)', value: onesVal.toString(2).padStart(NUM_BITS, '0') },
            { key: 'ones (bits seen 1x mod 3)', value: String(onesVal) },
            { key: 'twos (binary)', value: twosVal.toString(2).padStart(NUM_BITS, '0') },
            { key: 'twos (bits seen 2x mod 3)', value: String(twosVal) },
            ...auxEntries,
          ],
        },
      };
    };

    steps.push({
      line: 2,
      explanation: `Find the single number among [${nums.join(', ')}] where all others appear 3 times. Use two bitmasks: "ones" (bits seen 1x mod 3) and "twos" (bits seen 2x mod 3). After processing all, ones = unique number.`,
      variables: { nums },
      visualization: makeViz(0, 0, -1, [{ key: 'state machine', value: '0→ones→twos→reset' }]),
    });

    let ones = 0;
    let twos = 0;

    for (let i = 0; i < nums.length; i++) {
      const num = nums[i];
      const prevOnes = ones;
      const prevTwos = twos;

      const newOnes = (ones ^ num) & ~twos;
      const newTwos = (twos ^ num) & ~newOnes;
      ones = newOnes;
      twos = newTwos;

      steps.push({
        line: 4,
        explanation: `num=${num} (${num.toString(2).padStart(NUM_BITS,'0')}): ones = (${prevOnes}^${num})&~${prevTwos} = ${ones}. twos = (${prevTwos}^${num})&~${ones} = ${twos}.`,
        variables: { i, num, ones, twos },
        visualization: makeViz(ones, twos, i, [
          { key: 'current num', value: `${num} (${num.toString(2).padStart(NUM_BITS,'0')})` },
          { key: 'ones updated', value: `${prevOnes}→${ones}` },
          { key: 'twos updated', value: `${prevTwos}→${twos}` },
        ]),
      });
    }

    const onesArr = toBitArray(ones);
    const finalHl: Record<number, string> = {};
    nums.forEach((_, i) => { finalHl[i] = nums[i] === ones ? 'found' : 'visited'; });

    steps.push({
      line: 6,
      explanation: `Done! ones = ${ones} (${ones.toString(2).padStart(NUM_BITS,'0')}). This is the single number. All bits that appeared 3x times are zeroed out in ones.`,
      variables: { result: ones },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: finalHl,
        auxData: {
          label: 'Result',
          entries: [
            { key: 'single number', value: String(ones) },
            { key: 'binary', value: ones.toString(2).padStart(NUM_BITS, '0') },
          ],
        },
      },
    });

    return steps;
  },
};

export default singleNumberII;

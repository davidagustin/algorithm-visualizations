import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const missingNumber: AlgorithmDefinition = {
  id: 'missing-number',
  title: 'Missing Number',
  leetcodeNumber: 268,
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  description:
    'Find the missing number in an array containing n distinct numbers from 0 to n. Use XOR: XOR all array values with all indices 0..n. Since every number appears twice except the missing one, everything cancels out leaving the missing number. This works because a XOR a = 0 and a XOR 0 = a.',
  tags: ['Bit Manipulation', 'Array', 'Math'],
  code: {
    pseudocode: `function missingNumber(nums):
  xor = 0
  for i from 0 to n:
    xor ^= i        // XOR with index
    if i < n:
      xor ^= nums[i] // XOR with array value
  return xor
  // Each number 0..n appears twice (in index and value)
  // except the missing number which only appears in index`,
    python: `def missingNumber(nums):
    xor = 0
    for i in range(len(nums) + 1):
        xor ^= i
        if i < len(nums):
            xor ^= nums[i]
    return xor`,
    javascript: `function missingNumber(nums) {
  let xor = 0;
  for (let i = 0; i <= nums.length; i++) {
    xor ^= i;
    if (i < nums.length) xor ^= nums[i];
  }
  return xor;
}`,
    java: `public int missingNumber(int[] nums) {
    int xor = 0;
    for (int i = 0; i <= nums.length; i++) {
        xor ^= i;
        if (i < nums.length) xor ^= nums[i];
    }
    return xor;
}`,
  },
  defaultInput: { nums: [3, 0, 1] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array (contains 0..n with one missing)',
      type: 'array',
      defaultValue: [3, 0, 1],
      placeholder: '[3,0,1]',
      helperText: 'Array with n distinct numbers from 0 to n, one missing',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    const NUM_BITS = 8;

    const toBitArray = (val: number): number[] => {
      const bits: number[] = [];
      for (let i = NUM_BITS - 1; i >= 0; i--) bits.push((val >> i) & 1);
      return bits;
    };

    const makeViz = (
      xorVal: number,
      highlightArr: Record<number, string>,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights: highlightArr,
      auxData: { label: 'XOR State', entries: [
        { key: 'xor (binary)', value: xorVal.toString(2).padStart(NUM_BITS, '0') },
        { key: 'xor (decimal)', value: String(xorVal) },
        ...auxEntries,
      ]},
    });

    steps.push({
      line: 2,
      explanation: `Find missing number in [${nums.join(', ')}] (should have all of 0..${n}). XOR all indices 0..${n} with all values. Paired numbers cancel out (a^a=0), leaving the missing one.`,
      variables: { nums, n },
      visualization: makeViz(0, {}, [
        { key: 'nums', value: `[${nums.join(', ')}]` },
        { key: 'expected range', value: `0 to ${n}` },
      ]),
    });

    let xor = 0;

    for (let i = 0; i <= n; i++) {
      const prevXor = xor;
      xor ^= i;
      const afterIndex = xor;

      const hl: Record<number, string> = {};
      for (let j = 0; j < i && j < n; j++) hl[j] = 'visited';
      if (i < n) hl[i] = 'active';

      steps.push({
        line: 3,
        explanation: `XOR with index i=${i}: ${prevXor} ^ ${i} = ${afterIndex} (${afterIndex.toString(2).padStart(NUM_BITS,'0')}).`,
        variables: { i, prevXor, afterIndex },
        visualization: makeViz(afterIndex, hl, [
          { key: `step`, value: `XOR ^ index ${i}` },
        ]),
      });

      if (i < n) {
        const prevXor2 = xor;
        xor ^= nums[i];
        const afterValue = xor;

        steps.push({
          line: 5,
          explanation: `XOR with nums[${i}]=${nums[i]}: ${prevXor2} ^ ${nums[i]} = ${afterValue} (${afterValue.toString(2).padStart(NUM_BITS,'0')}). ${prevXor2 === nums[i] ? '(Cancelled! ' + prevXor2 + ' ^ ' + nums[i] + ' = 0)' : ''}`,
          variables: { i, value: nums[i], afterValue },
          visualization: makeViz(afterValue, { ...hl, [i]: 'comparing' }, [
            { key: `step`, value: `XOR ^ nums[${i}]=${nums[i]}` },
          ]),
        });
      }
    }

    const finalHl: Record<number, string> = {};
    for (let j = 0; j < n; j++) finalHl[j] = nums[j] === xor ? 'mismatch' : 'found';

    steps.push({
      line: 7,
      explanation: `Done! xor = ${xor}. This is the missing number since it only appeared once (in indices, not in array). Missing = ${xor}.`,
      variables: { result: xor },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: finalHl,
        auxData: {
          label: 'Result',
          entries: [
            { key: 'missing number', value: String(xor) },
            { key: 'binary', value: xor.toString(2).padStart(NUM_BITS, '0') },
            { key: 'nums array', value: `[${nums.join(', ')}]` },
          ],
        },
      },
    });

    return steps;
  },
};

export default missingNumber;

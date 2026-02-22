import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const flipStringToMonotoneIncreasing: AlgorithmDefinition = {
  id: 'flip-string-to-monotone-increasing',
  title: 'Flip String to Monotone Increasing',
  leetcodeNumber: 926,
  difficulty: 'Medium',
  category: 'String',
  description:
    'A binary string is monotone increasing if it consists of some 0s followed by some 1s. Given a binary string s, flip the minimum number of characters to make it monotone increasing. DP approach: at each position, track cost of ending with 0 or ending with 1.',
  tags: ['string', 'dynamic programming'],

  code: {
    pseudocode: `function minFlipsMonoIncr(s):
  ones = 0  // count of 1s seen so far (cost to flip all to 0)
  flips = 0 // minimum flips needed
  for char in s:
    if char == '1':
      ones++  // one more 1 seen
    else:
      // Option 1: flip this 0 to 1 (cost flips + 1)
      // Option 2: flip all previous 1s to 0 (cost ones)
      flips = min(flips + 1, ones)
  return flips`,

    python: `def minFlipsMonoIncr(s: str) -> int:
    ones = 0
    flips = 0
    for c in s:
        if c == '1':
            ones += 1
        else:
            flips = min(flips + 1, ones)
    return flips`,

    javascript: `function minFlipsMonoIncr(s) {
  let ones = 0, flips = 0;
  for (const c of s) {
    if (c === '1') ones++;
    else flips = Math.min(flips + 1, ones);
  }
  return flips;
}`,

    java: `public int minFlipsMonoIncr(String s) {
    int ones = 0, flips = 0;
    for (char c : s.toCharArray()) {
        if (c == '1') ones++;
        else flips = Math.min(flips + 1, ones);
    }
    return flips;
}`,
  },

  defaultInput: {
    s: '010110',
  },

  inputFields: [
    {
      name: 's',
      label: 'Binary String',
      type: 'string',
      defaultValue: '010110',
      placeholder: '010110',
      helperText: 'Binary string of 0s and 1s',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: s.split('') as unknown as number[],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Find minimum flips to make "${s}" monotone increasing (all 0s before all 1s). Initialize ones=0, flips=0.`,
      variables: { s, ones: 0, flips: 0 },
      visualization: makeViz({}, {}),
    });

    let ones = 0;
    let flips = 0;

    for (let i = 0; i < s.length; i++) {
      const c = s[i];

      if (c === '1') {
        ones++;
        steps.push({
          line: 4,
          explanation: `s[${i}]='1': increment ones to ${ones}. No flip needed here.`,
          variables: { i, char: c, ones, flips },
          visualization: makeViz({ [i]: 'found' }, { [i]: '1' }),
        });
      } else {
        const option1 = flips + 1;
        const option2 = ones;
        const prevFlips = flips;
        flips = Math.min(option1, option2);
        steps.push({
          line: 7,
          explanation: `s[${i}]='0': Option 1 (flip this 0 to 1)=${option1}, Option 2 (flip all previous 1s to 0)=${option2}. Take min: flips=${flips} (was ${prevFlips}).`,
          variables: { i, char: c, ones, flips, option1, option2 },
          visualization: makeViz({ [i]: 'active' }, { [i]: '0' }),
        });
      }
    }

    steps.push({
      line: 9,
      explanation: `Done. Minimum flips needed: ${flips}.`,
      variables: { result: flips },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default flipStringToMonotoneIncreasing;

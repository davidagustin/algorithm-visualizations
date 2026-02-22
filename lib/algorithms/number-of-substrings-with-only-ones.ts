import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfSubstringsWithOnlyOnes: AlgorithmDefinition = {
  id: 'number-of-substrings-with-only-ones',
  title: 'Number of Substrings With Only 1s',
  leetcodeNumber: 1513,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given a binary string s, return the number of substrings with all characters equal to 1. Since the answer may be large, return it modulo 10^9+7. Track the current run of consecutive 1s: for each new 1, it extends all previous runs plus creates one new single-char substring.',
  tags: ['sliding window', 'string', 'math'],

  code: {
    pseudocode: `function numSub(s):
  MOD = 10^9 + 7
  result = 0
  run = 0
  for c in s:
    if c == '1':
      run++
      result = (result + run) % MOD
    else:
      run = 0
  return result`,

    python: `def numSub(s: str) -> int:
    MOD = 10**9 + 7
    result = 0
    run = 0
    for c in s:
        if c == '1':
            run += 1
            result = (result + run) % MOD
        else:
            run = 0
    return result`,

    javascript: `function numSub(s) {
  const MOD = 1e9 + 7;
  let result = 0, run = 0;
  for (const c of s) {
    if (c === '1') {
      run++;
      result = (result + run) % MOD;
    } else {
      run = 0;
    }
  }
  return result;
}`,

    java: `public int numSub(String s) {
    int MOD = 1_000_000_007;
    long result = 0, run = 0;
    for (char c : s.toCharArray()) {
        if (c == '1') {
            run++;
            result = (result + run) % MOD;
        } else {
            run = 0;
        }
    }
    return (int) result;
}`,
  },

  defaultInput: {
    s: '0110111',
  },

  inputFields: [
    {
      name: 's',
      label: 'Binary String',
      type: 'string',
      defaultValue: '0110111',
      placeholder: '0110111',
      helperText: 'String of 0s and 1s',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const MOD = 1000000007;
    const arr = s.split('').map(Number);

    steps.push({
      line: 1,
      explanation: `Count all substrings containing only 1s in "${s}". For a run of k consecutive 1s, there are k*(k+1)/2 such substrings.`,
      variables: { result: 0, run: 0 },
      visualization: {
        type: 'array',
        array: arr,
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    let result = 0;
    let run = 0;

    for (let i = 0; i < s.length; i++) {
      if (s[i] === '1') {
        run++;
        result = (result + run) % MOD;

        steps.push({
          line: 6,
          explanation: `Index ${i}: "1" found. Run length = ${run}. This position adds ${run} new substrings (all lengths 1..${run} ending here). Total = ${result}.`,
          variables: { i, run, addedSubstrings: run, result },
          visualization: {
            type: 'array',
            array: arr,
            highlights: { ...Object.fromEntries(Array.from({ length: run }, (_, idx) => [i - idx, 'found'])) },
            labels: { [i - run + 1]: 'run start', [i]: `+${run}` },
          } as ArrayVisualization,
        });
      } else {
        run = 0;

        steps.push({
          line: 8,
          explanation: `Index ${i}: "0" found. Run of 1s broken, reset run to 0. No new substrings added. Total stays ${result}.`,
          variables: { i, run: 0, result },
          visualization: {
            type: 'array',
            array: arr,
            highlights: { [i]: 'mismatch' },
            labels: { [i]: 'break' },
          } as ArrayVisualization,
        });
      }
    }

    steps.push({
      line: 9,
      explanation: `Total substrings with only 1s = ${result} (mod 10^9+7).`,
      variables: { result },
      visualization: {
        type: 'array',
        array: arr,
        highlights: Object.fromEntries(arr.map((v, i) => [i, v === 1 ? 'found' : 'sorted'])),
        labels: {},
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default numberOfSubstringsWithOnlyOnes;

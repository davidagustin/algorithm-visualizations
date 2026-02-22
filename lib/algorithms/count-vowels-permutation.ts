import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const countVowelsPermutation: AlgorithmDefinition = {
  id: 'count-vowels-permutation',
  title: 'Count Vowels Permutation',
  leetcodeNumber: 1220,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Count strings of length n using only vowels (a, e, i, o, u) following these rules: after a, only e follows; after e, only a or i; after i, any vowel except i; after o, only i or u; after u, only a. Uses DP where dp[v] = number of valid strings of current length ending in vowel v.',
  tags: ['dynamic programming', 'combinatorics', 'string'],

  code: {
    pseudocode: `function countVowelPermutation(n):
  MOD = 1e9+7
  a=e=i=o=u = 1  // count of length-1 strings
  for _ in range(n-1):
    a2 = e + i + u          // e, i, u can precede a
    e2 = a + i              // a, i can precede e
    i2 = e + o              // e, o can precede i
    o2 = i                  // i can precede o
    u2 = i + o              // i, o can precede u
    a,e,i,o,u = a2,e2,i2,o2,u2 (mod MOD)
  return (a+e+i+o+u) % MOD`,

    python: `def countVowelPermutation(n):
    MOD = 10**9+7
    a=e=i=o=u=1
    for _ in range(n-1):
        a,e,i,o,u = (e+i+u)%MOD,(a+i)%MOD,(e+o)%MOD,i%MOD,(i+o)%MOD
    return (a+e+i+o+u)%MOD`,

    javascript: `function countVowelPermutation(n) {
  const MOD = 1e9+7;
  let [a,e,i,o,u] = [1,1,1,1,1];
  for (let x=1; x<n; x++) {
    [a,e,i,o,u] = [
      (e+i+u)%MOD, (a+i)%MOD, (e+o)%MOD, i%MOD, (i+o)%MOD
    ];
  }
  return (a+e+i+o+u)%MOD;
}`,

    java: `public int countVowelPermutation(int n) {
    long MOD=1_000_000_007L, a=1,e=1,i=1,o=1,u=1;
    for (int x=1; x<n; x++) {
        long a2=(e+i+u)%MOD,e2=(a+i)%MOD,i2=(e+o)%MOD,o2=i%MOD,u2=(i+o)%MOD;
        a=a2;e=e2;i=i2;o=o2;u=u2;
    }
    return (int)((a+e+i+o+u)%MOD);
}`,
  },

  defaultInput: {
    n: 5,
  },

  inputFields: [
    {
      name: 'n',
      label: 'String Length (n)',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Length of the vowel strings to count',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const MOD = 1_000_000_007;
    const steps: AlgorithmStep[] = [];

    let a = 1, e = 1, i = 1, o = 1, u = 1;

    steps.push({
      line: 1,
      explanation: `Count vowel permutations of length ${n}. Rules: a->e, e->a/i, i->a/e/o/u, o->i/u, u->a. Start: each vowel has 1 string of length 1.`,
      variables: { n, a, e, i, o, u, total: 5 },
      visualization: {
        type: 'array',
        array: [a, e, i, o, u],
        highlights: {},
        labels: { 0: 'a', 1: 'e', 2: 'i', 3: 'o', 4: 'u' },
      },
    });

    for (let step = 2; step <= Math.min(n, 8); step++) {
      const a2 = (e + i + u) % MOD;
      const e2 = (a + i) % MOD;
      const i2 = (e + o) % MOD;
      const o2 = i % MOD;
      const u2 = (i + o) % MOD;
      a = a2; e = e2; i = i2; o = o2; u = u2;

      const total = (a + e + i + o + u) % MOD;
      steps.push({
        line: 4,
        explanation: `Length ${step}: a=${a}(from e+i+u), e=${e}(from a+i), i=${i}(from e+o), o=${o}(from i), u=${u}(from i+o). Total=${total}.`,
        variables: { length: step, a, e, i, o, u, total },
        visualization: {
          type: 'array',
          array: [a, e, i, o, u],
          highlights: {},
          labels: { 0: 'a', 1: 'e', 2: 'i', 3: 'o', 4: 'u' },
        },
      });
    }

    if (n > 8) {
      for (let step = 9; step <= n; step++) {
        const a2 = (e + i + u) % MOD;
        const e2 = (a + i) % MOD;
        const i2 = (e + o) % MOD;
        const o2 = i % MOD;
        const u2 = (i + o) % MOD;
        a = a2; e = e2; i = i2; o = o2; u = u2;
      }
    }

    const ans = (a + e + i + o + u) % MOD;
    steps.push({
      line: 9,
      explanation: `Total vowel permutations of length ${n}: ${ans} (mod 10^9+7).`,
      variables: { n, answer: ans, a, e, i, o, u },
      visualization: {
        type: 'array',
        array: [a, e, i, o, u],
        highlights: { 0: 'found', 1: 'found', 2: 'found', 3: 'found', 4: 'found' },
        labels: { 0: 'a', 1: 'e', 2: 'i', 3: 'o', 4: 'u' },
      },
    });

    return steps;
  },
};

export default countVowelsPermutation;

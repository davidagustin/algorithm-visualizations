import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfBeautifulPartitions: AlgorithmDefinition = {
  id: 'number-of-beautiful-partitions',
  title: 'Number of Beautiful Partitions',
  leetcodeNumber: 2478,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Count ways to partition a digit string into exactly k non-overlapping substrings each of length >= minLength where the first digit is prime (2,3,5,7) and the last digit is non-prime. dp[i][j] = ways to partition s[i..] into j more parts. Prefix sum optimization reduces complexity.',
  tags: ['dynamic programming', 'string', 'prefix sum', 'counting'],

  code: {
    pseudocode: `function beautifulPartitions(s, k, minLength):
  PRIMES = {'2','3','5','7'}
  n = len(s)
  if s[0] not in PRIMES or s[n-1] in PRIMES: return 0
  dp[i][j] = ways to split s[i..n-1] into j parts
  dp[n][0] = 1 (base: empty suffix, 0 parts remaining)
  for j from 1 to k:
    for i from n down to 0:
      if valid cut position at i:
        dp[i][j] = sum of dp[l][j-1] for valid l >= i+minLength
  return dp[0][k]`,
    python: `def beautifulPartitions(s: str, k: int, minLength: int) -> int:
    MOD = 10**9 + 7
    primes = set('2357')
    n = len(s)
    if s[0] not in primes or s[-1] in primes:
        return 0
    def isPrime(c): return c in primes
    dp = [[0] * (k + 1) for _ in range(n + 1)]
    dp[n][0] = 1
    for j in range(1, k + 1):
        prefix = 0
        for i in range(n - 1, -1, -1):
            if i + minLength <= n and not isPrime(s[i + minLength - 1]) and (i + minLength == n or isPrime(s[i + minLength])):
                prefix = (prefix + dp[i + minLength][j - 1]) % MOD
            dp[i][j] = prefix if isPrime(s[i]) else 0
    return dp[0][k]`,
    javascript: `function beautifulPartitions(s, k, minLength) {
  const MOD = 1e9 + 7;
  const primes = new Set(['2','3','5','7']);
  const n = s.length;
  if (!primes.has(s[0]) || primes.has(s[n-1])) return 0;
  const dp = Array.from({length:n+1}, ()=>new Array(k+1).fill(0));
  dp[n][0] = 1;
  for (let j = 1; j <= k; j++) {
    let prefix = 0;
    for (let i = n-1; i >= 0; i--) {
      const end = i + minLength;
      if (end <= n && !primes.has(s[end-1]) && (end === n || primes.has(s[end])))
        prefix = (prefix + dp[end][j-1]) % MOD;
      dp[i][j] = primes.has(s[i]) ? prefix : 0;
    }
  }
  return dp[0][k];
}`,
    java: `public int beautifulPartitions(String s, int k, int minLength) {
    final int MOD = 1_000_000_007;
    Set<Character> primes = Set.of('2','3','5','7');
    int n = s.length();
    if (!primes.contains(s.charAt(0)) || primes.contains(s.charAt(n-1))) return 0;
    int[][] dp = new int[n+1][k+1];
    dp[n][0] = 1;
    for (int j = 1; j <= k; j++) {
        int prefix = 0;
        for (int i = n-1; i >= 0; i--) {
            int end = i + minLength;
            if (end <= n && !primes.contains(s.charAt(end-1)) && (end==n||primes.contains(s.charAt(end))))
                prefix = (prefix + dp[end][j-1]) % MOD;
            dp[i][j] = primes.contains(s.charAt(i)) ? prefix : 0;
        }
    }
    return dp[0][k];
}`,
  },

  defaultInput: {
    s: '23542185131',
    k: 3,
    minLength: 2,
  },

  inputFields: [
    {
      name: 's',
      label: 'Digit String',
      type: 'string',
      defaultValue: '23542185131',
      placeholder: '23542185131',
      helperText: 'String of digits',
    },
    {
      name: 'k',
      label: 'Number of Partitions (k)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of substrings to partition into',
    },
    {
      name: 'minLength',
      label: 'Min Length',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Minimum length of each partition',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const k = input.k as number;
    const minLength = input.minLength as number;
    const steps: AlgorithmStep[] = [];

    const MOD = 1000000007;
    const primes = new Set(['2', '3', '5', '7']);
    const n = s.length;

    steps.push({
      line: 3,
      explanation: `String "${s}", k=${k}, minLength=${minLength}. Prime digits: {2,3,5,7}. Each part must start with prime and end with non-prime.`,
      variables: { n, k, minLength },
      visualization: {
        type: 'array',
        array: s.split('').map(Number),
        highlights: Object.fromEntries(
          s.split('').map((c, i) => [i, primes.has(c) ? 'found' : 'default'])
        ),
        labels: Object.fromEntries(s.split('').map((c, i) => [i, c])),
      },
    });

    if (!primes.has(s[0]) || primes.has(s[n - 1])) {
      steps.push({
        line: 4,
        explanation: `First char "${s[0]}" is ${primes.has(s[0]) ? 'prime' : 'not prime'} or last char "${s[n - 1]}" is ${primes.has(s[n - 1]) ? 'prime' : 'not prime'}. Return 0.`,
        variables: { result: 0 },
        visualization: {
          type: 'array',
          array: s.split('').map(Number),
          highlights: { 0: 'mismatch', [n - 1]: 'mismatch' },
          labels: {},
        },
      });
      return steps;
    }

    const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(k + 1).fill(0));
    dp[n][0] = 1;

    steps.push({
      line: 5,
      explanation: `dp[n][0] = 1 (base: empty suffix with 0 remaining parts). dp[i][j] = ways to split s[i..] into j parts.`,
      variables: {},
      visualization: {
        type: 'array',
        array: dp[n],
        highlights: { 0: 'found' },
        labels: Object.fromEntries(dp[n].map((_, i) => [i, `j=${i}`])),
      },
    });

    for (let j = 1; j <= k; j++) {
      let prefix = 0;
      for (let i = n - 1; i >= 0; i--) {
        const end = i + minLength;
        if (end <= n && !primes.has(s[end - 1]) && (end === n || primes.has(s[end]))) {
          prefix = (prefix + dp[end][j - 1]) % MOD;
        }
        dp[i][j] = primes.has(s[i]) ? prefix : 0;
      }
      steps.push({
        line: 9,
        explanation: `After j=${j} parts: dp[0][${j}] = ${dp[0][j]}.`,
        variables: { j, 'dp[0][j]': dp[0][j] },
        visualization: {
          type: 'array',
          array: dp[0],
          highlights: { [j]: 'found' },
          labels: Object.fromEntries(dp[0].map((_, i) => [i, `j=${i}`])),
        },
      });
    }

    steps.push({
      line: 10,
      explanation: `Beautiful partitions of "${s}" into k=${k} parts with minLength=${minLength} = ${dp[0][k]}.`,
      variables: { result: dp[0][k] },
      visualization: {
        type: 'array',
        array: dp[0],
        highlights: { [k]: 'found' },
        labels: Object.fromEntries(dp[0].map((_, i) => [i, `j=${i}`])),
      },
    });

    return steps;
  },
};

export default numberOfBeautifulPartitions;

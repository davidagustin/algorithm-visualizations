import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const countSortedVowelStrings: AlgorithmDefinition = {
  id: 'count-sorted-vowel-strings',
  title: 'Count Sorted Vowel Strings',
  leetcodeNumber: 1641,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Count the number of strings of length n consisting of vowels (a, e, i, o, u) in lexicographically sorted order. Uses DP where dp[i][j] = number of sorted strings of length i ending with the j-th vowel. Transition: dp[i][j] = sum of dp[i-1][k] for k <= j.',
  tags: ['dynamic programming', 'math', 'combinatorics', 'string'],

  code: {
    pseudocode: `function countVowelStrings(n):
  // dp[j] = # sorted strings of current length ending at vowel j
  dp = [1, 1, 1, 1, 1]  // a,e,i,o,u each has 1 string of length 1
  for _ in range(n-1):
    for j from 1 to 4:
      dp[j] += dp[j-1]  // can append vowel j after any vowel <= j
  return sum(dp)`,

    python: `def countVowelStrings(n):
    dp = [1]*5
    for _ in range(n-1):
        for j in range(1,5):
            dp[j] += dp[j-1]
    return sum(dp)`,

    javascript: `function countVowelStrings(n) {
  const dp = [1,1,1,1,1];
  for (let k=1; k<n; k++) {
    for (let j=1; j<5; j++) dp[j]+=dp[j-1];
  }
  return dp.reduce((a,b)=>a+b,0);
}`,

    java: `public int countVowelStrings(int n) {
    int[] dp = {1,1,1,1,1};
    for (int k=1; k<n; k++) {
        for (int j=1; j<5; j++) dp[j]+=dp[j-1];
    }
    int ans=0; for(int v:dp)ans+=v; return ans;
}`,
  },

  defaultInput: {
    n: 4,
  },

  inputFields: [
    {
      name: 'n',
      label: 'String Length (n)',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Length of sorted vowel strings to count',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const dp = [1, 1, 1, 1, 1];

    steps.push({
      line: 1,
      explanation: `Count sorted vowel strings of length ${n}. dp[j] = count ending at vowel ${vowels.join('/')}. Length 1: each has exactly 1 string.`,
      variables: { n, dp: { a: 1, e: 1, i: 1, o: 1, u: 1 }, total: 5 },
      visualization: {
        type: 'array',
        array: [...dp],
        highlights: {},
        labels: { 0: 'a', 1: 'e', 2: 'i', 3: 'o', 4: 'u' },
      },
    });

    for (let k = 1; k < Math.min(n, 8); k++) {
      for (let j = 1; j < 5; j++) dp[j] += dp[j - 1];
      const total = dp.reduce((a, b) => a + b, 0);
      steps.push({
        line: 4,
        explanation: `Length ${k + 1}: dp updated by prefix sums. a=${dp[0]}, e=${dp[1]}, i=${dp[2]}, o=${dp[3]}, u=${dp[4]}. Total strings: ${total}.`,
        variables: { length: k + 1, a: dp[0], e: dp[1], i: dp[2], o: dp[3], u: dp[4], total },
        visualization: {
          type: 'array',
          array: [...dp],
          highlights: {},
          labels: { 0: 'a', 1: 'e', 2: 'i', 3: 'o', 4: 'u' },
        },
      });
    }

    if (n > 8) {
      for (let k = 8; k < n; k++) {
        for (let j = 1; j < 5; j++) dp[j] += dp[j - 1];
      }
    }

    const ans = dp.reduce((a, b) => a + b, 0);
    steps.push({
      line: 6,
      explanation: `Total sorted vowel strings of length ${n}: ${ans}.`,
      variables: { n, answer: ans },
      visualization: {
        type: 'array',
        array: [...dp],
        highlights: { 0: 'found', 1: 'found', 2: 'found', 3: 'found', 4: 'found' },
        labels: { 0: 'a', 1: 'e', 2: 'i', 3: 'o', 4: 'u' },
      },
    });

    return steps;
  },
};

export default countSortedVowelStrings;

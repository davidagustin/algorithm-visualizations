import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const longestIdealSubsequence: AlgorithmDefinition = {
  id: 'longest-ideal-subsequence',
  title: 'Longest Ideal Subsequence',
  leetcodeNumber: 2370,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Find the longest ideal subsequence of a string where consecutive characters differ by at most k in absolute ASCII value. Uses DP: for each character, look back at all 26 letters within distance k and take the best. dp[c] = longest ideal subsequence ending with character c.',
  tags: ['dynamic programming', 'string', 'greedy'],

  code: {
    pseudocode: `function longestIdealString(s, k):
  dp = array of 26 zeros  // dp[c] = LIS ending at char c
  for each char c in s:
    best = 0
    for each char prev where |prev-c| <= k:
      best = max(best, dp[prev])
    dp[c] = best + 1
  return max(dp)`,

    python: `def longestIdealString(s, k):
    dp = [0] * 26
    for c in s:
        ci = ord(c) - ord('a')
        best = 0
        for prev in range(max(0,ci-k), min(25,ci+k)+1):
            best = max(best, dp[prev])
        dp[ci] = best + 1
    return max(dp)`,

    javascript: `function longestIdealString(s, k) {
  const dp = new Array(26).fill(0);
  for (const c of s) {
    const ci = c.charCodeAt(0) - 97;
    let best = 0;
    for (let p = Math.max(0,ci-k); p <= Math.min(25,ci+k); p++) {
      best = Math.max(best, dp[p]);
    }
    dp[ci] = best + 1;
  }
  return Math.max(...dp);
}`,

    java: `public int longestIdealString(String s, int k) {
    int[] dp = new int[26];
    for (char c : s.toCharArray()) {
        int ci = c - 'a';
        int best = 0;
        for (int p = Math.max(0,ci-k); p <= Math.min(25,ci+k); p++) {
            best = Math.max(best, dp[p]);
        }
        dp[ci] = best + 1;
    }
    int ans = 0;
    for (int v : dp) ans = Math.max(ans, v);
    return ans;
}`,
  },

  defaultInput: {
    s: 'acfgbd',
    k: 2,
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'acfgbd',
      placeholder: 'acfgbd',
      helperText: 'Lowercase string to find ideal subsequence in',
    },
    {
      name: 'k',
      label: 'Max Difference (k)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Max absolute ASCII difference between consecutive chars',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const dp = new Array(26).fill(0);

    steps.push({
      line: 1,
      explanation: `Longest Ideal Subsequence in "${s}" with k=${k}. dp[c] = longest ideal subsequence ending at character c. Initialize all to 0.`,
      variables: { s, k },
      visualization: {
        type: 'array',
        array: [...dp],
        highlights: {},
        labels: Object.fromEntries(dp.map((_, i) => [i, String.fromCharCode(97 + i)])),
      },
    });

    for (let si = 0; si < s.length; si++) {
      const c = s[si];
      const ci = c.charCodeAt(0) - 97;
      let best = 0;
      for (let p = Math.max(0, ci - k); p <= Math.min(25, ci + k); p++) {
        best = Math.max(best, dp[p]);
      }
      dp[ci] = best + 1;

      const rangeStart = Math.max(0, ci - k);
      const rangeEnd = Math.min(25, ci + k);
      const highlights: Record<number, string> = {};
      for (let p = rangeStart; p <= rangeEnd; p++) highlights[p] = 'comparing';
      highlights[ci] = 'found';

      steps.push({
        line: 4,
        explanation: `Char "${c}" (index ${si}): checked range [${String.fromCharCode(97 + rangeStart)}-${String.fromCharCode(97 + rangeEnd)}], best predecessor length=${best}. dp["${c}"] = ${dp[ci]}.`,
        variables: { char: c, charIndex: si, bestPredecessor: best, dpChar: dp[ci] },
        visualization: {
          type: 'array',
          array: [...dp],
          highlights,
          labels: Object.fromEntries(dp.map((_, i) => [i, String.fromCharCode(97 + i)])),
        },
      });
    }

    const ans = Math.max(...dp);
    const bestChar = String.fromCharCode(97 + dp.indexOf(ans));
    steps.push({
      line: 6,
      explanation: `Longest ideal subsequence length: ${ans} (ends at character "${bestChar}").`,
      variables: { answer: ans, bestEndChar: bestChar },
      visualization: {
        type: 'array',
        array: [...dp],
        highlights: { [dp.indexOf(ans)]: 'found' },
        labels: Object.fromEntries(dp.map((_, i) => [i, String.fromCharCode(97 + i)])),
      },
    });

    return steps;
  },
};

export default longestIdealSubsequence;

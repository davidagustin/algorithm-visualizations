import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const scrambleStringDp: AlgorithmDefinition = {
  id: 'scramble-string-dp',
  title: 'Scramble String (DP)',
  leetcodeNumber: 87,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'A string can be scrambled by splitting it into two parts at any point, optionally swapping them, and recursively applying this to each part. Determine if t is a scrambled version of s. Uses 3D DP with memoization: dp[i][j][k] = whether s[i..i+k-1] can scramble into t[j..j+k-1].',
  tags: ['dynamic programming', 'string', 'recursion', 'memoization'],

  code: {
    pseudocode: `function isScramble(s1, s2):
  if s1 == s2: return true
  if sorted(s1) != sorted(s2): return false
  memo = {}
  def dp(s, t):
    if s == t: return true
    if sorted(s) != sorted(t): return false
    if (s,t) in memo: return memo[(s,t)]
    n = len(s)
    for i from 1 to n-1:
      if (dp(s[:i],t[:i]) and dp(s[i:],t[i:])) or
         (dp(s[:i],t[n-i:]) and dp(s[i:],t[:n-i])):
        memo[(s,t)] = true; return true
    memo[(s,t)] = false; return false
  return dp(s1, s2)`,
    python: `def isScramble(s1: str, s2: str) -> bool:
    from functools import lru_cache
    @lru_cache(maxsize=None)
    def dp(s, t):
        if s == t: return True
        if sorted(s) != sorted(t): return False
        n = len(s)
        for i in range(1, n):
            if (dp(s[:i],t[:i]) and dp(s[i:],t[i:])) or \
               (dp(s[:i],t[n-i:]) and dp(s[i:],t[:n-i])):
                return True
        return False
    return dp(s1, s2)`,
    javascript: `function isScramble(s1, s2) {
  const memo = new Map();
  function dp(s, t) {
    if (s === t) return true;
    if ([...s].sort().join('') !== [...t].sort().join('')) return false;
    const key = s+'#'+t;
    if (memo.has(key)) return memo.get(key);
    const n = s.length;
    for (let i = 1; i < n; i++) {
      if ((dp(s.slice(0,i),t.slice(0,i))&&dp(s.slice(i),t.slice(i)))||
          (dp(s.slice(0,i),t.slice(n-i))&&dp(s.slice(i),t.slice(0,n-i)))) {
        memo.set(key,true); return true;
      }
    }
    memo.set(key,false); return false;
  }
  return dp(s1,s2);
}`,
    java: `public boolean isScramble(String s1, String s2) {
    Map<String,Boolean> memo = new HashMap<>();
    return dp(s1, s2, memo);
}
boolean dp(String s, String t, Map<String,Boolean> memo) {
    if (s.equals(t)) return true;
    char[] sc=s.toCharArray(), tc=t.toCharArray();
    Arrays.sort(sc); Arrays.sort(tc);
    if (!Arrays.equals(sc,tc)) return false;
    String key = s+"#"+t;
    if (memo.containsKey(key)) return memo.get(key);
    int n = s.length();
    for (int i=1;i<n;i++) {
        if ((dp(s.substring(0,i),t.substring(0,i),memo)&&dp(s.substring(i),t.substring(i),memo))||
            (dp(s.substring(0,i),t.substring(n-i),memo)&&dp(s.substring(i),t.substring(0,n-i),memo))) {
            memo.put(key,true); return true;
        }
    }
    memo.put(key,false); return false;
}`,
  },

  defaultInput: {
    s1: 'great',
    s2: 'rgeat',
  },

  inputFields: [
    {
      name: 's1',
      label: 'String S1',
      type: 'string',
      defaultValue: 'great',
      placeholder: 'great',
      helperText: 'Original string',
    },
    {
      name: 's2',
      label: 'String S2',
      type: 'string',
      defaultValue: 'rgeat',
      placeholder: 'rgeat',
      helperText: 'Potentially scrambled string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s1 = input.s1 as string;
    const s2 = input.s2 as string;
    const steps: AlgorithmStep[] = [];
    const n = s1.length;

    const makeViz = (str: string, highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: str.split('').map((c: string) => c.charCodeAt(0) - 96),
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Scramble String: s1="${s1}", s2="${s2}". Is s2 a scrambled version of s1?`,
      variables: { s1, s2, length: n },
      visualization: makeViz(s1, {}, {}),
    });

    // Quick check: same characters
    const s1Sorted = s1.split('').sort().join('');
    const s2Sorted = s2.split('').sort().join('');
    if (s1Sorted !== s2Sorted) {
      steps.push({
        line: 3,
        explanation: `Different character sets: sorted(s1)="${s1Sorted}" != sorted(s2)="${s2Sorted}". Cannot be scrambled. Return false.`,
        variables: { result: false },
        visualization: makeViz(s1, Object.fromEntries(s1.split('').map((_, i) => [i, 'mismatch'])), {}),
      });
      return steps;
    }

    steps.push({
      line: 3,
      explanation: `Both strings have same characters: "${s1Sorted}". Possible scramble. Now check recursive splits.`,
      variables: { sorted: s1Sorted },
      visualization: makeViz(s1,
        Object.fromEntries(s1.split('').map((_, i) => [i, 'active'])),
        Object.fromEntries(s1.split('').map((c, i) => [i, c]))
      ),
    });

    const memo = new Map<string, boolean>();
    const splitLog: Array<{ split: number; s: string; t: string; swapped: boolean; result: boolean }> = [];

    function dp(s: string, t: string): boolean {
      if (s === t) return true;
      if ([...s].sort().join('') !== [...t].sort().join('')) return false;
      const key = s + '#' + t;
      if (memo.has(key)) return memo.get(key)!;
      const ns = s.length;
      for (let i = 1; i < ns; i++) {
        const noSwap = dp(s.slice(0, i), t.slice(0, i)) && dp(s.slice(i), t.slice(i));
        const swap = dp(s.slice(0, i), t.slice(ns - i)) && dp(s.slice(i), t.slice(0, ns - i));
        if (noSwap || swap) {
          if (splitLog.length < 4 && s === s1) {
            splitLog.push({ split: i, s, t, swapped: swap && !noSwap, result: true });
          }
          memo.set(key, true);
          return true;
        }
      }
      memo.set(key, false);
      return false;
    }

    const result = dp(s1, s2);

    for (const log of splitLog) {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < log.split && i < n; i++) highlights[i] = 'active';
      for (let i = log.split; i < n; i++) highlights[i] = 'comparing';
      labels[0] = `split@${log.split}`;

      steps.push({
        line: 9,
        explanation: `Split "${log.s}" at ${log.split}: "${log.s.slice(0, log.split)}" | "${log.s.slice(log.split)}". ${log.swapped ? 'Swap version matches!' : 'No-swap version matches!'} -> scramble confirmed.`,
        variables: { split: log.split, left: log.s.slice(0, log.split), right: log.s.slice(log.split), swapped: log.swapped },
        visualization: makeViz(log.s.slice(0, n), highlights, labels),
      });
    }

    steps.push({
      line: 11,
      explanation: `Result: ${result}. "${s2}" is ${result ? '' : 'NOT '}a scrambled version of "${s1}". Computed ${memo.size} memoized states.`,
      variables: { result, memoStates: memo.size },
      visualization: makeViz(
        s1,
        Object.fromEntries(s1.split('').map((_, i) => [i, result ? 'found' : 'mismatch'])),
        { 0: result ? 'YES' : 'NO' }
      ),
    });

    return steps;
  },
};

export default scrambleStringDp;

import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const wordBreakDp: AlgorithmDefinition = {
  id: 'word-break-dp',
  title: 'Word Break - DP',
  leetcodeNumber: 139,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given a string s and a dictionary wordDict, determine if s can be segmented into dictionary words. dp[i] = true if s[0..i-1] can be segmented. For each position i, try all j < i where dp[j] is true and s[j..i] is in the dictionary.',
  tags: ['dynamic programming', 'hash set', 'string', 'trie'],

  code: {
    pseudocode: `function wordBreak(s, wordDict):
  wordSet = set(wordDict)
  n = len(s)
  dp = boolean array of size n+1, dp[0] = true
  for i from 1 to n:
    for j from 0 to i-1:
      if dp[j] and s[j:i] in wordSet:
        dp[i] = true
        break
  return dp[n]`,
    python: `def wordBreak(s: str, wordDict: list[str]) -> bool:
    wordSet = set(wordDict)
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in wordSet:
                dp[i] = True
                break
    return dp[n]`,
    javascript: `function wordBreak(s, wordDict) {
  const wordSet = new Set(wordDict);
  const n = s.length;
  const dp = new Array(n + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= n; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && wordSet.has(s.slice(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[n];
}`,
    java: `public boolean wordBreak(String s, List<String> wordDict) {
    Set<String> wordSet = new HashSet<>(wordDict);
    int n = s.length();
    boolean[] dp = new boolean[n + 1];
    dp[0] = true;
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j < i; j++) {
            if (dp[j] && wordSet.contains(s.substring(j, i))) {
                dp[i] = true;
                break;
            }
        }
    }
    return dp[n];
}`,
  },

  defaultInput: {
    s: 'leetcode',
    wordDict: ['leet', 'code'],
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'leetcode',
      placeholder: 'leetcode',
      helperText: 'The string to segment',
    },
    {
      name: 'wordDict',
      label: 'Word Dictionary',
      type: 'array',
      defaultValue: ['leet', 'code'],
      placeholder: 'leet,code',
      helperText: 'Dictionary words (comma-separated)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const wordDict = input.wordDict as string[];
    const steps: AlgorithmStep[] = [];

    const wordSet = new Set(wordDict);
    const n = s.length;
    const dp = new Array(n + 1).fill(false);
    dp[0] = true;

    const makeViz = (dpArr: boolean[], highlights: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: dpArr.map(v => (v ? 1 : 0)),
      highlights,
      labels: Object.fromEntries(dpArr.map((_, i) => [i, i < n ? s[i - 1] || '' : 'end'])),
    });

    steps.push({
      line: 3,
      explanation: `String: "${s}", wordDict: [${wordDict.map(w => `"${w}"`).join(', ')}]. dp[0] = true (empty prefix).`,
      variables: { s, wordDict: wordDict.join(','), n },
      visualization: makeViz([...dp], { 0: 'found' }),
    });

    for (let i = 1; i <= n; i++) {
      for (let j = 0; j < i; j++) {
        const sub = s.slice(j, i);
        if (dp[j] && wordSet.has(sub)) {
          dp[i] = true;
          steps.push({
            line: 7,
            explanation: `dp[${i}] = true: dp[${j}] is true and "${sub}" is in wordDict.`,
            variables: { i, j, substring: sub },
            visualization: makeViz([...dp], { [i]: 'found', [j]: 'comparing' }),
          });
          break;
        } else if (dp[j] && !wordSet.has(sub)) {
          steps.push({
            line: 6,
            explanation: `Check s[${j}..${i - 1}] = "${sub}": dp[${j}] is true but "${sub}" not in dict.`,
            variables: { i, j, substring: sub },
            visualization: makeViz([...dp], { [i]: 'active', [j]: 'comparing' }),
          });
        }
      }
      if (!dp[i]) {
        steps.push({
          line: 8,
          explanation: `dp[${i}] remains false. Cannot form s[0..${i - 1}] = "${s.slice(0, i)}" from dict.`,
          variables: { i, prefix: s.slice(0, i) },
          visualization: makeViz([...dp], { [i]: 'mismatch' }),
        });
      }
    }

    steps.push({
      line: 9,
      explanation: `dp[${n}] = ${dp[n]}. String "${s}" ${dp[n] ? 'can' : 'cannot'} be segmented into dictionary words.`,
      variables: { result: dp[n] },
      visualization: makeViz([...dp], { [n]: dp[n] ? 'found' : 'mismatch' }),
    });

    return steps;
  },
};

export default wordBreakDp;

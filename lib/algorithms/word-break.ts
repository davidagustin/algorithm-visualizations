import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const wordBreak: AlgorithmDefinition = {
  id: 'word-break',
  title: 'Word Break',
  leetcodeNumber: 139,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words. dp[i] = true if s[0..i-1] can be segmented using words in the dictionary.',
  tags: ['Dynamic Programming', 'String', 'Hash Map'],
  code: {
    pseudocode: `function wordBreak(s, wordDict):
  n = length(s)
  dp = array of size n+1, all false
  dp[0] = true
  for i from 1 to n:
    for j from 0 to i-1:
      if dp[j] and s[j..i-1] in wordDict:
        dp[i] = true
        break
  return dp[n]`,
    python: `def wordBreak(s, wordDict):
    n = len(s)
    wordSet = set(wordDict)
    dp = [False] * (n + 1)
    dp[0] = True
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in wordSet:
                dp[i] = True
                break
    return dp[n]`,
    javascript: `function wordBreak(s, wordDict) {
  const n = s.length;
  const wordSet = new Set(wordDict);
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
    int n = s.length();
    Set<String> wordSet = new HashSet<>(wordDict);
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
  defaultInput: { s: 'leetcode', wordDict: ['leet', 'code'] },
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
      type: 'string',
      defaultValue: 'leet,code',
      placeholder: 'leet,code',
      helperText: 'Comma-separated dictionary words',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const rawDict = input.wordDict as string | string[];
    const wordDict = Array.isArray(rawDict)
      ? rawDict
      : String(rawDict).split(',').map(w => w.trim()).filter(Boolean);
    const wordSet = new Set(wordDict);
    const n = s.length;
    const steps: AlgorithmStep[] = [];

    const dp: (boolean | null)[] = new Array(n + 1).fill(null);
    const dpVals: (number | null)[] = new Array(n + 1).fill(null);

    const labelArr: string[] = ['""'];
    for (let i = 1; i <= n; i++) labelArr.push(`"${s.slice(0, i)}"`);

    function makeViz(activeIdx: number | null, comparingIndices: number[]): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let i = 0; i <= n; i++) {
        if (dp[i] !== null) {
          highlights[i] = dp[i] ? 'found' : 'mismatch';
        }
      }
      for (const idx of comparingIndices) {
        if (idx >= 0 && idx <= n) highlights[idx] = 'comparing';
      }
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return {
        type: 'dp-table',
        values: dpVals.slice(),
        highlights,
        labels: labelArr,
      };
    }

    steps.push({
      line: 1,
      explanation: `Word Break: can "${s}" be split using [${wordDict.join(', ')}]? Create dp[0..${n}] where dp[i]=1 means s[0..i-1] is segmentable.`,
      variables: { s, wordDict, n },
      visualization: makeViz(null, []),
    });

    dp[0] = true;
    dpVals[0] = 1;
    steps.push({
      line: 3,
      explanation: 'dp[0] = true (base case). Empty string is always segmentable.',
      variables: { 'dp[0]': true },
      visualization: makeViz(0, []),
    });

    for (let i = 1; i <= n; i++) {
      let found = false;
      for (let j = 0; j < i; j++) {
        const word = s.slice(j, i);
        if (dp[j] === true && wordSet.has(word)) {
          found = true;
          steps.push({
            line: 6,
            explanation: `dp[${j}]=true and s[${j}..${i - 1}]="${word}" is in wordDict. So dp[${i}]=true! "${s.slice(0, i)}" is segmentable.`,
            variables: { i, j, word, 'dp[j]': true },
            visualization: makeViz(i, [j]),
          });
          break;
        }
      }
      dp[i] = found;
      dpVals[i] = found ? 1 : 0;
      if (!found) {
        steps.push({
          line: 7,
          explanation: `No valid split found for s[0..${i - 1}]="${s.slice(0, i)}". dp[${i}]=false.`,
          variables: { i, 'dp[i]': false },
          visualization: makeViz(i, []),
        });
      }
    }

    steps.push({
      line: 8,
      explanation: `dp[${n}] = ${dp[n]}. "${s}" ${dp[n] ? 'CAN' : 'CANNOT'} be segmented into dictionary words.`,
      variables: { result: dp[n] },
      visualization: {
        type: 'dp-table',
        values: dpVals.slice(),
        highlights: Object.fromEntries(
          Array.from({ length: n + 1 }, (_, i) => [
            i,
            i === n ? 'active' : dp[i] ? 'found' : 'mismatch',
          ])
        ),
        labels: labelArr,
      },
    });

    return steps;
  },
};

export default wordBreak;

import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const wordBreakIi: AlgorithmDefinition = {
  id: 'word-break-ii',
  title: 'Word Break II',
  leetcodeNumber: 140,
  difficulty: 'Hard',
  category: 'Backtracking',
  description:
    'Given a string s and a dictionary of words, add spaces to s to construct all possible sentences where each word is a valid dictionary word. Use backtracking with memoization: at each position try every prefix and recurse if the prefix is in the dictionary.',
  tags: ['backtracking', 'dynamic programming', 'trie', 'memoization', 'string'],

  code: {
    pseudocode: `function wordBreak(s, wordDict):
  wordSet = set(wordDict)
  memo = {}
  function backtrack(start):
    if start == len(s): return [""]
    if start in memo: return memo[start]
    results = []
    for end in start..len(s)-1:
      word = s[start..end]
      if word in wordSet:
        rest = backtrack(end+1)
        for sentence in rest:
          results.append(word + (if sentence then " " + sentence else ""))
    memo[start] = results
    return results
  return backtrack(0)`,
    python: `def wordBreak(s: str, wordDict: list[str]) -> list[str]:
    wordSet = set(wordDict)
    memo = {}
    def bt(start):
        if start == len(s): return ['']
        if start in memo: return memo[start]
        res = []
        for end in range(start, len(s)):
            word = s[start:end+1]
            if word in wordSet:
                for rest in bt(end + 1):
                    res.append(word + (' ' + rest if rest else ''))
        memo[start] = res
        return res
    return bt(0)`,
    javascript: `function wordBreak(s, wordDict) {
  const wordSet = new Set(wordDict);
  const memo = new Map();
  function bt(start) {
    if (start === s.length) return [''];
    if (memo.has(start)) return memo.get(start);
    const res = [];
    for (let end = start; end < s.length; end++) {
      const word = s.slice(start, end + 1);
      if (wordSet.has(word)) {
        for (const rest of bt(end + 1)) {
          res.push(word + (rest ? ' ' + rest : ''));
        }
      }
    }
    memo.set(start, res);
    return res;
  }
  return bt(0);
}`,
    java: `public List<String> wordBreak(String s, List<String> wordDict) {
    Set<String> wordSet = new HashSet<>(wordDict);
    Map<Integer, List<String>> memo = new HashMap<>();
    return bt(s, wordSet, 0, memo);
}
private List<String> bt(String s, Set<String> ws, int start, Map<Integer, List<String>> memo) {
    if (start == s.length()) return List.of("");
    if (memo.containsKey(start)) return memo.get(start);
    List<String> res = new ArrayList<>();
    for (int end = start; end < s.length(); end++) {
        String word = s.substring(start, end + 1);
        if (ws.contains(word)) {
            for (String rest : bt(s, ws, end + 1, memo))
                res.add(word + (rest.isEmpty() ? "" : " " + rest));
        }
    }
    memo.put(start, res);
    return res;
}`,
  },

  defaultInput: { s: 'catsanddog', wordDict: ['cat', 'cats', 'and', 'sand', 'dog'] },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'catsanddog',
      placeholder: 'catsanddog',
      helperText: 'String to segment into words',
    },
    {
      name: 'wordDict',
      label: 'Word Dictionary',
      type: 'array',
      defaultValue: ['cat', 'cats', 'and', 'sand', 'dog'],
      placeholder: 'cat,cats,and,sand,dog',
      helperText: 'Comma-separated dictionary words',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const wordDict = input.wordDict as string[];
    const steps: AlgorithmStep[] = [];
    const wordSet = new Set(wordDict);

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: s.split('').map((_, i) => i),
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Word Break II for "${s}" with dictionary [${wordDict.join(', ')}]. Find all sentence segmentations.`,
      variables: { s, dictionarySize: wordDict.length },
      visualization: makeViz({}, Object.fromEntries(s.split('').map((c, i) => [i, c]))),
    });

    const memo = new Map<number, string[]>();

    function backtrack(start: number): string[] {
      if (start === s.length) return [''];
      if (memo.has(start)) return memo.get(start)!;

      const res: string[] = [];

      for (let end = start; end < s.length; end++) {
        const word = s.slice(start, end + 1);
        const inDict = wordSet.has(word);

        if (steps.length < 30) {
          const h: Record<number, string> = {};
          const l: Record<number, string> = {};
          s.split('').forEach((c, i) => {
            if (i < start) { h[i] = 'visited'; l[i] = c; }
            else if (i >= start && i <= end) { h[i] = inDict ? 'active' : 'mismatch'; l[i] = c; }
            else { l[i] = c; }
          });
          steps.push({
            line: 7,
            explanation: `Try word "${word}" starting at index ${start}: ${inDict ? 'FOUND in dictionary' : 'not in dictionary'}.`,
            variables: { word, start, end, inDictionary: inDict },
            visualization: makeViz(h, l),
          });
        }

        if (inDict) {
          const rest = backtrack(end + 1);
          for (const sentence of rest) {
            res.push(word + (sentence ? ' ' + sentence : ''));
          }
        }
      }

      memo.set(start, res);
      return res;
    }

    const results = backtrack(0);

    results.forEach(sentence => {
      const h: Record<number, string> = {};
      s.split('').forEach((_, i) => { h[i] = 'found'; });
      steps.push({
        line: 14,
        explanation: `Valid sentence: "${sentence}"`,
        variables: { sentence },
        visualization: makeViz(h, Object.fromEntries(s.split('').map((c, i) => [i, c]))),
      });
    });

    steps.push({
      line: 15,
      explanation: `Word Break II complete. Found ${results.length} sentence(s): ${results.map(r => '"' + r + '"').join(', ')}`,
      variables: { totalSentences: results.length, results },
      visualization: makeViz({}, Object.fromEntries(s.split('').map((c, i) => [i, c]))),
    });

    return steps;
  },
};

export default wordBreakIi;

import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const concatenatedWords: AlgorithmDefinition = {
  id: 'concatenated-words',
  title: 'Concatenated Words',
  leetcodeNumber: 472,
  difficulty: 'Hard',
  category: 'Trie',
  description:
    'Given a list of words, find all words that can be formed by concatenating two or more shorter words from the same list. Build a trie from all words, then use DP for each word: dp[i] = true if the prefix of length i can be formed by one or more complete words in the trie. A word is concatenated if dp[n] is true using at least 2 sub-words.',
  tags: ['trie', 'dynamic programming', 'string', 'dfs'],

  code: {
    pseudocode: `function findAllConcatenatedWords(words):
  trie = buildTrie(words)
  result = []
  for word in words:
    n = len(word)
    dp = [False] * (n + 1)
    dp[0] = True
    wordCount = [0] * (n + 1)
    for i in range(1, n + 1):
      for j in range(i):
        if dp[j] and trieContains(trie, word[j:i]):
          dp[i] = True
          wordCount[i] = wordCount[j] + 1
    if dp[n] and wordCount[n] >= 2:
      result.append(word)
  return result`,

    python: `def findAllConcatenatedWordsInADict(words):
    word_set = set(words)
    from functools import lru_cache
    def can_form(word):
        @lru_cache(None)
        def dp(i, count):
            if i == len(word): return count >= 2
            for j in range(i + 1, len(word) + 1):
                if word[i:j] in word_set and dp(j, count + 1):
                    return True
            return False
        return dp(0, 0)
    return [w for w in words if can_form(w)]`,

    javascript: `function findAllConcatenatedWordsInADict(words) {
  const set = new Set(words);
  function canForm(word) {
    const n = word.length;
    const dp = new Array(n + 1).fill(0);
    dp[0] = 1;
    for (let i = 1; i <= n; i++) {
      for (let j = 0; j < i; j++) {
        if (dp[j] > 0 && set.has(word.slice(j, i))) {
          dp[i] = Math.max(dp[i], dp[j] + 1);
        }
      }
    }
    return dp[n] >= 3; // root + 2 pieces minimum
  }
  return words.filter(canForm);
}`,

    java: `public List<String> findAllConcatenatedWordsInADict(String[] words) {
    Set<String> set = new HashSet<>(Arrays.asList(words));
    List<String> res = new ArrayList<>();
    for (String w : words) {
        int n = w.length();
        int[] dp = new int[n + 1];
        dp[0] = 1;
        for (int i = 1; i <= n; i++)
            for (int j = 0; j < i; j++)
                if (dp[j] > 0 && set.contains(w.substring(j, i)))
                    dp[i] = Math.max(dp[i], dp[j] + 1);
        if (dp[n] >= 3) res.add(w);
    }
    return res;
}`,
  },

  defaultInput: {
    words: ['cat', 'cats', 'catsdogcats', 'dog', 'dogcatsdog', 'rat', 'ratcatdogcat'],
  },

  inputFields: [
    {
      name: 'words',
      label: 'Words',
      type: 'array',
      defaultValue: ['cat', 'cats', 'catsdogcats', 'dog', 'dogcatsdog', 'rat', 'ratcatdogcat'],
      placeholder: 'cat,cats,catsdogcats,dog',
      helperText: 'Words to check for concatenation',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const words = input.words as string[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    const wordSet = new Set(words);
    const result: string[] = [];

    steps.push({
      line: 1,
      explanation: `Building word set from ${words.length} words. For each word, use DP to check if it can be split into 2+ sub-words from the set.`,
      variables: { words: words.length },
      visualization: makeViz(words.map((w) => w.length), {}, Object.fromEntries(words.map((w, i) => [i, w]))),
    });

    for (let wi = 0; wi < words.length; wi++) {
      const word = words[wi];
      const n = word.length;
      const dp = new Array(n + 1).fill(0);
      dp[0] = 1;

      steps.push({
        line: 6,
        explanation: `Checking word "${word}" (length ${n}). dp[0] = 1. For each position i, check all sub-words word[j..i] in the set.`,
        variables: { word, length: n },
        visualization: makeViz(dp, { 0: 'active' }, Object.fromEntries(dp.map((v, i) => [i, i.toString()]))),
      });

      for (let i = 1; i <= n; i++) {
        for (let j = 0; j < i; j++) {
          const sub = word.slice(j, i);
          if (dp[j] > 0 && wordSet.has(sub)) {
            dp[i] = Math.max(dp[i], dp[j] + 1);
          }
        }
        if (dp[i] > 0) {
          steps.push({
            line: 9,
            explanation: `dp[${i}] = ${dp[i]}: the prefix "${word.slice(0, i)}" can be formed by ${dp[i] - 1} complete word(s).`,
            variables: { position: i, prefix: word.slice(0, i), subWordCount: dp[i] - 1 },
            visualization: makeViz([...dp], Object.fromEntries(dp.map((v, idx) => [idx, v > 0 ? (idx === i ? 'active' : 'found') : 'default'])), Object.fromEntries(dp.map((v, idx) => [idx, idx.toString()]))),
          });
        }
      }

      const isConcatenated = dp[n] >= 3;
      if (isConcatenated) {
        result.push(word);
      }

      steps.push({
        line: 12,
        explanation: `"${word}": dp[${n}] = ${dp[n]}. ${isConcatenated ? `CONCATENATED - formed from ${dp[n] - 1} sub-words. Adding to result.` : 'Not a concatenated word (not enough sub-words or not reachable).'}`,
        variables: { word, dpN: dp[n], isConcatenated },
        visualization: makeViz([...dp], { [n]: isConcatenated ? 'found' : 'mismatch' }, Object.fromEntries(dp.map((v, idx) => [idx, idx.toString()]))),
      });
    }

    steps.push({
      line: 13,
      explanation: `Found ${result.length} concatenated word(s): [${result.join(', ')}].`,
      variables: { result: result.join(', '), count: result.length },
      visualization: makeViz(words.map((w) => (result.includes(w) ? w.length : 0)), Object.fromEntries(words.map((w, i) => [i, result.includes(w) ? 'found' : 'default'])), Object.fromEntries(words.map((w, i) => [i, w]))),
    });

    return steps;
  },
};

export default concatenatedWords;

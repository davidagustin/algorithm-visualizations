import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const longestStringChain: AlgorithmDefinition = {
  id: 'longest-string-chain',
  title: 'Longest String Chain',
  leetcodeNumber: 1048,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given a list of words, find the longest chain where each word is a predecessor of the next (differs by one letter insertion). Sort words by length, then dp[word] = longest chain ending at that word. For each word, try removing each character to find a predecessor.',
  tags: ['Dynamic Programming', 'Hash Map', 'String'],
  code: {
    pseudocode: `function longestStrChain(words):
  sort words by length
  dp = map word -> chain length (default 1)
  for each word in words:
    for i from 0 to len(word):
      pred = word without word[i]
      if pred in dp:
        dp[word] = max(dp[word], dp[pred] + 1)
  return max(dp.values())`,
    python: `def longestStrChain(words):
    words.sort(key=len)
    dp = {}
    for word in words:
        dp[word] = 1
        for i in range(len(word)):
            pred = word[:i] + word[i+1:]
            if pred in dp:
                dp[word] = max(dp[word], dp[pred] + 1)
    return max(dp.values())`,
    javascript: `function longestStrChain(words) {
  words.sort((a, b) => a.length - b.length);
  const dp = new Map();
  let res = 1;
  for (const word of words) {
    dp.set(word, 1);
    for (let i = 0; i < word.length; i++) {
      const pred = word.slice(0, i) + word.slice(i+1);
      if (dp.has(pred)) {
        dp.set(word, Math.max(dp.get(word), dp.get(pred) + 1));
      }
    }
    res = Math.max(res, dp.get(word));
  }
  return res;
}`,
    java: `public int longestStrChain(String[] words) {
    Arrays.sort(words, Comparator.comparingInt(String::length));
    Map<String, Integer> dp = new HashMap<>();
    int res = 1;
    for (String word : words) {
        dp.put(word, 1);
        for (int i = 0; i < word.length(); i++) {
            String pred = word.substring(0, i) + word.substring(i+1);
            if (dp.containsKey(pred)) {
                dp.put(word, Math.max(dp.get(word), dp.get(pred) + 1));
            }
        }
        res = Math.max(res, dp.get(word));
    }
    return res;
}`,
  },
  defaultInput: { words: ['a', 'b', 'ba', 'bca', 'bda', 'bdca'] },
  inputFields: [
    {
      name: 'words',
      label: 'Words',
      type: 'string',
      defaultValue: 'a,b,ba,bca,bda,bdca',
      placeholder: 'a,b,ba,bca,bda,bdca',
      helperText: 'Comma-separated words (lowercase letters only)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawWords = input.words as string | string[];
    const wordsInput = Array.isArray(rawWords)
      ? rawWords
      : String(rawWords).split(',').map(w => w.trim()).filter(Boolean);
    const words = [...wordsInput].sort((a, b) => a.length - b.length);
    const steps: AlgorithmStep[] = [];

    const dp: Map<string, number> = new Map();
    let result = 1;

    // Build array-based visualization: words sorted by length
    const vals: (number | null)[] = new Array(words.length).fill(null);
    const labels: string[] = words.slice();

    function makeViz(activeIdx: number | null, comparingIndices: number[]): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let i = 0; i < words.length; i++) {
        if (vals[i] !== null) highlights[i] = 'found';
      }
      for (const idx of comparingIndices) {
        if (idx >= 0 && idx < words.length) highlights[idx] = 'comparing';
      }
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'dp-table', values: vals.slice(), highlights, labels };
    }

    steps.push({
      line: 1,
      explanation: `Longest String Chain: sort words by length → [${words.join(', ')}]. dp[word] = longest chain ending at that word.`,
      variables: { words, sortedWords: [...words] },
      visualization: makeViz(null, []),
    });

    for (let wi = 0; wi < words.length; wi++) {
      const word = words[wi];
      dp.set(word, 1);
      vals[wi] = 1;

      steps.push({
        line: 3,
        explanation: `word="${word}" (len=${word.length}). Initialize dp["${word}"]=1. Try removing each letter to find predecessors.`,
        variables: { word },
        visualization: makeViz(wi, []),
      });

      for (let i = 0; i < word.length; i++) {
        const pred = word.slice(0, i) + word.slice(i + 1);
        if (dp.has(pred)) {
          const predIdx = words.indexOf(pred);
          const candidate = (dp.get(pred) as number) + 1;
          if (candidate > (dp.get(word) as number)) {
            dp.set(word, candidate);
            vals[wi] = candidate;
            if (candidate > result) result = candidate;
            steps.push({
              line: 5,
              explanation: `Remove word[${i}]='${word[i]}' → pred="${pred}". dp["${pred}"]=${dp.get(pred) as number - 1}+1=${candidate} > current dp["${word}"]=${vals[wi] as number - 1}. Update dp["${word}"]=${candidate}.`,
              variables: { pred, 'dp[pred]': dp.get(pred), candidate },
              visualization: makeViz(wi, predIdx >= 0 ? [predIdx] : []),
            });
          }
        }
      }

      steps.push({
        line: 6,
        explanation: `dp["${word}"] = ${vals[wi]}. Longest chain ending at "${word}" has length ${vals[wi]}.`,
        variables: { word, 'dp[word]': vals[wi] },
        visualization: makeViz(wi, []),
      });
    }

    const maxIdx = vals.indexOf(Math.max(...(vals.filter(v => v !== null) as number[])));
    steps.push({
      line: 7,
      explanation: `max(dp) = ${result}. The longest string chain has length ${result}, ending at "${words[maxIdx]}".`,
      variables: { result },
      visualization: {
        type: 'dp-table',
        values: vals.slice(),
        highlights: Object.fromEntries(
          vals.map((v, i) => [i, i === maxIdx ? 'active' : v !== null ? 'found' : 'default'])
        ),
        labels,
      },
    });

    return steps;
  },
};

export default longestStringChain;

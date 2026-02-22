import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const palindromePairs: AlgorithmDefinition = {
  id: 'palindrome-pairs',
  title: 'Palindrome Pairs',
  leetcodeNumber: 336,
  difficulty: 'Hard',
  category: 'Trie',
  description:
    'Given a list of unique words, find all pairs of distinct indices (i, j) such that words[i] + words[j] is a palindrome. For each word, check: (1) its reverse exists in the map and (2) splitting the word at each position to see if one part is a palindrome and the other reversed is in the map. Uses a hash map for O(k) lookups.',
  tags: ['trie', 'hash map', 'palindrome', 'string'],

  code: {
    pseudocode: `function palindromePairs(words):
  wordMap = {word: idx for idx, word in enumerate(words)}
  result = []
  for i, word in enumerate(words):
    for k in 0..len(word):
      left = word[0:k], right = word[k:]
      if isPalin(left) and reverse(right) in wordMap:
        j = wordMap[reverse(right)]
        if j != i: result.add([j, i])
      if isPalin(right) and reverse(left) in wordMap:
        j = wordMap[reverse(left)]
        if j != i and k != 0: result.add([i, j])
  return result`,

    python: `def palindromePairs(words):
    word_map = {w: i for i, w in enumerate(words)}
    result = []
    def is_palin(s): return s == s[::-1]
    for i, word in enumerate(words):
        for k in range(len(word) + 1):
            left, right = word[:k], word[k:]
            if is_palin(left):
                rev_right = right[::-1]
                if rev_right in word_map and word_map[rev_right] != i:
                    result.append([word_map[rev_right], i])
            if k != 0 and is_palin(right):
                rev_left = left[::-1]
                if rev_left in word_map and word_map[rev_left] != i:
                    result.append([i, word_map[rev_left]])
    return result`,

    javascript: `function palindromePairs(words) {
  const wordMap = new Map(words.map((w, i) => [w, i]));
  const isPalin = s => s === [...s].reverse().join('');
  const result = [];
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    for (let k = 0; k <= word.length; k++) {
      const [left, right] = [word.slice(0, k), word.slice(k)];
      if (isPalin(left)) {
        const j = wordMap.get([...right].reverse().join(''));
        if (j !== undefined && j !== i) result.push([j, i]);
      }
      if (k !== 0 && isPalin(right)) {
        const j = wordMap.get([...left].reverse().join(''));
        if (j !== undefined && j !== i) result.push([i, j]);
      }
    }
  }
  return result;
}`,

    java: `public List<List<Integer>> palindromePairs(String[] words) {
    Map<String, Integer> map = new HashMap<>();
    for (int i = 0; i < words.length; i++) map.put(words[i], i);
    List<List<Integer>> res = new ArrayList<>();
    for (int i = 0; i < words.length; i++) {
        for (int k = 0; k <= words[i].length(); k++) {
            String left = words[i].substring(0, k), right = words[i].substring(k);
            if (isPalin(left)) {
                String rev = new StringBuilder(right).reverse().toString();
                if (map.containsKey(rev) && map.get(rev) != i)
                    res.add(Arrays.asList(map.get(rev), i));
            }
            if (k != 0 && isPalin(right)) {
                String rev = new StringBuilder(left).reverse().toString();
                if (map.containsKey(rev) && map.get(rev) != i)
                    res.add(Arrays.asList(i, map.get(rev)));
            }
        }
    }
    return res;
}`,
  },

  defaultInput: {
    words: ['abcd', 'dcba', 'lls', 's', 'sssll'],
  },

  inputFields: [
    {
      name: 'words',
      label: 'Words (JSON)',
      type: 'string',
      defaultValue: '["abcd","dcba","lls","s","sssll"]',
      placeholder: '["abcd","dcba","lls"]',
      helperText: 'JSON array of unique words',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const words = (typeof input.words === 'string'
      ? JSON.parse(input.words)
      : input.words) as string[];
    const steps: AlgorithmStep[] = [];

    const wordMap = new Map(words.map((w, i) => [w, i]));
    const isPalin = (s: string) => s === s.split('').reverse().join('');
    const result: number[][] = [];

    steps.push({
      line: 1,
      explanation: `Words: [${words.map(w => `"${w}"`).join(', ')}]. Build word-to-index map.`,
      variables: { words: words.join(', ') },
      visualization: {
        type: 'array',
        array: words.map((_, i) => i),
        highlights: {},
        labels: Object.fromEntries(words.map((w, i) => [i, `"${w}"`])),
      },
    });

    for (let i = 0; i < words.length; i++) {
      const word = words[i];

      steps.push({
        line: 3,
        explanation: `Checking word[${i}]="${word}". Split at each position to find palindrome pairs.`,
        variables: { i, word },
        visualization: {
          type: 'array',
          array: words.map((_, j) => j),
          highlights: { [i]: 'active' },
          labels: Object.fromEntries(words.map((w, j) => [j, j === i ? `"${w}" *` : `"${w}"`])),
        },
      });

      for (let k = 0; k <= word.length; k++) {
        const left = word.slice(0, k);
        const right = word.slice(k);
        const revRight = right.split('').reverse().join('');
        const revLeft = left.split('').reverse().join('');

        if (isPalin(left)) {
          const j = wordMap.get(revRight);
          if (j !== undefined && j !== i) {
            result.push([j, i]);
            steps.push({
              line: 7,
              explanation: `Split: left="${left}"(palindrome) + right="${right}". rev(right)="${revRight}" found at index ${j}. Pair: [${j},${i}] => "${words[j]}${word}" is a palindrome.`,
              variables: { left, right, revRight, j, i, pair: `[${j},${i}]` },
              visualization: {
                type: 'array',
                array: words.map((_, idx) => idx),
                highlights: { [i]: 'active', [j]: 'found' },
                labels: Object.fromEntries(words.map((w, idx) => [idx, `"${w}"`])),
              },
            });
          }
        }

        if (k !== 0 && isPalin(right)) {
          const j = wordMap.get(revLeft);
          if (j !== undefined && j !== i) {
            result.push([i, j]);
            steps.push({
              line: 10,
              explanation: `Split: left="${left}" + right="${right}"(palindrome). rev(left)="${revLeft}" found at index ${j}. Pair: [${i},${j}] => "${word}${words[j]}" is a palindrome.`,
              variables: { left, right, revLeft, i, j, pair: `[${i},${j}]` },
              visualization: {
                type: 'array',
                array: words.map((_, idx) => idx),
                highlights: { [i]: 'active', [j]: 'found' },
                labels: Object.fromEntries(words.map((w, idx) => [idx, `"${w}"`])),
              },
            });
          }
        }

        if (steps.length > 35) break;
      }
      if (steps.length > 35) break;
    }

    steps.push({
      line: 11,
      explanation: `Done. Palindrome pairs: ${JSON.stringify(result)}.`,
      variables: { result: JSON.stringify(result) },
      visualization: {
        type: 'array',
        array: result.length > 0 ? result.map((_, i) => i) : [0],
        highlights: Object.fromEntries(result.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(result.map((pair, i) => [i, `[${pair[0]},${pair[1]}]`])),
      },
    });

    return steps;
  },
};

export default palindromePairs;

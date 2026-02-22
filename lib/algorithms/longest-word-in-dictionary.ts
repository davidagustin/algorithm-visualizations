import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestWordInDictionary: AlgorithmDefinition = {
  id: 'longest-word-in-dictionary',
  title: 'Longest Word in Dictionary',
  leetcodeNumber: 720,
  difficulty: 'Medium',
  category: 'Trie',
  description:
    'Find the longest word in the dictionary that can be built one character at a time by other words in the dictionary. Insert all words into a trie. A word is valid if every prefix of length 1 through len-1 exists in the dictionary (every prefix node is marked as end of word). BFS/DFS through the trie to find the longest valid path.',
  tags: ['Trie', 'Hash Map', 'String'],
  code: {
    pseudocode: `function longestWord(words):
  sort words lexicographically
  insert all words into trie
  result = ""
  BFS/DFS trie keeping only isEnd paths:
    for each node where isEnd = true:
      advance to children
      track current prefix
  return longest prefix found`,
    python: `def longestWord(words):
    words.sort()
    trie = {'#': False}
    for w in words:
        node = trie
        for ch in w:
            node = node.setdefault(ch, {'#': False})
        node['#'] = True
    # BFS only through valid (isEnd) paths
    result = ""
    queue = [("", trie)]
    while queue:
        prefix, node = queue.pop(0)
        for ch, child in node.items():
            if ch == '#': continue
            if child.get('#'):
                new_prefix = prefix + ch
                if len(new_prefix) > len(result) or \
                   (len(new_prefix) == len(result) and new_prefix < result):
                    result = new_prefix
                queue.append((new_prefix, child))
    return result`,
    javascript: `function longestWord(words) {
  const set = new Set(words);
  words.sort();
  let result = "";
  for (const word of words) {
    let valid = true;
    for (let i = 1; i < word.length; i++) {
      if (!set.has(word.slice(0, i))) { valid = false; break; }
    }
    if (valid && (word.length > result.length ||
      (word.length === result.length && word < result)))
      result = word;
  }
  return result;
}`,
    java: `public String longestWord(String[] words) {
    Set<String> set = new HashSet<>(Arrays.asList(words));
    Arrays.sort(words);
    String result = "";
    for (String word : words) {
        boolean valid = true;
        for (int i = 1; i < word.length(); i++) {
            if (!set.contains(word.substring(0, i))) { valid = false; break; }
        }
        if (valid && (word.length() > result.length() ||
            (word.length() == result.length() && word.compareTo(result) < 0)))
            result = word;
    }
    return result;
}`,
  },
  defaultInput: { words: ['w', 'wo', 'wor', 'worl', 'world'] },
  inputFields: [
    {
      name: 'words',
      label: 'Dictionary Words',
      type: 'array',
      defaultValue: ['w', 'wo', 'wor', 'worl', 'world'],
      placeholder: '["w","wo","wor","worl","world"]',
      helperText: 'Array of dictionary words',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const words = (input.words as string[]).slice();
    const steps: AlgorithmStep[] = [];

    const wordSet = new Set(words);
    const sorted = [...words].sort();

    steps.push({
      line: 2,
      explanation: `Find longest word buildable one character at a time. Words: [${sorted.join(', ')}]. For each word, verify every prefix (length 1..len-1) exists in the dictionary.`,
      variables: { words: sorted },
      visualization: {
        type: 'array',
        array: sorted.map((_, i) => i),
        highlights: {},
        labels: Object.fromEntries(sorted.map((w, i) => [i, w])),
        auxData: { label: 'Dictionary', entries: sorted.map(w => ({ key: w, value: `len=${w.length}` })) },
      },
    });

    let result = '';

    for (let wi = 0; wi < sorted.length; wi++) {
      const word = sorted[wi];
      let valid = true;
      let failedPrefix = '';

      steps.push({
        line: 4,
        explanation: `Check word "${word}": verify all prefixes exist in dictionary.`,
        variables: { word },
        visualization: {
          type: 'array',
          array: word.split('').map((_, i) => i),
          highlights: {},
          labels: Object.fromEntries(word.split('').map((ch, i) => [i, ch])),
          auxData: {
            label: `Checking "${word}"`,
            entries: [
              { key: 'word', value: word },
              { key: 'current best', value: result || '(none)' },
            ],
          },
        },
      });

      for (let i = 1; i < word.length; i++) {
        const prefix = word.slice(0, i);
        const exists = wordSet.has(prefix);
        if (!exists) {
          valid = false;
          failedPrefix = prefix;
          break;
        }

        const hl: Record<number, string> = {};
        for (let j = 0; j < word.length; j++) {
          if (j < i) hl[j] = 'found';
          else if (j === i) hl[j] = 'active';
        }

        steps.push({
          line: 6,
          explanation: `Prefix "${prefix}" ${exists ? 'EXISTS' : 'MISSING'} in dictionary.`,
          variables: { prefix, exists },
          visualization: {
            type: 'array',
            array: word.split('').map((_, idx) => idx),
            highlights: hl,
            labels: Object.fromEntries(word.split('').map((ch, idx) => [idx, ch])),
            auxData: {
              label: `Prefix check`,
              entries: [
                { key: 'prefix', value: prefix },
                { key: 'in dict?', value: String(exists) },
              ],
            },
          },
        });

        if (!exists) break;
      }

      const wordHl: Record<number, string> = {};
      for (let j = 0; j < word.length; j++) wordHl[j] = valid ? 'found' : 'mismatch';
      const isNewBest = valid && (word.length > result.length || (word.length === result.length && word < result));
      if (isNewBest) result = word;

      const wiHl: Record<number, string> = {};
      for (let j = 0; j <= wi; j++) wiHl[j] = j < wi ? 'visited' : (valid ? 'found' : 'mismatch');

      steps.push({
        line: 8,
        explanation: valid
          ? `"${word}" is valid! All prefixes exist. ${isNewBest ? `New best result: "${word}"` : `Not longer than current best "${result}".`}`
          : `"${word}" is INVALID. Prefix "${failedPrefix}" not in dictionary. Skip.`,
        variables: { word, valid, result },
        visualization: {
          type: 'array',
          array: sorted.map((_, i) => i),
          highlights: wiHl,
          labels: Object.fromEntries(sorted.map((w, i) => [i, w])),
          auxData: {
            label: 'Progress',
            entries: [
              { key: `"${word}"`, value: valid ? 'valid' : `invalid (missing "${failedPrefix}")` },
              { key: 'best so far', value: result || '(none)' },
            ],
          },
        },
      });
    }

    const finalHl: Record<number, string> = {};
    for (let j = 0; j < sorted.length; j++) finalHl[j] = sorted[j] === result ? 'found' : 'visited';

    steps.push({
      line: 9,
      explanation: `Done! Longest word buildable one character at a time: "${result}".`,
      variables: { result },
      visualization: {
        type: 'array',
        array: sorted.map((_, i) => i),
        highlights: finalHl,
        labels: Object.fromEntries(sorted.map((w, i) => [i, w])),
        auxData: { label: 'Result', entries: [{ key: 'longest word', value: result }] },
      },
    });

    return steps;
  },
};

export default longestWordInDictionary;

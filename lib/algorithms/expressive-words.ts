import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const expressiveWords: AlgorithmDefinition = {
  id: 'expressive-words',
  title: 'Expressive Words',
  leetcodeNumber: 809,
  difficulty: 'Medium',
  category: 'String',
  description:
    'A string is stretchy if it can be made from another string by extending groups of characters. Specifically, a group of size k >= 3 in the original can be extended, or groups that are already size >= 3 in the query must match. Count how many words can be "stretched" to match the given string s.',
  tags: ['string', 'two pointers', 'run-length encoding'],

  code: {
    pseudocode: `function expressiveWords(s, words):
  count = 0
  for word in words:
    if isStretchy(s, word):
      count++
  return count

function isStretchy(s, word):
  i = 0, j = 0
  while i < len(s) and j < len(word):
    if s[i] != word[j]: return false
    // count runs
    lenS = run length in s starting at i
    lenW = run length in word starting at j
    if lenS < lenW: return false
    if lenS != lenW and lenS < 3: return false
    i += lenS, j += lenW
  return i == len(s) and j == len(word)`,

    python: `def expressiveWords(s: str, words: list[str]) -> int:
    def isStretchy(s, word):
        i = j = 0
        while i < len(s) and j < len(word):
            if s[i] != word[j]: return False
            lenS = lenW = 0
            c = s[i]
            while i < len(s) and s[i] == c: i += 1; lenS += 1
            while j < len(word) and word[j] == c: j += 1; lenW += 1
            if lenS < lenW: return False
            if lenS != lenW and lenS < 3: return False
        return i == len(s) and j == len(word)
    return sum(isStretchy(s, w) for w in words)`,

    javascript: `function expressiveWords(s, words) {
  function isStretchy(s, word) {
    let i = 0, j = 0;
    while (i < s.length && j < word.length) {
      if (s[i] !== word[j]) return false;
      let lenS = 0, lenW = 0;
      const c = s[i];
      while (i < s.length && s[i] === c) { i++; lenS++; }
      while (j < word.length && word[j] === c) { j++; lenW++; }
      if (lenS < lenW || (lenS !== lenW && lenS < 3)) return false;
    }
    return i === s.length && j === word.length;
  }
  return words.filter(w => isStretchy(s, w)).length;
}`,

    java: `public int expressiveWords(String s, String[] words) {
    int count = 0;
    for (String word : words) if (isStretchy(s, word)) count++;
    return count;
}
private boolean isStretchy(String s, String word) {
    int i = 0, j = 0;
    while (i < s.length() && j < word.length()) {
        if (s.charAt(i) != word.charAt(j)) return false;
        int lenS = 0, lenW = 0;
        char c = s.charAt(i);
        while (i < s.length() && s.charAt(i) == c) { i++; lenS++; }
        while (j < word.length() && word.charAt(j) == c) { j++; lenW++; }
        if (lenS < lenW || (lenS != lenW && lenS < 3)) return false;
    }
    return i == s.length() && j == word.length();
}`,
  },

  defaultInput: {
    s: 'heeellooo',
    words: 'hello,hi,helo',
  },

  inputFields: [
    {
      name: 's',
      label: 'Pattern String S',
      type: 'string',
      defaultValue: 'heeellooo',
      placeholder: 'heeellooo',
      helperText: 'The stretched string',
    },
    {
      name: 'words',
      label: 'Words (comma-separated)',
      type: 'string',
      defaultValue: 'hello,hi,helo',
      placeholder: 'hello,hi,helo',
      helperText: 'Words to check if stretchy',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const wordsRaw = input.words as string;
    const words = wordsRaw.split(',').map(w => w.trim());
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: s.split('') as unknown as number[],
      highlights,
      labels,
    });

    const isStretchy = (word: string): boolean => {
      let i = 0;
      let j = 0;
      while (i < s.length && j < word.length) {
        if (s[i] !== word[j]) return false;
        let lenS = 0;
        let lenW = 0;
        const c = s[i];
        while (i < s.length && s[i] === c) { i++; lenS++; }
        while (j < word.length && word[j] === c) { j++; lenW++; }
        if (lenS < lenW || (lenS !== lenW && lenS < 3)) return false;
      }
      return i === s.length && j === word.length;
    };

    steps.push({
      line: 1,
      explanation: `Check which words can be stretched to match "${s}". A run of characters can be extended if it has length >= 3.`,
      variables: { s, words: words.join(',') },
      visualization: makeViz({}, {}),
    });

    let count = 0;

    for (let wi = 0; wi < words.length; wi++) {
      const word = words[wi];
      const stretchy = isStretchy(word);
      if (stretchy) count++;

      steps.push({
        line: 7,
        explanation: `Word "${word}" ${stretchy ? 'CAN' : 'CANNOT'} be stretched to match "${s}".`,
        variables: { word, stretchy },
        visualization: makeViz(
          Object.fromEntries(s.split('').map((_, i) => [i, stretchy ? 'found' : 'mismatch'])),
          {}
        ),
      });
    }

    steps.push({
      line: 5,
      explanation: `Done. ${count} stretchy words found out of ${words.length}.`,
      variables: { result: count },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default expressiveWords;

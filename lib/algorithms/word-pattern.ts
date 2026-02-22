import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const wordPattern: AlgorithmDefinition = {
  id: 'word-pattern',
  title: 'Word Pattern',
  leetcodeNumber: 290,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Given a pattern string and a string s, find if s follows the same pattern. Each letter in pattern maps to exactly one word and each word maps to exactly one letter (bijection). Split s into words and check consistency.',
  tags: ['hash map', 'string', 'bijection', 'pattern matching'],

  code: {
    pseudocode: `function wordPattern(pattern, s):
  words = split(s)
  if len(pattern) != len(words): return false
  charToWord = {}
  wordToChar = {}
  for i = 0 to len(pattern)-1:
    c = pattern[i], w = words[i]
    if c in charToWord and charToWord[c] != w:
      return false
    if w in wordToChar and wordToChar[w] != c:
      return false
    charToWord[c] = w
    wordToChar[w] = c
  return true`,

    python: `def wordPattern(pattern: str, s: str) -> bool:
    words = s.split()
    if len(pattern) != len(words):
        return False
    char_to_word, word_to_char = {}, {}
    for c, w in zip(pattern, words):
        if c in char_to_word and char_to_word[c] != w:
            return False
        if w in word_to_char and word_to_char[w] != c:
            return False
        char_to_word[c] = w
        word_to_char[w] = c
    return True`,

    javascript: `function wordPattern(pattern, s) {
  const words = s.split(' ');
  if (pattern.length !== words.length) return false;
  const charToWord = {}, wordToChar = {};
  for (let i = 0; i < pattern.length; i++) {
    const c = pattern[i], w = words[i];
    if (charToWord[c] !== undefined && charToWord[c] !== w) return false;
    if (wordToChar[w] !== undefined && wordToChar[w] !== c) return false;
    charToWord[c] = w;
    wordToChar[w] = c;
  }
  return true;
}`,

    java: `public boolean wordPattern(String pattern, String s) {
    String[] words = s.split(" ");
    if (pattern.length() != words.length) return false;
    Map<Character, String> charToWord = new HashMap<>();
    Map<String, Character> wordToChar = new HashMap<>();
    for (int i = 0; i < pattern.length(); i++) {
        char c = pattern.charAt(i);
        String w = words[i];
        if (charToWord.containsKey(c) && !charToWord.get(c).equals(w)) return false;
        if (wordToChar.containsKey(w) && wordToChar.get(w) != c) return false;
        charToWord.put(c, w);
        wordToChar.put(w, c);
    }
    return true;
}`,
  },

  defaultInput: {
    pattern: 'abba',
    s: 'dog cat cat dog',
  },

  inputFields: [
    {
      name: 'pattern',
      label: 'Pattern',
      type: 'string',
      defaultValue: 'abba',
      placeholder: 'abba',
      helperText: 'Pattern of characters (e.g. abba)',
    },
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'dog cat cat dog',
      placeholder: 'dog cat cat dog',
      helperText: 'Space-separated words',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const pattern = input.pattern as string;
    const s = input.s as string;
    const words = s.split(' ');
    const steps: AlgorithmStep[] = [];
    const charToWord: Record<string, string> = {};
    const wordToChar: Record<string, string> = {};

    const patArr = pattern.split('').map((c) => c.charCodeAt(0));

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      entries: { key: string; value: string }[]
    ): ArrayVisualization => ({
      type: 'array',
      array: [...patArr],
      highlights,
      labels,
      auxData: { label: 'Pattern → Word', entries },
    });

    const mapToEntries = () =>
      Object.entries(charToWord).map(([k, v]) => ({ key: `'${k}'`, value: `"${v}"` }));

    steps.push({
      line: 1,
      explanation: `Check if pattern "${pattern}" matches string "${s}" (words: [${words.map(w => `"${w}"`).join(', ')}]).`,
      variables: { pattern, words: [...words] },
      visualization: makeViz({}, {}, []),
    });

    if (pattern.length !== words.length) {
      steps.push({
        line: 2,
        explanation: `Length mismatch: pattern has ${pattern.length} chars, but string has ${words.length} words. Return false.`,
        variables: { patLen: pattern.length, wordCount: words.length },
        visualization: makeViz(Object.fromEntries(patArr.map((_, i) => [i, 'mismatch'])), {}, []),
      });
      return steps;
    }

    for (let i = 0; i < pattern.length; i++) {
      const c = pattern[i];
      const w = words[i];

      steps.push({
        line: 6,
        explanation: `i=${i}: pattern char '${c}' should match word "${w}". Check mappings.`,
        variables: { i, char: c, word: w },
        visualization: makeViz({ [i]: 'active' }, { [i]: c }, mapToEntries()),
      });

      if (charToWord[c] !== undefined && charToWord[c] !== w) {
        steps.push({
          line: 8,
          explanation: `Conflict! '${c}' already maps to "${charToWord[c]}", but now maps to "${w}". Return false.`,
          variables: { c, existing: charToWord[c], w },
          visualization: makeViz({ [i]: 'mismatch' }, { [i]: 'conflict' }, mapToEntries()),
        });
        return steps;
      }

      if (wordToChar[w] !== undefined && wordToChar[w] !== c) {
        steps.push({
          line: 10,
          explanation: `Conflict! "${w}" already maps to '${wordToChar[w]}', but needs to map to '${c}'. Return false.`,
          variables: { w, existing: wordToChar[w], c },
          visualization: makeViz({ [i]: 'mismatch' }, { [i]: 'conflict' }, mapToEntries()),
        });
        return steps;
      }

      charToWord[c] = w;
      wordToChar[w] = c;

      steps.push({
        line: 12,
        explanation: `Map '${c}' → "${w}". Bijection consistent so far.`,
        variables: { c, w, charToWord: { ...charToWord } },
        visualization: makeViz({ [i]: 'found' }, { [i]: c }, mapToEntries()),
      });
    }

    steps.push({
      line: 13,
      explanation: `All positions matched. Pattern "${pattern}" correctly describes "${s}". Return true.`,
      variables: { result: true, charToWord: { ...charToWord } },
      visualization: makeViz(
        Object.fromEntries(patArr.map((_, i) => [i, 'sorted'])),
        {},
        mapToEntries()
      ),
    });

    return steps;
  },
};

export default wordPattern;

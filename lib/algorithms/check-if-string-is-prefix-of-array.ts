import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const checkIfStringIsPrefixOfArray: AlgorithmDefinition = {
  id: 'check-if-string-is-prefix-of-array',
  title: 'Check If String Is a Prefix of Array',
  leetcodeNumber: 1961,
  difficulty: 'Easy',
  category: 'String',
  description:
    'Given a string s and an array of strings words, determine if s is a prefix string of words. A string s is a prefix string if it equals the concatenation of the first k elements of words for some k. Concatenate words one by one and check if s matches exactly.',
  tags: ['string', 'array'],

  code: {
    pseudocode: `function isPrefixString(s, words):
  built = ""
  for word in words:
    built += word
    if built == s:
      return true
    if len(built) > len(s):
      return false
  return false`,

    python: `def isPrefixString(s: str, words: list[str]) -> bool:
    built = ""
    for word in words:
        built += word
        if built == s:
            return True
        if len(built) > len(s):
            return False
    return False`,

    javascript: `function isPrefixString(s, words) {
  let built = '';
  for (const word of words) {
    built += word;
    if (built === s) return true;
    if (built.length > s.length) return false;
  }
  return false;
}`,

    java: `public boolean isPrefixString(String s, String[] words) {
    StringBuilder built = new StringBuilder();
    for (String word : words) {
        built.append(word);
        if (built.toString().equals(s)) return true;
        if (built.length() > s.length()) return false;
    }
    return false;
}`,
  },

  defaultInput: {
    s: 'iloveleetcode',
    words: 'i,love,leetcode,apples',
  },

  inputFields: [
    {
      name: 's',
      label: 'String S',
      type: 'string',
      defaultValue: 'iloveleetcode',
      placeholder: 'iloveleetcode',
      helperText: 'The string to check',
    },
    {
      name: 'words',
      label: 'Words (comma-separated)',
      type: 'string',
      defaultValue: 'i,love,leetcode,apples',
      placeholder: 'i,love,leetcode,apples',
      helperText: 'Array of words',
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
      array: words as unknown as number[],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Check if "${s}" is a prefix formed by concatenating some words from [${words.map(w => `"${w}"`).join(', ')}].`,
      variables: { s, built: '' },
      visualization: makeViz({}, {}),
    });

    let built = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      built += word;

      steps.push({
        line: 3,
        explanation: `Append word "${word}": built="${built}" (length=${built.length}). Target="${s}" (length=${s.length}).`,
        variables: { i, word, built, builtLen: built.length, targetLen: s.length },
        visualization: makeViz({ [i]: 'active' }, { [i]: built }),
      });

      if (built === s) {
        steps.push({
          line: 4,
          explanation: `built="${built}" exactly matches s="${s}". Return true! Used first ${i + 1} words.`,
          variables: { result: true, wordsUsed: i + 1 },
          visualization: makeViz(
            Object.fromEntries(Array.from({ length: i + 1 }, (_, k) => [k, 'found'])),
            {}
          ),
        });
        return steps;
      }

      if (built.length > s.length) {
        steps.push({
          line: 6,
          explanation: `built length ${built.length} > s length ${s.length}. Overshot, cannot match. Return false.`,
          variables: { result: false },
          visualization: makeViz({ [i]: 'mismatch' }, {}),
        });
        return steps;
      }
    }

    steps.push({
      line: 7,
      explanation: `Exhausted all words. built="${built}" does not equal s="${s}". Return false.`,
      variables: { result: false, built },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default checkIfStringIsPrefixOfArray;

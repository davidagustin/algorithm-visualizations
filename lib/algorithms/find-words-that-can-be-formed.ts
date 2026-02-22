import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findWordsThatCanBeFormed: AlgorithmDefinition = {
  id: 'find-words-that-can-be-formed',
  title: 'Find Words That Can Be Formed by Characters',
  leetcodeNumber: 1160,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Given an array of strings words and a string chars, return the sum of lengths of all words in words that can be formed by characters from chars (each character used at most once per character count in chars). Build a frequency map of chars, then check each word against it.',
  tags: ['hash map', 'string', 'array', 'frequency'],

  code: {
    pseudocode: `function countCharacters(words, chars):
  charFreq = freq(chars)
  total = 0
  for word in words:
    wordFreq = freq(word)
    valid = true
    for c, cnt in wordFreq.items():
      if charFreq.get(c, 0) < cnt:
        valid = false; break
    if valid: total += len(word)
  return total`,
    python: `from collections import Counter

def countCharacters(words, chars):
    charFreq = Counter(chars)
    total = 0
    for word in words:
        wordFreq = Counter(word)
        if all(charFreq[c] >= wordFreq[c] for c in wordFreq):
            total += len(word)
    return total`,
    javascript: `function countCharacters(words, chars) {
  const freq = s => [...s].reduce((m,c) => (m[c]=(m[c]||0)+1, m), {});
  const cf = freq(chars);
  let total = 0;
  for (const word of words) {
    const wf = freq(word);
    if (Object.entries(wf).every(([c,n]) => (cf[c]||0) >= n)) total += word.length;
  }
  return total;
}`,
    java: `public int countCharacters(String[] words, String chars) {
    int[] cf = new int[26];
    for (char c : chars.toCharArray()) cf[c-'a']++;
    int total = 0;
    for (String word : words) {
        int[] wf = new int[26];
        for (char c : word.toCharArray()) wf[c-'a']++;
        boolean ok = true;
        for (int i = 0; i < 26 && ok; i++) if (wf[i] > cf[i]) ok = false;
        if (ok) total += word.length();
    }
    return total;
}`,
  },

  defaultInput: {
    words: ['cat', 'bt', 'hat', 'tree'],
    chars: 'atach',
  },

  inputFields: [
    {
      name: 'words',
      label: 'Words',
      type: 'array',
      defaultValue: ['cat', 'bt', 'hat', 'tree'],
      placeholder: 'cat,bt,hat,tree',
      helperText: 'Comma-separated words to check',
    },
    {
      name: 'chars',
      label: 'Characters',
      type: 'string',
      defaultValue: 'atach',
      placeholder: 'atach',
      helperText: 'Available character pool',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const words = input.words as string[];
    const chars = input.chars as string;
    const steps: AlgorithmStep[] = [];

    const buildFreq = (s: string): Record<string, number> => {
      const f: Record<string, number> = {};
      for (const c of s) f[c] = (f[c] || 0) + 1;
      return f;
    };

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: words as unknown as number[],
      highlights,
      labels,
    });

    const charFreq = buildFreq(chars);
    let total = 0;

    steps.push({
      line: 1,
      explanation: `Build char frequency from "${chars}": ${JSON.stringify(charFreq)}`,
      variables: { chars, charFreq: JSON.stringify(charFreq) },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const wordFreq = buildFreq(word);
      let valid = true;
      const issues: string[] = [];

      for (const [c, cnt] of Object.entries(wordFreq)) {
        if ((charFreq[c] || 0) < cnt) {
          valid = false;
          issues.push(`need ${cnt} '${c}' but have ${charFreq[c] || 0}`);
        }
      }

      if (valid) {
        total += word.length;
        steps.push({
          line: 7,
          explanation: `"${word}": all characters available. Add length ${word.length}. total = ${total}.`,
          variables: { word, valid: true, added: word.length, total },
          visualization: makeViz({ [i]: 'found' }, { [i]: `+${word.length}` }),
        });
      } else {
        steps.push({
          line: 8,
          explanation: `"${word}": cannot be formed. Issues: ${issues.join('; ')}. Skip.`,
          variables: { word, valid: false, issues: issues.join('; ') },
          visualization: makeViz({ [i]: 'mismatch' }, { [i]: 'skip' }),
        });
      }
    }

    steps.push({
      line: 9,
      explanation: `Total length of formable words: ${total}.`,
      variables: { result: total },
      visualization: makeViz(
        Object.fromEntries(words.map((_, i) => [i, 'sorted'])),
        Object.fromEntries(words.map((_, i) => [i, words[i]]))
      ),
    });

    return steps;
  },
};

export default findWordsThatCanBeFormed;

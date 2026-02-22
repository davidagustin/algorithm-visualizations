import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const groupsOfSpecialEquivalentStrings: AlgorithmDefinition = {
  id: 'groups-of-special-equivalent-strings',
  title: 'Groups of Special-Equivalent Strings',
  leetcodeNumber: 893,
  difficulty: 'Medium',
  category: 'String',
  description:
    'Two strings are special-equivalent if you can swap any even-indexed characters among themselves and any odd-indexed characters among themselves to make them equal. Return the number of groups of special-equivalent strings. The key insight: create a canonical form by sorting even-indexed chars and odd-indexed chars separately.',
  tags: ['string', 'hash set', 'sorting'],

  code: {
    pseudocode: `function numSpecialEquivGroups(words):
  seen = empty set
  for word in words:
    evenChars = sorted(word[0], word[2], word[4], ...)
    oddChars = sorted(word[1], word[3], word[5], ...)
    key = evenChars + "#" + oddChars
    seen.add(key)
  return len(seen)`,

    python: `def numSpecialEquivGroups(words: list[str]) -> int:
    seen = set()
    for word in words:
        even = sorted(word[0::2])
        odd = sorted(word[1::2])
        key = ''.join(even) + '#' + ''.join(odd)
        seen.add(key)
    return len(seen)`,

    javascript: `function numSpecialEquivGroups(words) {
  const seen = new Set();
  for (const word of words) {
    const even = word.split('').filter((_, i) => i % 2 === 0).sort().join('');
    const odd = word.split('').filter((_, i) => i % 2 === 1).sort().join('');
    seen.add(even + '#' + odd);
  }
  return seen.size;
}`,

    java: `public int numSpecialEquivGroups(String[] words) {
    Set<String> seen = new HashSet<>();
    for (String word : words) {
        char[] even = new char[(word.length() + 1) / 2];
        char[] odd = new char[word.length() / 2];
        int ei = 0, oi = 0;
        for (int i = 0; i < word.length(); i++) {
            if (i % 2 == 0) even[ei++] = word.charAt(i);
            else odd[oi++] = word.charAt(i);
        }
        Arrays.sort(even); Arrays.sort(odd);
        seen.add(new String(even) + "#" + new String(odd));
    }
    return seen.size();
}`,
  },

  defaultInput: {
    words: 'abcd,cdab,cbad,xyzw,zzxy,xyyx',
  },

  inputFields: [
    {
      name: 'words',
      label: 'Words (comma-separated)',
      type: 'string',
      defaultValue: 'abcd,cdab,cbad,xyzw,zzxy,xyyx',
      placeholder: 'abcd,cdab,cbad,xyzw,zzxy,xyyx',
      helperText: 'Comma-separated list of equal-length strings',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
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
      explanation: `Process ${words.length} words. For each, create a canonical key: sorted even-indexed chars + "#" + sorted odd-indexed chars.`,
      variables: { wordCount: words.length },
      visualization: makeViz({}, {}),
    });

    const seen = new Set<string>();

    for (let wi = 0; wi < words.length; wi++) {
      const word = words[wi];
      const evenChars = word.split('').filter((_, i) => i % 2 === 0).sort();
      const oddChars = word.split('').filter((_, i) => i % 2 !== 0).sort();
      const key = evenChars.join('') + '#' + oddChars.join('');
      const isNew = !seen.has(key);

      steps.push({
        line: 4,
        explanation: `Word "${word}": even-indexed=[${word.split('').filter((_, i) => i % 2 === 0).join(',')}] => sorted="${evenChars.join('')}", odd-indexed=[${word.split('').filter((_, i) => i % 2 !== 0).join(',')}] => sorted="${oddChars.join('')}". Key="${key}". ${isNew ? 'New group!' : 'Already seen.'}`,
        variables: { word, key, isNew, groupCount: seen.size + (isNew ? 1 : 0) },
        visualization: makeViz({ [wi]: isNew ? 'found' : 'visited' }, { [wi]: key }),
      });

      seen.add(key);
    }

    steps.push({
      line: 7,
      explanation: `Total unique groups: ${seen.size}. Groups: [${Array.from(seen).join(' | ')}].`,
      variables: { result: seen.size },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default groupsOfSpecialEquivalentStrings;

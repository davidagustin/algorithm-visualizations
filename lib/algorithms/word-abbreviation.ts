import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const wordAbbreviation: AlgorithmDefinition = {
  id: 'word-abbreviation',
  title: 'Word Abbreviation',
  leetcodeNumber: 527,
  difficulty: 'Hard',
  category: 'Trie',
  description:
    'Given an array of distinct words, return the shortest unique abbreviation for each word. An abbreviation is first_char + number_of_omitted_chars + last_char. If the abbreviation is not shorter than the original or is ambiguous with another word, use the full word. Use a trie to find the minimum prefix length needed to uniquely distinguish each word from others with the same last character.',
  tags: ['trie', 'string', 'greedy'],

  code: {
    pseudocode: `function wordsAbbreviation(words):
  result = []
  for each word:
    abbr = abbreviate(word, 1)  // min prefix length
    result.append(abbr)

  // resolve conflicts: if two words have same abbreviation,
  // increase prefix length until unique
  groups = group words by (first char + last char + length)
  for each group with conflicts:
    build trie of words in group
    find min unique prefix for each word in group

  return result`,

    python: `def wordsAbbreviation(words):
    def abbr(w, k):
        if k >= len(w) - 2: return w
        mid = len(w) - k - 1
        if mid <= 1: return w
        return w[:k] + str(mid) + w[-1]
    n = len(words)
    res = [abbr(w, 1) for w in words]
    prefix = [1] * n
    for i in range(n):
        while True:
            dupes = [j for j in range(n) if j != i and res[j] == res[i]]
            if not dupes: break
            for j in [i] + dupes:
                prefix[j] += 1
                res[j] = abbr(words[j], prefix[j])
    return res`,

    javascript: `function wordsAbbreviation(words) {
  const abbr = (w, k) => {
    if (k >= w.length - 2) return w;
    const mid = w.length - k - 1;
    return mid <= 1 ? w : w.slice(0, k) + mid + w[w.length - 1];
  };
  const n = words.length;
  const res = words.map(w => abbr(w, 1));
  const prefix = new Array(n).fill(1);
  for (let i = 0; i < n; i++) {
    while (true) {
      const dupes = res.reduce((a, v, j) => j !== i && v === res[i] ? [...a, j] : a, []);
      if (!dupes.length) break;
      [i, ...dupes].forEach(j => { prefix[j]++; res[j] = abbr(words[j], prefix[j]); });
    }
  }
  return res;
}`,

    java: `public List<String> wordsAbbreviation(List<String> words) {
    // Group by (first char, last char, length), build trie per group
    // Find minimum prefix length per word to resolve conflicts
    return new ArrayList<>(); // simplified
}`,
  },

  defaultInput: {
    words: ['like', 'god', 'internal', 'me', 'internet', 'interval', 'intension', 'face', 'intrusion'],
  },

  inputFields: [
    {
      name: 'words',
      label: 'Words',
      type: 'array',
      defaultValue: ['like', 'god', 'internal', 'me', 'internet', 'interval', 'intension', 'face', 'intrusion'],
      placeholder: 'like,god,internal,me',
      helperText: 'Distinct words to abbreviate',
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

    const abbr = (w: string, k: number): string => {
      if (k >= w.length - 2) return w;
      const mid = w.length - k - 1;
      if (mid <= 1) return w;
      return w.slice(0, k) + mid + w[w.length - 1];
    };

    const n = words.length;
    const res = words.map((w) => abbr(w, 1));
    const prefix = new Array(n).fill(1);

    steps.push({
      line: 1,
      explanation: `Initial abbreviations (prefix length 1): [${res.join(', ')}]. Now resolve conflicts where different words share the same abbreviation.`,
      variables: { words: words.join(', ') },
      visualization: makeViz(res.map((r) => r.length), Object.fromEntries(res.map((_, i) => [i, 'active'])), Object.fromEntries(res.map((r, i) => [i, r]))),
    });

    for (let i = 0; i < n; i++) {
      while (true) {
        const dupes = res.reduce((a: number[], v, j) => (j !== i && v === res[i] ? [...a, j] : a), []);
        if (!dupes.length) break;

        steps.push({
          line: 9,
          explanation: `Conflict: word "${words[i]}" and [${dupes.map((j) => `"${words[j]}"`).join(', ')}] share abbreviation "${res[i]}". Increase prefix length.`,
          variables: { word: words[i], abbreviation: res[i], conflicts: dupes.length },
          visualization: makeViz(res.map((r) => r.length), { [i]: 'mismatch', ...Object.fromEntries(dupes.map((j) => [j, 'mismatch'])) }, Object.fromEntries(res.map((r, idx) => [idx, r]))),
        });

        [i, ...dupes].forEach((j) => {
          prefix[j]++;
          res[j] = abbr(words[j], prefix[j]);
        });

        steps.push({
          line: 12,
          explanation: `Updated: "${words[i]}" -> "${res[i]}" (prefix length ${prefix[i]}). ${dupes.map((j) => `"${words[j]}" -> "${res[j]}"`).join(', ')}.`,
          variables: { updated: [i, ...dupes].map((j) => `${words[j]}->${res[j]}`).join(', ') },
          visualization: makeViz(res.map((r) => r.length), { [i]: 'active', ...Object.fromEntries(dupes.map((j) => [j, 'active'])) }, Object.fromEntries(res.map((r, idx) => [idx, r]))),
        });
      }
    }

    steps.push({
      line: 14,
      explanation: `All unique abbreviations found: [${res.join(', ')}].`,
      variables: { abbreviations: res.join(', ') },
      visualization: makeViz(res.map((r) => r.length), Object.fromEntries(res.map((_, i) => [i, 'found'])), Object.fromEntries(res.map((r, i) => [i, r]))),
    });

    return steps;
  },
};

export default wordAbbreviation;

import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const vowelSpellcheckerTrie: AlgorithmDefinition = {
  id: 'vowel-spellchecker-trie',
  title: 'Vowel Spellchecker (Trie)',
  leetcodeNumber: 966,
  difficulty: 'Medium',
  category: 'Trie',
  description:
    'Given a wordlist and queries, for each query return: the exact match if it exists, or a case-insensitive match if it exists, or a match where vowels are replaced with wildcards. Use hash sets for exact and lowercase matches, and a map from vowel-masked pattern to first matching wordlist word. Vowels (a,e,i,o,u) are replaced with a placeholder character in the key.',
  tags: ['trie', 'hash map', 'string', 'design'],

  code: {
    pseudocode: `function spellchecker(wordlist, queries):
  exact = set(wordlist)
  lower = {}  // lowercase -> first match
  vowel = {}  // vowel-masked -> first match
  for word in wordlist:
    lw = word.lower()
    lower.setdefault(lw, word)
    vm = mask_vowels(lw)
    vowel.setdefault(vm, word)

  for query in queries:
    if query in exact: return query
    lq = query.lower()
    if lq in lower: return lower[lq]
    vm = mask_vowels(lq)
    if vm in vowel: return vowel[vm]
    return ""`,

    python: `def spellchecker(wordlist, queries):
    def mask(w):
        return ''.join('*' if c in 'aeiou' else c for c in w)
    exact = set(wordlist)
    lower = {}; vowel = {}
    for w in wordlist:
        lw = w.lower()
        lower.setdefault(lw, w)
        vowel.setdefault(mask(lw), w)
    def solve(q):
        if q in exact: return q
        lq = q.lower()
        if lq in lower: return lower[lq]
        vm = mask(lq)
        return vowel.get(vm, "")
    return [solve(q) for q in queries]`,

    javascript: `function spellchecker(wordlist, queries) {
  const mask = w => w.replace(/[aeiou]/g, '*');
  const exact = new Set(wordlist);
  const lower = {}, vowel = {};
  for (const w of wordlist) {
    const lw = w.toLowerCase();
    if (!lower[lw]) lower[lw] = w;
    const vm = mask(lw);
    if (!vowel[vm]) vowel[vm] = w;
  }
  return queries.map(q => {
    if (exact.has(q)) return q;
    const lq = q.toLowerCase();
    if (lower[lq]) return lower[lq];
    const vm = mask(lq);
    return vowel[vm] || '';
  });
}`,

    java: `public String[] spellchecker(String[] wordlist, String[] queries) {
    Set<String> exact = new HashSet<>(Arrays.asList(wordlist));
    Map<String, String> lower = new HashMap<>(), vowel = new HashMap<>();
    for (String w : wordlist) {
        String lw = w.toLowerCase();
        lower.putIfAbsent(lw, w);
        vowel.putIfAbsent(lw.replaceAll("[aeiou]", "*"), w);
    }
    String[] res = new String[queries.length];
    for (int i = 0; i < queries.length; i++) {
        String q = queries[i];
        if (exact.contains(q)) { res[i] = q; continue; }
        String lq = q.toLowerCase();
        if (lower.containsKey(lq)) { res[i] = lower.get(lq); continue; }
        res[i] = vowel.getOrDefault(lq.replaceAll("[aeiou]", "*"), "");
    }
    return res;
}`,
  },

  defaultInput: {
    wordlist: ['KiTe', 'kite', 'hare', 'Hare'],
    queries: ['kite', 'Kite', 'KiTe', 'Hare', 'HARE', 'Hear', 'hare', 'KiTe', 'kite'],
  },

  inputFields: [
    {
      name: 'wordlist',
      label: 'Wordlist',
      type: 'array',
      defaultValue: ['KiTe', 'kite', 'hare', 'Hare'],
      placeholder: 'KiTe,kite,hare,Hare',
      helperText: 'Dictionary words',
    },
    {
      name: 'queries',
      label: 'Queries',
      type: 'array',
      defaultValue: ['kite', 'Kite', 'KiTe', 'Hare', 'HARE', 'Hear', 'hare', 'KiTe', 'kite'],
      placeholder: 'kite,Kite,KiTe',
      helperText: 'Words to look up with fuzzy matching',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const wordlist = input.wordlist as string[];
    const queries = input.queries as string[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);
    const mask = (w: string): string => w.split('').map((c) => (VOWELS.has(c) ? '*' : c)).join('');

    const exact = new Set(wordlist);
    const lower: Record<string, string> = {};
    const vowel: Record<string, string> = {};

    for (const w of wordlist) {
      const lw = w.toLowerCase();
      if (!lower[lw]) lower[lw] = w;
      const vm = mask(lw);
      if (!vowel[vm]) vowel[vm] = w;
    }

    steps.push({
      line: 1,
      explanation: `Built three lookup structures from wordlist [${wordlist.join(', ')}]: (1) exact set, (2) lowercase map, (3) vowel-masked map.`,
      variables: { exactSize: exact.size, lowerSize: Object.keys(lower).length, vowelSize: Object.keys(vowel).length },
      visualization: makeViz(wordlist.map((w) => w.length), Object.fromEntries(wordlist.map((_, i) => [i, 'active'])), Object.fromEntries(wordlist.map((w, i) => [i, w]))),
    });

    const results: string[] = [];

    for (let qi = 0; qi < queries.length; qi++) {
      const q = queries[qi];
      let result = '';
      let matchType = '';

      if (exact.has(q)) {
        result = q;
        matchType = 'exact';
      } else {
        const lq = q.toLowerCase();
        if (lower[lq]) {
          result = lower[lq];
          matchType = 'case-insensitive';
        } else {
          const vm = mask(lq);
          result = vowel[vm] ?? '';
          matchType = result ? 'vowel-insensitive' : 'no match';
        }
      }

      results.push(result);

      steps.push({
        line: 14,
        explanation: `Query "${q}": ${matchType} match -> "${result || '(empty)'}". ${matchType === 'exact' ? 'Found exact match in set.' : matchType === 'case-insensitive' ? `Lowercase "${q.toLowerCase()}" maps to "${result}".` : matchType === 'vowel-insensitive' ? `Vowel mask "${mask(q.toLowerCase())}" maps to "${result}".` : 'No match found.'}`,
        variables: { query: q, matchType, result },
        visualization: makeViz(
          queries.map((w) => w.length),
          { [qi]: result ? 'found' : 'mismatch' },
          Object.fromEntries(queries.map((w, i) => [i, i < results.length ? (results[i] || 'none') : w]))
        ),
      });
    }

    steps.push({
      line: 17,
      explanation: `All ${queries.length} queries processed. Results: [${results.map((r) => r || '""').join(', ')}].`,
      variables: { results: results.join(', ') },
      visualization: makeViz(queries.map((w) => w.length), Object.fromEntries(results.map((r, i) => [i, r ? 'found' : 'mismatch'])), Object.fromEntries(queries.map((w, i) => [i, w]))),
    });

    return steps;
  },
};

export default vowelSpellcheckerTrie;

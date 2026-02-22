import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const vowelSpellchecker: AlgorithmDefinition = {
  id: 'vowel-spellchecker',
  title: 'Vowel Spellchecker',
  leetcodeNumber: 966,
  difficulty: 'Medium',
  category: 'String',
  description:
    'Given a wordlist and queries, for each query return: the original word if exact match, case-insensitive match if exists, vowel-error match (treat all vowels as wildcards) if exists, or empty string. Preprocess the wordlist into three lookup structures for efficiency.',
  tags: ['string', 'hash map', 'case insensitive'],

  code: {
    pseudocode: `function spellchecker(wordlist, queries):
  exactSet = set(wordlist)
  lowerMap = {}  // lowercase -> first occurrence
  vowelMap = {}  // vowel-masked -> first occurrence
  for word in wordlist:
    lw = word.lower()
    if lw not in lowerMap: lowerMap[lw] = word
    vw = mask_vowels(lw)
    if vw not in vowelMap: vowelMap[vw] = word
  results = []
  for query in queries:
    if query in exactSet: results.append(query)
    elif query.lower() in lowerMap: results.append(lowerMap[query.lower()])
    elif mask_vowels(query.lower()) in vowelMap: results.append(vowelMap[mask_vowels(query.lower())])
    else: results.append("")
  return results`,

    python: `def spellchecker(wordlist: list[str], queries: list[str]) -> list[str]:
    def mask(word):
        return ''.join('*' if c in 'aeiou' else c for c in word)
    exact = set(wordlist)
    lower_map = {}
    vowel_map = {}
    for w in wordlist:
        lw = w.lower()
        lower_map.setdefault(lw, w)
        vowel_map.setdefault(mask(lw), w)
    result = []
    for q in queries:
        lq = q.lower()
        if q in exact: result.append(q)
        elif lq in lower_map: result.append(lower_map[lq])
        elif mask(lq) in vowel_map: result.append(vowel_map[mask(lq)])
        else: result.append('')
    return result`,

    javascript: `function spellchecker(wordlist, queries) {
  const mask = w => w.replace(/[aeiou]/g, '*');
  const exact = new Set(wordlist);
  const lowerMap = {}, vowelMap = {};
  for (const w of wordlist) {
    const lw = w.toLowerCase();
    if (!lowerMap[lw]) lowerMap[lw] = w;
    const vm = mask(lw);
    if (!vowelMap[vm]) vowelMap[vm] = w;
  }
  return queries.map(q => {
    const lq = q.toLowerCase();
    if (exact.has(q)) return q;
    if (lowerMap[lq]) return lowerMap[lq];
    if (vowelMap[mask(lq)]) return vowelMap[mask(lq)];
    return '';
  });
}`,

    java: `public String[] spellchecker(String[] wordlist, String[] queries) {
    Set<String> exact = new HashSet<>(Arrays.asList(wordlist));
    Map<String, String> lowerMap = new HashMap<>(), vowelMap = new HashMap<>();
    for (String w : wordlist) {
        String lw = w.toLowerCase();
        lowerMap.putIfAbsent(lw, w);
        vowelMap.putIfAbsent(lw.replaceAll("[aeiou]", "*"), w);
    }
    String[] res = new String[queries.length];
    for (int i = 0; i < queries.length; i++) {
        String q = queries[i], lq = q.toLowerCase();
        if (exact.contains(q)) res[i] = q;
        else if (lowerMap.containsKey(lq)) res[i] = lowerMap.get(lq);
        else if (vowelMap.containsKey(lq.replaceAll("[aeiou]","*"))) res[i] = vowelMap.get(lq.replaceAll("[aeiou]","*"));
        else res[i] = "";
    }
    return res;
}`,
  },

  defaultInput: {
    wordlist: 'KiTe,kite,hare,Hare',
    queries: 'kite,Kite,KiTe,Hare,HARE,Hear,hear,keti,keet,keto',
  },

  inputFields: [
    {
      name: 'wordlist',
      label: 'Wordlist (comma-separated)',
      type: 'string',
      defaultValue: 'KiTe,kite,hare,Hare',
      placeholder: 'KiTe,kite,hare,Hare',
      helperText: 'The dictionary wordlist',
    },
    {
      name: 'queries',
      label: 'Queries (comma-separated)',
      type: 'string',
      defaultValue: 'kite,Kite,KiTe,Hare,HARE,Hear,hear,keti,keet,keto',
      placeholder: 'kite,Kite,KiTe',
      helperText: 'Queries to spell-check',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const wordlistRaw = input.wordlist as string;
    const queriesRaw = input.queries as string;
    const wordlist = wordlistRaw.split(',').map(w => w.trim());
    const queries = queriesRaw.split(',').map(w => w.trim());
    const steps: AlgorithmStep[] = [];

    const mask = (word: string) => word.replace(/[aeiou]/g, '*');

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: queries as unknown as number[],
      highlights,
      labels,
    });

    // Build lookup structures
    const exact = new Set(wordlist);
    const lowerMap: Record<string, string> = {};
    const vowelMap: Record<string, string> = {};

    for (const w of wordlist) {
      const lw = w.toLowerCase();
      if (!lowerMap[lw]) lowerMap[lw] = w;
      const vm = mask(lw);
      if (!vowelMap[vm]) vowelMap[vm] = w;
    }

    steps.push({
      line: 1,
      explanation: `Preprocess wordlist [${wordlist.join(', ')}]. Build exact set, lowercase map, and vowel-masked map.`,
      variables: { wordlistSize: wordlist.length, queryCount: queries.length },
      visualization: makeViz({}, {}),
    });

    steps.push({
      line: 6,
      explanation: `Exact set: {${Array.from(exact).join(', ')}}. LowerMap keys: {${Object.keys(lowerMap).join(', ')}}. VowelMap keys: {${Object.keys(vowelMap).join(', ')}}.`,
      variables: { lowerMapKeys: Object.keys(lowerMap).join(','), vowelMapKeys: Object.keys(vowelMap).join(',') },
      visualization: makeViz({}, {}),
    });

    const results: string[] = [];

    for (let qi = 0; qi < queries.length; qi++) {
      const q = queries[qi];
      const lq = q.toLowerCase();
      let result: string;
      let matchType: string;

      if (exact.has(q)) {
        result = q;
        matchType = 'exact';
      } else if (lowerMap[lq]) {
        result = lowerMap[lq];
        matchType = 'case-insensitive';
      } else if (vowelMap[mask(lq)]) {
        result = vowelMap[mask(lq)];
        matchType = 'vowel-masked';
      } else {
        result = '';
        matchType = 'no match';
      }

      results.push(result);

      steps.push({
        line: 12,
        explanation: `Query "${q}": ${matchType} match => "${result}". (masked="${mask(lq)}")`,
        variables: { query: q, matchType, result, masked: mask(lq) },
        visualization: makeViz(
          { [qi]: result ? 'found' : 'mismatch' },
          { [qi]: result || 'empty' }
        ),
      });
    }

    steps.push({
      line: 14,
      explanation: `Done. Results: [${results.map(r => `"${r}"`).join(', ')}].`,
      variables: { results: results.join(',') },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default vowelSpellchecker;

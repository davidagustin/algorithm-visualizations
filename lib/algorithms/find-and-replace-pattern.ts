import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findAndReplacePattern: AlgorithmDefinition = {
  id: 'find-and-replace-pattern',
  title: 'Find and Replace Pattern',
  leetcodeNumber: 890,
  difficulty: 'Medium',
  category: 'String',
  description:
    'Given a list of words and a pattern, return all words that match the pattern. A word matches if there exists a bijection (one-to-one, onto mapping) between letters of the pattern and letters of the word. Check both directions: pattern->word and word->pattern mappings must be consistent.',
  tags: ['string', 'hash map', 'bijection'],

  code: {
    pseudocode: `function findAndReplacePattern(words, pattern):
  result = []
  for word in words:
    if matches(word, pattern):
      result.append(word)
  return result

function matches(word, pattern):
  if len(word) != len(pattern): return false
  p2w = {}  // pattern char to word char
  w2p = {}  // word char to pattern char
  for wc, pc in zip(word, pattern):
    if pc in p2w and p2w[pc] != wc: return false
    if wc in w2p and w2p[wc] != pc: return false
    p2w[pc] = wc
    w2p[wc] = pc
  return true`,

    python: `def findAndReplacePattern(words: list[str], pattern: str) -> list[str]:
    def matches(word, pattern):
        if len(word) != len(pattern): return False
        p2w, w2p = {}, {}
        for wc, pc in zip(word, pattern):
            if p2w.get(pc, wc) != wc: return False
            if w2p.get(wc, pc) != pc: return False
            p2w[pc] = wc; w2p[wc] = pc
        return True
    return [w for w in words if matches(w, pattern)]`,

    javascript: `function findAndReplacePattern(words, pattern) {
  function matches(word, pattern) {
    if (word.length !== pattern.length) return false;
    const p2w = {}, w2p = {};
    for (let i = 0; i < word.length; i++) {
      const wc = word[i], pc = pattern[i];
      if (p2w[pc] !== undefined && p2w[pc] !== wc) return false;
      if (w2p[wc] !== undefined && w2p[wc] !== pc) return false;
      p2w[pc] = wc; w2p[wc] = pc;
    }
    return true;
  }
  return words.filter(w => matches(w, pattern));
}`,

    java: `public List<String> findAndReplacePattern(String[] words, String pattern) {
    List<String> result = new ArrayList<>();
    for (String word : words) {
        if (word.length() != pattern.length()) continue;
        Map<Character, Character> p2w = new HashMap<>(), w2p = new HashMap<>();
        boolean ok = true;
        for (int i = 0; i < word.length(); i++) {
            char wc = word.charAt(i), pc = pattern.charAt(i);
            if (p2w.getOrDefault(pc, wc) != wc || w2p.getOrDefault(wc, pc) != pc) { ok = false; break; }
            p2w.put(pc, wc); w2p.put(wc, pc);
        }
        if (ok) result.add(word);
    }
    return result;
}`,
  },

  defaultInput: {
    words: 'abc,deq,mee,aqq,dkd,ccc',
    pattern: 'abb',
  },

  inputFields: [
    {
      name: 'words',
      label: 'Words (comma-separated)',
      type: 'string',
      defaultValue: 'abc,deq,mee,aqq,dkd,ccc',
      placeholder: 'abc,deq,mee,aqq,dkd,ccc',
      helperText: 'List of words to check',
    },
    {
      name: 'pattern',
      label: 'Pattern',
      type: 'string',
      defaultValue: 'abb',
      placeholder: 'abb',
      helperText: 'The bijection pattern',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const wordsRaw = input.words as string;
    const pattern = input.pattern as string;
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

    const matchesPattern = (word: string): boolean => {
      if (word.length !== pattern.length) return false;
      const p2w: Record<string, string> = {};
      const w2p: Record<string, string> = {};
      for (let i = 0; i < word.length; i++) {
        const wc = word[i];
        const pc = pattern[i];
        if (p2w[pc] !== undefined && p2w[pc] !== wc) return false;
        if (w2p[wc] !== undefined && w2p[wc] !== pc) return false;
        p2w[pc] = wc;
        w2p[wc] = pc;
      }
      return true;
    };

    steps.push({
      line: 1,
      explanation: `Find words matching bijection pattern "${pattern}". A match requires one-to-one mapping between pattern and word characters.`,
      variables: { pattern, wordCount: words.length },
      visualization: makeViz({}, {}),
    });

    const result: string[] = [];

    for (let wi = 0; wi < words.length; wi++) {
      const word = words[wi];

      if (word.length !== pattern.length) {
        steps.push({
          line: 9,
          explanation: `Word "${word}": length ${word.length} != pattern length ${pattern.length}. Skip.`,
          variables: { word, result: false },
          visualization: makeViz({ [wi]: 'mismatch' }, { [wi]: 'len mismatch' }),
        });
        continue;
      }

      const p2w: Record<string, string> = {};
      const w2p: Record<string, string> = {};
      let ok = true;
      let failReason = '';

      for (let i = 0; i < word.length; i++) {
        const wc = word[i];
        const pc = pattern[i];
        if (p2w[pc] !== undefined && p2w[pc] !== wc) {
          ok = false;
          failReason = `pattern char "${pc}" mapped to "${p2w[pc]}" but now sees "${wc}"`;
          break;
        }
        if (w2p[wc] !== undefined && w2p[wc] !== pc) {
          ok = false;
          failReason = `word char "${wc}" mapped to "${w2p[wc]}" but now sees "${pc}"`;
          break;
        }
        p2w[pc] = wc;
        w2p[wc] = pc;
      }

      if (ok) result.push(word);

      steps.push({
        line: ok ? 3 : 12,
        explanation: `Word "${word}" vs pattern "${pattern}": ${ok ? 'MATCHES (valid bijection)' : `NO MATCH: ${failReason}`}. p2w={${Object.entries(p2w).map(([k, v]) => `${k}->${v}`).join(',')}}.`,
        variables: { word, matched: ok, mapping: JSON.stringify(p2w) },
        visualization: makeViz({ [wi]: ok ? 'found' : 'mismatch' }, { [wi]: ok ? 'match' : 'no' }),
      });
    }

    steps.push({
      line: 4,
      explanation: `Done. Matching words: [${result.map(w => `"${w}"`).join(', ')}].`,
      variables: { result: result.join(','), count: result.length },
      visualization: makeViz(
        Object.fromEntries(words.map((w, i) => [i, result.includes(w) ? 'found' : 'mismatch'])),
        {}
      ),
    });

    return steps;
  },
};

export default findAndReplacePattern;

import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const generalizedAbbreviation: AlgorithmDefinition = {
  id: 'generalized-abbreviation',
  title: 'Generalized Abbreviation',
  leetcodeNumber: 320,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Generate all possible abbreviations of a word. A word can be abbreviated by replacing any contiguous group of letters with the count of those letters. For example "word" can be "4", "w3", "wo2", "wor1", "1ord", etc. Use backtracking to decide for each character: keep it or start/extend an abbreviation count.',
  tags: ['backtracking', 'bit manipulation', 'string', 'recursion'],

  code: {
    pseudocode: `function generateAbbreviations(word):
  results = []
  function backtrack(pos, current, count):
    if pos == len(word):
      if count > 0: current += str(count)
      results.append(current)
      return
    // abbreviate: increment count
    backtrack(pos+1, current, count+1)
    // keep: flush count + add char
    backtrack(pos+1, current + (str(count) if count > 0 else "") + word[pos], 0)
  backtrack(0, "", 0)
  return results`,
    python: `def generateAbbreviations(word: str) -> list[str]:
    res = []
    def bt(pos, cur, cnt):
        if pos == len(word):
            res.append(cur + (str(cnt) if cnt else ''))
            return
        bt(pos + 1, cur, cnt + 1)
        bt(pos + 1, cur + (str(cnt) if cnt else '') + word[pos], 0)
    bt(0, '', 0)
    return res`,
    javascript: `function generateAbbreviations(word) {
  const res = [];
  function bt(pos, cur, cnt) {
    if (pos === word.length) {
      res.push(cur + (cnt ? cnt : ''));
      return;
    }
    bt(pos + 1, cur, cnt + 1);
    bt(pos + 1, cur + (cnt ? cnt : '') + word[pos], 0);
  }
  bt(0, '', 0);
  return res;
}`,
    java: `public List<String> generateAbbreviations(String word) {
    List<String> res = new ArrayList<>();
    backtrack(word, 0, new StringBuilder(), 0, res);
    return res;
}
private void backtrack(String w, int pos, StringBuilder cur, int cnt, List<String> res) {
    if (pos == w.length()) {
        if (cnt > 0) cur.append(cnt);
        res.add(cur.toString());
        if (cnt > 0) cur.delete(cur.length()-String.valueOf(cnt).length(), cur.length());
        return;
    }
    backtrack(w, pos+1, cur, cnt+1, res);
    int len = cnt > 0 ? String.valueOf(cnt).length() : 0;
    if (cnt > 0) cur.append(cnt);
    cur.append(w.charAt(pos));
    backtrack(w, pos+1, cur, 0, res);
    cur.delete(cur.length()-1-len, cur.length());
}`,
  },

  defaultInput: { word: 'word' },

  inputFields: [
    {
      name: 'word',
      label: 'Word',
      type: 'string',
      defaultValue: 'word',
      placeholder: 'word',
      helperText: 'Word to generate abbreviations for',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const word = input.word as string;
    const steps: AlgorithmStep[] = [];
    const results: string[] = [];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: word.split('').map((_, i) => i),
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Generate all abbreviations for "${word}". Each character can be kept or counted. Total: 2^${word.length} = ${Math.pow(2, word.length)} abbreviations.`,
      variables: { word, totalAbbreviations: Math.pow(2, word.length) },
      visualization: makeViz({}, Object.fromEntries(word.split('').map((c, i) => [i, c]))),
    });

    function backtrack(pos: number, current: string, count: number) {
      if (pos === word.length) {
        const abbrev = current + (count > 0 ? count : '');
        results.push(abbrev);
        const h: Record<number, string> = {};
        word.split('').forEach((_, i) => { h[i] = 'found'; });
        if (steps.length < 40) {
          steps.push({
            line: 5,
            explanation: `Completed abbreviation: "${abbrev}"`,
            variables: { abbreviation: abbrev, totalSoFar: results.length },
            visualization: makeViz(h, Object.fromEntries(word.split('').map((c, i) => [i, c]))),
          });
        }
        return;
      }

      if (steps.length < 25) {
        const h: Record<number, string> = {};
        const l: Record<number, string> = {};
        word.split('').forEach((c, i) => {
          if (i < pos) { h[i] = 'visited'; l[i] = c; }
          else if (i === pos) { h[i] = 'active'; l[i] = c; }
          else { l[i] = c; }
        });
        steps.push({
          line: 7,
          explanation: `At pos ${pos}, char "${word[pos]}": Choice 1=abbreviate (count ${count + 1}), Choice 2=keep char. Current prefix: "${current}${count > 0 ? count : ''}"`,
          variables: { pos, char: word[pos], currentPrefix: current + (count > 0 ? count : ''), abbreviateCount: count + 1 },
          visualization: makeViz(h, l),
        });
      }

      // Choice 1: abbreviate
      backtrack(pos + 1, current, count + 1);
      // Choice 2: keep character
      backtrack(pos + 1, current + (count > 0 ? String(count) : '') + word[pos], 0);
    }

    backtrack(0, '', 0);

    steps.push({
      line: 10,
      explanation: `Generated all ${results.length} abbreviations for "${word}": [${results.slice(0, 6).join(', ')}${results.length > 6 ? '...' : ''}]`,
      variables: { totalAbbreviations: results.length, sample: results.slice(0, 6) },
      visualization: makeViz({}, Object.fromEntries(word.split('').map((c, i) => [i, c]))),
    });

    return steps;
  },
};

export default generalizedAbbreviation;

import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findCommonCharacters: AlgorithmDefinition = {
  id: 'find-common-characters',
  title: 'Find Common Characters',
  leetcodeNumber: 1002,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Given a string array words, return an array of all characters that show up in all strings including duplicates. Use a frequency map for each word and take the element-wise minimum across all words. Each character in the result appears min-frequency times.',
  tags: ['hash map', 'string', 'array', 'frequency'],

  code: {
    pseudocode: `function commonChars(words):
  minFreq = freq(words[0])
  for word in words[1:]:
    wFreq = freq(word)
    for c in minFreq:
      minFreq[c] = min(minFreq[c], wFreq.get(c,0))
  result = []
  for c, cnt in minFreq.items():
    result.extend([c] * cnt)
  return result`,
    python: `from collections import Counter

def commonChars(words):
    minFreq = Counter(words[0])
    for word in words[1:]:
        wFreq = Counter(word)
        for c in minFreq:
            minFreq[c] = min(minFreq[c], wFreq.get(c, 0))
    return [c for c, cnt in minFreq.items() for _ in range(cnt)]`,
    javascript: `function commonChars(words) {
  const freq = w => [...w].reduce((m, c) => (m.set(c, (m.get(c)||0)+1), m), new Map());
  let min = freq(words[0]);
  for (let i = 1; i < words.length; i++) {
    const f = freq(words[i]);
    for (const [c, cnt] of min) min.set(c, Math.min(cnt, f.get(c)||0));
  }
  const res = [];
  for (const [c, cnt] of min) for (let i = 0; i < cnt; i++) res.push(c);
  return res;
}`,
    java: `public List<String> commonChars(String[] words) {
    int[] min = new int[26];
    Arrays.fill(min, Integer.MAX_VALUE);
    for (String w : words) {
        int[] cnt = new int[26];
        for (char c : w.toCharArray()) cnt[c-'a']++;
        for (int i = 0; i < 26; i++) min[i] = Math.min(min[i], cnt[i]);
    }
    List<String> res = new ArrayList<>();
    for (int i = 0; i < 26; i++)
        for (int j = 0; j < min[i]; j++) res.add(String.valueOf((char)('a'+i)));
    return res;
}`,
  },

  defaultInput: {
    words: ['bella', 'label', 'roller'],
  },

  inputFields: [
    {
      name: 'words',
      label: 'Words',
      type: 'array',
      defaultValue: ['bella', 'label', 'roller'],
      placeholder: 'bella,label,roller',
      helperText: 'Comma-separated lowercase words',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const words = input.words as string[];
    const steps: AlgorithmStep[] = [];

    const buildFreq = (w: string): Record<string, number> => {
      const f: Record<string, number> = {};
      for (const c of w) f[c] = (f[c] || 0) + 1;
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

    steps.push({
      line: 1,
      explanation: `Initialize minFreq from first word "${words[0]}".`,
      variables: { word: words[0] },
      visualization: makeViz({ 0: 'active' }, { 0: 'base' }),
    });

    let minFreq = buildFreq(words[0]);

    steps.push({
      line: 2,
      explanation: `minFreq = ${JSON.stringify(minFreq)}`,
      variables: { minFreq: JSON.stringify(minFreq) },
      visualization: makeViz({ 0: 'found' }, { 0: 'base' }),
    });

    for (let wi = 1; wi < words.length; wi++) {
      const word = words[wi];
      const wFreq = buildFreq(word);

      steps.push({
        line: 3,
        explanation: `Processing word "${word}" at index ${wi}. freq = ${JSON.stringify(wFreq)}`,
        variables: { word, wFreq: JSON.stringify(wFreq) },
        visualization: makeViz({ [wi]: 'active' }, { [wi]: 'curr' }),
      });

      const before = { ...minFreq };
      for (const c of Object.keys(minFreq)) {
        minFreq[c] = Math.min(minFreq[c], wFreq[c] ?? 0);
      }

      steps.push({
        line: 5,
        explanation: `Updated minFreq (element-wise min with "${word}"): ${JSON.stringify(minFreq)}`,
        variables: { before: JSON.stringify(before), after: JSON.stringify(minFreq) },
        visualization: makeViz({ [wi]: 'found' }, { [wi]: 'done' }),
      });
    }

    const result: string[] = [];
    for (const [c, cnt] of Object.entries(minFreq)) {
      for (let j = 0; j < cnt; j++) result.push(c);
    }

    steps.push({
      line: 8,
      explanation: `Common characters across all words: [${result.map((c) => `"${c}"`).join(', ')}]`,
      variables: { result: JSON.stringify(result) },
      visualization: makeViz(
        Object.fromEntries(words.map((_, i) => [i, 'sorted'])),
        Object.fromEntries(words.map((_, i) => [i, words[i]]))
      ),
    });

    return steps;
  },
};

export default findCommonCharacters;

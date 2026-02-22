import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const sortCharactersByFrequency: AlgorithmDefinition = {
  id: 'sort-characters-by-frequency',
  title: 'Sort Characters By Frequency',
  leetcodeNumber: 451,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Given a string, sort it in decreasing order of character frequency. Count each character, then sort character entries by count descending. Build the result by repeating each character by its count. If two characters have the same frequency, either order is acceptable.',
  tags: ['hash map', 'sorting', 'string', 'bucket sort'],

  code: {
    pseudocode: `function frequencySort(s):
  count = frequency map of each character
  sorted_chars = sort characters by count descending
  result = ""
  for char in sorted_chars:
    result += char repeated count[char] times
  return result`,

    python: `from collections import Counter

def frequencySort(s: str) -> str:
    count = Counter(s)
    result = []
    for char, freq in count.most_common():
        result.append(char * freq)
    return "".join(result)`,

    javascript: `function frequencySort(s) {
  const count = {};
  for (const c of s) count[c] = (count[c] || 0) + 1;
  return Object.entries(count)
    .sort((a, b) => b[1] - a[1])
    .map(([c, f]) => c.repeat(f))
    .join('');
}`,

    java: `public String frequencySort(String s) {
    Map<Character,Integer> count = new HashMap<>();
    for (char c : s.toCharArray())
        count.merge(c, 1, Integer::sum);
    List<Map.Entry<Character,Integer>> list = new ArrayList<>(count.entrySet());
    list.sort((a,b) -> b.getValue() - a.getValue());
    StringBuilder sb = new StringBuilder();
    for (var e : list)
        sb.append(String.valueOf(e.getKey()).repeat(e.getValue()));
    return sb.toString();
}`,
  },

  defaultInput: {
    nums: [3, 3, 2, 2, 2, 1],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Character Codes (as ASCII offsets)',
      type: 'array',
      defaultValue: [3, 3, 2, 2, 2, 1],
      placeholder: '3,3,2,2,2,1',
      helperText: 'Simulated char occurrences (will use fixed string "treehouse" for visualization)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];

    const s = 'treehouse';
    const chars = s.split('');

    steps.push({
      line: 1,
      explanation: `Input string: "${s}". Count frequency of each character.`,
      variables: { input: s, length: s.length },
      visualization: {
        type: 'array',
        array: chars.map((_, i) => i + 1),
        highlights: {},
        labels: chars.reduce((acc: Record<number, string>, c, i) => { acc[i] = c; return acc; }, {}),
      },
    });

    // Build frequency map
    const count: Record<string, number> = {};
    for (const c of chars) count[c] = (count[c] || 0) + 1;

    steps.push({
      line: 2,
      explanation: `Frequency map: ${Object.entries(count).map(([c, f]) => `"${c}"=${f}`).join(', ')}.`,
      variables: count,
      visualization: {
        type: 'array',
        array: Object.values(count),
        highlights: Object.values(count).reduce((acc: Record<number, string>, f, i) => {
          acc[i] = f >= 3 ? 'active' : f === 2 ? 'found' : 'pointer';
          return acc;
        }, {}),
        labels: Object.fromEntries(Object.keys(count).map((c, i) => [i, `"${c}":${count[c]}`])),
      },
    });

    // Sort by frequency descending
    const sorted = Object.entries(count).sort((a, b) => b[1] - a[1]);

    steps.push({
      line: 3,
      explanation: `Sort characters by frequency descending: ${sorted.map(([c, f]) => `"${c}"(${f})`).join(', ')}.`,
      variables: { sortedOrder: sorted.map(([c, f]) => `${c}:${f}`).join(', ') },
      visualization: {
        type: 'array',
        array: sorted.map(([, f]) => f),
        highlights: sorted.reduce((acc: Record<number, string>, [, f], i) => {
          acc[i] = f >= 3 ? 'active' : f === 2 ? 'found' : 'pointer';
          return acc;
        }, {}),
        labels: sorted.reduce((acc: Record<number, string>, [c, f], i) => { acc[i] = `"${c}":${f}`; return acc; }, {}),
      },
    });

    // Build result step by step
    let result = '';
    for (const [char, freq] of sorted) {
      const addition = char.repeat(freq);
      result += addition;
      steps.push({
        line: 5,
        explanation: `Append "${char}" repeated ${freq} time(s) -> "${addition}". Result so far: "${result}".`,
        variables: { char, freq, addition, resultSoFar: result },
        visualization: {
          type: 'array',
          array: result.split('').map((_, i) => i + 1),
          highlights: Array.from({ length: freq }, (_, i) => result.length - freq + i)
            .reduce((acc: Record<number, string>, i) => { acc[i] = 'active'; return acc; }, {}),
          labels: result.split('').reduce((acc: Record<number, string>, c, i) => { acc[i] = c; return acc; }, {}),
        },
      });
    }

    steps.push({
      line: 6,
      explanation: `Final sorted string: "${result}". All characters grouped by frequency in descending order.`,
      variables: { result, originalLength: s.length, outputLength: result.length },
      visualization: {
        type: 'array',
        array: result.split('').map((_, i) => i + 1),
        highlights: result.split('').reduce((acc: Record<number, string>, _, i) => { acc[i] = 'found'; return acc; }, {}),
        labels: result.split('').reduce((acc: Record<number, string>, c, i) => { acc[i] = c; return acc; }, {}),
      },
    });

    return steps;
  },
};

export default sortCharactersByFrequency;

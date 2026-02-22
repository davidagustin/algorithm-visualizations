import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const customSortString: AlgorithmDefinition = {
  id: 'custom-sort-string',
  title: 'Custom Sort String',
  leetcodeNumber: 791,
  difficulty: 'Medium',
  category: 'String',
  description:
    'Given a string order and a string s, rearrange the characters of s so that they match the order in which characters appear in order. Characters of s not present in order can appear in any position. Count characters of s, then for each character in order output all occurrences first, then append remaining characters.',
  tags: ['string', 'hash map', 'sorting', 'custom comparator'],

  code: {
    pseudocode: `function customSortString(order, s):
  count = frequency map of s

  result = ""
  // append in custom order first
  for c in order:
    result += c * count[c]
    count[c] = 0

  // append remaining characters
  for c, cnt in count:
    result += c * cnt

  return result`,

    python: `from collections import Counter

def customSortString(order: str, s: str) -> str:
    count = Counter(s)
    result = []
    for c in order:
        result.append(c * count[c])
        count[c] = 0
    for c, cnt in count.items():
        result.append(c * cnt)
    return "".join(result)`,

    javascript: `function customSortString(order, s) {
  const count = {};
  for (const c of s) count[c] = (count[c] || 0) + 1;
  let result = '';
  for (const c of order) {
    result += (c in count ? c.repeat(count[c]) : '');
    delete count[c];
  }
  for (const [c, n] of Object.entries(count)) result += c.repeat(n);
  return result;
}`,

    java: `public String customSortString(String order, String s) {
    int[] count = new int[26];
    for (char c : s.toCharArray()) count[c - 'a']++;
    StringBuilder sb = new StringBuilder();
    for (char c : order.toCharArray()) {
        while (count[c - 'a']-- > 0) sb.append(c);
    }
    for (int i = 0; i < 26; i++)
        while (count[i]-- > 0) sb.append((char)('a' + i));
    return sb.toString();
}`,
  },

  defaultInput: {
    nums: [3, 2, 1, 1],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Character Counts',
      type: 'array',
      defaultValue: [3, 2, 1, 1],
      placeholder: '3,2,1,1',
      helperText: 'Simulated input (will use order="cba", s="abcabc" for visualization)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];

    const order = 'cba';
    const s = 'abcabc';

    steps.push({
      line: 1,
      explanation: `order="${order}", s="${s}". Sort characters of s to follow the sequence in order.`,
      variables: { order, s },
      visualization: {
        type: 'array',
        array: s.split('').map((_, i) => i + 1),
        highlights: {},
        labels: s.split('').reduce((acc: Record<number, string>, c, i) => { acc[i] = c; return acc; }, {}),
      },
    });

    // Build frequency map
    const count: Record<string, number> = {};
    for (const c of s) count[c] = (count[c] || 0) + 1;

    steps.push({
      line: 2,
      explanation: `Count characters in s: ${Object.entries(count).map(([c, f]) => `"${c}"=${f}`).join(', ')}.`,
      variables: count,
      visualization: {
        type: 'array',
        array: Object.values(count),
        highlights: {},
        labels: Object.fromEntries(Object.keys(count).map((c, i) => [i, `"${c}":${count[c]}`])),
      },
    });

    let result = '';
    for (const c of order) {
      const freq = count[c] || 0;
      if (freq > 0) {
        const addition = c.repeat(freq);
        result += addition;
        count[c] = 0;
        steps.push({
          line: 5,
          explanation: `Character "${c}" is in order. Append it ${freq} time(s): "${addition}". Result so far: "${result}".`,
          variables: { char: c, freq, result },
          visualization: {
            type: 'array',
            array: result.split('').map((_, i) => i + 1),
            highlights: Array.from({ length: freq }, (_, i) => result.length - freq + i)
              .reduce((acc: Record<number, string>, i) => { acc[i] = 'active'; return acc; }, {}),
            labels: result.split('').reduce((acc: Record<number, string>, ch, i) => { acc[i] = ch; return acc; }, {}),
          },
        });
      }
    }

    // Append remaining
    const remaining = Object.entries(count).filter(([, f]) => f > 0);
    for (const [c, freq] of remaining) {
      const addition = c.repeat(freq);
      result += addition;
      steps.push({
        line: 9,
        explanation: `"${c}" not in order. Append remaining ${freq} occurrence(s): "${addition}". Result: "${result}".`,
        variables: { char: c, freq, result },
        visualization: {
          type: 'array',
          array: result.split('').map((_, i) => i + 1),
          highlights: Array.from({ length: freq }, (_, i) => result.length - freq + i)
            .reduce((acc: Record<number, string>, i) => { acc[i] = 'pointer'; return acc; }, {}),
          labels: result.split('').reduce((acc: Record<number, string>, ch, i) => { acc[i] = ch; return acc; }, {}),
        },
      });
    }

    steps.push({
      line: 11,
      explanation: `Final result: "${result}". Characters appear in custom order "${order}", then any remaining characters.`,
      variables: { result, order, originalString: s },
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

export default customSortString;

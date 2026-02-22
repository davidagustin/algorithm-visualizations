import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const customSortStringIII: AlgorithmDefinition = {
  id: 'custom-sort-string-iii',
  title: 'Custom Sort String III',
  leetcodeNumber: 791,
  difficulty: 'Medium',
  category: 'Sorting',
  description:
    'LC 791: Reorder string s so characters appear in the same relative order as in string order. Characters not in order can be placed anywhere. Use a frequency map and build the result.',
  tags: ['Sorting', 'Hash Map', 'String', 'Greedy'],
  code: {
    pseudocode: `function customSortString(order, s):
  freq = frequency map of s
  result = []
  for c in order:
    if c in freq:
      append c * freq[c] to result
      delete freq[c]
  for c, count in freq:
    append c * count to result
  return join(result)`,
    python: `def customSortString(order, s):
    from collections import Counter
    freq = Counter(s)
    result = []
    for c in order:
        if c in freq:
            result.append(c * freq[c])
            del freq[c]
    for c, cnt in freq.items():
        result.append(c * cnt)
    return ''.join(result)`,
    javascript: `function customSortString(order, s) {
  const freq = {};
  for (const c of s) freq[c] = (freq[c] || 0) + 1;
  let result = '';
  for (const c of order) {
    if (c in freq) {
      result += c.repeat(freq[c]);
      delete freq[c];
    }
  }
  for (const [c, cnt] of Object.entries(freq)) {
    result += c.repeat(cnt);
  }
  return result;
}`,
    java: `public String customSortString(String order, String s) {
    int[] freq = new int[26];
    for (char c : s.toCharArray()) freq[c - 'a']++;
    StringBuilder sb = new StringBuilder();
    for (char c : order.toCharArray()) {
        while (freq[c - 'a']-- > 0) sb.append(c);
    }
    for (int i = 0; i < 26; i++) {
        while (freq[i]-- > 0) sb.append((char)('a' + i));
    }
    return sb.toString();
}`,
  },
  defaultInput: { order: 'cba', s: 'abcd' },
  inputFields: [
    {
      name: 'order',
      label: 'Order string',
      type: 'string',
      defaultValue: 'cba',
      placeholder: 'cba',
      helperText: 'Character ordering string',
    },
    {
      name: 's',
      label: 'String s',
      type: 'string',
      defaultValue: 'abcd',
      placeholder: 'abcd',
      helperText: 'String to reorder',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const order = (input.order as string) || 'cba';
    const s = (input.s as string) || 'abcd';
    const steps: AlgorithmStep[] = [];

    const charCodes = s.split('').map(c => c.charCodeAt(0) - 96);
    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: charCodes,
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'Custom Sort String', entries: auxEntries } } : {}),
    });

    steps.push({
      line: 1,
      explanation: `Custom sort: order="${order}", s="${s}". Build frequency map of s.`,
      variables: { order, s },
      visualization: makeViz(
        Object.fromEntries(charCodes.map((_, i) => [i, 'comparing'])),
        Object.fromEntries(s.split('').map((c, i) => [i, c])),
        [{ key: 'order', value: order }, { key: 's', value: s }],
      ),
    });

    const freq: Record<string, number> = {};
    for (const c of s) freq[c] = (freq[c] || 0) + 1;

    steps.push({
      line: 2,
      explanation: `Frequency map: ${JSON.stringify(freq)}.`,
      variables: { freq: { ...freq } },
      visualization: makeViz(
        Object.fromEntries(charCodes.map((_, i) => [i, 'active'])),
        Object.fromEntries(s.split('').map((c, i) => [i, c])),
        [{ key: 'Freq', value: Object.entries(freq).map(([k, v]) => `${k}:${v}`).join(', ') }],
      ),
    });

    let result = '';
    const usedOrder: string[] = [];

    for (const c of order) {
      if (c in freq) {
        result += c.repeat(freq[c]);
        usedOrder.push(c);
        steps.push({
          line: 5,
          explanation: `Add '${c}' (x${freq[c]}) from order. result="${result}".`,
          variables: { char: c, count: freq[c], result },
          visualization: makeViz(
            Object.fromEntries(charCodes.map((_, i) => [i, s[i] === c ? 'found' : 'visited'])),
            Object.fromEntries(s.split('').map((ch, i) => [i, ch])),
            [{ key: 'Added', value: `'${c}' x${freq[c]}` }, { key: 'Result', value: result }],
          ),
        });
        delete freq[c];
      }
    }

    for (const [c, cnt] of Object.entries(freq)) {
      result += c.repeat(cnt);
      steps.push({
        line: 9,
        explanation: `Add remaining '${c}' (x${cnt}). result="${result}".`,
        variables: { char: c, count: cnt, result },
        visualization: makeViz(
          Object.fromEntries(charCodes.map((_, i) => [i, s[i] === c ? 'pointer' : 'visited'])),
          Object.fromEntries(s.split('').map((ch, i) => [i, ch])),
          [{ key: 'Remaining', value: `'${c}' x${cnt}` }, { key: 'Result', value: result }],
        ),
      });
    }

    const resultCodes = result.split('').map(c => c.charCodeAt(0) - 96);
    steps.push({
      line: 1,
      explanation: `Custom sort complete! Result: "${result}".`,
      variables: { result },
      visualization: {
        type: 'array',
        array: resultCodes,
        highlights: Object.fromEntries(resultCodes.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(result.split('').map((c, i) => [i, c])),
        auxData: { label: 'Custom Sort String', entries: [{ key: 'Output', value: result }] },
      },
    });

    return steps;
  },
};

export default customSortStringIII;

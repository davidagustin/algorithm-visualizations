import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const partitionLabels: AlgorithmDefinition = {
  id: 'partition-labels',
  title: 'Partition Labels',
  leetcodeNumber: 763,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Partition a string into as many parts as possible so that each letter appears in at most one part. Greedy: first record the last occurrence of each character. Then sweep the string: extend the current partition end to the last occurrence of the current character. When i reaches the partition end, record a partition.',
  tags: ['Greedy', 'String', 'Two Pointers'],
  code: {
    pseudocode: `function partitionLabels(s):
  last = map each char to its last index
  result = []
  start = 0, end = 0
  for i from 0 to s.length-1:
    end = max(end, last[s[i]])
    if i == end:
      result.append(end - start + 1)
      start = i + 1
  return result`,
    python: `def partitionLabels(s):
    last = {c: i for i, c in enumerate(s)}
    result = []
    start = end = 0
    for i, c in enumerate(s):
        end = max(end, last[c])
        if i == end:
            result.append(end - start + 1)
            start = i + 1
    return result`,
    javascript: `function partitionLabels(s) {
  const last = {};
  for (let i = 0; i < s.length; i++) last[s[i]] = i;
  const result = [];
  let start = 0, end = 0;
  for (let i = 0; i < s.length; i++) {
    end = Math.max(end, last[s[i]]);
    if (i === end) {
      result.push(end - start + 1);
      start = i + 1;
    }
  }
  return result;
}`,
    java: `public List<Integer> partitionLabels(String s) {
    int[] last = new int[26];
    for (int i = 0; i < s.length(); i++)
        last[s.charAt(i) - 'a'] = i;
    List<Integer> result = new ArrayList<>();
    int start = 0, end = 0;
    for (int i = 0; i < s.length(); i++) {
        end = Math.max(end, last[s.charAt(i) - 'a']);
        if (i == end) {
            result.add(end - start + 1);
            start = i + 1;
        }
    }
    return result;
}`,
  },
  defaultInput: { s: 'ababcbacadefegdehijhklij' },
  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'ababcbacadefegdehijhklij',
      placeholder: 'e.g. ababcbacadefegdehijhklij',
      helperText: 'Lowercase string to partition',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const n = s.length;
    const steps: AlgorithmStep[] = [];

    // Build last occurrence map
    const last: Record<string, number> = {};
    for (let i = 0; i < n; i++) last[s[i]] = i;

    const chars = s.split('').map((_, i) => i);
    const result: number[] = [];
    let start = 0, end = 0;
    const partitionColors: Record<number, string> = {};
    const colorList = ['found', 'active', 'pointer', 'sorted', 'comparing'];

    function makeViz(i: number, partitionEnd: number): ArrayVisualization {
      const highlights: Record<number, string> = { ...partitionColors };
      const labels: Record<number, string> = {};
      for (let j = 0; j < n; j++) {
        labels[j] = s[j];
        if (partitionColors[j] !== undefined) {
          // already set, keep color
        } else if (j >= start && j <= partitionEnd) {
          highlights[j] = 'active';
        } else {
          highlights[j] = 'default';
        }
      }
      if (i < n) highlights[i] = 'current';
      if (partitionEnd < n) {
        const prev = highlights[partitionEnd];
        if (prev !== 'current') highlights[partitionEnd] = 'pointer';
      }
      return {
        type: 'array',
        array: chars.slice(),
        highlights,
        labels,
        auxData: {
          label: 'Partition State',
          entries: [
            { key: 'Current char', value: i < n ? `"${s[i]}" at idx ${i}` : '-' },
            { key: 'Last occurrence', value: i < n ? String(last[s[i]]) : '-' },
            { key: 'Start', value: String(start) },
            { key: 'End (extended)', value: String(partitionEnd) },
            { key: 'Partitions', value: result.join(', ') || 'none' },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Record last occurrence of each character. last: ${Object.entries(last).map(([k, v]) => `${k}→${v}`).join(', ')}.`,
      variables: { last },
      visualization: makeViz(0, 0),
    });

    steps.push({
      line: 3,
      explanation: `Initialize start=0, end=0. Sweep string and extend partition boundary.`,
      variables: { start, end },
      visualization: makeViz(0, 0),
    });

    let colorIdx = 0;
    for (let i = 0; i < n; i++) {
      const prevEnd = end;
      end = Math.max(end, last[s[i]]);

      steps.push({
        line: 5,
        explanation: `i=${i}, s[i]="${s[i]}". last["${s[i]}"]=>${last[s[i]]}. end = max(${prevEnd}, ${last[s[i]]}) = ${end}.`,
        variables: { i, char: s[i], lastOccurrence: last[s[i]], prevEnd, end },
        visualization: makeViz(i, end),
      });

      if (i === end) {
        const partLen = end - start + 1;
        result.push(partLen);
        const color = colorList[colorIdx % colorList.length];
        colorIdx++;
        for (let j = start; j <= end; j++) partitionColors[j] = color;
        steps.push({
          line: 7,
          explanation: `i=${i} == end=${end}. Partition [${start}..${end}] length ${partLen} complete! Partitions: [${result.join(', ')}].`,
          variables: { partitionLength: partLen, start, end, total: result.length },
          visualization: makeViz(i, end),
        });
        start = i + 1;
      }
    }

    steps.push({
      line: 9,
      explanation: `All partitions found: [${result.join(', ')}]. Each letter appears in exactly one part.`,
      variables: { result },
      visualization: (() => {
        const h: Record<number, string> = { ...partitionColors };
        const l: Record<number, string> = {};
        for (let i = 0; i < n; i++) l[i] = s[i];
        return {
          type: 'array' as const,
          array: chars.slice(),
          highlights: h,
          labels: l,
          auxData: {
            label: 'Final Partitions',
            entries: [
              { key: 'Partition sizes', value: `[${result.join(', ')}]` },
              { key: 'Part count', value: String(result.length) },
            ],
          },
        };
      })(),
    });

    return steps;
  },
};

export default partitionLabels;

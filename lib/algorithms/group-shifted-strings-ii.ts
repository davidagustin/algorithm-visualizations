import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const groupShiftedStringsIi: AlgorithmDefinition = {
  id: 'group-shifted-strings-ii',
  title: 'Group Shifted Strings',
  leetcodeNumber: 249,
  difficulty: 'Medium',
  category: 'String',
  description:
    'Group strings that belong to the same shifting sequence. A string belongs to a shifting sequence if shifting each character by the same amount gives another string in the sequence. Encode each string as its "difference signature" (mod 26) and group by it.',
  tags: ['string', 'hash map', 'grouping', 'encoding'],
  code: {
    pseudocode: `function groupStrings(strings):
  groups = {}
  for s in strings:
    key = encodeShift(s)
    groups[key].append(s)
  return list(groups.values())

function encodeShift(s):
  if len(s) == 1: return ()
  diffs = []
  for i in 1..len(s)-1:
    diffs.append((s[i]-s[i-1]+26) % 26)
  return tuple(diffs)`,
    python: `def groupStrings(strings):
    from collections import defaultdict
    groups = defaultdict(list)
    for s in strings:
        key = tuple((ord(c) - ord(s[0])) % 26 for c in s)
        groups[key].append(s)
    return list(groups.values())`,
    javascript: `function groupStrings(strings) {
  const groups = new Map();
  for (const s of strings) {
    const key = s.split('').map(c => (c.charCodeAt(0) - s.charCodeAt(0) + 26) % 26).join(',');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(s);
  }
  return [...groups.values()];
}`,
    java: `public List<List<String>> groupStrings(String[] strings) {
    Map<String, List<String>> groups = new HashMap<>();
    for (String s : strings) {
        StringBuilder key = new StringBuilder();
        for (char c : s.toCharArray())
            key.append((c - s.charAt(0) + 26) % 26).append(',');
        groups.computeIfAbsent(key.toString(), k -> new ArrayList<>()).add(s);
    }
    return new ArrayList<>(groups.values());
}`,
  },
  defaultInput: { strings: ['abc', 'bcd', 'acef', 'xyz', 'az', 'ba', 'a', 'z'] },
  inputFields: [
    { name: 'strings', label: 'Strings Array', type: 'array', defaultValue: ['abc', 'bcd', 'acef', 'xyz', 'az', 'ba', 'a', 'z'], placeholder: 'abc,bcd', helperText: 'Strings to group by shift equivalence' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const strings = input.strings as string[];
    const steps: AlgorithmStep[] = [];
    const groups = new Map<string, string[]>();

    const encodeKey = (s: string) =>
      s.split('').map(c => ((c.charCodeAt(0) - s.charCodeAt(0)) + 26) % 26).join(',');

    const makeViz = (pos: number, groups: Map<string, string[]>): ArrayVisualization => {
      const highlights: Record<number, string> = {};
      const groupColors = ['active', 'found', 'comparing', 'match', 'sorted', 'pointer'];
      let gi = 0;
      groups.forEach(members => {
        members.forEach(m => {
          const idx = strings.indexOf(m);
          if (idx >= 0) highlights[idx] = groupColors[gi % groupColors.length];
        });
        gi++;
      });
      if (pos >= 0) highlights[pos] = 'current';
      const labels: Record<number, string> = {};
      strings.forEach((s, i) => { labels[i] = s; });
      return {
        type: 'array',
        array: strings.map((_, i) => i),
        highlights,
        labels,
        auxData: {
          label: 'Group Shifted Strings',
          entries: [...groups.entries()].map(([key, vals]) => ({
            key: `[${key}]`, value: vals.join(', ')
          })),
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `Group ${strings.length} strings by shift equivalence. Encode each as difference offsets from first char.`,
      variables: { strings },
      visualization: makeViz(-1, new Map()),
    });

    strings.forEach((s, i) => {
      const key = encodeKey(s);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(s);

      steps.push({
        line: 4,
        explanation: `"${s}" -> key=[${key}]. Group now: [${groups.get(key)!.join(', ')}]. Total groups: ${groups.size}.`,
        variables: { string: s, key, groupMembers: [...groups.get(key)!] },
        visualization: makeViz(i, new Map(groups)),
      });
    });

    const result = [...groups.values()];
    steps.push({
      line: 6,
      explanation: `Grouped into ${result.length} group(s): ${result.map(g => `[${g.join(', ')}]`).join(' | ')}.`,
      variables: { result: result.map(g => [...g]) },
      visualization: makeViz(-1, new Map(groups)),
    });

    return steps;
  },
};

export default groupShiftedStringsIi;

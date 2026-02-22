import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const groupAnagrams: AlgorithmDefinition = {
  id: 'group-anagrams',
  title: 'Group Anagrams',
  leetcodeNumber: 49,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Given an array of strings, group the anagrams together. Anagrams are strings using the same characters in the same frequencies. Use a hash map where the sorted string is the key and groups are values.',
  tags: ['hash map', 'string', 'sorting', 'grouping'],

  code: {
    pseudocode: `function groupAnagrams(strs):
  map = {}
  for str in strs:
    key = sort(str)
    if key not in map:
      map[key] = []
    map[key].append(str)
  return values(map)`,

    python: `def groupAnagrams(strs: list[str]) -> list[list[str]]:
    from collections import defaultdict
    map = defaultdict(list)
    for s in strs:
        key = ''.join(sorted(s))
        map[key].append(s)
    return list(map.values())`,

    javascript: `function groupAnagrams(strs) {
  const map = new Map();
  for (const s of strs) {
    const key = s.split('').sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(s);
  }
  return [...map.values()];
}`,

    java: `public List<List<String>> groupAnagrams(String[] strs) {
    Map<String, List<String>> map = new HashMap<>();
    for (String s : strs) {
        char[] chars = s.toCharArray();
        Arrays.sort(chars);
        String key = new String(chars);
        map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
    }
    return new ArrayList<>(map.values());
}`,
  },

  defaultInput: {
    strs: ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'],
  },

  inputFields: [
    {
      name: 'strs',
      label: 'Strings Array',
      type: 'array',
      defaultValue: ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'],
      placeholder: 'eat,tea,tan,ate,nat,bat',
      helperText: 'Comma-separated strings to group',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const strs = input.strs as string[];
    const steps: AlgorithmStep[] = [];
    const map: Record<string, string[]> = {};

    // Use char codes for visualization array
    const indices = strs.map((_, i) => i);
    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      mapEntries: { key: string; value: string }[]
    ): ArrayVisualization => ({
      type: 'array',
      array: indices,
      highlights,
      labels,
      auxData: { label: 'Anagram Groups', entries: mapEntries },
    });

    const mapToEntries = () =>
      Object.entries(map).map(([k, v]) => ({ key: `"${k}"`, value: `[${v.map(s => `"${s}"`).join(', ')}]` }));

    steps.push({
      line: 1,
      explanation: `Group anagrams from [${strs.map(s => `"${s}"`).join(', ')}]. We'll sort each string to get its canonical key.`,
      variables: { strs: [...strs] },
      visualization: makeViz({}, strs.reduce((acc, s, i) => ({ ...acc, [i]: s }), {}), []),
    });

    for (let i = 0; i < strs.length; i++) {
      const str = strs[i];
      const key = str.split('').sort().join('');

      steps.push({
        line: 3,
        explanation: `Processing "${str}". Sort its characters: "${key}". This is the anagram key.`,
        variables: { i, str, key },
        visualization: makeViz(
          { [i]: 'active' },
          strs.reduce((acc, s, j) => ({ ...acc, [j]: j === i ? `key="${key}"` : s }), {}),
          mapToEntries()
        ),
      });

      if (!map[key]) {
        map[key] = [];
        steps.push({
          line: 4,
          explanation: `Key "${key}" is new. Create group for it.`,
          variables: { key, newGroup: true },
          visualization: makeViz(
            { [i]: 'comparing' },
            strs.reduce((acc, s, j) => ({ ...acc, [j]: s }), {}),
            mapToEntries()
          ),
        });
      }

      map[key].push(str);

      steps.push({
        line: 6,
        explanation: `Add "${str}" to group "${key}". Group now: [${map[key].map(s => `"${s}"`).join(', ')}].`,
        variables: { str, key, group: [...map[key]] },
        visualization: makeViz(
          { [i]: 'found' },
          strs.reduce((acc, s, j) => ({ ...acc, [j]: s }), {}),
          mapToEntries()
        ),
      });
    }

    const result = Object.values(map);
    steps.push({
      line: 7,
      explanation: `Done! ${result.length} anagram groups: ${result.map(g => `[${g.map(s => `"${s}"`).join(', ')}]`).join(', ')}.`,
      variables: { result },
      visualization: makeViz(
        Object.fromEntries(strs.map((_, i) => [i, 'sorted'])),
        strs.reduce((acc, s, i) => ({ ...acc, [i]: s }), {}),
        mapToEntries()
      ),
    });

    return steps;
  },
};

export default groupAnagrams;

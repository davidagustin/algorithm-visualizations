import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const ransomNote: AlgorithmDefinition = {
  id: 'ransom-note',
  title: 'Ransom Note',
  leetcodeNumber: 383,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Given two strings ransomNote and magazine, return true if ransomNote can be constructed by using the letters from magazine. Each letter in magazine can only be used once. Count magazine letters, then verify ransomNote requirements.',
  tags: ['hash map', 'string', 'counting'],

  code: {
    pseudocode: `function canConstruct(ransomNote, magazine):
  count = {}
  for char in magazine:
    count[char] = count.get(char, 0) + 1
  for char in ransomNote:
    count[char] = count.get(char, 0) - 1
    if count[char] < 0:
      return false
  return true`,

    python: `def canConstruct(ransomNote: str, magazine: str) -> bool:
    count = {}
    for c in magazine:
        count[c] = count.get(c, 0) + 1
    for c in ransomNote:
        count[c] = count.get(c, 0) - 1
        if count[c] < 0:
            return False
    return True`,

    javascript: `function canConstruct(ransomNote, magazine) {
  const count = {};
  for (const c of magazine) count[c] = (count[c] || 0) + 1;
  for (const c of ransomNote) {
    count[c] = (count[c] || 0) - 1;
    if (count[c] < 0) return false;
  }
  return true;
}`,

    java: `public boolean canConstruct(String ransomNote, String magazine) {
    Map<Character, Integer> count = new HashMap<>();
    for (char c : magazine.toCharArray()) count.merge(c, 1, Integer::sum);
    for (char c : ransomNote.toCharArray()) {
        count.merge(c, -1, Integer::sum);
        if (count.get(c) < 0) return false;
    }
    return true;
}`,
  },

  defaultInput: {
    ransomNote: 'aab',
    magazine: 'aab',
  },

  inputFields: [
    {
      name: 'ransomNote',
      label: 'Ransom Note',
      type: 'string',
      defaultValue: 'aab',
      placeholder: 'aab',
      helperText: 'String to construct',
    },
    {
      name: 'magazine',
      label: 'Magazine',
      type: 'string',
      defaultValue: 'aab',
      placeholder: 'aab',
      helperText: 'Source of available letters',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const ransomNote = input.ransomNote as string;
    const magazine = input.magazine as string;
    const steps: AlgorithmStep[] = [];
    const count: Record<string, number> = {};

    const magArr = magazine.split('').map((c) => c.charCodeAt(0));
    const noteArr = ransomNote.split('').map((c) => c.charCodeAt(0));

    const makeViz = (
      arr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>,
      entries: { key: string; value: string }[]
    ): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
      auxData: { label: 'Letter Count', entries },
    });

    const mapToEntries = () =>
      Object.entries(count).map(([k, v]) => ({ key: `'${k}'`, value: String(v) }));

    steps.push({
      line: 1,
      explanation: `Can we construct "${ransomNote}" from magazine "${magazine}"? Count magazine letters first.`,
      variables: { ransomNote, magazine },
      visualization: makeViz(magArr, {}, {}, []),
    });

    // Count magazine letters
    for (let i = 0; i < magazine.length; i++) {
      const ch = magazine[i];
      count[ch] = (count[ch] || 0) + 1;
      steps.push({
        line: 3,
        explanation: `magazine[${i}] = '${ch}'. Increment count['${ch}'] to ${count[ch]}.`,
        variables: { i, char: ch, 'count[char]': count[ch] },
        visualization: makeViz(magArr, { [i]: 'active' }, { [i]: ch }, mapToEntries()),
      });
    }

    steps.push({
      line: 4,
      explanation: `Magazine inventory complete. Now check if ransomNote "${ransomNote}" can be satisfied.`,
      variables: { count: { ...count } },
      visualization: makeViz(magArr, Object.fromEntries(magArr.map((_, i) => [i, 'sorted'])), {}, mapToEntries()),
    });

    // Check ransom note
    for (let i = 0; i < ransomNote.length; i++) {
      const ch = ransomNote[i];
      count[ch] = (count[ch] || 0) - 1;

      steps.push({
        line: 5,
        explanation: `ransomNote[${i}] = '${ch}'. Use one '${ch}'. Remaining count['${ch}'] = ${count[ch]}.`,
        variables: { i, char: ch, 'count[char]': count[ch] },
        visualization: makeViz(noteArr, { [i]: count[ch] < 0 ? 'mismatch' : 'comparing' }, { [i]: ch }, mapToEntries()),
      });

      if (count[ch] < 0) {
        steps.push({
          line: 7,
          explanation: `count['${ch}'] = ${count[ch]} < 0. Not enough '${ch}' in magazine. Return false.`,
          variables: { char: ch, count: count[ch] },
          visualization: makeViz(noteArr, { [i]: 'mismatch' }, { [i]: 'fail' }, mapToEntries()),
        });
        return steps;
      }
    }

    steps.push({
      line: 8,
      explanation: `All letters accounted for. ransomNote "${ransomNote}" CAN be constructed from magazine. Return true.`,
      variables: { result: true },
      visualization: makeViz(
        noteArr,
        Object.fromEntries(noteArr.map((_, i) => [i, 'found'])),
        {},
        mapToEntries()
      ),
    });

    return steps;
  },
};

export default ransomNote;

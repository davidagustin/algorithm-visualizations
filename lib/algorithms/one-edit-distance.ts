import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const oneEditDistance: AlgorithmDefinition = {
  id: 'one-edit-distance',
  title: 'One Edit Distance',
  leetcodeNumber: 161,
  difficulty: 'Medium',
  category: 'String',
  description:
    'Given two strings s and t, determine if they are exactly one edit apart. An edit is defined as inserting a character, deleting a character, or replacing a character. If the lengths differ by more than 1, they cannot be one edit apart.',
  tags: ['string', 'two pointers'],

  code: {
    pseudocode: `function isOneEditDistance(s, t):
  if abs(len(s) - len(t)) > 1:
    return false
  if len(s) > len(t):
    swap s and t
  for i from 0 to len(s):
    if s[i] != t[i]:
      if len(s) == len(t):
        return s[i+1:] == t[i+1:]
      else:
        return s[i:] == t[i+1:]
  return len(s) + 1 == len(t)`,

    python: `def isOneEditDistance(s: str, t: str) -> bool:
    m, n = len(s), len(t)
    if abs(m - n) > 1:
        return False
    if m > n:
        return isOneEditDistance(t, s)
    for i in range(m):
        if s[i] != t[i]:
            if m == n:
                return s[i+1:] == t[i+1:]
            else:
                return s[i:] == t[i+1:]
    return m + 1 == n`,

    javascript: `function isOneEditDistance(s, t) {
  const m = s.length, n = t.length;
  if (Math.abs(m - n) > 1) return false;
  if (m > n) return isOneEditDistance(t, s);
  for (let i = 0; i < m; i++) {
    if (s[i] !== t[i]) {
      if (m === n) return s.slice(i+1) === t.slice(i+1);
      else return s.slice(i) === t.slice(i+1);
    }
  }
  return m + 1 === n;
}`,

    java: `public boolean isOneEditDistance(String s, String t) {
    int m = s.length(), n = t.length();
    if (Math.abs(m - n) > 1) return false;
    if (m > n) return isOneEditDistance(t, s);
    for (int i = 0; i < m; i++) {
        if (s.charAt(i) != t.charAt(i)) {
            if (m == n) return s.substring(i+1).equals(t.substring(i+1));
            else return s.substring(i).equals(t.substring(i+1));
        }
    }
    return m + 1 == n;
}`,
  },

  defaultInput: {
    s: 'ab',
    t: 'acb',
  },

  inputFields: [
    {
      name: 's',
      label: 'String S',
      type: 'string',
      defaultValue: 'ab',
      placeholder: 'ab',
      helperText: 'First string',
    },
    {
      name: 't',
      label: 'String T',
      type: 'string',
      defaultValue: 'acb',
      placeholder: 'acb',
      helperText: 'Second string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const t = input.t as string;
    const steps: AlgorithmStep[] = [];

    const sArr = s.split('').map((_, i) => i);
    const tArr = t.split('').map((_, i) => i);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      arr: string[]
    ): ArrayVisualization => ({
      type: 'array',
      array: arr as unknown as number[],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Start: s="${s}" (len=${s.length}), t="${t}" (len=${t.length}). Check if length difference > 1.`,
      variables: { s, t, lenS: s.length, lenT: t.length },
      visualization: makeViz({}, {}, s.split('')),
    });

    if (Math.abs(s.length - t.length) > 1) {
      steps.push({
        line: 2,
        explanation: `Length difference is ${Math.abs(s.length - t.length)} which is > 1. Return false immediately.`,
        variables: { result: false },
        visualization: makeViz({}, {}, s.split('')),
      });
      return steps;
    }

    let shorter = s;
    let longer = t;
    if (s.length > t.length) {
      shorter = t;
      longer = s;
      steps.push({
        line: 4,
        explanation: `s is longer than t, so swap them for easier iteration. shorter="${shorter}", longer="${longer}".`,
        variables: { shorter, longer },
        visualization: makeViz({}, {}, shorter.split('')),
      });
    }

    steps.push({
      line: 5,
      explanation: `Iterate through the shorter string to find first mismatch.`,
      variables: { shorter, longer },
      visualization: makeViz({}, {}, shorter.split('')),
    });

    for (let i = 0; i < shorter.length; i++) {
      const highlights: Record<number, string> = {};
      highlights[i] = 'active';

      steps.push({
        line: 6,
        explanation: `Compare index ${i}: shorter[${i}]="${shorter[i]}" vs longer[${i}]="${longer[i]}".`,
        variables: { i, shorterChar: shorter[i], longerChar: longer[i] },
        visualization: makeViz(highlights, { [i]: 'i' }, shorter.split('')),
      });

      if (shorter[i] !== longer[i]) {
        highlights[i] = 'mismatch';
        if (shorter.length === longer.length) {
          const restMatch = shorter.slice(i + 1) === longer.slice(i + 1);
          steps.push({
            line: 8,
            explanation: `Mismatch at index ${i}. Same length so this is a replace. Rest after index: "${shorter.slice(i + 1)}" vs "${longer.slice(i + 1)}". Result: ${restMatch}.`,
            variables: { i, action: 'replace', result: restMatch },
            visualization: makeViz(highlights, { [i]: 'mismatch' }, shorter.split('')),
          });
          return steps;
        } else {
          const restMatch = shorter.slice(i) === longer.slice(i + 1);
          steps.push({
            line: 10,
            explanation: `Mismatch at index ${i}. Length differs by 1 so this is an insert. Check if shorter[${i}:]="${shorter.slice(i)}" == longer[${i + 1}:]="${longer.slice(i + 1)}". Result: ${restMatch}.`,
            variables: { i, action: 'insert', result: restMatch },
            visualization: makeViz(highlights, { [i]: 'mismatch' }, shorter.split('')),
          });
          return steps;
        }
      } else {
        highlights[i] = 'match';
        steps.push({
          line: 6,
          explanation: `Match at index ${i}: both are "${shorter[i]}". Continue.`,
          variables: { i },
          visualization: makeViz(highlights, { [i]: 'match' }, shorter.split('')),
        });
      }
    }

    const result = shorter.length + 1 === longer.length;
    steps.push({
      line: 11,
      explanation: `No mismatch found. Strings are identical up to length ${shorter.length}. Result is shorter.length + 1 == longer.length => ${shorter.length} + 1 == ${longer.length} => ${result}.`,
      variables: { result },
      visualization: makeViz({}, {}, shorter.split('')),
    });

    return steps;
  },
};

export default oneEditDistance;

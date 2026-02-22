import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const compareVersionNumbers: AlgorithmDefinition = {
  id: 'compare-version-numbers',
  title: 'Compare Version Numbers',
  leetcodeNumber: 165,
  difficulty: 'Medium',
  category: 'String',
  description:
    'Given two version strings version1 and version2, compare them. Version strings consist of revisions separated by dots. Compare each revision integer from left to right. Return 1 if version1 > version2, -1 if version1 < version2, and 0 if equal.',
  tags: ['string', 'two pointers', 'split'],

  code: {
    pseudocode: `function compareVersion(version1, version2):
  parts1 = split version1 by '.'
  parts2 = split version2 by '.'
  n = max(len(parts1), len(parts2))
  for i from 0 to n-1:
    v1 = parts1[i] if i < len(parts1) else 0
    v2 = parts2[i] if i < len(parts2) else 0
    if v1 > v2: return 1
    if v1 < v2: return -1
  return 0`,

    python: `def compareVersion(version1: str, version2: str) -> int:
    parts1 = list(map(int, version1.split('.')))
    parts2 = list(map(int, version2.split('.')))
    n = max(len(parts1), len(parts2))
    for i in range(n):
        v1 = parts1[i] if i < len(parts1) else 0
        v2 = parts2[i] if i < len(parts2) else 0
        if v1 > v2: return 1
        if v1 < v2: return -1
    return 0`,

    javascript: `function compareVersion(version1, version2) {
  const parts1 = version1.split('.').map(Number);
  const parts2 = version2.split('.').map(Number);
  const n = Math.max(parts1.length, parts2.length);
  for (let i = 0; i < n; i++) {
    const v1 = parts1[i] ?? 0;
    const v2 = parts2[i] ?? 0;
    if (v1 > v2) return 1;
    if (v1 < v2) return -1;
  }
  return 0;
}`,

    java: `public int compareVersion(String version1, String version2) {
    String[] parts1 = version1.split("\\\\.");
    String[] parts2 = version2.split("\\\\.");
    int n = Math.max(parts1.length, parts2.length);
    for (int i = 0; i < n; i++) {
        int v1 = i < parts1.length ? Integer.parseInt(parts1[i]) : 0;
        int v2 = i < parts2.length ? Integer.parseInt(parts2[i]) : 0;
        if (v1 > v2) return 1;
        if (v1 < v2) return -1;
    }
    return 0;
}`,
  },

  defaultInput: {
    version1: '1.2.3',
    version2: '1.2.4',
  },

  inputFields: [
    {
      name: 'version1',
      label: 'Version 1',
      type: 'string',
      defaultValue: '1.2.3',
      placeholder: '1.2.3',
      helperText: 'First version string (dot-separated integers)',
    },
    {
      name: 'version2',
      label: 'Version 2',
      type: 'string',
      defaultValue: '1.2.4',
      placeholder: '1.2.4',
      helperText: 'Second version string (dot-separated integers)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const version1 = input.version1 as string;
    const version2 = input.version2 as string;
    const steps: AlgorithmStep[] = [];

    const parts1 = version1.split('.').map(Number);
    const parts2 = version2.split('.').map(Number);
    const n = Math.max(parts1.length, parts2.length);

    steps.push({
      line: 1,
      explanation: `Split version1 "${version1}" into parts: [${parts1.join(', ')}]`,
      variables: { version1, parts1: parts1.join(', ') },
      visualization: {
        type: 'array',
        array: parts1,
        highlights: Object.fromEntries(parts1.map((_, i) => [i, 'active'])),
        labels: Object.fromEntries(parts1.map((_, i) => [i, `v1[${i}]`])),
      },
    });

    steps.push({
      line: 2,
      explanation: `Split version2 "${version2}" into parts: [${parts2.join(', ')}]`,
      variables: { version2, parts2: parts2.join(', ') },
      visualization: {
        type: 'array',
        array: parts2,
        highlights: Object.fromEntries(parts2.map((_, i) => [i, 'active'])),
        labels: Object.fromEntries(parts2.map((_, i) => [i, `v2[${i}]`])),
      },
    });

    for (let i = 0; i < n; i++) {
      const v1 = i < parts1.length ? parts1[i] : 0;
      const v2 = i < parts2.length ? parts2[i] : 0;

      steps.push({
        line: 5,
        explanation: `Compare revision ${i}: v1[${i}] = ${v1} vs v2[${i}] = ${v2}`,
        variables: { revision: i, v1, v2 },
        visualization: {
          type: 'array',
          array: [v1, v2],
          highlights: { 0: 'comparing', 1: 'comparing' },
          labels: { 0: `v1[${i}]`, 1: `v2[${i}]` },
        },
      });

      if (v1 > v2) {
        steps.push({
          line: 8,
          explanation: `v1[${i}] (${v1}) > v2[${i}] (${v2}): version1 is greater. Return 1.`,
          variables: { revision: i, v1, v2, result: 1 },
          visualization: {
            type: 'array',
            array: [v1, v2],
            highlights: { 0: 'found', 1: 'mismatch' },
            labels: { 0: 'LARGER', 1: 'smaller' },
          },
        });
        return steps;
      } else if (v1 < v2) {
        steps.push({
          line: 9,
          explanation: `v1[${i}] (${v1}) < v2[${i}] (${v2}): version2 is greater. Return -1.`,
          variables: { revision: i, v1, v2, result: -1 },
          visualization: {
            type: 'array',
            array: [v1, v2],
            highlights: { 0: 'mismatch', 1: 'found' },
            labels: { 0: 'smaller', 1: 'LARGER' },
          },
        });
        return steps;
      } else {
        steps.push({
          line: 5,
          explanation: `v1[${i}] (${v1}) == v2[${i}] (${v2}): revisions are equal, continue to next revision.`,
          variables: { revision: i, v1, v2 },
          visualization: {
            type: 'array',
            array: [v1, v2],
            highlights: { 0: 'sorted', 1: 'sorted' },
            labels: { 0: 'equal', 1: 'equal' },
          },
        });
      }
    }

    steps.push({
      line: 10,
      explanation: 'All revisions are equal. Return 0.',
      variables: { result: 0 },
      visualization: {
        type: 'array',
        array: [0],
        highlights: { 0: 'found' },
        labels: { 0: 'result' },
      },
    });

    return steps;
  },
};

export default compareVersionNumbers;

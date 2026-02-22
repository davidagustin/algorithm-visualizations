import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const licenseKeyFormatting: AlgorithmDefinition = {
  id: 'license-key-formatting',
  title: 'License Key Formatting',
  leetcodeNumber: 482,
  difficulty: 'Easy',
  category: 'String',
  description:
    'Given a license key string s and integer k, reformat the key such that each group contains exactly k characters, except the first group which may be shorter. Groups are separated by dashes and all letters are uppercased.',
  tags: ['string', 'simulation'],

  code: {
    pseudocode: `function licenseKeyFormatting(s, k):
  cleaned = s.replace('-','').toUpperCase()
  result = []
  firstGroupLen = len(cleaned) % k
  if firstGroupLen > 0:
    result.append(cleaned[0..firstGroupLen])
  for i from firstGroupLen to len(cleaned) step k:
    result.append(cleaned[i..i+k])
  return result.join('-')`,

    python: `def licenseKeyFormatting(s: str, k: int) -> str:
    cleaned = s.replace('-', '').upper()
    n = len(cleaned)
    first = n % k
    parts = []
    if first:
        parts.append(cleaned[:first])
    for i in range(first, n, k):
        parts.append(cleaned[i:i+k])
    return '-'.join(parts)`,

    javascript: `function licenseKeyFormatting(s, k) {
  const cleaned = s.replace(/-/g, '').toUpperCase();
  const n = cleaned.length;
  const first = n % k;
  const parts = [];
  if (first) parts.push(cleaned.slice(0, first));
  for (let i = first; i < n; i += k) {
    parts.push(cleaned.slice(i, i + k));
  }
  return parts.join('-');
}`,

    java: `public String licenseKeyFormatting(String s, int k) {
    String cleaned = s.replace("-", "").toUpperCase();
    int n = cleaned.length();
    int first = n % k;
    StringBuilder sb = new StringBuilder();
    if (first > 0) sb.append(cleaned, 0, first);
    for (int i = first; i < n; i += k) {
        if (sb.length() > 0) sb.append('-');
        sb.append(cleaned, i, i + k);
    }
    return sb.toString();
}`,
  },

  defaultInput: {
    s: '5F3Z-2e-9-w',
    k: 4,
  },

  inputFields: [
    {
      name: 's',
      label: 'License Key String',
      type: 'string',
      defaultValue: '5F3Z-2e-9-w',
      placeholder: '5F3Z-2e-9-w',
      helperText: 'License key string with alphanumerics and dashes',
    },
    {
      name: 'k',
      label: 'Group Size K',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Size of each group in reformatted key',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Input: "${s}", k=${k}. First remove dashes and uppercase all letters.`,
      variables: { s, k },
      visualization: {
        type: 'array',
        array: s.split('').map((_, i) => i),
        highlights: {},
        labels: Object.fromEntries(s.split('').map((c, i) => [i, c])),
      },
    });

    const cleaned = s.replace(/-/g, '').toUpperCase();
    steps.push({
      line: 2,
      explanation: `Cleaned string (dashes removed, uppercased): "${cleaned}", length=${cleaned.length}`,
      variables: { cleaned, length: cleaned.length },
      visualization: {
        type: 'array',
        array: cleaned.split('').map((_, i) => i),
        highlights: Object.fromEntries(cleaned.split('').map((_, i) => [i, 'active'])),
        labels: Object.fromEntries(cleaned.split('').map((c, i) => [i, c])),
      },
    });

    const n = cleaned.length;
    const firstLen = n % k;

    steps.push({
      line: 4,
      explanation: `First group length = ${n} % ${k} = ${firstLen}. ${firstLen === 0 ? 'All groups will have exactly k characters.' : `First group has ${firstLen} char(s).`}`,
      variables: { n, k, firstGroupLen: firstLen },
      visualization: {
        type: 'array',
        array: cleaned.split('').map((_, i) => i),
        highlights: Object.fromEntries(Array.from({ length: firstLen }, (_, i) => [i, 'pointer'])),
        labels: Object.fromEntries(cleaned.split('').map((c, i) => [i, c])),
      },
    });

    const parts: string[] = [];
    if (firstLen > 0) {
      parts.push(cleaned.slice(0, firstLen));
      steps.push({
        line: 6,
        explanation: `First group: "${cleaned.slice(0, firstLen)}"`,
        variables: { firstGroup: cleaned.slice(0, firstLen) },
        visualization: {
          type: 'array',
          array: cleaned.split('').map((_, i) => i),
          highlights: Object.fromEntries(Array.from({ length: firstLen }, (_, i) => [i, 'found'])),
          labels: Object.fromEntries(cleaned.split('').map((c, i) => [i, c])),
        },
      });
    }

    for (let i = firstLen; i < n; i += k) {
      const group = cleaned.slice(i, i + k);
      parts.push(group);
      steps.push({
        line: 7,
        explanation: `Group ${parts.length}: "${group}" (indices ${i} to ${i + k - 1})`,
        variables: { groupIndex: parts.length, group, partsSoFar: parts.join('-') },
        visualization: {
          type: 'array',
          array: cleaned.split('').map((_, idx) => idx),
          highlights: {
            ...Object.fromEntries(Array.from({ length: group.length }, (_, j) => [i + j, 'active'])),
            ...Object.fromEntries(Array.from({ length: i }, (_, j) => [j, 'sorted'])),
          },
          labels: Object.fromEntries(cleaned.split('').map((c, idx) => [idx, c])),
        },
      });
    }

    const result = parts.join('-');
    steps.push({
      line: 9,
      explanation: `Join groups with dashes. Final result: "${result}"`,
      variables: { parts: parts.join(', '), result },
      visualization: {
        type: 'array',
        array: cleaned.split('').map((_, i) => i),
        highlights: Object.fromEntries(cleaned.split('').map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(cleaned.split('').map((c, i) => [i, c])),
      },
    });

    return steps;
  },
};

export default licenseKeyFormatting;

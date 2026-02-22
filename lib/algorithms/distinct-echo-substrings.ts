import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const distinctEchoSubstrings: AlgorithmDefinition = {
  id: 'distinct-echo-substrings',
  title: 'Distinct Echo Substrings',
  leetcodeNumber: 1316,
  difficulty: 'Hard',
  category: 'String',
  description:
    'Count distinct substrings of the form s+s (echo strings). For each even-length window of length 2k, check if the first half equals the second half. Use rolling hash or Z-function for efficient comparison.',
  tags: ['string', 'rolling hash', 'hashing', 'substring'],
  code: {
    pseudocode: `function distinctEchoSubstrings(text):
  seen = set()
  n = len(text)
  for k in 1..n//2:
    for i in 0..n-2k:
      first = text[i:i+k]
      second = text[i+k:i+2k]
      if first == second:
        seen.add(first)
  return len(seen)`,
    python: `def distinctEchoSubstrings(text: str) -> int:
    n = len(text)
    seen = set()
    for k in range(1, n // 2 + 1):
        for i in range(n - 2 * k + 1):
            sub = text[i:i + k]
            if sub == text[i + k:i + 2 * k]:
                seen.add(sub)
    return len(seen)`,
    javascript: `function distinctEchoSubstrings(text) {
  const n = text.length;
  const seen = new Set();
  for (let k = 1; k <= n >> 1; k++) {
    for (let i = 0; i + 2 * k <= n; i++) {
      const first = text.slice(i, i + k);
      if (first === text.slice(i + k, i + 2 * k))
        seen.add(first);
    }
  }
  return seen.size;
}`,
    java: `public int distinctEchoSubstrings(String text) {
    int n = text.length();
    Set<String> seen = new HashSet<>();
    for (int k = 1; k <= n / 2; k++) {
        for (int i = 0; i + 2 * k <= n; i++) {
            String sub = text.substring(i, i + k);
            if (sub.equals(text.substring(i + k, i + 2 * k)))
                seen.add(sub);
        }
    }
    return seen.size();
}`,
  },
  defaultInput: { text: 'abcabcabc' },
  inputFields: [
    { name: 'text', label: 'Text', type: 'string', defaultValue: 'abcabcabc', placeholder: 'abcabcabc', helperText: 'Find distinct echo (repeated) substrings' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const text = input.text as string;
    const n = text.length;
    const steps: AlgorithmStep[] = [];
    const seen = new Set<string>();

    const makeViz = (i: number, k: number, isEcho: boolean): ArrayVisualization => {
      const highlights: Record<number, string> = {};
      if (i >= 0 && k > 0) {
        for (let x = i; x < i + k && x < n; x++) highlights[x] = isEcho ? 'match' : 'active';
        for (let x = i + k; x < i + 2 * k && x < n; x++) highlights[x] = isEcho ? 'found' : 'comparing';
      }
      const labels: Record<number, string> = {};
      for (let x = 0; x < n; x++) labels[x] = text[x];
      return {
        type: 'array',
        array: Array.from({ length: n }, (_, x) => x),
        highlights,
        labels,
        auxData: {
          label: 'Echo Substrings',
          entries: [
            { key: 'k (half-length)', value: String(k) },
            { key: 'window start', value: String(i) },
            { key: 'first half', value: i >= 0 ? text.slice(i, i + k) : '-' },
            { key: 'second half', value: i >= 0 ? text.slice(i + k, i + 2 * k) : '-' },
            { key: 'distinct echoes', value: String(seen.size) },
          ],
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `Find all distinct echo substrings in "${text}". Try all half-lengths k from 1 to ${Math.floor(n / 2)}.`,
      variables: { text, n },
      visualization: makeViz(-1, 0, false),
    });

    for (let k = 1; k <= Math.floor(n / 2); k++) {
      for (let i = 0; i + 2 * k <= n; i++) {
        const first = text.slice(i, i + k);
        const second = text.slice(i + k, i + 2 * k);
        const isEcho = first === second;
        if (isEcho) {
          seen.add(first);
          steps.push({
            line: 7,
            explanation: `Echo found! k=${k}, i=${i}: "${first}"="${second}". Total distinct echoes: ${seen.size}.`,
            variables: { k, i, first, second, distinct: seen.size },
            visualization: makeViz(i, k, true),
          });
        }
      }
    }

    steps.push({
      line: 9,
      explanation: `Total distinct echo substrings: ${seen.size}. Echoes: [${[...seen].join(', ')}].`,
      variables: { count: seen.size, echoes: [...seen] },
      visualization: makeViz(-1, 0, false),
    });

    return steps;
  },
};

export default distinctEchoSubstrings;

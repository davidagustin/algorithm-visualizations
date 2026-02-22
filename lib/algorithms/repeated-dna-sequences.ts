import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const repeatedDnaSequences: AlgorithmDefinition = {
  id: 'repeated-dna-sequences',
  title: 'Repeated DNA Sequences',
  leetcodeNumber: 187,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given a DNA string, find all 10-letter-long substrings that appear more than once. Uses a fixed sliding window of size 10 and a hash set to track seen sequences.',
  tags: ['sliding window', 'hash set', 'string', 'fixed window'],

  code: {
    pseudocode: `function findRepeatedDnaSequences(s):
  seen = {}
  result = set()
  for i = 0 to len(s)-10:
    substr = s[i..i+9]
    if substr in seen:
      add substr to result
    else:
      add substr to seen
  return list(result)`,

    python: `def findRepeatedDnaSequences(s: str) -> list[str]:
    seen = set()
    result = set()
    for i in range(len(s) - 9):
        substr = s[i:i+10]
        if substr in seen:
            result.add(substr)
        else:
            seen.add(substr)
    return list(result)`,

    javascript: `function findRepeatedDnaSequences(s) {
  const seen = new Set(), result = new Set();
  for (let i = 0; i <= s.length - 10; i++) {
    const substr = s.slice(i, i + 10);
    if (seen.has(substr)) result.add(substr);
    else seen.add(substr);
  }
  return [...result];
}`,

    java: `public List<String> findRepeatedDnaSequences(String s) {
    Set<String> seen = new HashSet<>(), result = new HashSet<>();
    for (int i = 0; i <= s.length() - 10; i++) {
        String sub = s.substring(i, i + 10);
        if (seen.contains(sub)) result.add(sub);
        else seen.add(sub);
    }
    return new ArrayList<>(result);
}`,
  },

  defaultInput: { s: 'AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT' },

  inputFields: [
    {
      name: 's',
      label: 'DNA String',
      type: 'string',
      defaultValue: 'AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT',
      placeholder: 'AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT',
      helperText: 'DNA string containing only A, C, G, T characters',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = (input.s as string) || 'AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT';
    const steps: AlgorithmStep[] = [];
    const chars = s.split('');
    const windowSize = 10;

    const seen = new Set<string>();
    const result = new Set<string>();

    const makeViz = (
      windowStart: number,
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: chars.map((c) => c.charCodeAt(0)),
      highlights,
      labels: { ...Object.fromEntries(chars.map((c, i) => [i, c])), ...labels },
      auxData: {
        label: 'Sequence Tracking',
        entries: [
          { key: 'seen count', value: `${seen.size}` },
          { key: 'duplicates', value: `${result.size}` },
          { key: 'found', value: result.size > 0 ? Array.from(result).join(', ') : 'none yet' },
        ],
      },
    });

    steps.push({
      line: 1,
      explanation: `Initialize seen set and result set. Slide a window of size 10 across the DNA string of length ${s.length}.`,
      variables: { windowSize: 10, seenCount: 0, duplicates: 0 },
      visualization: makeViz(-1, {}, {}),
    });

    const limit = Math.min(s.length - windowSize + 1, 15); // cap steps for long strings

    for (let i = 0; i <= s.length - windowSize; i++) {
      const substr = s.slice(i, i + windowSize);
      const isDuplicate = seen.has(substr);

      if (isDuplicate) result.add(substr);
      else seen.add(substr);

      if (i < limit) {
        const h: Record<number, string> = {};
        const l: Record<number, string> = {};

        for (let j = 0; j < i; j++) h[j] = 'visited';
        for (let j = i; j < i + windowSize; j++) {
          h[j] = isDuplicate ? 'found' : 'active';
        }
        l[i] = 'L';
        l[i + windowSize - 1] = 'R';

        steps.push({
          line: 4,
          explanation: `Window [${i}..${i + windowSize - 1}] = "${substr}". ${isDuplicate ? `DUPLICATE found! Adding to result.` : `First time seen. Add to seen set.`} Seen: ${seen.size}, Duplicates: ${result.size}.`,
          variables: {
            i,
            substring: substr,
            isDuplicate,
            seenCount: seen.size,
            duplicates: result.size,
            results: Array.from(result),
          },
          visualization: makeViz(i, h, l),
        });
      }
    }

    if (s.length - windowSize + 1 > limit) {
      steps.push({
        line: 4,
        explanation: `Continued sliding window for remaining ${s.length - windowSize + 1 - limit} positions... (truncated for display)`,
        variables: { seenCount: seen.size, duplicates: result.size },
        visualization: makeViz(
          s.length - windowSize,
          Object.fromEntries(chars.map((_, i) => [i, i >= s.length - windowSize ? 'active' : 'visited'])),
          { [s.length - windowSize]: 'L', [s.length - 1]: 'R' }
        ),
      });
    }

    steps.push({
      line: 8,
      explanation: `Done! Found ${result.size} repeated 10-letter DNA sequences: ${result.size > 0 ? Array.from(result).join(', ') : 'none'}.`,
      variables: { result: Array.from(result), count: result.size },
      visualization: makeViz(
        -1,
        Object.fromEntries(chars.map((_, i) => [i, 'sorted'])),
        {}
      ),
    });

    return steps;
  },
};

export default repeatedDnaSequences;

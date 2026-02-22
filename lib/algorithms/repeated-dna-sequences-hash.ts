import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const repeatedDnaSequencesHash: AlgorithmDefinition = {
  id: 'repeated-dna-sequences-hash',
  title: 'Repeated DNA Sequences (Rolling Hash)',
  leetcodeNumber: 187,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Find all 10-letter-long DNA sequences that appear more than once in a string. Uses a sliding window of length 10 and a hash map to count occurrences of each substring. When a substring is seen a second time, it is added to the result.',
  tags: ['hash map', 'sliding window', 'string', 'DNA', 'rolling hash'],

  code: {
    pseudocode: `function findRepeatedDnaSequences(s):
  seen = {}
  result = []
  for i in range(len(s) - 9):
    sub = s[i:i+10]
    seen[sub] = seen.get(sub, 0) + 1
    if seen[sub] == 2:
      result.append(sub)
  return result`,

    python: `def findRepeatedDnaSequences(s: str) -> list[str]:
    seen = {}
    res = []
    for i in range(len(s) - 9):
        sub = s[i:i+10]
        seen[sub] = seen.get(sub, 0) + 1
        if seen[sub] == 2:
            res.append(sub)
    return res`,

    javascript: `function findRepeatedDnaSequences(s) {
  const seen = new Map();
  const res = [];
  for (let i = 0; i <= s.length - 10; i++) {
    const sub = s.slice(i, i + 10);
    seen.set(sub, (seen.get(sub) || 0) + 1);
    if (seen.get(sub) === 2) res.push(sub);
  }
  return res;
}`,

    java: `public List<String> findRepeatedDnaSequences(String s) {
    Map<String, Integer> seen = new HashMap<>();
    List<String> res = new ArrayList<>();
    for (int i = 0; i <= s.length() - 10; i++) {
        String sub = s.substring(i, i + 10);
        seen.merge(sub, 1, Integer::sum);
        if (seen.get(sub) == 2) res.add(sub);
    }
    return res;
}`,
  },

  defaultInput: {
    s: 'AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT',
  },

  inputFields: [
    {
      name: 's',
      label: 'DNA String',
      type: 'string',
      defaultValue: 'AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT',
      placeholder: 'AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT',
      helperText: 'DNA string containing only A, C, G, T',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const seen: Record<string, number> = {};
    const result: string[] = [];
    const windowSize = 10;

    steps.push({
      line: 1,
      explanation: `DNA string length = ${s.length}. Slide a window of size ${windowSize} and track each substring in a hash map.`,
      variables: { length: s.length, windowSize, seen: '{}' },
      visualization: {
        type: 'array',
        array: Array.from(s) as unknown as number[],
        highlights: {},
        labels: {},
      },
    });

    for (let i = 0; i <= s.length - windowSize; i++) {
      const sub = s.slice(i, i + windowSize);
      seen[sub] = (seen[sub] || 0) + 1;

      const hlMap: Record<number, string> = {};
      for (let k = i; k < i + windowSize; k++) hlMap[k] = 'active';

      steps.push({
        line: 4,
        explanation: `i=${i}: window = "${sub}". seen["${sub}"] = ${seen[sub]}.`,
        variables: { i, substring: sub, count: seen[sub] },
        visualization: {
          type: 'array',
          array: Array.from(s) as unknown as number[],
          highlights: hlMap,
          labels: { [i]: 'start', [i + windowSize - 1]: 'end' },
        },
      });

      if (seen[sub] === 2) {
        result.push(sub);
        const foundHl: Record<number, string> = {};
        for (let k = i; k < i + windowSize; k++) foundHl[k] = 'found';

        steps.push({
          line: 6,
          explanation: `"${sub}" seen for the 2nd time! Add to result. Result = ${JSON.stringify(result)}.`,
          variables: { substring: sub, result: JSON.stringify(result) },
          visualization: {
            type: 'array',
            array: Array.from(s) as unknown as number[],
            highlights: foundHl,
            labels: { [i]: 'REPEAT' },
          },
        });
      }
    }

    steps.push({
      line: 7,
      explanation: `Done. Repeated DNA sequences: ${JSON.stringify(result)}.`,
      variables: { result: JSON.stringify(result) },
      visualization: {
        type: 'array',
        array: Array.from(s) as unknown as number[],
        highlights: {},
        labels: {},
      },
    });

    return steps;
  },
};

export default repeatedDnaSequencesHash;

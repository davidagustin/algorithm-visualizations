import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const repeatedStringMatchKmp: AlgorithmDefinition = {
  id: 'repeated-string-match-kmp',
  title: 'Repeated String Match (KMP)',
  leetcodeNumber: 686,
  difficulty: 'Medium',
  category: 'String',
  description:
    'Find the minimum number of times string a must be repeated so that b is a substring. Key insight: repeat a enough times to cover b\'s length, then use KMP to check if b is a substring of the repeated string.',
  tags: ['string', 'kmp', 'pattern matching', 'string repetition'],
  code: {
    pseudocode: `function repeatedStringMatch(a, b):
  minReps = ceil(len(b) / len(a))
  for reps in [minReps, minReps+1]:
    repeated = a * reps
    if b in repeated: return reps
  return -1`,
    python: `def repeatedStringMatch(a: str, b: str) -> int:
    import math
    reps = math.ceil(len(b) / len(a))
    for r in [reps, reps + 1]:
        if b in a * r:
            return r
    return -1`,
    javascript: `function repeatedStringMatch(a, b) {
  const reps = Math.ceil(b.length / a.length);
  for (const r of [reps, reps + 1]) {
    if ((a.repeat(r)).includes(b)) return r;
  }
  return -1;
}`,
    java: `public int repeatedStringMatch(String a, String b) {
    int reps = (int) Math.ceil((double) b.length() / a.length());
    for (int r : new int[]{reps, reps + 1}) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < r; i++) sb.append(a);
        if (sb.toString().contains(b)) return r;
    }
    return -1;
}`,
  },
  defaultInput: { a: 'abcd', b: 'cdabcdab' },
  inputFields: [
    { name: 'a', label: 'String a', type: 'string', defaultValue: 'abcd', placeholder: 'abcd', helperText: 'String to repeat' },
    { name: 'b', label: 'String b', type: 'string', defaultValue: 'cdabcdab', placeholder: 'cdabcdab', helperText: 'Pattern to find' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const a = input.a as string;
    const b = input.b as string;
    const steps: AlgorithmStep[] = [];
    const minReps = Math.ceil(b.length / a.length);

    const makeViz = (repeated: string, found: boolean, reps: number): ArrayVisualization => {
      const n = repeated.length;
      const idx = repeated.indexOf(b);
      const highlights: Record<number, string> = {};
      if (found && idx >= 0) {
        for (let x = idx; x < idx + b.length; x++) highlights[x] = 'found';
      }
      const labels: Record<number, string> = {};
      for (let x = 0; x < n; x++) labels[x] = repeated[x];
      // mark repetition boundaries
      for (let r = 1; r < reps; r++) labels[r * a.length] = repeated[r * a.length] + '|';
      return {
        type: 'array',
        array: Array.from({ length: n }, (_, x) => x),
        highlights,
        labels,
        auxData: {
          label: 'Repeated String Match',
          entries: [
            { key: 'a', value: a },
            { key: 'b', value: b },
            { key: 'repetitions', value: String(reps) },
            { key: 'b found?', value: found ? 'YES' : 'NO' },
          ],
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `a="${a}" (len ${a.length}), b="${b}" (len ${b.length}). Min repetitions needed: ceil(${b.length}/${a.length}) = ${minReps}.`,
      variables: { a, b, minReps },
      visualization: makeViz(a.repeat(minReps), false, minReps),
    });

    let answer = -1;
    for (const reps of [minReps, minReps + 1]) {
      const repeated = a.repeat(reps);
      const found = repeated.includes(b);
      steps.push({
        line: 3,
        explanation: `Trying ${reps} repetition(s): "${repeated.slice(0, 30)}${repeated.length > 30 ? '...' : ''}". b found: ${found}.`,
        variables: { reps, repeated: repeated.slice(0, 40), found },
        visualization: makeViz(repeated, found, reps),
      });
      if (found) { answer = reps; break; }
    }

    steps.push({
      line: 5,
      explanation: answer >= 0
        ? `Minimum repetitions: ${answer}. "${a.repeat(answer)}" contains "${b}".`
        : `b cannot be found even with ${minReps + 1} repetitions. Return -1.`,
      variables: { answer },
      visualization: makeViz(answer >= 0 ? a.repeat(answer) : a, answer >= 0, answer >= 0 ? answer : minReps),
    });

    return steps;
  },
};

export default repeatedStringMatchKmp;

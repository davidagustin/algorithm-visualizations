import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumDeletionsToMakeSorted: AlgorithmDefinition = {
  id: 'minimum-number-of-deletions-to-make-sorted',
  title: 'Minimum Deletions to Make String Sorted',
  leetcodeNumber: 1578,
  difficulty: 'Medium',
  category: 'String',
  description:
    'Given a string of \'a\' and \'b\' characters, find the minimum number of deletions needed so the string becomes sorted (all a\'s before b\'s). For each position, the cost is min(b\'s before it, a\'s after it).',
  tags: ['string', 'greedy', 'prefix sum', 'sorting'],
  code: {
    pseudocode: `function minimumDeletions(s):
  // Count b's before each position and a's after
  // deletions = min over all split points of
  //   (b's in s[0..i]) + (a's in s[i+1..n-1])
  countB = 0, countA = s.count('a')
  result = countA  // delete all a's case
  for c in s:
    if c == 'a': countA--
    result = min(result, countB + countA)
    if c == 'b': countB++
  return result`,
    python: `def minimumDeletions(s: str) -> int:
    count_b = 0
    count_a = s.count('a')
    result = count_a
    for c in s:
        if c == 'a':
            count_a -= 1
        result = min(result, count_b + count_a)
        if c == 'b':
            count_b += 1
    return result`,
    javascript: `function minimumDeletions(s) {
  let countB = 0, countA = [...s].filter(c => c === 'a').length;
  let result = countA;
  for (const c of s) {
    if (c === 'a') countA--;
    result = Math.min(result, countB + countA);
    if (c === 'b') countB++;
  }
  return result;
}`,
    java: `public int minimumDeletions(String s) {
    int countB = 0, countA = 0;
    for (char c : s.toCharArray()) if (c == 'a') countA++;
    int result = countA;
    for (char c : s.toCharArray()) {
        if (c == 'a') countA--;
        result = Math.min(result, countB + countA);
        if (c == 'b') countB++;
    }
    return result;
}`,
  },
  defaultInput: { s: 'aababbab' },
  inputFields: [
    { name: 's', label: 'String (a/b)', type: 'string', defaultValue: 'aababbab', placeholder: 'aababbab', helperText: 'String of a and b characters' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const n = s.length;
    const steps: AlgorithmStep[] = [];
    let countB = 0;
    let countA = s.split('').filter(c => c === 'a').length;
    let result = countA;

    const makeViz = (pos: number, countB: number, countA: number, result: number): ArrayVisualization => {
      const highlights: Record<number, string> = {};
      for (let x = 0; x < pos; x++) highlights[x] = s[x] === 'b' ? 'comparing' : 'visited';
      if (pos < n) highlights[pos] = 'active';
      const labels: Record<number, string> = {};
      for (let x = 0; x < n; x++) labels[x] = s[x];
      return {
        type: 'array',
        array: Array.from({ length: n }, (_, x) => x),
        highlights,
        labels,
        auxData: {
          label: 'Min Deletions',
          entries: [
            { key: "b's seen (left)", value: String(countB) },
            { key: "a's remaining (right)", value: String(countA) },
            { key: 'cost at this split', value: String(countB + countA) },
            { key: 'min so far', value: String(result) },
          ],
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `s="${s}". Total a's=${countA}. Try each split point: delete b's on left + a's on right.`,
      variables: { s, totalA: countA },
      visualization: makeViz(0, countB, countA, result),
    });

    for (let i = 0; i < n; i++) {
      if (s[i] === 'a') countA--;
      const cost = countB + countA;
      if (cost < result) result = cost;

      steps.push({
        line: 7,
        explanation: `Pos ${i}, char='${s[i]}'. Split here: delete ${countB} b's on left + ${countA} a's on right = ${cost}. Min=${result}.`,
        variables: { pos: i, char: s[i], countB, countA, cost, result },
        visualization: makeViz(i + 1, countB, countA, result),
      });

      if (s[i] === 'b') countB++;
    }

    steps.push({
      line: 9,
      explanation: `Minimum deletions to make "${s}" sorted: ${result}.`,
      variables: { result },
      visualization: makeViz(n, countB, countA, result),
    });

    return steps;
  },
};

export default minimumDeletionsToMakeSorted;

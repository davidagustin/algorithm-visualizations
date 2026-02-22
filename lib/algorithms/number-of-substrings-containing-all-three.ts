import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfSubstringsContainingAllThree: AlgorithmDefinition = {
  id: 'number-of-substrings-containing-all-three',
  title: 'Number of Substrings Containing All Three Characters',
  leetcodeNumber: 1358,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given a string s consisting only of characters a, b, and c, return the number of substrings containing at least one occurrence of all three characters. Use a sliding window: expand right, and once all three are present, every extension of that right position with the current valid left forms a valid substring. Count valid starts.',
  tags: ['sliding window', 'string', 'counting'],

  code: {
    pseudocode: `function numberOfSubstrings(s):
  count = {'a': 0, 'b': 0, 'c': 0}
  left = 0
  result = 0
  for right in range(len(s)):
    count[s[right]] += 1
    while count['a'] > 0 and count['b'] > 0 and count['c'] > 0:
      result += len(s) - right
      count[s[left]] -= 1
      left += 1
  return result`,

    python: `def numberOfSubstrings(s: str) -> int:
    count = {'a': 0, 'b': 0, 'c': 0}
    left = 0
    result = 0
    for right in range(len(s)):
        count[s[right]] += 1
        while all(count[c] > 0 for c in 'abc'):
            result += len(s) - right
            count[s[left]] -= 1
            left += 1
    return result`,

    javascript: `function numberOfSubstrings(s) {
  const count = {a: 0, b: 0, c: 0};
  let left = 0, result = 0;
  for (let right = 0; right < s.length; right++) {
    count[s[right]]++;
    while (count.a > 0 && count.b > 0 && count.c > 0) {
      result += s.length - right;
      count[s[left]]--;
      left++;
    }
  }
  return result;
}`,

    java: `public int numberOfSubstrings(String s) {
    int[] count = new int[3];
    int left = 0, result = 0;
    for (int right = 0; right < s.length(); right++) {
        count[s.charAt(right) - 'a']++;
        while (count[0] > 0 && count[1] > 0 && count[2] > 0) {
            result += s.length() - right;
            count[s.charAt(left++) - 'a']--;
        }
    }
    return result;
}`,
  },

  defaultInput: {
    s: 'abcabc',
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'abcabc',
      placeholder: 'abcabc',
      helperText: 'String containing only a, b, c characters',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const n = s.length;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: s.split('').map((c) => c.charCodeAt(0)),
      highlights,
      labels,
    });

    const count = { a: 0, b: 0, c: 0 };
    let left = 0;
    let result = 0;

    steps.push({
      line: 1,
      explanation: `Count substrings containing all three characters a, b, c. String length=${n}. When all three are in window, every extension to the right is valid.`,
      variables: { n, result: 0 },
      visualization: makeViz({}, {}),
    });

    for (let right = 0; right < n; right++) {
      const ch = s[right] as 'a' | 'b' | 'c';
      count[ch]++;

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = left; i <= right; i++) highlights[i] = 'active';
      highlights[right] = 'current';
      labels[left] = 'L';
      labels[right] = 'R';

      steps.push({
        line: 5,
        explanation: `Expand right to index ${right} (char '${ch}'). Counts: a=${count.a}, b=${count.b}, c=${count.c}.`,
        variables: { left, right, char: ch, countA: count.a, countB: count.b, countC: count.c },
        visualization: makeViz(highlights, labels),
      });

      while (count.a > 0 && count.b > 0 && count.c > 0) {
        const added = n - right;
        result += added;

        const foundHighlights: Record<number, string> = {};
        const foundLabels: Record<number, string> = {};
        for (let i = left; i <= right; i++) foundHighlights[i] = 'found';
        foundLabels[left] = 'L';
        foundLabels[right] = 'R';

        steps.push({
          line: 7,
          explanation: `All three chars present! Window starts at ${left}, so substrings starting at ${left} and ending at ${right} through ${n - 1} are all valid. Adding ${added} to result. Total=${result}.`,
          variables: { left, right, added, result, countA: count.a, countB: count.b, countC: count.c },
          visualization: makeViz(foundHighlights, foundLabels),
        });

        count[s[left] as 'a' | 'b' | 'c']--;
        left++;
      }
    }

    steps.push({
      line: 10,
      explanation: `Done. Number of substrings containing all three characters a, b, c = ${result}.`,
      variables: { result },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default numberOfSubstringsContainingAllThree;

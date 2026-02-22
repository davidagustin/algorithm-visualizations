import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestHappyString: AlgorithmDefinition = {
  id: 'longest-happy-string',
  title: 'Longest Happy String',
  leetcodeNumber: 1405,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Given counts a, b, c for characters "a", "b", "c", construct the longest string using at most a "a"s, b "b"s, c "c"s such that no three consecutive characters are the same. Greedy: always pick the character with the highest remaining count, unless it would create three in a row; in that case pick the second highest.',
  tags: ['greedy', 'heap', 'string'],

  code: {
    pseudocode: `function longestDiverseString(a, b, c):
  result = ""
  counts = [(a,'a'), (b,'b'), (c,'c')]
  while true:
    sort counts descending by count
    if last 2 chars of result == counts[0].char:
      if counts[1].count == 0: break
      append counts[1].char; counts[1].count--
    else:
      if counts[0].count == 0: break
      append counts[0].char; counts[0].count--
  return result`,

    python: `def longestDiverseString(a: int, b: int, c: int) -> str:
    result = []
    counts = [[a, 'a'], [b, 'b'], [c, 'c']]
    while True:
        counts.sort(reverse=True)
        n = len(result)
        if n >= 2 and result[-1] == result[-2] == counts[0][1]:
            if counts[1][0] == 0:
                break
            result.append(counts[1][1])
            counts[1][0] -= 1
        else:
            if counts[0][0] == 0:
                break
            result.append(counts[0][1])
            counts[0][0] -= 1
    return ''.join(result)`,

    javascript: `function longestDiverseString(a, b, c) {
  const counts = [[a,'a'],[b,'b'],[c,'c']];
  const result = [];
  while (true) {
    counts.sort((x, y) => y[0] - x[0]);
    const n = result.length;
    if (n >= 2 && result[n-1] === result[n-2] && result[n-1] === counts[0][1]) {
      if (!counts[1][0]) break;
      result.push(counts[1][1]);
      counts[1][0]--;
    } else {
      if (!counts[0][0]) break;
      result.push(counts[0][1]);
      counts[0][0]--;
    }
  }
  return result.join('');
}`,

    java: `public String longestDiverseString(int a, int b, int c) {
    int[][] counts = {{a,0},{b,1},{c,2}};
    StringBuilder sb = new StringBuilder();
    while (true) {
        Arrays.sort(counts, (x, y) -> y[0] - x[0]);
        int n = sb.length();
        char[] ch = {'a','b','c'};
        if (n >= 2 && sb.charAt(n-1) == ch[counts[0][1]] && sb.charAt(n-2) == ch[counts[0][1]]) {
            if (counts[1][0] == 0) break;
            sb.append(ch[counts[1][1]]); counts[1][0]--;
        } else {
            if (counts[0][0] == 0) break;
            sb.append(ch[counts[0][1]]); counts[0][0]--;
        }
    }
    return sb.toString();
}`,
  },

  defaultInput: {
    a: 1,
    b: 1,
    c: 7,
  },

  inputFields: [
    {
      name: 'a',
      label: 'Count of "a"',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Max number of "a" characters',
    },
    {
      name: 'b',
      label: 'Count of "b"',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Max number of "b" characters',
    },
    {
      name: 'c',
      label: 'Count of "c"',
      type: 'number',
      defaultValue: 7,
      placeholder: '7',
      helperText: 'Max number of "c" characters',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const a = input.a as number;
    const b = input.b as number;
    const c = input.c as number;
    const steps: AlgorithmStep[] = [];

    const counts: [number, string][] = [[a, 'a'], [b, 'b'], [c, 'c']];
    const result: string[] = [];
    const resultHistory: string[] = [];

    steps.push({
      line: 1,
      explanation: `Start with counts: a=${a}, b=${b}, c=${c}. Greedily pick highest-count character, avoiding triple repeats.`,
      variables: { a, b, c },
      visualization: {
        type: 'array',
        array: [a, b, c],
        highlights: { 0: 'active', 1: 'active', 2: 'active' },
        labels: { 0: 'a', 1: 'b', 2: 'c' },
      },
    });

    let iteration = 0;

    while (true) {
      iteration++;
      counts.sort((x, y) => y[0] - x[0]);
      const n = result.length;

      if (n >= 2 && result[n - 1] === result[n - 2] && result[n - 1] === counts[0][1]) {
        if (counts[1][0] === 0) {
          steps.push({
            line: 9,
            explanation: `Last two chars are "${counts[0][1]}" and second option count=0. Cannot extend. Stop.`,
            variables: { result: result.join(''), counts: counts.map(c => c[1] + ':' + c[0]).join(',') },
            visualization: {
              type: 'array',
              array: counts.map(c => c[0]),
              highlights: { 0: 'mismatch', 1: 'mismatch' },
              labels: { 0: counts[0][1], 1: counts[1][1] },
            },
          });
          break;
        }
        result.push(counts[1][1]);
        counts[1][0]--;
        resultHistory.push(result.join(''));

        steps.push({
          line: 8,
          explanation: `Last two are "${counts[0][1]}". Adding another would create triple. Use 2nd choice: "${counts[1][1]}". String: "${result.join('')}".`,
          variables: { appended: counts[1][1], result: result.join(''), counts: counts.map(c => c[1] + ':' + c[0]).join(',') },
          visualization: {
            type: 'array',
            array: counts.map(c => c[0]),
            highlights: { 0: 'mismatch', 1: 'found' },
            labels: { 0: counts[0][1] + ' (skip)', 1: counts[1][1] + ' (pick)' },
          },
        });
      } else {
        if (counts[0][0] === 0) {
          steps.push({
            line: 9,
            explanation: `Top count is 0. No more characters to add. Stop.`,
            variables: { result: result.join(''), counts: counts.map(c => c[1] + ':' + c[0]).join(',') },
            visualization: {
              type: 'array',
              array: counts.map(c => c[0]),
              highlights: { 0: 'mismatch' },
              labels: { 0: 'empty' },
            },
          });
          break;
        }
        result.push(counts[0][1]);
        counts[0][0]--;
        resultHistory.push(result.join(''));

        steps.push({
          line: 7,
          explanation: `Pick most frequent: "${counts[0][1]}". String: "${result.join('')}". Remaining: ${counts.map(c => c[1] + ':' + c[0]).join(', ')}.`,
          variables: { appended: counts[0][1], result: result.join(''), counts: counts.map(c => c[1] + ':' + c[0]).join(',') },
          visualization: {
            type: 'array',
            array: counts.map(c => c[0]),
            highlights: { 0: 'found' },
            labels: { 0: counts[0][1] + ' (pick)', 1: counts[1][1], 2: counts[2][1] },
          },
        });
      }

      if (iteration > 50) break;
    }

    steps.push({
      line: 10,
      explanation: `Longest happy string: "${result.join('')}" (length ${result.length}).`,
      variables: { result: result.join(''), length: result.length },
      visualization: {
        type: 'array',
        array: [a, b, c],
        highlights: { 0: 'sorted', 1: 'sorted', 2: 'sorted' },
        labels: { 0: 'a used', 1: 'b used', 2: 'c used' },
      },
    });

    return steps;
  },
};

export default longestHappyString;

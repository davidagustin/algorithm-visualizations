import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countAndSayIi: AlgorithmDefinition = {
  id: 'count-and-say-ii',
  title: 'Count and Say',
  leetcodeNumber: 38,
  difficulty: 'Medium',
  category: 'String',
  description:
    'The count-and-say sequence: "1", "11" (one 1), "21" (two 1s), "1211" (one 2, one 1), etc. Each term describes the previous term by counting consecutive runs of digits. Generate the nth term iteratively.',
  tags: ['string', 'run-length encoding', 'simulation', 'sequence'],
  code: {
    pseudocode: `function countAndSay(n):
  result = "1"
  for i in 2..n:
    next = ""
    j = 0
    while j < len(result):
      count = 1
      while j+count < len(result) and result[j+count]==result[j]:
        count++
      next += str(count) + result[j]
      j += count
    result = next
  return result`,
    python: `def countAndSay(n: int) -> str:
    result = "1"
    for _ in range(n - 1):
        next_str = ""
        j = 0
        while j < len(result):
            count = 1
            while j + count < len(result) and result[j + count] == result[j]:
                count += 1
            next_str += str(count) + result[j]
            j += count
        result = next_str
    return result`,
    javascript: `function countAndSay(n) {
  let result = "1";
  for (let i = 1; i < n; i++) {
    let next = "", j = 0;
    while (j < result.length) {
      let count = 1;
      while (j + count < result.length && result[j + count] === result[j]) count++;
      next += count + result[j];
      j += count;
    }
    result = next;
  }
  return result;
}`,
    java: `public String countAndSay(int n) {
    String result = "1";
    for (int i = 1; i < n; i++) {
        StringBuilder next = new StringBuilder();
        int j = 0;
        while (j < result.length()) {
            int count = 1;
            while (j + count < result.length() && result.charAt(j + count) == result.charAt(j)) count++;
            next.append(count).append(result.charAt(j));
            j += count;
        }
        result = next.toString();
    }
    return result;
}`,
  },
  defaultInput: { n: 5 },
  inputFields: [
    { name: 'n', label: 'n', type: 'number', defaultValue: 5, placeholder: '5', helperText: 'Which term of count-and-say sequence (1-indexed)' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    let result = '1';

    const makeViz = (term: number, current: string, next: string): ArrayVisualization => {
      const len = current.length;
      const labels: Record<number, string> = {};
      for (let x = 0; x < len; x++) labels[x] = current[x];
      return {
        type: 'array',
        array: Array.from({ length: len }, (_, x) => x),
        highlights: {},
        labels,
        auxData: {
          label: `Count-and-Say Term ${term}`,
          entries: [
            { key: 'current term', value: current },
            { key: 'next term', value: next || '...' },
          ],
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `Count-and-Say(${n}). Start with "1". Build each term by describing the previous.`,
      variables: { n },
      visualization: makeViz(1, '1', ''),
    });

    for (let term = 2; term <= n; term++) {
      let next = '';
      let j = 0;
      while (j < result.length) {
        let count = 1;
        while (j + count < result.length && result[j + count] === result[j]) count++;
        next += `${count}${result[j]}`;
        j += count;
      }

      steps.push({
        line: 8,
        explanation: `Term ${term}: describe "${result}" -> "${next}".`,
        variables: { term, current: result, next },
        visualization: makeViz(term, result, next),
      });

      result = next;
    }

    steps.push({
      line: 10,
      explanation: `countAndSay(${n}) = "${result}".`,
      variables: { n, result },
      visualization: makeViz(n, result, ''),
    });

    return steps;
  },
};

export default countAndSayIi;

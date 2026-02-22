import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const countAndSay: AlgorithmDefinition = {
  id: 'count-and-say',
  title: 'Count and Say',
  leetcodeNumber: 38,
  difficulty: 'Medium',
  category: 'String',
  description:
    'The count-and-say sequence is built iteratively. "1" is the first term. Each subsequent term describes the previous term by counting consecutive digits. For example, "1" is described as "one 1" which gives "11". Given n, return the nth term.',
  tags: ['string', 'simulation', 'run-length encoding'],

  code: {
    pseudocode: `function countAndSay(n):
  result = "1"
  for i from 2 to n:
    next = ""
    j = 0
    while j < len(result):
      digit = result[j]
      count = 0
      while j < len(result) and result[j] == digit:
        count++
        j++
      next += count + digit
    result = next
  return result`,

    python: `def countAndSay(n: int) -> str:
    result = "1"
    for _ in range(n - 1):
        next_str = ""
        j = 0
        while j < len(result):
            digit = result[j]
            count = 0
            while j < len(result) and result[j] == digit:
                count += 1
                j += 1
            next_str += str(count) + digit
        result = next_str
    return result`,

    javascript: `function countAndSay(n) {
  let result = "1";
  for (let i = 1; i < n; i++) {
    let next = "";
    let j = 0;
    while (j < result.length) {
      const digit = result[j];
      let count = 0;
      while (j < result.length && result[j] === digit) {
        count++;
        j++;
      }
      next += count + digit;
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
            char digit = result.charAt(j);
            int count = 0;
            while (j < result.length() && result.charAt(j) == digit) {
                count++;
                j++;
            }
            next.append(count).append(digit);
        }
        result = next.toString();
    }
    return result;
}`,
  },

  defaultInput: {
    n: 5,
  },

  inputFields: [
    {
      name: 'n',
      label: 'N (term number)',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Which term of the count-and-say sequence to generate (1-10)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: 'Start with the base case: term 1 is "1"',
      variables: { term: 1, result: '"1"' },
      visualization: {
        type: 'array',
        array: [1],
        highlights: { 0: 'active' },
        labels: { 0: 'term 1' },
      },
    });

    let result = '1';

    for (let i = 2; i <= n; i++) {
      steps.push({
        line: 3,
        explanation: `Building term ${i} by reading term ${i - 1}: "${result}"`,
        variables: { buildingTerm: i, reading: result },
        visualization: {
          type: 'array',
          array: result.split('').map(Number),
          highlights: Object.fromEntries(result.split('').map((_, idx) => [idx, 'active'])),
          labels: Object.fromEntries(result.split('').map((_, idx) => [idx, `${idx}`])),
        },
      });

      let next = '';
      let j = 0;

      while (j < result.length) {
        const digit = result[j];
        let count = 0;
        const groupStart = j;

        while (j < result.length && result[j] === digit) {
          count++;
          j++;
        }

        steps.push({
          line: 8,
          explanation: `Count consecutive "${digit}"s starting at index ${groupStart}: found ${count}. Append "${count}${digit}" to next.`,
          variables: { digit, count, groupStart, groupEnd: j - 1, nextSoFar: next + count + digit },
          visualization: {
            type: 'array',
            array: result.split('').map(Number),
            highlights: {
              ...Object.fromEntries(
                Array.from({ length: count }, (_, k) => [groupStart + k, 'found'])
              ),
            },
            labels: {
              [groupStart]: `start(${count}x"${digit}")`,
            },
          },
        });

        next += count + digit;
      }

      result = next;

      steps.push({
        line: 11,
        explanation: `Term ${i} is: "${result}"`,
        variables: { term: i, result },
        visualization: {
          type: 'array',
          array: result.split('').map(Number),
          highlights: Object.fromEntries(result.split('').map((_, idx) => [idx, 'sorted'])),
          labels: { 0: `term ${i}` },
        },
      });
    }

    steps.push({
      line: 12,
      explanation: `Final answer: term ${n} = "${result}"`,
      variables: { n, result },
      visualization: {
        type: 'array',
        array: result.split('').map(Number),
        highlights: Object.fromEntries(result.split('').map((_, idx) => [idx, 'found'])),
        labels: { 0: 'result' },
      },
    });

    return steps;
  },
};

export default countAndSay;

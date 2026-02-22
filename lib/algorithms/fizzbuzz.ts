import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const fizzbuzz: AlgorithmDefinition = {
  id: 'fizzbuzz',
  title: 'FizzBuzz',
  leetcodeNumber: 412,
  difficulty: 'Easy',
  category: 'Math',
  description:
    'Given an integer n, return a string array where each element is "FizzBuzz" if divisible by both 3 and 5, "Fizz" if divisible by 3, "Buzz" if divisible by 5, or the string representation of the number otherwise. Classic modulo problem.',
  tags: ['math', 'string', 'simulation'],

  code: {
    pseudocode: `function fizzBuzz(n):
  result = []
  for i from 1 to n:
    if i % 15 == 0: result.append("FizzBuzz")
    elif i % 3 == 0: result.append("Fizz")
    elif i % 5 == 0: result.append("Buzz")
    else: result.append(str(i))
  return result`,

    python: `def fizzBuzz(n):
    result = []
    for i in range(1, n + 1):
        if i % 15 == 0:
            result.append("FizzBuzz")
        elif i % 3 == 0:
            result.append("Fizz")
        elif i % 5 == 0:
            result.append("Buzz")
        else:
            result.append(str(i))
    return result`,

    javascript: `function fizzBuzz(n) {
  const result = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) result.push("FizzBuzz");
    else if (i % 3 === 0) result.push("Fizz");
    else if (i % 5 === 0) result.push("Buzz");
    else result.push(String(i));
  }
  return result;
}`,

    java: `public List<String> fizzBuzz(int n) {
    List<String> result = new ArrayList<>();
    for (int i = 1; i <= n; i++) {
        if (i % 15 == 0) result.add("FizzBuzz");
        else if (i % 3 == 0) result.add("Fizz");
        else if (i % 5 == 0) result.add("Buzz");
        else result.add(String.valueOf(i));
    }
    return result;
}`,
  },

  defaultInput: {
    n: 15,
  },

  inputFields: [
    {
      name: 'n',
      label: 'n',
      type: 'number',
      defaultValue: 15,
      placeholder: '15',
      helperText: 'Generate FizzBuzz for 1 through n',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const result: string[] = [];

    steps.push({
      line: 1,
      explanation: `Generate FizzBuzz for numbers 1 to ${n}. Check divisibility by 3 and 5.`,
      variables: { n, result: [] },
      visualization: {
        type: 'array',
        array: Array.from({ length: Math.min(n, 20) }, (_, i) => i + 1),
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    for (let i = 1; i <= n; i++) {
      let label: string;
      let highlight: string;

      if (i % 15 === 0) {
        label = 'FizzBuzz';
        highlight = 'found';
      } else if (i % 3 === 0) {
        label = 'Fizz';
        highlight = 'active';
      } else if (i % 5 === 0) {
        label = 'Buzz';
        highlight = 'comparing';
      } else {
        label = String(i);
        highlight = 'default';
      }
      result.push(label);

      steps.push({
        line: i % 15 === 0 ? 3 : i % 3 === 0 ? 4 : i % 5 === 0 ? 5 : 6,
        explanation: `i = ${i}: ${i % 15 === 0 ? 'divisible by 3 and 5 -> FizzBuzz' : i % 3 === 0 ? 'divisible by 3 -> Fizz' : i % 5 === 0 ? 'divisible by 5 -> Buzz' : `not divisible by 3 or 5 -> "${i}"`}`,
        variables: { i, label, 'i%3': i % 3, 'i%5': i % 5 },
        visualization: {
          type: 'array',
          array: Array.from({ length: Math.min(n, 20) }, (_, idx) => idx + 1),
          highlights: {
            ...Object.fromEntries(result.map((_, idx) => [idx, result[idx] === 'FizzBuzz' ? 'found' : result[idx] === 'Fizz' ? 'active' : result[idx] === 'Buzz' ? 'comparing' : 'default'])),
            [i - 1]: highlight,
          },
          labels: Object.fromEntries(result.map((v, idx) => [idx, v])),
        } as ArrayVisualization,
      });
    }

    steps.push({
      line: 7,
      explanation: `FizzBuzz complete for 1 to ${n}. Total items: ${result.length}.`,
      variables: { result },
      visualization: {
        type: 'array',
        array: Array.from({ length: Math.min(n, 20) }, (_, i) => i + 1),
        highlights: Object.fromEntries(result.map((v, i) => [i, v === 'FizzBuzz' ? 'found' : v === 'Fizz' ? 'active' : v === 'Buzz' ? 'comparing' : 'default'])),
        labels: Object.fromEntries(result.map((v, i) => [i, v])),
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default fizzbuzz;

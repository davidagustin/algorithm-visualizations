import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const fizzbuzzII: AlgorithmDefinition = {
  id: 'fizzbuzz-ii',
  title: 'FizzBuzz II',
  leetcodeNumber: 412,
  difficulty: 'Easy',
  category: 'Math',
  description:
    'For each number from 1 to n, output "FizzBuzz" if divisible by 15, "Fizz" if by 3, "Buzz" if by 5, else the number as a string. Classic modulo exercise demonstrating order of conditions. O(n) time and space.',
  tags: ['Math', 'Simulation', 'String'],
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
    for i in range(1, n+1):
        if i % 15 == 0: result.append("FizzBuzz")
        elif i % 3 == 0: result.append("Fizz")
        elif i % 5 == 0: result.append("Buzz")
        else: result.append(str(i))
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
  defaultInput: { n: 15 },
  inputFields: [
    {
      name: 'n',
      label: 'N',
      type: 'number',
      defaultValue: 15,
      placeholder: '15',
      helperText: 'Generate FizzBuzz from 1 to N',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const result: number[] = [];
    const labels: string[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labelMap: Record<number, string>,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...result],
      highlights,
      labels: labelMap,
      auxData: { label: 'FizzBuzz', entries: auxEntries },
    });

    steps.push({
      line: 1,
      explanation: `FizzBuzz from 1 to ${n}. Rules: %15=FizzBuzz, %3=Fizz, %5=Buzz, else number.`,
      variables: { n },
      visualization: makeViz(
        {},
        {},
        [{ key: 'N', value: String(n) }],
      ),
    });

    for (let i = 1; i <= n; i++) {
      let label: string;
      let color: string;

      if (i % 15 === 0) { label = 'FizzBuzz'; color = 'found'; }
      else if (i % 3 === 0) { label = 'Fizz'; color = 'active'; }
      else if (i % 5 === 0) { label = 'Buzz'; color = 'comparing'; }
      else { label = String(i); color = 'pointer'; }

      result.push(i);
      labels.push(label);

      steps.push({
        line: 3,
        explanation: `i=${i}: ${i % 15 === 0 ? `${i}%15=0 → FizzBuzz` : i % 3 === 0 ? `${i}%3=0 → Fizz` : i % 5 === 0 ? `${i}%5=0 → Buzz` : `${i}%3≠0, ${i}%5≠0 → "${i}"`}.`,
        variables: { i, label },
        visualization: makeViz(
          { [i - 1]: color },
          Object.fromEntries(labels.map((l, j) => [j, l])),
          [{ key: `i=${i}`, value: label }, { key: 'Pattern', value: `%3→Fizz, %5→Buzz` }],
        ),
      });
    }

    steps.push({
      line: 8,
      explanation: `FizzBuzz complete for n=${n}. FizzBuzz appears at multiples of 15, Fizz at 3, Buzz at 5.`,
      variables: { n },
      visualization: makeViz(
        Object.fromEntries(result.map((v, i) => [i, v % 15 === 0 ? 'found' : v % 3 === 0 ? 'active' : v % 5 === 0 ? 'comparing' : 'default'])),
        Object.fromEntries(labels.map((l, i) => [i, l])),
        [{ key: 'FizzBuzz Count', value: String(result.filter(v => v % 15 === 0).length) }, { key: 'Fizz Count', value: String(result.filter(v => v % 3 === 0 && v % 5 !== 0).length) }, { key: 'Buzz Count', value: String(result.filter(v => v % 5 === 0 && v % 3 !== 0).length) }],
      ),
    });

    return steps;
  },
};

export default fizzbuzzII;
